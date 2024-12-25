import axios from 'axios';

const httpRequest =  axios.create({
    baseURL: 'http://localhost:4444/api',
    headers: {
        'Content-Type': 'application/json',
    },
    });

export const get  = async(path , options = () => {}) => {
    try {
        const response = await httpRequest.get(path, options);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default httpRequest;
