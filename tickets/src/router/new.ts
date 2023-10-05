import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/Ticket';

import { requireAuth, validateRequest } from '@cbgetticket/common';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, 
[
    body('title')
        .not().isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })

], validateRequest, async (req: Request, res: Response) => {
    //dont need currentuser middleware as we applied in app.js file
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentuser!.id });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.status(201).send(ticket)
    }
)

export { router as createTicketRouter }