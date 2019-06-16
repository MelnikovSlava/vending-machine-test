import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { requestsConfig } from './apiConfig';
import subscribeMockRequests from './apiMock';


//TODO: add condition process.env.NODE_ENV !== 'production'
if (requestsConfig.USE_MOCK) {
  subscribeMockRequests(new MockAdapter(axios, { delayResponse: requestsConfig.MOCK_DELAY }));
}

const axiosInstance = axios.create({
  baseURL: requestsConfig.BASE_URL,
});

export { axiosInstance };
