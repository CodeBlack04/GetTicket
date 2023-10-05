import request from 'supertest';
import { Ticket } from "../../model/Ticket"
import { app } from '../../app';
import { signupCookie } from '../../test/signupCookie';
import { Order } from '../../model/Order';
import { OrderStatus } from '@cbgetticket/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('makes an order as cancelled', async () => {
    // CREATE TICKET
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 50
    })
    await ticket.save();

    // CREATE USER
    const user = signupCookie();

    // MAKE A REQUEST TO CREATE AN ORDER
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // MAKE A REQUEST TO CANCEL THE ORDER
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    // MAKE SURE THE ORDER IS CANCELLED
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    
})

it('emits a order cancelled event', async () => {
    // create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 30
      });
      await ticket.save();

    // create an user
    const user = signupCookie();

    // create an order associated with a ticket
    const { body:order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)
    
    // make a cancel request
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // make sure a OrderCancelled event is emitted
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});