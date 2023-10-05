import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";
import StripeCheckout from 'react-stripe-checkout';
import Router from "next/router";

const OrderShow = ({ order, currentuser }) => {
    //console.log(order);
    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/payments',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });

    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiredAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if(timeLeft<0) {
        return <div>Order Expired.</div>
    };
    
    return (
        <div>
            <h1>Order Item: {order.ticket.title}</h1>
            <p>Time left to complete order: ${timeLeft} seconds</p>
            {errors}
            <StripeCheckout
                token={(token) => doRequest({ token: token.id })} // mainly merging token with body in useRequest hook
                stripeKey="pk_test_51Nwg5MKl2OcSzkOf4aqQ7WDinUnwdAEbu7O41PMW08cWgPzM7rwURfOLfuUeHs359uO02WtQuoAwCpiSt8CG9YRU00jdYMMu4B"
                amount={order.ticket.price * 100}
                email={currentuser.email}
            />
        </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;