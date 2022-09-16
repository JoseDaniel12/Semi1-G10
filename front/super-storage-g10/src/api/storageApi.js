import axios from 'axios';


const storageApi = axios.create({
    //baseURL: 'http://35.87.197.86:5000/'
    //baseURL: 'http://localhost:9000/'
    baseURL: 'http://balanceadorapi-1713661728.us-east-1.elb.amazonaws.com/'
});

export default storageApi;