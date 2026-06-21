import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
const secretkey = process.env.KEY

if (!secretkey) throw ".env: secretkey didnt load properly."

const auth = async (req: any, res: any, next: any) => {
    if (!req.cookies.sessiontoken) {
        return res.status(401).json({error: "Invalid credentials."})
    }
    let e=0
    try {
        let v = jwt.verify(req.cookies.sessiontoken, secretkey)
        e++
        let v2 = await prisma.user.findUnique({
            where: {
                id: v.id
            }
        })
        if (!v2) {
            return res.status(401).json({error: "Invalid credentials; account doesn't exist."})
        }
        next()       
    } catch(err) {
        if (e === 0) {
            return res.status(401).json({error: "Invalid session token."})
        }
        return res.status(500).json({error: "Internal server error."})
    }
}

router.get('/:id', async (req, res, next) => {
  if (!req.params.id) {
      try {
      const users = await prisma.user.findMany();
      return res.json(users);
      } catch (err) {
        return next(err);
      }
  } else {
      const u = await prisma.user.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      })
      if (!u) {
        return res.status(404).json({error: "User not found"})
      }
      return res.json(u)
  }
});

router.patch('/', auth, async (req, res, next) => {
    const {name, description, email, password} = req.body
    let b = new Map()
    b.set("name", name)
    b.set("description", description)
    b.set("email", email)
    try {
      if (password) {
        b.set("password",await bcrypt.hash(password, 10))
      }
      let a = jwt.verify(req.cookies.sessiontoken, secretkey)
      b.forEach((a,b) => {
        if (b) {
          c[a] = b
        }
      })
      let c:any = {
      }
        
        let u = await prisma.user.update({
          where: {
           id: a.id
          },
          data: b
        })
          } catch(err) {
            return res.status(500).json({error:"Internal server error"})
        }
})

router.post('/', async (req, res, next) => {
    const {name, email, password} = req.body
    let e=0
    try {
      let h = await bcrypt.hash(password, 10)
      e++
      if (name.length > 50 || name.length === 0 || email.length === 0 || email.length > 256) {
        return res.status(422).send("Invalid data format.")
      }
      const u = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: h
        }
      })
      res.cookie("sessiontoken", jwt.sign({id:u.id}, secretkey), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.send("User account created successfully.")
    } catch(err) {
      if (e===0) {
        return res.status(500).json({error:"Could not store password safely."})
      }
      return res.status(500).json({error:'Could not create user account; internal server error.'})
    }
})

router.post('/login', async(req, res, next) => {
    const {email, password} = req.body
    try {
      const u = await prisma.user.findUnique({
        where: {email: email}
      })
      if (!u) {
        return res.status(404).json({erro: "User not found."})
      }
      const s = await bcrypt.compare(password, u.password)
      if (!s) {
        return res.status(401).json({erro: "Incorrect credentials."})
      }
      res.cookie("sessiontoken", jwt.sign({id:u.id}, secretkey), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.send("User logged in successfully.")
    } catch(err) {
      return res.status(500).json({erro: "Internal server error."})
    }
})
export default router