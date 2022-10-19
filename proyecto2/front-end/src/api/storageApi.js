import axios from 'axios';


const storageApi = axios.create({
    //baseURL: 'http://35.87.197.86:5000/'
    //baseURL: 'http://localhost:9000/'
    baseURL: 'http://localhost:9000/'
});

export default storageApi;