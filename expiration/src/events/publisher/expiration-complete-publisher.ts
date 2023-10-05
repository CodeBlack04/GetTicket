import { Publisher, ExpirationCompleteEvent, Subjects } from "@cbgetticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete
}