import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@cbgetticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../model/Order';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentuser!.id) {
            throw new NotAuthorizedError('Please signin!')
        }
        order.status = OrderStatus.Cancelled
        await order.save();

        // emitting event
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        
        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };