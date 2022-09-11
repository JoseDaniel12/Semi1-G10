import axios from 'axios';


const storageApi = axios.create({
    baseURL: 'http://localhost:9000/'
    //baseURL: 'http://balancer-proyecto1-72833247.us-east-1.elb.amazonaws.com/'
});

export default storageApi;