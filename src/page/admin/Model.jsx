import { useState, useEffect } from 'react';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';
import { saveAs } from 'file-saver';
import SuccessModal from '../../component/SuccessModal';
import DeleteConfirmationModal from '../../component/DeleteConfirmationModal';
import { ClipLoader } from 'react-spinners';

function ThreeDModel() {
	const [name, setName] = useState('');
	const [images, setImages] = useState([null, null, null, null]);
	const [imageFiles, setImageFiles] = useState([null, null, null, null]);
	const [models, setModels] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successModal, setSuccessModal] = useState(false);
	const [message, setMessage] = useState('');
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

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
				if (error.response?.status === 401) {
					localStorage.removeItem('authToken');
					window.location.href = '/login';
				}
			} finally {
				setIsTableLoading(false);
			}
		};
		fetchModels();
	}, []);

	const handleImageChange = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const newImages = [...images];
			const newImageFiles = [...imageFiles];
			newImages[index] = URL.createObjectURL(file);
			newImageFiles[index] = file;
			setImages(newImages);
			setImageFiles(newImageFiles);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name && imageFiles.some((file) => file !== null)) {
			setIsLoading(true);
			setError(null);
			try {
				const formData = new FormData();
				formData.append('name', name);

				const imageLabels = ['front', 'left', 'back', 'right'];
				imageLabels.forEach((label, index) => {
					const key = `${label}`;
					const file = imageFiles[index];
					formData.append(key, file || '');
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
				if (response.status === 201) {
					const updatedResponse = await axiosInstance.get(
						'threed_request/get_my_model_requests/'
					);
					setModels(updatedResponse.data);
					setName('');
					setImages([null, null, null, null]);
					setImageFiles([null, null, null, null]);
					setMessage('Model request submitted successfully!');
					setSuccessModal(true);
					setIsUploadModalOpen(false);
				}
			} catch (error) {
				console.error('Error creating model request:', error);
				setError('Failed to submit model request. Please try again.');
			} finally {
				setIsLoading(false);
			}
		} else {
			setError('Please provide a model name and upload at least one image.');
		}
	};

	const handleDelete = (id) => {
		setDeleteId(id);
		setMessage('Are you sure you want to delete this model request?');
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (deleteId) {
			setIsLoading(true);
			setError(null);
			setIsDeleteModalOpen(false);
			try {
				await axiosInstance.delete(
					`threed_request/delete_my_model_request/${deleteId}/`
				);
				const response = await axiosInstance.get(
					'threed_request/get_my_model_requests/'
				);
				setModels(response.data);
				setMessage('Model request deleted successfully!');
				setSuccessModal(true);
			} catch (error) {
				console.error('Error deleting model request:', error);
				setError('Failed to delete model request. Please try again.');
			} finally {
				setIsLoading(false);
				setDeleteId(null);
			}
		}
	};

	const openImageModal = (image) => {
		setSelectedImage(image);
	};

	const closeImageModal = () => {
		setSelectedImage(null);
	};

	const imageLabels = ['Front', 'Left', 'Back', 'Right'];

	const [downloading, setDownloading] = useState(false);

	const downloadModel = async (url, name) => {
		try {
			setDownloading(true);
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch model');
			const blob = await response.blob();
			saveAs(blob, `${name}.glb`);
		} catch (err) {
			console.error('Download error:', err);
			setError('Failed to download model.');
		} finally {
			setDownloading(false);
		}
	};

	return (
		<Sidebar>
			<div className="flex-1 p-4 sm:p-6">
				<div className="flex justify-between items-center mb-4 sm:mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
						3D Model Generator
					</h1>
					<button
						onClick={() => setIsUploadModalOpen(true)}
						className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 text-sm sm:text-base"
						disabled={isLoading}>
						Add Request Model
					</button>
				</div>

				{error && (
					<div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-sm sm:text-base">
						{error}
					</div>
				)}

				<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
						Requested Models
					</h2>
					<div className="overflow-x-auto h-[20vh] sm:h-[65vh]">
						<table className="min-w-full table-auto w-full">
							<thead>
								<tr className="bg-gray-200 text-gray-600 uppercase text-xs sm:text-sm sticky top-0">
									<th className="py-2 sm:py-3 px-2 sm:px-4 text-left min-w-[100px]">
										Name
									</th>
									<th className="py-2 sm:py-3 px-2 sm:px-4 text-left min-w-[120px]">
										Images
									</th>
									<th className="py-2 sm:py-3 px-2 sm:px-4 text-left min-w-[80px]">
										Status
									</th>
									<th className="py-2 sm:py-3 px-2 sm:px-4 text-left min-w-[100px]">
										Download
									</th>
									<th className="py-2 sm:py-3 px-2 sm:px-4 text-left min-w-[80px]">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="text-xs sm:text-sm">
								{isTableLoading ? (
									<tr>
										<td colSpan="5" className="py-4 px-2 sm:px-6 text-center">
											<div className="flex justify-center items-center h-20 sm:h-32">
												<div className="loader"></div>
											</div>
										</td>
									</tr>
								) : models.length === 0 ? (
									<tr>
										<td
											colSpan="5"
											className="py-4 px-2 sm:px-6 text-center text-gray-500 text-sm sm:text-base">
											No models requested yet.
										</td>
									</tr>
								) : (
									models.map((model) => (
										<tr key={model.id} className="border-b hover:bg-gray-50">
											<td className="py-2 sm:py-4 px-2 sm:px-4 truncate">
												{model.name}
											</td>
											<td className="py-2 sm:py-4 px-2 sm:px-4">
												<div className="flex flex-wrap space-x-1 sm:space-x-2">
													{model.pictures.map((img, index) =>
														img.file ===
														'https://ar-menu-bucket-jvai-files.s3-accelerate.amazonaws.com/no' ? null : (
															<img
																key={index}
																src={`${img.file}`}
																alt={`Model ${model.name} ${imageLabels[index]}`}
																className="w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-md cursor-pointer hover:opacity-80"
																onClick={() => openImageModal(img)}
																onError={(e) =>
																	(e.target.src = '/fallback-image.png')
																}
															/>
														)
													)}
												</div>
											</td>
											<td className="py-2 sm:py-4 px-2 sm:px-4">
												<span
													className={`px-1 sm:px-2 py-1 rounded-full text-xs ${
														model.status === 'processing'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-green-100 text-green-800'
													}`}>
													{model.status}
												</span>
											</td>
											<td className="py-2 sm:py-4 px-2 sm:px-4">
												{model.status === 'approve' &&
												model.downloadable_file !== '/media/no' ? (
													<a
														onClick={() =>
															downloadModel(model.downloadable_file, model.name)
														}
														className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs sm:text-sm">
														{downloading ? 'Downloading...' : 'Download Model'}
													</a>
												) : (
													<span className="text-gray-400 text-xs sm:text-sm">
														N/A
													</span>
												)}
											</td>
											<td className="py-2 sm:py-4 px-2 sm:px-4">
												<button
													onClick={() => handleDelete(model.id)}
													className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
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
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					role="dialog"
					aria-modal="true"
					aria-labelledby="image-preview-modal-title">
					<div className="bg-white p-2 sm:p-4 rounded-lg max-w-[90%] sm:max-w-3xl w-full">
						<div className="flex justify-between items-center mb-2 sm:mb-4">
							<h3
								id="image-preview-modal-title"
								className="text-sm sm:text-lg font-semibold">
								Image Preview
							</h3>
							<button
								onClick={closeImageModal}
								className="text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
								aria-label="Close image preview">
								✕
							</button>
						</div>
						<img
							src={`${selectedImage.file}`}
							alt="Full-size preview"
							className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain"
							onError={(e) => (e.target.src = '/fallback-image.png')}
						/>
					</div>
				</div>
			)}

			{/* Upload Modal */}
			{isUploadModalOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
					role="dialog"
					aria-modal="true"
					aria-labelledby="upload-model-modal-title">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6 mx-4 max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h3
								id="upload-model-modal-title"
								className="text-lg sm:text-xl font-semibold text-gray-800">
								Add 3D Model Request
							</h3>
							<button
								onClick={() => {
									setIsUploadModalOpen(false);
									setName('');
									setImages([null, null, null, null]);
									setImageFiles([null, null, null, null]);
									setError(null);
								}}
								className="text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
								aria-label="Close modal"
								disabled={isLoading}>
								✕
							</button>
						</div>
						{error && (
							<p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
						)}
						<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
							<div>
								<label className="block text-sm sm:text-base font-medium text-gray-600">
									Model Name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
									placeholder="Enter model name"
									required
									disabled={isLoading}
								/>
							</div>

							<div className="grid grid-cols-2 gap-2 sm:gap-4">
								{images.map((img, index) => (
									<div key={index} className="flex flex-col items-center">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											{imageLabels[index]}
										</label>
										<div
											className={`w-20 h-20 sm:w-24 sm:h-24 border-2 ${
												img
													? 'border-gray-300'
													: 'border-dashed border-gray-400'
											} rounded-md flex items-center justify-center mb-2 overflow-hidden`}>
											{img ? (
												<img
													src={img}
													alt={`${imageLabels[index]} Preview`}
													className="w-full h-full object-cover"
												/>
											) : (
												<span className="text-gray-400 text-xs">No image</span>
											)}
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => handleImageChange(index, e)}
											className="text-xs w-full"
											disabled={isLoading}
										/>
									</div>
								))}
							</div>

							<button
								type="submit"
								className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-green-300 text-sm sm:text-base"
								disabled={isLoading}>
								{isLoading ? (
									<span className="flex items-center justify-center">
										<ClipLoader size={20} color="#fff" className="mr-2" />
										Submitting...
									</span>
								) : (
									'Submit Request'
								)}
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Global Loader for Form Submission/Delete/Download */}
			{(isLoading || downloading) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="flex flex-col items-center">
						<ClipLoader size={40} color="#3B82F6" />
						<p className="mt-2 text-sm text-white">
							{downloading ? 'Downloading...' : 'Processing...'}
						</p>
					</div>
				</div>
			)}

			<SuccessModal
				isOpen={successModal}
				message={message}
				onClose={() => setSuccessModal(false)}
			/>
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onConfirm={confirmDelete}
				onCancel={() => {
					setIsDeleteModalOpen(false);
					setDeleteId(null);
				}}
				message={message}
			/>
		</Sidebar>
	);
}

export default ThreeDModel;
