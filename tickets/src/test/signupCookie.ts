// made to receive cookie and pass it to jest tests.
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signupCookie = () => {
    // building a jwt payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    // create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session Object {jwt: jwt_code }
    const session = {jwt: token};

    // Turn that sessoin into JSON
    const sessionJSON = JSON.stringify(session);

    // Take json and decode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return the cookie encoded data
    return `session=${base64}`;
}