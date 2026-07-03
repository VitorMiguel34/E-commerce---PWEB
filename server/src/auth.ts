import jwt from 'jsonwebtoken'
import prisma from './db/prisma'

const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const auth = async (req: any, res: any, next: any) => {
    
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

        let user = await prisma.user.findUnique({
            where: {
                id: verify.id
            }
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

const inverseAuth = async (req:any, res:any, next:any) => {
    if (!req.cookies.sessiontoken) {
        return next()
    }
    return res.status(403).json({error: "Forbidden."})
}

export {auth, inverseAuth}