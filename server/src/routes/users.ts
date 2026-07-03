import { Router } from 'express'
import prisma from '../db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {auth, inverseAuth} from '../auth'

const UsersRouter = Router()
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

UsersRouter.get('/', async (req,res) => {
  try{
    const users = await prisma.user.findMany({
      omit: {
        password: true
      }
    })
    return res.status(200).json(users)
  }
  catch(err){
    return res.status(500).json({error: "Internal server error"})
  }
})

UsersRouter.get('/:id', async (req, res) => {
  try{
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(req.params.id)
        },
        omit: {
          password: true
        }
      })
      if (!user) {
        return res.status(404).json({error: "User not found"})
      }
      return res.status(200).json(user)
  }
  catch(err){
    res.status(500).json({error: "Internal server error", description: err})
  }
});

UsersRouter.patch('/', auth, async (req, res) => {
    const {name, email, password} = req.body
    let user = new Map()
    user.set("name", name)
    user.set("email", email)
    try {
      if (password) {
        user.set("password", await bcrypt.hash(password, 10))
      }

      let newValues : any = {}
      Object.keys(req.body).forEach((key : string) => {
        if (req.body[key] !== undefined) {
          newValues[key] = req.body[key]
        }
      })
        
      await prisma.user.update({
        where: {
          id: res.locals.verify.id
        },
        data: newValues
      })
      return res.status(200).json({message: "Sucefully updated"})
    } catch(err) {
      console.error(err)
      return res.status(500).json({error:"Internal server error"})
    }
})

UsersRouter.post('/', inverseAuth, async (req, res) => {
    const {name, email, password} = req.body
    let isValid = false
    try {
      let hashpassword = await bcrypt.hash(password, 10)
      isValid = true
      if (name.length > 50 || name.length === 0 || email.length === 0 || email.length > 256) {
        return res.status(422).send("Invalid data format.")
      }
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashpassword
        }
      })
      res.cookie("sessiontoken", jwt.sign({id : user.id}, secretkey), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.status(201).json({message: "User created!"})
    } catch(err) {
      if (!isValid) {
        return res.status(500).json({error:"Could not store password safely."})
      }
      return res.status(500).json({error:'Could not create user account; internal server error.'})
    }
})

UsersRouter.post('/login', inverseAuth, async(req, res) => {
    const {email, password} = req.body
    try {
      const user = await prisma.user.findUnique({
        where: {email: email}
      })
      if (!user) {
        return res.status(404).json({erro: "User not found."})
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({erro: "Incorrect credentials."})
      }
      res.cookie("sessiontoken", jwt.sign({id : user.id}, secretkey), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.status(200).send("User logged in successfully.")
    } catch(err) {
      return res.status(500).json({erro: "Internal server error."})
    }
})

export default UsersRouter