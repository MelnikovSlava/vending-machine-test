import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { apiConfig } from './apiConfig';
import subscribeMockRequests from './apiMock';


//TODO: add condition process.env.NODE_ENV !== 'production'
if (apiConfig.USE_MOCK) {
  subscribeMockRequests(new MockAdapter(axios, { delayResponse: apiConfig.MOCK_DELAY }));
}

const axiosInstance = axios.create({
  baseURL: apiConfig.BASE_URL,
});

export { axiosInstance };
