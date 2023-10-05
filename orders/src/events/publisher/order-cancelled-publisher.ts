import { OrderCancelledEvent, Publisher, Subjects } from "@cbgetticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled
}