import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


const stan = nats.connect('ticketing', `publisher`, {
    url: 'http://localhost:4222'
})

console.clear();

stan.on('connect', async () => {
    console.log('Publisher connected to NATS')

    try {
        await new TicketCreatedPublisher(stan).publish(
            {
                id: 'sfsf',
                title: 'concert',
                price: 20
            }
        )

    } catch (err) {
        console.error(err);        
    }

    // // nats publish and listens for json raw data.
    // const data = JSON.stringify({
    //     id: 20,
    //     title: 'concert',
    //     price: 100
    // });

    // //publish(subject/channel, data, callbackfunction)
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published.');
    // })
})