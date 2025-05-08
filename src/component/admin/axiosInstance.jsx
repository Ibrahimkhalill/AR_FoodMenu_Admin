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
// Function to refresh access token using the refresh token
const refreshAccessToken = async () => {
	try {
		// Get the stored refresh token
		const refreshToken = localStorage.getItem('refreshToken');

		if (!refreshToken) {
			throw new Error('No refresh token found');
		}

		// Make a request to your backend to refresh the token
		const response = await axiosInstance.post('/auth/refresh-token', {
			token: refreshToken,
		});

		// Assuming the response contains the new access token
		const { accessToken } = response.data;

		// Save the new tokens to AsyncStorage
		localStorage.setItem('authToken', accessToken);

		return accessToken; // Return the new access token
	} catch (error) {
		console.error('Error refreshing access token:', error);
		throw new Error('Failed to refresh access token');
	}
};

// ✅ Handle 401 Errors (Expired Token)
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const token = localStorage.getItem('authToken');
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			if (token) {
				const newToken = await refreshAccessToken();
				if (newToken) {
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
					return axiosInstance(originalRequest);
				}
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
