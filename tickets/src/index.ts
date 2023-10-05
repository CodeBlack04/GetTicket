import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';
import { OrderCancelledListener } from './events/listener/order-cancelled-listener';
import { OrderCompletedListener } from './events/listener/order-completed-listener';

const start = async () => {
  console.log("Starting...");
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
      console.log("NATS listener closing!");
      process.exit();
    })
    process.on('SIGINT', () => natsWrapper.client.close() );
    process.on('SIGTERM', () => natsWrapper.client.close() );

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCompletedListener(natsWrapper.client).listen();

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
