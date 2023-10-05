import Link from 'next/link'

const LandingPage = ( {currentuser, tickets} ) => { 
    //console.log(tickets)      // we can not get fetch or get data during server side rendering
    //console.log(currentuser)
    
    const ticketList = tickets.map((ticket) => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href='/tickets/[tickeId]' as={`/tickets/${ticket.id}`}>View</Link>
                </td>
            </tr>
        )
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
};

LandingPage.getInitialProps = async (context, client) => {      // getInitialProps is used to fetch data and check for signin before the HTML file is loaded
    const { data } = await client.get('/api/tickets');

    return { tickets: data }
};


export default LandingPage;