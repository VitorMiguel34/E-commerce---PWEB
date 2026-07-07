import {Router} from 'express'
import { auth } from '../auth'
import prisma from '../db/prisma'
const CouponRouter = Router()

CouponRouter.post('/', auth, async (req, res) => {
    await prisma.coupon.create({
        data: {
            discount: parseInt(req.body.desconto),
            userCartId: parseInt(res.locals.verify.id)
        }
    })
    return res.status(201).json({message: "Coupon created."})
})

export default CouponRouter