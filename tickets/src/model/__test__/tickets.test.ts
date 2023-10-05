import { Request } from "supertest";
import { app } from "../../app";
import { Ticket } from "../Ticket";

it('implements optimistic concurrency control', async () => {
    // create an instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 40,
        userId: '123'
    });

    // save the ticket to database
    await ticket.save()

    // fetch the ticket twice
    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);

    // make two changes to the tickets
    firstTicket!.price = 400;
    secondTicket!.price = 500;

    //save the first fetched ticket
    await firstTicket!.save();
    //save the second fetched ticket and expect an error
    try {
        await secondTicket!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point.');
})

it('increaments the version number on multiple save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 300,
        userId: '1234'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
})