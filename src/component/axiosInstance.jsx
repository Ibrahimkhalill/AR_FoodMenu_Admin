import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://bdcallingarbackend.duckdns.org/',
});
axiosInstance.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem('authToken'); // Get token from local storage

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
