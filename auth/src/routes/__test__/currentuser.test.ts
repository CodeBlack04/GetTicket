import request from 'supertest';
import { app } from '../../app';
import { signupCookie } from '../../test/signupCookie';

it('gives details about the currentuser', async () => {

    const cookie = await signupCookie();
    //console.log(cookie)
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie) // sets a Cookie header to cookie received from signup
        .send()
        .expect(200);

    expect(response.body.currentuser.email).toEqual('test@test.com');
    //console.log(response.body)
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    
    expect(response.body.currentuser).toEqual(null);
});