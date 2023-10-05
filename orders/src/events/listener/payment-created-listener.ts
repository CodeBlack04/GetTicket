import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@cbgetticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";
import { OrderCompletedPublisher } from "../publisher/order-completed-publisher";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
    
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }
        
        order.set({
            status: OrderStatus.Completed
        })
        await order.save();

        await new OrderCompletedPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticketId: order.ticket.id
        })

        // Technically we should publish an event like orderUpdated to avoid the concurrency version problem
        // among the services, But for our app, it is not required as once an order is completed, it will not be updated again.

        msg.ack();
    }
}