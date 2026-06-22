import { Router } from 'express';
import prisma from '../prisma';
import jwt from 'jsonwebtoken'
import {auth, inverseAuth} from '../auth'
const secretkey = process.env.KEY
const router = Router();

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

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

router.patch('/products', auth, async (req, res, next) => { 
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
      b.forEach((a,b) => {
        if (b) {
          c[a] = b
        }
      })

      let c:any = {
      }

      const a = await prisma.product.update({
        where: {
        id: id
        },
        data: c
      })
      return res.json({updated: a})
  } catch(err) {
    res.status(500).json({error:"Internal server error."})
  }
})

router.post('/products', auth, async (req, res, next) => {
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
  return res.json({product: a})
  } catch(err) {
    return res.status(500).send("Internal server error")
  }
})

export default router;
