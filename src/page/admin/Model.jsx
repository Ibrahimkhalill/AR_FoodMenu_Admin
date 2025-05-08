import { useState, useEffect } from 'react';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';

function ThreeDModel() {
	// State for form inputs, modal, and loaders
	const [name, setName] = useState('');
	const [images, setImages] = useState([null, null, null, null]); // [front, left, back, right]
	const [imageFiles, setImageFiles] = useState([null, null, null, null]); // Store actual File objects
	const [models, setModels] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false); // For form submission
	const [isTableLoading, setIsTableLoading] = useState(true); // For table data fetch
	const [error, setError] = useState(null);

	// Fetch models on mount
	useEffect(() => {
		const fetchModels = async () => {
			setIsTableLoading(true);
			setError(null);
			try {
				const response = await axiosInstance.get(
					'threed_request/get_my_model_requests/'
				);
				setModels(response.data);
			} catch (error) {
				console.error('Error fetching models:', error);
				setError('Failed to load models. Please try again.');
			} finally {
				setIsTableLoading(false);
			}
		};
		fetchModels();
	}, []);

	// Handle image upload
	const handleImageChange = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const newImages = [...images];
			const newImageFiles = [...imageFiles];
			newImages[index] = URL.createObjectURL(file); // For preview
			newImageFiles[index] = file; // For submission
			setImages(newImages);
			setImageFiles(newImageFiles);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name && imageFiles.every((file) => file !== null)) {
			setIsLoading(true);
			setError(null);
			try {
				// Create FormData for POST request
				const formData = new FormData();
				formData.append('name', name);
				imageFiles.forEach((file, index) => {
					formData.append('pictures', file); // Backend expects 'pictures' array
				});

				const response = await axiosInstance.post(
					'threed_request/create_model_request/',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);

				// Refresh models list
				const updatedResponse = await axiosInstance.get(
					'threed_request/get_my_model_requests/'
				);
				setModels(updatedResponse.data);
				setName('');
				setImages([null, null, null, null]);
				setImageFiles([null, null, null, null]);
				alert('Model request submitted successfully!');
			} catch (error) {
				console.error('Error creating model request:', error);
				setError('Failed to submit model request. Please try again.');
			} finally {
				setIsLoading(false);
			}
		} else {
			alert(
				'Please fill in all fields and upload images for Front, Left, Back, and Right.'
			);
		}
	};

	// Handle delete action
	const handleDelete = async (id) => {
		if (
			!window.confirm('Are you sure you want to delete this model request?')
		) {
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			await axiosInstance.delete(
				`threed_request/delete_my_model_request/${id}/`
			);
			// Refresh models list
			const response = await axiosInstance.get(
				'threed_request/get_my_model_requests/'
			);
			setModels(response.data);
			alert('Model request deleted successfully!');
		} catch (error) {
			console.error('Error deleting model request:', error);
			setError('Failed to delete model request. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Open image in modal
	const openImageModal = (image) => {
		setSelectedImage(image);
	};

	// Close modal
	const closeImageModal = () => {
		setSelectedImage(null);
	};

	// Labels for image uploads in order: front, left, back, right
	const imageLabels = ['Front', 'Left', 'Back', 'Right'];

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 p-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					3D Model Generator
				</h1>

				{/* Error Message */}
				{error && (
					<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
						{error}
					</div>
				)}

				{/* Form Section */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Upload 3D Model Details
					</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Input */}
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Model Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter model name"
								required
								disabled={isLoading}
							/>
						</div>

						{/* Image Upload Inputs */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{images.map((img, index) => (
								<div key={index} className="flex flex-col items-center">
									<label className="block text-sm font-medium text-gray-600 mb-1">
										{imageLabels[index]}
									</label>
									<div
										className={`w-32 h-32 border-2 ${
											img ? 'border-gray-300' : 'border-dashed border-gray-400'
										} rounded-md flex items-center justify-center mb-2 overflow-hidden`}>
										{img ? (
											<img
												src={img}
												alt={`${imageLabels[index]} Preview`}
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-gray-400 text-sm">No image</span>
										)}
									</div>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleImageChange(index, e)}
										className="p-2 border rounded-md w-full"
										required
										disabled={isLoading}
									/>
								</div>
							))}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-green-400"
							disabled={isLoading}>
							{isLoading ? 'Submitting...' : 'Submit Request'}
						</button>
					</form>
				</div>

				{/* Table Section */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Requested Models
					</h2>
					<div className="overflow-x-auto h-[25vh] overflow-y-auto">
						<table className="min-w-full table-auto">
							<thead>
								<tr className="bg-gray-200 text-gray-600 uppercase text-sm sticky">
									<th className="py-3 px-6 text-left">Name</th>
									<th className="py-3 px-6 text-left">Images</th>
									<th className="py-3 px-6 text-left">Status</th>
									<th className="py-3 px-6 text-left">Download</th>
									<th className="py-3 px-6 text-left">Action</th>
								</tr>
							</thead>
							<tbody>
								{isTableLoading ? (
									<tr>
										<td colSpan="5" className="py-4 px-6 text-center">
											<div className="flex justify-center items-center h-32">
												<div className="loader"></div>
											</div>
										</td>
									</tr>
								) : models.length === 0 ? (
									<tr>
										<td
											colSpan="5"
											className="py-4 px-6 text-center text-gray-500">
											No models requested yet.
										</td>
									</tr>
								) : (
									models.map((model) => (
										<tr key={model.id} className="border-b hover:bg-gray-50">
											<td className="py-4 px-6">{model.name}</td>
											<td className="py-4 px-6">
												<div className="flex space-x-2">
													{model.pictures.map((img, index) => (
														<img
															key={index}
															src={`${import.meta.env.VITE_REACT_BASE_URL}${
																img.file
															}`}
															alt={`Model ${model.name} ${imageLabels[index]}`}
															className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80"
															onClick={() => openImageModal(img)}
														/>
													))}
												</div>
											</td>
											<td className="py-4 px-6">
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														model.status === 'processing'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-green-100 text-green-800'
													}`}>
													{model.status}
												</span>
											</td>
											<td className="py-4 px-6">
												{model.status === 'approve' &&
												model.downloadable_file ? (
													<a
														href={model.downloadable_file}
														download
														className="text-blue-600 hover:text-blue-800 underline">
														Download Model
													</a>
												) : (
													<span className="text-gray-400">N/A</span>
												)}
											</td>
											<td className="py-4 px-6">
												<button
													onClick={() => handleDelete(model.id)}
													className="text-red-600 hover:text-red-800"
													disabled={isLoading}>
													Delete
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Image Modal */}
			{selectedImage && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded-lg max-w-3xl w-full">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Image Preview</h3>
							<button
								onClick={closeImageModal}
								className="text-gray-600 hover:text-gray-800">
								✕
							</button>
						</div>
						<img
							src={`${import.meta.env.VITE_REACT_BASE_URL}${
								selectedImage.file
							}`}
							alt="Full-size preview"
							className="w-full h-auto max-h-[70vh] object-contain"
						/>
					</div>
				</div>
			)}

			{/* Form Submission/Delete Loader */}
			{isLoading && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="loader"></div>
				</div>
			)}
		</div>
	);
}

export default ThreeDModel;
