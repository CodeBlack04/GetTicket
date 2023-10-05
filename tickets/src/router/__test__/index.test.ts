import request from "supertest"; 
import { app } from "../../app";
import { signupCookie } from "../../test/signupCookie";

const createTicket = () => {
    return request(app)
            .post('/api/tickets')
            .set('Cookie', signupCookie())
            .send({title: 'ewnfwf', price: 20})
}

it('can fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .set('Cookie', signupCookie())
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3);
})