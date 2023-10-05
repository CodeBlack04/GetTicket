import mongoose from "mongoose";
import { TicketDoc } from "./Ticket";
import { OrderStatus } from "@cbgetticket/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describe the properties
// that are required to create a new order
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiredAt: Date;
    ticket: TicketDoc;
}

// An interface that describe the properties
// that a order Doc has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiredAt: Date;
    ticket: TicketDoc;
    version: number;
}

// An interface that describe the properties
// that a order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },

    expiredAt: {
        type: mongoose.Schema.Types.Date
    },

    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
},
{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };