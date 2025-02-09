import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:4444/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors
httpRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized - redirecting to login...');
            // Xử lý logic khi cần
        }
        return Promise.reject(error);
    }
);

// Helper functions
export const get = async (path, options = {}) => {
    try {
        const response = await httpRequest.get(path, { ...options });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const post = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.post(path, data, { ...options });
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

export const put = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.put(path, data, { ...options });
        return response.data;
    } catch (error) {
        console.error('Error putting data:', error);
        throw error;
    }
};

export const del = async (path, options = {}) => {
    try {
        const response = await httpRequest.delete(path, { ...options });
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

export default httpRequest;
