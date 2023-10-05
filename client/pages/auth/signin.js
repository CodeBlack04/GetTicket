import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'; //custom hook

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        method: "post",
        url: "/api/users/signin",
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();

        await doRequest();
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Enter Password</label>
                <input type="password" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"></input>
            </div>
            {errors}
            <button className="btn btn-primary" type="submit">Sign In</button>
        </form>
    );
}