import { requireAuth } from '@cbgetticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../model/Order';

const router = express.Router();

router.get(
    '/api/orders',
    requireAuth,
    async (req: Request, res: Response) => {
        const orders = await Order.find({
            userId: req.currentuser!.id
        }).populate('ticket');

        res.status(200).send(orders);
    }
)

export { router as indexOrderRouter };