import Router, {Request, Response, NextFunction} from 'express'
import prisma from '../db/prisma'
import {auth, adminAuth} from '../auth'

const CartsRouter = Router()
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const where = (userId: number, productId: number) => {
    return {
        userCartId_productId : {
            userCartId : userId,
            productId : productId
        }
    }
}

CartsRouter.get("/all", adminAuth, async ( req : Request, res : Response) => {
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
                orderId: null
            }
        })
        
        const total = await prisma.productInCart.aggregate({
            where: {
                orderId: null
            },
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
            where : where(userId, productId),
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

CartsRouter.post("/purchase", auth, async (req: Request, res: Response) => {
    try {
        const userId = res.locals.verify.id
        const productId = req.body.id
        const cartProduct = await prisma.productInCart.findUnique(
            {
                where: where(userId, productId)
            }
        )
        if (!cartProduct) {
            return res.status(404).json({error:"Product could not be found in your cart."})
        }
        const user = await prisma.userCart.findUnique({
            where: {
                id: userId
            }, 
            omit: {password: true}
        })
        if (!user) {
            return res.status(401).json({error:"not authorized"})
        }
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if (!product) {
            return res.status(404).json({error:"Product could not be found."})
        }
        if (product.price > user.tokens) {
            return res.status(403).send("Not enough tokens.")
        }
        if (product.stock < cartProduct.quantity) {
            return res.status(403).send("Out of stock.")
        }
        await prisma.$transaction([  
            prisma.userCart.update({
                where: {
                    id: userId
                },
                data: {
                    tokens: {increment: product.price}
                }
            }),
            prisma.userCart.update({
                where: {
                    id: userId
                },
                data: {
                    tokens: {decrement: product.price}
                }
            }),
            prisma.product.update({
                where: {
                    id: productId
                },
                data: {
                    stock: {decrement: cartProduct.quantity}
                }
            })
        ])
    } catch(err) {
        return res.status(500).json({error: "Internal server error"})
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
        await prisma.productInCart.deleteMany()
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
    const recentCoupon = await prisma.coupon.findFirst({
        where: {
            used: false
        },
        orderBy: {
            id: "asc"
        }
        
    })
    if (!recentCoupon) {
        return res.status(404).json({error:"No unused coupons."})
    }
    const multiplier = (1-recentCoupon.discount/100)
    await prisma.productInCart.updateMany({
        where: {
            orderId: null,
        },
        data: {
            price: {
                multiply: multiplier
            }
        }
    })
}catch(err) {
    return res.status(500).json({error: "internal server error"})
}})
export default CartsRouter