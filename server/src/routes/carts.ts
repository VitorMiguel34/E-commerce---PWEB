import Router, {Request, Response, NextFunction} from 'express'
import prisma from '../db/prisma'
import {auth, adminAuth} from '../auth'

const CartsRouter = Router()
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const where = (userId: number, productId: number) => {
    return {
        userCartId_productId: {
            userCartId : userId,
            productId : productId
        }
    }
}

CartsRouter.get("/all", auth, async ( req : Request, res : Response) => {
    try{
        const products = await prisma.productInCart.findMany()
        return res.status(200).json(products)
    }catch(err){
        res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.get("/", auth, async ( req : Request, res : Response) => {
    const uid = res.locals.verify.id
    try{
        const products = await prisma.productInCart.findMany({
            where: {
                userCartId: uid,
            }
        })
        
        const total = await prisma.productInCart.aggregate({
            _sum: {
                price: true
            }
        })
        if(products.length === 0){
            return res.status(404).json({error: "Products not found"})
        }

        return res.status(200).json({produtos: products, total: total._sum.price})
    }catch(err){
        res.status(500).json({error: `Internal server error`, description: err})
    }
})

CartsRouter.get("/:id", auth, async ( req : Request, res : Response ) => {
    try{
        const userId : number = Number(res.locals.verify.id)
        const productId : number = Number(req.params.id)
        const product = await prisma.productInCart.findUnique({
            where : where(userId, productId)
        })
        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }
        return res.status(200).json(product)
    }catch(err){
        res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.post("/items", auth, async ( req : Request, res : Response) => {
    try{
        const productId : number = parseInt(req.body.id)
        const userId : number = parseInt(res.locals.verify.id)
        const quantity : number = Number(req.body.quantidade)
        console.log('teste1')
        const p2 = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if (!p2) {
            return res.status(404).send("Not found")
        }
        console.log('teste2')
        const product = await prisma.productInCart.upsert({
            where : {
                userCartId_productId: {
                    userCartId: userId,
                    productId: productId
                }
            },
            update : {
                quantity : { increment : 1 },
                price: {
                    increment: p2.price
                }
            },
            create : {
                userCartId : userId,
                productId : productId,
                price: p2.price*quantity,
                quantity : quantity
            }
        })
        console.log('teste3')
        const status : number = product.quantity > 1 ? 201 : 200
        return res.status(status).json(product)
        
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})


CartsRouter.patch("/items/:id", auth, async ( req : Request, res : Response) => {
    try{
        const userId : number = Number(res.locals.verify.id)
        const productId : number = Number(req.params.id)
        const quantity : number = Number(req.body.quantity)

        let productExist = await prisma.productInCart.findUnique({
            where: where(userId, productId)
        })

        if (!productExist) {
            return res.status(404).json({error: "Product not found."})
        }

        const product = await prisma.productInCart.update({
            where : where(userId, productId), 
            data : {
                quantity : quantity,
                price: productExist.price*quantity/productExist.quantity
            }
        })
        return res.json(product) 
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.delete('/', async (req, res) => {
    try {
        await prisma.productInCart.deleteMany({
            where: {
                userCartId: res.locals.verify.id
            }
        })
        return res.json({message: "Product deleted"})
    } catch(err) {
        return res.status(500).json({error: "internal server error"})
    }
})

CartsRouter.delete("/items/:id", auth, async ( req : Request, res : Response) => {
    try{
        const userId : number = Number(res.locals.verify.id)
        const productId : number = Number(req.params.id)

        const response = await prisma.productInCart.deleteMany({
            where : {
                userCartId : userId,
                productId : productId
            }
        })
        if (response.count === 0) {
            return res.status(404).json({ error: "Product not found in cart." })
        }
        return res.json({ message: "Product deleted" })
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.post('/cupom', async (req, res) => {
    try {
    const recentCoupon = await prisma.coupon.findUnique({
        where: {
            id: req.body.id,
            used: false
        }
    })
    if (!recentCoupon) {
        return res.status(404).json({error:"Inexistent/already used coupon."})
    }
    console.log(recentCoupon.discount)
    const multiplier = (1-(recentCoupon.discount/100))
    console.log(multiplier)
    await prisma.$transaction(async (prisma) => {
        [   
            await prisma.productInCart.updateMany({
                data: {
                    price: {
                        multiply: multiplier
                    }
                }
            }),
            await prisma.coupon.update({
                where: {
                    id: parseInt(req.body.id)
                },
                data: {
                    used: true
                }
            })
        ]
    })
    return res.json({message: "Coupon applied."})
}catch(err) {
    return res.status(500).json({error: "internal server error"})
}})
export default CartsRouter