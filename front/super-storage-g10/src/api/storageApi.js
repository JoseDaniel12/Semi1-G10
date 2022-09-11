import axios from 'axios';


const storageApi = axios.create({
    baseURL: 'http://balancer-proyecto1-72833247.us-east-1.elb.amazonaws.com/'
});

export default storageApi;