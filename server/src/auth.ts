import jwt from 'jsonwebtoken'
import prisma from './prisma'
const secretkey = process.env.KEY

if (!secretkey) throw Error(".env: couldn't load secretkey properly.")

const auth = async (req: any, res: any, next: any) => {
    if (!req.cookies.sessiontoken) {
        return res.status(401).json({error: "Invalid credentials."})
    }
    let e=0
    try {
        let v = jwt.verify(req.cookies.sessiontoken, secretkey)
        if (typeof v === 'string') {
            res.cookie("sessiontoken", 0, {
                httpOnly:true,  
                maxAge: 0.1
            })
            return res.status(401).json({error:"Invalid token format."})}
        e++
        let v2 = await prisma.user.findUnique({
            where: {
                id: v.id
            }
        })
        if (!v2) {
            res.cookie("sessiontoken", 0, {
                httpOnly:true,  
                maxAge: 0.1
            })
            return res.status(401).json({error: "Invalid credentials; account doesn't exist."})
        }
        res.locals.v = v
        return next()       
    } catch(err) {
        if (e === 0) {
            res.cookie("sessiontoken",0, {
                httpOnly: true,
                maxAge: 0.1
            })
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