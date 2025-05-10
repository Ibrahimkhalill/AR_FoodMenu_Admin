import { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const ProfileModal = ({ isOpen, onClose }) => {
	const [profile, setProfile] = useState(null);
	const [formData, setFormData] = useState({
		restaurant_name: '',
		restaurant_location: '',
		password: '',
		confirm_password: '',
	});
	const [logoFile, setLogoFile] = useState(null);
	const [bannerFile, setBannerFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	useEffect(() => {
		if (isOpen) {
			setIsLoading(true);
			setError(null);
			setSuccessMessage(null);
			setLogoFile(null);
			setBannerFile(null);
			axiosInstance
				.get('auth/get_my_resturant_info/')
				.then((response) => {
					if (response.status === 200) {
						setProfile(response.data);
						// Initialize form data with fetched values
						setFormData({
							restaurant_name: response.data.restaurant_name || '',
							restaurant_location: response.data.restaurant_location || '',
							password: '',
							confirm_password: '',
						});
					} else {
						setError('Failed to fetch profile information.');
					}
				})
				.catch((err) => {
					console.error('Error fetching profile:', err);
					setError('Failed to fetch profile information. Please try again.');
				})
				.finally(() => setIsLoading(false));
		}
	}, [isOpen]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e, setFile) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		// Validate password match
		if (formData.password !== formData.confirm_password) {
			setError('Passwords do not match.');
			return;
		}

		setIsLoading(true);
		try {
			// Create FormData object for multipart form submission
			const formDataToSend = new FormData();
			formDataToSend.append('restaurant_name', formData.restaurant_name);
			formDataToSend.append(
				'restaurant_location',
				formData.restaurant_location
			);
			if (formData.password) {
				formDataToSend.append('raw_password', formData.password);
			}
			if (logoFile) {
				formDataToSend.append('restaurant_logo', logoFile);
			}
			if (bannerFile) {
				formDataToSend.append('homepage_banner', bannerFile);
			}

			const response = await axiosInstance.put(
				'auth/update_my_restaurant_info/',
				formDataToSend,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.status === 200) {
				setSuccessMessage('Profile updated successfully!');
				// Fetch updated profile data to refresh the modal
				const updatedProfile = await axiosInstance.get(
					'auth/get_my_resturant_info/'
				);
				setProfile(updatedProfile.data);
				// Update form data with new values
				setFormData({
					restaurant_name: updatedProfile.data.restaurant_name || '',
					restaurant_location: updatedProfile.data.restaurant_location || '',
					password: '',
					confirm_password: '',
				});
				// Clear file inputs
				setLogoFile(null);
				setBannerFile(null);
			} else {
				setError('Failed to update profile.');
			}
		} catch (err) {
			console.error('Error updating profile:', err);
			setError('Failed to update profile. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 sm:p-8 mx-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl sm:text-2xl font-bold text-gray-800">
						Restaurant Profile
					</h3>
					<button
						onClick={onClose}
						className="text-gray-600 hover:text-gray-800 text-lg sm:text-xl">
						✕
					</button>
				</div>
				{isLoading ? (
					<div className="flex justify-center">
						<div className="loader"></div>
					</div>
				) : error ? (
					<p className="text-red-500 text-center">{error}</p>
				) : profile ? (
					<form onSubmit={handleSubmit} className="space-y-4">
						{successMessage && (
							<p className="text-green-500 text-center">{successMessage}</p>
						)}
						<div className="flex flex-col items-center space-y-3">
							<div className="w-full">
								<label className="font-semibold text-gray-700">
									Restaurant Logo:
								</label>
								<div className="flex flex-col items-center mt-1">
									<img
										src={`https://bdcallingarbackend.duckdns.org${profile.restaurant_logo}`}
										alt="Restaurant Logo"
										className="w-24 h-24 object-cover rounded-full mb-2"
									/>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleFileChange(e, setLogoFile)}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										disabled={isLoading}
									/>
								</div>
							</div>
							<div className="w-full">
								<label className="font-semibold text-gray-700">
									Homepage Banner:
								</label>
								<div className="flex flex-col items-center mt-1">
									<img
										src={`https://bdcallingarbackend.duckdns.org${profile.homepage_banner}`}
										alt="Homepage Banner"
										className="w-full h-32 object-cover rounded-lg mb-2"
									/>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleFileChange(e, setBannerFile)}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										disabled={isLoading}
									/>
								</div>
							</div>
						</div>
						<div className="text-sm sm:text-base space-y-3">
							<div>
								<label className="font-semibold text-gray-700">
									Restaurant Name:
								</label>
								<input
									type="text"
									name="restaurant_name"
									value={formData.restaurant_name}
									onChange={handleInputChange}
									className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
									disabled={isLoading}
								/>
							</div>
							<div>
								<label className="font-semibold text-gray-700">Location:</label>
								<input
									type="text"
									name="restaurant_location"
									value={formData.restaurant_location}
									onChange={handleInputChange}
									className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
									disabled={isLoading}
								/>
							</div>
							<div>
								<p className="font-semibold text-gray-700">
									Email: <span className="font-normal">{profile.email}</span>
								</p>
							</div>
							<div>
								<label className="font-semibold text-gray-700">Password:</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									placeholder="Enter new password"
									disabled={isLoading}
								/>
							</div>
							<div>
								<label className="font-semibold text-gray-700">
									Confirm Password:
								</label>
								<input
									type="password"
									name="confirm_password"
									value={formData.confirm_password}
									onChange={handleInputChange}
									className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									placeholder="Confirm new password"
									disabled={isLoading}
								/>
							</div>
						</div>
						<div className="flex justify-end space-x-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 text-sm sm:text-base"
								disabled={isLoading}>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm sm:text-base disabled:bg-green-300"
								disabled={isLoading}>
								{isLoading ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				) : null}
			</div>
		</div>
	);
};

export default ProfileModal;
