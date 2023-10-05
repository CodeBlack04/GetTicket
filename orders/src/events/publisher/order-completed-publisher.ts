import { OrderCompletedEvent, Publisher, Subjects } from "@cbgetticket/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
    subject: OrderCompletedEvent['subject'] = Subjects.OrderCompleted;
}