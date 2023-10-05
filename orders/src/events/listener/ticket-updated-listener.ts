import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@cbgetticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/Ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;
        
        const ticket = await Ticket.findByEvent(id, version);

        if(!ticket) {
            throw new Error('Ticket not found!');
        }

        ticket.set( {title, price} );

        await ticket.save();

        msg.ack();
    }
}