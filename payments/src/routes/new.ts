import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@cbgetticket/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../model/Order';
import { stripe } from '../stripe';
import { Payment } from '../model/Payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentuser!.id) {
            throw new NotAuthorizedError('Not authorized.');
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Can not process a cancelled order')
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        })
        const payment = Payment.build({
            orderId: order.id,
            stripeId: charge.id
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })
        
        res.status(201).send(payment);
    }
);

export { router as createChargeRouter }