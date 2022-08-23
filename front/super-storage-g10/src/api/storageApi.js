import axios from 'axios';

const storageApi = axios.create({
    baseURL: 'http://localhost:9000/'
});

export default storageApi;