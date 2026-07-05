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
    try{
        const userId : number = res.locals.verify.id
        const products = await prisma.productInCart.findMany({
            where : { userCartId : userId }
        })
        if(!products){
            res.status(404).json({error: "Products not found"})
        }
        return res.status(200).json(products)
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

CartsRouter.post("/", auth, async ( req : Request, res : Response) => {
    try{
        const productId : number = Number(req.body.id)
        const userId : number = Number(res.locals.verify.id)
        const quantity : number = Number(req.body.quantity)

        const product = await prisma.productInCart.upsert({
            where : where(userId, productId),
            update : {
                quantity : { increment : 1 }
            },
            create : {
                userCartId : userId,
                productId : productId,
                quantity : quantity
            }
        })
        
        const status : number = product.quantity > 1 ? 201 : 200
        return res.status(status).json(product)
        
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.patch("/", auth, async ( req : Request, res : Response) => {
    try{
        const userId : number = Number(res.locals.verify.id)
        const productId : number = Number(req.body.id)
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
                quantity : quantity
            }
        })
        return res.status(200).json(product) 
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})

CartsRouter.delete("/:id", auth, async ( req : Request, res : Response) => {
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
        return res.status(200).json({ message: "Product deleted" })
    }catch(err){
        return res.status(500).json({error: "Internal server error", description: err})
    }
})