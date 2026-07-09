import {Router} from 'express'
import { auth } from '../auth'
import prisma from '../db/prisma'
const CouponRouter = Router()

CouponRouter.post('/', auth, async (req, res) => {
    try {
    if (parseInt(req.body.desconto) > 100) return res.status(422).json({error: "no discount above 100%."})
    const cupom = await prisma.coupon.create({
        data: {
            discount: parseInt(req.body.desconto),
            userCartId: parseInt(res.locals.verify.id)
        }
    })
    return res.status(201).json({message: "Coupon created", coupon: cupom})
    } catch(err) {
        return res.status(500).json({error: "Internal server error."})
    }
})
CouponRouter.get('/', auth, async (req, res) => {
    try {
        const cupons = await prisma.coupon.findMany({
            where: {
                userCartId: res.locals.verify.id
            }
        })
        if (cupons.length === 0) {
            return res.status(404).json({error: "No coupons found."})
        }
        return res.json({coupons: cupons})
    } catch(err) {
        return res.status(500).json({error: "Internal server error"})
    }
})
export default CouponRouter