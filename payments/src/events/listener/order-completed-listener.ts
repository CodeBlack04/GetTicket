import { Listener, OrderCompletedEvent, OrderStatus, Subjects } from "@cbgetticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
    subject: OrderCompletedEvent['subject'] = Subjects.OrderCompleted;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Completed
        });
        await order.save();

        msg.ack();
    }
}