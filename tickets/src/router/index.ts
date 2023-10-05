import express, { Request, Response } from 'express';
import { Ticket } from '../model/Ticket';
import { NotFoundError } from '@cbgetticket/common';

const router = express.Router();

router.get(
    '/api/tickets',
    async (req: Request, res: Response) => {
        const tickets = await Ticket.find({
            orderId: undefined
        });

        if(!tickets) {
            throw new NotFoundError();
        }

        res.status(200).send(tickets)
    }
)

export { router as indexTicketRouter };