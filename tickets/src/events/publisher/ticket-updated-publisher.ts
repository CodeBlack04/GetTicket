import { Publisher, Subjects, TicketUpdatedEvent } from "@cbgetticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
}