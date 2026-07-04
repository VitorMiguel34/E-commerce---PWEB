import Router, {Request, Response, NextFunction} from 'express'
import prisma from '../db/prisma'
import {auth, adminAuth} from '../auth'

const CartsRouter = Router()
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

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
        const userId = res.locals.verify.id
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
        const userId = Number(res.locals.verify.id)
        const productId = Number(req.params.id)
        const product = await prisma.productInCart.findUnique({
            where : {
                userCartId_productId : {
                    userCartId : userId,
                    productId : productId
                }
            }
        })
        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }
        return res.status(200).json(product)
    }catch(err){
        res.status(500).json({error: "Internal server error"})
    }
})
