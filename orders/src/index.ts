import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listener/payment-created-listener';

const start = async () => {
  console.log('Starting...')
  // these if statements are required to make typescript happy
  if (!process.env.JWT_KEY) {
    throw new Error('Secret key(jwt_key) must be valid.')
  };

  if (!process.env.MONGO_URI) {
    throw new Error('Secret key(mongo-uri) must be valid.')
  };

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Secret key(nats-cluster-id) must be valid.')
  };

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Secret key(nats-client-id) must be valid.')
  };

  if (!process.env.NATS_URL) {
    throw new Error('Secret key(nats-url) must be valid.')
  };
  
  try {

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log("NATS listener closing!")
      process.exit();
    })
    process.on('SIGINT', () => natsWrapper.client.close() )
    process.on('SIGTERM', () => natsWrapper.client.close() )

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
