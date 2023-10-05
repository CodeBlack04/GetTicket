import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51Nwg5MKl2OcSzkOfKulAD2iNt3DzXsiJNB5Ek8AY8Z0gUVegUTlCrdLqhxCZcWhPHYgxnpgaGOKyIAq4LqS8PXh200pFmVMANp';

let mongo: any;
beforeAll( async () => {
    process.env.JWT_KEY = 'asdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach( async () => {
    
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll( async () => {
    await mongo.stop();
    await mongoose.connection.close();
})