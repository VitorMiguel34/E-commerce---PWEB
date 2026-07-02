import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {auth, inverseAuth} from '../auth'
const router = Router();
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

router.get('/', async (req,res) => {
  try{
    const users = await prisma.user.findMany({
      omit: {
        password: true
      }
    })
    return res.status(200).json(users)
  }
  catch(err){
    return res.status(500).json({error: "Internal server erro"})
  }
})

router.get('/:id', async (req, res) => {
  try{
      const u = await prisma.user.findUnique({
        where: {
          id: parseInt(req.params.id)
        },
        omit: {
          password: true
        }
      })
      if (!u) {
        return res.status(404).json({error: "User not found"})
      }
      return res.status(200).json(u)
  }
  catch(err){
    res.status(500).json({error: "Internal server error"})
  }
});

router.patch('/', auth, async (req, res) => {
    const {name, email, password} = req.body
    let b = new Map()
    b.set("name", name)
    b.set("email", email)
    try {
      if (password) {
        b.set("password",await bcrypt.hash(password, 10))
      }

      let c: any = {}
      b.forEach((value,key) => {
        if (value) {
          c[key] = value
        }
      })
        
      await prisma.user.update({
        where: {
          id: res.locals.v.id
        },
        data: c
      })
      return res.status(200).json({message: "Sucefully updated"})
    } catch(err) {
      console.error(err)
      return res.status(500).json({error:"Internal server error"})
    }
})

router.post('/', inverseAuth, async (req, res) => {
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
      return res.status(201).json({message: "User created!"})
    } catch(err) {
      if (e===0) {
        return res.status(500).json({error:"Could not store password safely."})
      }
      return res.status(500).json({error:'Could not create user account; internal server error.'})
    }
})

router.post('/login', inverseAuth, async(req, res) => {
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
      return res.status(200).send("User logged in successfully.")
    } catch(err) {
      return res.status(500).json({erro: "Internal server error."})
    }
})

export default router