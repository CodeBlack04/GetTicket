import { Listener, OrderCompletedEvent, Subjects } from "@cbgetticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/Ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
    subject: OrderCompletedEvent['subject'] = Subjects.OrderCompleted;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticketId);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });
        await ticket.save();

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}