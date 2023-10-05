import { OrderCreatedListener } from './events/listener/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  // these if statements are required to make typescript happy
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

  } catch (err) {
    console.error(err);
  }
};

start();
