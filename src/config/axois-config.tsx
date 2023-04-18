import interceptor from './interceptor';
import axios from 'axios';
axios.interceptors.request.use(interceptor.request, interceptor.requestError);
axios.interceptors.response.use(interceptor.response, interceptor.responseError);