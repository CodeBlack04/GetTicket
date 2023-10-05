import { Publisher, Subjects, TicketCreatedEvent } from "@cbgetticket/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated
}