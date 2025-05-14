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
	const [isProfileLoading, setIsProfileLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	useEffect(() => {
		if (isOpen) {
			setError(null);
			setSuccessMessage(null);
			setLogoFile(null);
			setBannerFile(null);
			axiosInstance
				.get('auth/get_my_resturant_info/')
				.then((response) => {
					if (response.status === 200) {
						setProfile(response.data);
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
				});
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

		if (formData.password !== formData.confirm_password) {
			setError('Passwords do not match.');
			return;
		}

		setIsLoading(true);
		try {
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

			const response = await axiosInstance.patch(
				'auth/update_resturant_info/',
				formDataToSend,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.status === 200) {
				setSuccessMessage('Profile updated successfully!');
				const updatedProfile = await axiosInstance.get(
					'auth/get_my_resturant_info/'
				);
				setProfile(updatedProfile.data);
				setFormData({
					restaurant_name: updatedProfile.data.restaurant_name || '',
					restaurant_location: updatedProfile.data.restaurant_location || '',
					password: '',
					confirm_password: '',
				});
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
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
			role="dialog"
			aria-modal="true"
			aria-labelledby="profile-modal-title">
			<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 sm:p-6 mx-4 max-h-[80vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3
						id="profile-modal-title"
						className="text-lg sm:text-xl font-bold text-gray-800">
						Restaurant Profile
					</h3>
					<button
						onClick={onClose}
						className="text-gray-600 hover:text-gray-800 text-lg sm:text-xl focus:outline-none"
						aria-label="Close modal"
						disabled={isLoading}>
						✕
					</button>
				</div>
				{error ? (
					<div className="text-center">
						<p className="text-red-500">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 text-sm">
							Retry
						</button>
					</div>
				) : profile ? (
					<form onSubmit={handleSubmit} className="space-y-4">
						{successMessage && (
							<p className="text-green-500 text-center">{successMessage}</p>
						)}
						<div className="flex flex-col items-center space-y-4">
							<div className="w-full">
								<label className="font-semibold text-gray-700">
									Restaurant Logo:
								</label>
								<div className="flex flex-col items-center mt-1">
									<img
										src={`${profile.restaurant_logo}`}
										alt="Restaurant Logo"
										className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mb-2"
										onError={(e) => (e.target.src = '/fallback-logo.png')} // Fallback image
									/>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleFileChange(e, setLogoFile)}
										className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
										src={`${profile.homepage_banner}`}
										alt="Homepage Banner"
										className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2"
										onError={(e) => (e.target.src = '/fallback-banner.png')} // Fallback image
									/>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleFileChange(e, setBannerFile)}
										className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
										disabled={isLoading}
									/>
								</div>
							</div>
						</div>
						<div className="space-y-3 text-sm sm:text-base">
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
