/* eslint-disable import/no-anonymous-default-export */
export default {
    request(request: any) {
        return request;
    },

    requestError(error: any) {
        return Promise.reject(error);
    },

    response(response: any) {
        return response;
    },

    responseError(error: { response: { status: number; }; }) {
        if (error.response.status === 404) {
            if (!localStorage.getItem('token'))
                window.location.replace('/notfound');
            else
                window.location.replace('/user/notfound');

        }
        if (error.response.status === 401) {
            window.location.replace('/notfound')
        }

        return Promise.reject(error);
    }
}