// made to receive cookie and pass it to jest tests.
import request from 'supertest';
import { app } from '../app';

export const signupCookie = async () => {
    const email = 'test@test.com'
    const password = '1234'

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie')

    return cookie
}