import { Router } from 'express';
import prisma from '../prisma';
import jwt from 'jsonwebtoken'
import {auth, inverseAuth} from '../auth'
const secretkey = process.env.KEY
const router = Router();

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

router.get('/', async (req,res) => {
  try{
    const products = await prisma.product.findMany({})
    return res.status(200).json(products)
  }
  catch(err){
    return res.status(500).json({error: "Internal server erro"})
  }
})

router.get('/:id', async (req, res) => {
  try{
      const product = await prisma.user.findUnique({
        where: {
          id: parseInt(req.params.id)
        },
      })
      if (!product) {
        return res.status(404).json({error: "Product not found"})
      }
      return res.status(200).json(product)
  }
  catch(err){
    res.status(500).json({error: "Internal server error"})
  }
});

router.patch('/', auth, async (req, res) => { 
    try {
      const {id, sku, name, description, price, stock} = req.body
      let p = await prisma.product.findUnique({
        where: {id: id}
      })

      if (!p) {
        return res.status(404).json({error: "Product not found."})
      }

      if (!(p.owner_id === res.locals.v.id)) {
        return res.status(403).json({error: "You dont have permission to update this product."})
      }
      

      let b = new Map()
      b.set("sku", sku)
      b.set("name", name)
      b.set("description", description)
      b.set("price", price)
      b.set("stock", stock)

      let c:any = {}
      b.forEach((value,key) => {
        if (value) {
          c[key] = value
        }
      })

      await prisma.product.update({
        where: {
          id: id
        },
        data: c
      })
      return res.status(200).json({message: "Successfully updated"})
  } catch(err) {
    res.status(500).json({error:"Internal server error."})
  }
})

router.post('/', auth, async (req, res) => {
  const {name, description, price, sku, stock} = req.body
  if (Number.isNaN(price)) {
      return res.status(422).json({error: "Invalid data format."})
  }
  if (name.length === 0 || parseFloat(price) < 0) {
      return res.status(422).json({error: "Invalid data format."})
  }
  try {
    const a = await prisma.product.create({
      data: {
        owner_id: res.locals.v,
        name: name,
        description: description,
        price: price,
        sku: sku,
        stock: stock
      }
    })
  return res.status(201).json({message: "Product created"})
  } catch(err) {
    return res.status(500).send("Internal server error")
  }
})

export default router;
