import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
const secretkey = process.env.KEY
// Users
router.get('/users/:id', async (req, res, next) => {
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

router.post('/users', async (req, res, next) => {
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
          password: password
        }
      })
      res.cookie("sessaotoken", jwt.sign({id:u.id}, secretkey), {
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

router.post('/users/login', async(req, res, next) => {
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
      res.cookie("sessaotoken", jwt.sign({id:u.id}, secretkey), {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60*60*24*3
      })
      return res.send("User logged in successfully.")
    } catch(err) {
      return res.status(500).json({erro: "Internal server error."})
    }
})

// Products
router.get('/products/:id', async (req, res, next) => {
    if (!req.params.id) {
          try {
          const products = await prisma.product.findMany();
          res.json(products);
        } catch (err) {
          next(err);
        }
    } else {
    try {
      const p = await prisma.product.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      })
      if (!p) {
        return res.status(404).json({error: "Product not found."})
      }
      return res.json(p)
    } catch (err) {
        next(err)
    }
  }
});

router.post('/products', async (req, res, next) => {
  const {name, description, price, sku} = req.body
  if (Number.isNaN(price)) {
      return res.status(422).json({error: "Invalid data format."})
  }
  if (name.length === 0 || parseFloat(price) < 0) {
      return res.status(422).json({error: "Invalid data format."})
  }
  try {
    const products = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        sku: sku
      }
    })
  } catch(err) {
    next(err)
  }
})

export default router;
