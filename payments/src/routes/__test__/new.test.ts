import request from 'supertest';
import { app } from '../../app';
import { signupCookie } from '../../test/signupCookie';
import mongoose from 'mongoose';
import { Order } from '../../model/Order';
import { OrderStatus } from '@cbgetticket/common';
import { stripe } from '../../stripe';
import { Payment } from '../../model/Payment';

it('returns 404 if a order is not found', async () => {
    await request(app)
            .post('/api/payments')
            .set('Cookie', signupCookie())
            .send({
                token: 'dwefwfwf',
                orderId: new mongoose.Types.ObjectId().toHexString()
            })
            .expect(404)
});

it('returns 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 100
    })
    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', signupCookie())
            .send({
                token: 'dwefwfwf',
                orderId: order.id
            })
            .expect(401)
});

it('return 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 100
    })
    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', signupCookie(userId))
            .send({
                token: 'dwefwfwf',
                orderId: order.id
            })
            .expect(400)
});

it('returns 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Created,
        version: 0,
        price
    })
    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', signupCookie(userId))
            .send({
                token: 'tok_visa',
                orderId: order.id
            })
            .expect(201)

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(100*100);
    // expect(chargeOptions.currency).toEqual('usd');
    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100;
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.amount).toEqual(price*100);
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    expect(payment).not.toBeNull();
});