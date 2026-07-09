import jwt from 'jsonwebtoken'
import prisma from './db/prisma'
import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'

const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({error: "Forbidden."})
    }

    let auth = req.headers.authorization.split(' ')
    if (auth[0] !== "Bearer") {
        return res.status(401).json({error: "Not authorized."})
    }
    try {
        let j = jwt.verify(auth[1], secretkey)
        if (typeof j === "string") {
            return res.status(401).json({error: "Invalid JWT token format."})
        }

        let u = await prisma.userCart.findUnique({
            where: {
                id: j.id
            }
        })
        if (!u) {
            return res.status(401).json({error: "Inexistent user."})
        }
        let verify = {
            id: j.id
        }
        res.locals.verify = verify
        return next()
    } catch(err) {
        return res.status(401).json({error: "Not authorized."})
    }
}

const adminAuth = async ( req : Request, res : Response, next : NextFunction) => {
    if (!req.cookies.sessiontoken){
        return res.status(401).json({error: "Invalid credentials."})
    }
    let autenticated = false
    try{
        const verify = jwt.verify(req.cookies.sessiontoken, secretkey)
        if (typeof verify === 'string') {
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error:"Invalid token format."})
        }
        autenticated = true
        const user = await prisma.userCart.findUnique({
            where : { id : verify.id}
        })
        if(!user){
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error: "Invalid credentials; account doesn't exist."})
        }
        if(!user.isAdmin){
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(403).json({error: "Permission denied; user is not an admin."})
        }
        res.locals.verify = verify
        return next()
    }catch(err){
        if (!autenticated) {
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error: "Invalid session token."})
        }
        return res.status(500).json({error: "Internal server error."})
    }
}

const inverseAuth = async (req : Request, res : Response, next : NextFunction) => {
    if (!req.headers.authorization) {
        return next()
    }
    return res.status(403).json({error: "Forbidden."})
}

const autoverif = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const coupons = await prisma.coupon.findMany()
    const products = await prisma.product.findMany()
    const users = await prisma.userCart.findMany()
    if (products.length === 0 || users.length === 0 || coupons.length === 0) {
        let pass = await bcrypt.hash("senha",10)
        await prisma.userCart.create({
            data: 
                {
                    email: "user@gmail.com",
                    password: pass,
                    name: "user1"
                }
        })
        await prisma.product.createMany({
            data: [
                {
                    price: 1,
                    stock: 100,
                    name: "lapis azul",
                    ownerId: 1,
                    category: "escolar",
                    description: "lapis daora"
                },
                {
                    price: 1,
                    stock: 100,
                    name: "lapis vermelho",
                    ownerId: 1,
                    category: "escolar",
                    description: "lapis daora"
                },
                {
                    price: 1,
                    stock: 100,
                    name: "lapis verde",
                    ownerId: 1,
                    category: "escolar",
                    description: "lapis daora"
                },
                {
                    price: 1,
                    stock: 100,
                    name: "lapis faber castell 1967 original",
                    ownerId: 1,
                    category: "escolar",
                    description: "lapis daora"
                },
                {
                    price: 1,
                    stock: 100,
                    name: "lapis rosa",
                    ownerId: 1,
                    category: "escolar",
                    description: "lapis daora"
                }
            ]
        })
    await prisma.coupon.createMany({
        data: [
            {
                discount: 10,
                userCartId: 1
            },
            {
                discount: 20,
                userCartId: 1
            }
        ]
    })
    }
    return next()
} catch(err) {
        return res.status(500).json({error: "internal server error"})
    }
}

export {auth, inverseAuth, adminAuth, autoverif}