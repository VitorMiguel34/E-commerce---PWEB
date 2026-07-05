import { Router } from 'express'
import prisma from '../db/prisma'
import {auth} from '../auth'

const secretkey = process.env.KEY
const ProductRouter = Router()

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

ProductRouter.get('/', async (req,res) => {
  try{
    const products = await prisma.product.findMany()
    return res.status(200).json(products)
  }
  catch(err){
    return res.status(500).json({error: "Internal server erro"})
  }
})

ProductRouter.get('/:id', async (req, res) => {
  try{
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      })
      if (!product) {
        return res.status(404).json({error: "Product not found"})
      }
      return res.status(200).json(product)
  }
  catch(err){
    res.status(500).json({error: "Internal server error"})
  }
})

ProductRouter.patch('/', auth, async (req, res) => { 
    try {
      const id : number = req.body.id
      let product = await prisma.product.findUnique({
        where: {id: id}
      })

      if (!product) {
        return res.status(404).json({error: "Product not found."})
      }
      
      let newValues : any = {}

      Object.keys(req.body).forEach((key : string) => {
        if (req.body[key] !== undefined) {
          newValues[key] = req.body[key]
        }
      })

      await prisma.product.update({
        where: {
          id: id
        },
        data: newValues
      })
      return res.status(200).json({message: "Successfully updated"})
  } catch(err) {
    res.status(500).json({error:"Internal server error."})
  }
})

ProductRouter.post('/', auth, async (req, res) => {
  const {name, description, price, sku, stock} = req.body
  if (Number.isNaN(price)) {
      return res.status(422).json({error: "Invalid data format."})
  }
  if (name.length === 0 || parseFloat(price) < 0) {
      return res.status(422).json({error: "Invalid data format."})
  }
  try {
    await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        sku: sku,
        stock: stock,
        owner_id: Number(res.locals.verify.id)
      }
    })
  return res.status(201).json({message: "Product created"})
  } catch(err) {
    return res.status(500).send("Internal server error")
  }
})



export default ProductRouter
