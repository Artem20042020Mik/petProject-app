import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: baseURL,
    withCredentials:true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    const isAuthEndpoint = config.url.startsWith('/auth');

    if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response)=>{return response;},
    async (error) =>  {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
                !originalRequest.url.includes("/auth/")
        ){
            try{

                originalRequest._retry=true;
                const refreshResponse =await axios.post(`${baseURL}/auth/refresh`,
                    {}, {withCredentials:true});

                const newAccess= refreshResponse.data.accessToken;

                localStorage.setItem("accessToken", newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return api(originalRequest);
            }
            catch (e){
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;