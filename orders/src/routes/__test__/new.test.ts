import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signupCookie } from '../../test/signupCookie';
import { Ticket } from '../../model/Ticket';
import { Order } from '../../model/Order';
import { OrderStatus } from '@cbgetticket/common';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signupCookie())
    .send({ ticketId })
    .expect(404)

});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30
  });
  await ticket.save();

  const order = Order.build({
    userId: 'fdfvdvdd',
    status: OrderStatus.Created,
    expiredAt: new Date(),
    ticket: ticket
  })
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signupCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signupCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signupCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
