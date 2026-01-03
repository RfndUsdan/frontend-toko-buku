import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Ambil dari sessionStorage
    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                sessionStorage.clear();
                
                // Tambahkan pengecekan: Jangan redirect jika di "/" atau "/login"
                const publicPages = ["/", "/login", "/register"];
                const isPublicPage = publicPages.includes(window.location.pathname);

                if (!isPublicPage) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;