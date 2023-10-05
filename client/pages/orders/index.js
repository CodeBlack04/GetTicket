const OrderList = ({ orders }) => {
    console.log(orders);
    return (
        <ul>
            {orders.map((order) => {
                return <li key={order.id}>Item: {order.ticket.title}<br/>Price: {order.ticket.price}<br/>Status: {order.status}</li>
            })}
        </ul>
    )
}

OrderList.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data };
}

export default OrderList