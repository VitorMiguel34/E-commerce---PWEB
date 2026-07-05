import jwt from 'jsonwebtoken'
import prisma from './db/prisma'
import { Request, Response, NextFunction } from 'express'

const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const auth = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.cookies.sessiontoken) {
        return res.status(401).json({error: "Invalid credentials."})
    }
    let autenticated = false

    try {
        let verify = jwt.verify(req.cookies.sessiontoken, secretkey)

        if (typeof verify === 'string') {
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error:"Invalid token format."})}
        autenticated = true

        let user = await prisma.userCart.findUnique({
            where: { id: verify.id }
        })
        if (!user) {
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error: "Invalid credentials; account doesn't exist."})
        }
        res.locals.verify = verify
        return next()       
    } catch(err) {
        if (!autenticated) {
            res.clearCookie("sessiontoken", {httpOnly : true})
            return res.status(401).json({error: "Invalid session token."})
        }
        return res.status(500).json({error: "Internal server error."})
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
    if (!req.cookies.sessiontoken) {
        return next()
    }
    return res.status(403).json({error: "Forbidden."})
}

export {auth, inverseAuth, adminAuth}