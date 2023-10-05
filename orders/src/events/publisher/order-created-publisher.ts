import { OrderCreatedEvent, Publisher, Subjects } from "@cbgetticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated
}