import { NotAuthorizedError, NotFoundError, requireAuth } from '@cbgetticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../model/Order';

const router = express.Router();

router.get(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentuser!.id) {
            throw new NotAuthorizedError('Please signin');
        }
        res.status(200).send(order)
    }
)

export { router as showOrderRouter };