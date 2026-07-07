import {Router} from 'express'
import { auth } from '../auth'
import prisma from '../db/prisma'
const CouponRouter = Router()

CouponRouter.post('/', auth, async (req, res) => {
    const cupom = await prisma.coupon.create({
        data: {
            discount: parseInt(req.body.desconto),
            userCartId: parseInt(res.locals.verify.id)
        }
    })
    return res.status(201).json({message: "Coupon created", cupom: cupom})
})

export default CouponRouter