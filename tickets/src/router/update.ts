import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/Ticket';

import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@cbgetticket/common';

import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Can not edit a reserved ticket.')
        }

        if (ticket.userId !== req.currentuser!.id) {
            throw new NotAuthorizedError('Not authorized. Please Sign in.');
        }

        const { title, price } = req.body;
        
        ticket.set({
            title: title,
            price: price
        });
        await ticket.save();

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

        res.status(200).send(ticket);
    }
)

export { router as updateTicketRouter };