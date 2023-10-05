import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server. All request should be made to ingress-nginx namespace
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',  // format: http://SERVICENAME.NAMESPACE.svc.cluster.local
            headers: req.headers
        });
    } else {
        // We are on the browser. request can be made with a base url.
        return axios.create({
            baseURL: '/'
        });
    }
};