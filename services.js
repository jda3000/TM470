import axios from 'axios';

let isAlreadyFetchingAccessToken = false;
import Session from "./sessionHandler";

let BASEURL =
  process.env.NODE_ENV === 'production'
    ? `https://tm470.onrender.com/`
    : 'http://127.0.0.1:8000/';


export const http = axios.create({
  baseURL: BASEURL,
  xhrFields: {
    withCredentials: true
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginHttp = axios.create({
  baseURL: BASEURL
})

const errorInterceptor = async (error) => {
  console.log('error interceptor', error);

  if (!error.response) { // no connection server error
    // display message
    return Promise.reject(error);
  }

  switch (error.response.status) {
    case 400: // general error, leave to calling catch method
      break;
    case 404: // not found
      break;
    case 401: // authentication error, logout the user
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        const originalRequest = error.config;
        let response = await Session._inspectToken()

        if (response) {
          // if successfully refresh then retry request
          // first update headers on original request
          isAlreadyFetchingAccessToken = false
          originalRequest.headers = http.defaults.headers
          return http.request(originalRequest);
        }

      }
      break;
    case 403: // Permission Denied
      break;
    default:
      console.error('server error');
  }
  return Promise.reject(error);
};

const responseInterceptor = (response) => {
  switch (response.status) {
    case 200:
      break;
    default:
      break;
  }
  return response;
};

http.interceptors.response.use(responseInterceptor, errorInterceptor);
