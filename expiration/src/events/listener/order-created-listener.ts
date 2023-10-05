import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent } from "@cbgetticket/common";
import { Subjects } from "@cbgetticket/common/build/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
        console.log('Waiting this seconds to process the job', delay);
        
        await expirationQueue.add({
            orderId: data.id
        },
        {
            delay
        })

        msg.ack()
    }
}