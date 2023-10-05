import { Message, Stan } from "node-nats-streaming";

import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    protected ackWait = 5 * 1000;
    
    private client: Stan;
    constructor(client: Stan) {
        this.client = client
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }
    
    listen() {
        const subscription = this.client.subscribe(
            this.subject, //channel name
            this.queueGroupName,    // queuename
            this.subscriptionOptions()  //subscription opstions
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parsedMessage(msg);
            this.onMessage( parsedData, msg);
        })
    }
    
    parsedMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string'   // it can be buffer or string
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'));
    }
}