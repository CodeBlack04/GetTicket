import Link from 'next/link';

export default ({ currentuser }) => {
    const links = [
        !currentuser && {label: 'Sign Up', href: '/auth/signup'},
        !currentuser && {label: 'Sign in', href: '/auth/signin'},
        currentuser && {label: 'List Ticket', href: '/tickets/newticket'},
        currentuser && {label: 'Order-Lists', href: '/orders'},
        currentuser && {label: 'Sign out', href: '/auth/signout'}
        ]
        .filter(linkConfig => linkConfig)
        .map( ({ label,href }) =>{
            return (
                <li key={href} className='nav-item'>
                    <Link className='nav-link' href={href}> {label} </Link>
                </li>
            )
        })
    return (
        <nav className="navbar navbar-light bg-light" >
            <Link className='navbar-brand' href="/">
                GetTicket
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    )
}