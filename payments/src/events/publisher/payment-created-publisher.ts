import { PaymentCreatedEvent, Publisher, Subjects } from "@cbgetticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
}