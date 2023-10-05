import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/Ticket';
import { signupCookie } from '../../test/signupCookie';
import mongoose from 'mongoose';

it('fetches the order', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    })
    await ticket.save();

    const user1 = signupCookie();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user1)
        .send()
        .expect(200)
        
    //console.log(order, fetchedOrder)
    expect(order.id).toEqual(fetchedOrder.id);
    expect(order.ticket.id).toEqual(fetchedOrder.ticket.id);
    expect(order.ticket.id).toEqual(ticket.id);   
})

it('returns a error one user tries to fetch another user orders', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 50
    })
    await ticket.save();

    const user1 = signupCookie();
    const user2 = signupCookie();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401)
        
})