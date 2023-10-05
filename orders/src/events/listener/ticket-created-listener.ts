import { Listener, Subjects, TicketCreatedEvent } from "@cbgetticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        
        const ticket = Ticket.build({
            id: data.id,
            title: data.title,
            price: data.price
        });

        await ticket.save();

        msg.ack();
    }
}