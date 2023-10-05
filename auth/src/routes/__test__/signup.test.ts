import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfull signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "testtest.com",
            password: "1234"
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "134"
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com" })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({ password: "1234" })
        .expect(400);
});

it('disallows duplicate emails', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(400);
});

it('sets a cookie after successful signup', async() => {
    const responce = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(201);

    expect(responce.get('Set-Cookie')).toBeDefined();  // get() checks for "Set-Cookie" header in the cookie 
});                                                    // transfered after signup