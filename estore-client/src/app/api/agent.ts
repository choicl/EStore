import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'https://localhost:5001/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await sleep();
    return response 
}, (error: AxiosError) => {
    const {data, status} = error.response!;
    switch (status) {
        case 400:
            toast.error(error.message);
            break;
        case 401: 
            toast.error(error.message);
            break;
        case 500: 
            toast.error(error.message);
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`) 
}

const TestErrors ={
    get400Error : () => requests.get('buggy/bad-request'),
    get401Error : () => requests.get('buggy/unauthorised'),
    get404Error : () => requests.get('buggy/not-found'),
    get500Error : () => requests.get('buggy/server-error'),
    getValidationError : () => requests.get('buggy/validation-error')
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`Basket?productId=${productId}&quantity=${quantity}`),
}

const agent ={
    Catalog,
    TestErrors,
    Basket
}

export default agent;