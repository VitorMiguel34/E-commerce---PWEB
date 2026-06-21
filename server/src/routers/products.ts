import { Router } from 'express';
import prisma from '../prisma';
const router = Router();

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
