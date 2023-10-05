import { useState } from "react";
import axios from 'axios';

export default ({ method, url, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {...body, ...props});
            //console.log(response.data);
            if (onSuccess) {
                onSuccess(response.data); // response.data is not necessary here.
            }

            return response.data
        } catch (err) {
            setErrors(
                <div className='alert alert-danger'>
                    <h3>Opps...</h3>
                    <ul className='my-0'>
                    {err.response.data.errors.map(err => <li key={err.message}> {err.message} </li>)}
                    </ul>
                </div>
            )
        }
    };
    return { doRequest, errors };
}