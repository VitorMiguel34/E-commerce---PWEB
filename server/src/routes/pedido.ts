import {Router} from 'express'
const OrderRouter = Router()
import {auth} from '../auth'
import prisma from '../db/prisma'
OrderRouter.post('/', auth, async (req, res) => {
    try {
    const productsInCart = await prisma.productInCart.findMany({
        where: {
            orderId: null
        }
    })
    if (!productsInCart) {
        return res.status(404).json({error:"There are no products in your cart that aren't already related to an order."})
    }
    console.log("foi aqui.")
    let tmap = []
    const products = await prisma.product.findMany()
    for (let x of productsInCart) {
        for (let y of products) {
            if (y.id === x.productId) {
                if (x.quantity > y.stock) {
                    return res.status(409).json({error:"Insufficient stock."})
                }
                tmap.push({
                    id: y.id,
                    decrement: x.quantity
                })
            }
        }
    }
    console.log("foi aqui 2.")
    await prisma.$transaction(async (p) => {
     await Promise.all(tmap.map(async (key) => {
        await p.product.update({
            where: {
                id: key.id
            },
            data: {
                stock: {
                    decrement: key.decrement
                }
            }
        })
     }) )}
    )
    console.log("foi aqui 3.")
    const order = await prisma.order.create({
        data: {
            userCartId: parseInt(res.locals.verify.id),
            status: "pendente"
        }
    })
    console.log("foi aqui 4.")
    await prisma.productInCart.updateMany({
        where: {
            orderId: null 
        },
        data: {
            orderId: order.id
        }
    })
    console.log("foi aqui 5?")
    return res.status(201).json({message: "Order successfully created."})
} catch(err) {
        return res.status(500).json({error: "internal server error"})
    }
})

OrderRouter.get('/', auth, async(req, res) => {
    try {
     
    const orders = await prisma.order.findMany({
        where: {
            userCartId: res.locals.verify.id
        }
    })
    if (orders.length === 0) {
        return res.json({error: "No orders."})
    }
    return res.json(orders)   
    } catch(err) {
        return res.status(500).json({error: "internal server error"})
    }
})

OrderRouter.patch('/:id/status', auth, async(req,res) => {
    if (typeof req.params.id !== "string") {
        return res.status(422).json({error: "invalid format."})
    }
    try {
        await prisma.order.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status: req.body.status
            }
        })
        return res.json({message: "success."})
    } catch(err) {
        return res.status(500).json({error: "intenral server error"})
    }
})

export default OrderRouter