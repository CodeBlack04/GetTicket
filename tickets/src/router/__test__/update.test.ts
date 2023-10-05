import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signupCookie } from '../../test/signupCookie';
import { Ticket } from '../../model/Ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signupCookie())
        .send({title: 'dadad', price: 25})
        .expect(404)

});

it('returns 401 if the user is not signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({title: 'dadad', price: 25})
        .expect(401)
});

it('returns 401 if the user does not own the ticket', async () => {
    const title = 'fwwfw';
    const price = 40;
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signupCookie())
        .send({title, price})

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signupCookie())
        .send({title: 'wrfwq', price: 500})
        .expect(401)

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
});

it('returns 400 if the user provides invalid title and price', async () => {
    const cookie = signupCookie();
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'wfwfs', price: 80})
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: '', price: 40 })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'ffwfw', price: -40 })
        .expect(400)
});

it('updates the ticket if provided valid inputs', async () => {
    const cookie = signupCookie();
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'wfwfs', price: 80})
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'fwnofw', price: 120 })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('fwnofw');
    expect(ticketResponse.body.price).toEqual(120);
});

it('publishes an event', async () => {
    const cookie = signupCookie();
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'wfwfs', price: 80})
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'fwnofw', price: 120 })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects update if a ticket is reserved', async () => {
    const cookie = signupCookie();
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'wfwfs', price: 80})
        .expect(201)

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'fwnofw', price: 120 })
        .expect(400)
})