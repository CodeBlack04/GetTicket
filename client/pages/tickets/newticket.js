import { useState } from "react";
import useRequest from "../../hooks/use-request"
import Router from "next/router";

export default () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState();
    const { doRequest, errors } = useRequest({
        method: "post",
        url: "/api/tickets",
        body: { title, price },
        onSuccess: () => Router.push('/') 
    })

    const onSubmit = async (event) => {
        event.preventDefault();

        doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);

        if ( isNaN(value) ) {
            return;
        }

        setPrice(value.toFixed(2));
    }

    return (
        <div>
            <h1>New Ticket page</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input type="number" className="form-control" onBlur={onBlur} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                {errors}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}