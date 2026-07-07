import { Router } from 'express'
import prisma from '../db/prisma'
import {auth} from '../auth'

const secretkey = process.env.KEY
const ProductRouter = Router()

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

ProductRouter.get('/', async (req,res) => {
  if (req.query.categoria === "") {     
      try{
        const products = await prisma.product.findMany()
        return res.status(200).json(products)
      }
      catch(err){
        return res.status(500).json({error: "Internal server error"})
      }
  }
  if (typeof req.query.categoria !== 'string') {
    return res.status(422).json({error:"invalid format."})
  }
  const products = await prisma.product.findMany({
    where: {
      category: req.query.categoria
    }
  })
  return res.json(products)
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
      return res.json(product)
  }
  catch(err){
    res.status(500).json({error: "Internal server error"})
  }
})

ProductRouter.patch('/:id', auth, async (req, res) => { 
    try {
      const id : number = Number(req.params.id)
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
  console.log('recebi')
  const {nome, descricao, preco, estoque, categoria} = req.body
  if (Number.isNaN(preco)) {
      return res.status(422).json({error: "Invalid data format."})
  }
  if (nome.length === 0 || parseFloat(preco) < 0) {
      return res.status(422).json({error: "Invalid data format."})
  }
  try {
    await prisma.product.create({
      data: {
        ownerId: parseInt(res.locals.verify.id),
        name: nome,
        description: descricao,
        price: preco,
        stock: estoque,
        category: categoria
      }
    })
  return res.status(201).json({message: "Product created"})
  } catch(err) {
    return res.status(500).send("Internal server error")
  }
})

ProductRouter.delete('/:id', async (req, res) => {
  try{
    await prisma.product.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    return res.send("product deleted.")
  } catch(err) {
    return res.status(500).json({error:"Internal server error."})
  }
})

export default ProductRouter
