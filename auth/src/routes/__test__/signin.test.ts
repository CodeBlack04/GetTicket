import request from 'supertest';
import { app } from '../../app';

it('fails when a email doesnt exist', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(400);
});

it('fails when the password doesnt exist', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "134"
        })
        .expect(400);
});

it('sets a cookie after successful signin', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(201);
    
    const responce = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "1234"
        })
        .expect(200);

    expect(responce.get('Set-Cookie')).toBeDefined();  // get() checks for "Set-Cookie" header in the cookie 
});