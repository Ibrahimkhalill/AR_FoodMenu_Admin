import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
	FaArrowLeft,
	FaStar,
	FaThumbsUp,
	FaThumbsDown,
	FaPencilAlt,
	FaTrashAlt,
} from 'react-icons/fa';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';
import SkeletonLoader from '../../component/SkeletonLoader';
import SuccessModal from '../../component/SuccessModal';
import DeleteConfirmationModal from '../../component/DeleteConfirmationModal';
import { ClipLoader } from 'react-spinners';

export default function Menu() {
	const { categoryName } = useParams();
	const navigate = useNavigate();
	const [foods, setFoods] = useState([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
	const [newFood, setNewFood] = useState({
		category: '',
		name: '',
		imageFile: null,
		modelFile: null,
		description: '',
		price: '',
		size: '',
		time: '',
	});
	const [editFood, setEditFood] = useState({
		id: null,
		category: '',
		name: '',
		imageFile: null,
		modelFile: null,
		description: '',
		price: '',
		size: '',
		time: '',
	});
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [successModal, setSuccessModal] = useState(false);
	const [message, setMessage] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	// Fetch categories and foods on mount
	useEffect(() => {
		const fetchCategory = async () => {
			try {
				const response = await axiosInstance.get('restaurant/get_categories/');
				if (response.status === 200) {
					console.log('✅ Category List Fetched:', response.data);
					setCategories([...new Set(response.data)]);
				} else {
					console.error(
						'❌ Error fetching category list:',
						response.data.error
					);
					setError('Failed to load categories. Please try again.');
				}
			} catch (error) {
				console.error('❌ Error fetching category list:', error.message);
				setError('Failed to load categories. Please try again.');
			}
		};

		const fetchFood = async () => {
			setIsSkeletonLoading(true);
			try {
				const response = await axiosInstance.get('restaurant/get_all_foods/');
				if (response.status === 200) {
					console.log('✅ Food List Fetched:', response.data);
					setFoods(response.data);
					setIsSkeletonLoading(false);
				} else {
					console.error('❌ Error fetching food list:', response.data.error);
					setError('Failed to load foods. Please try again.');
				}
			} catch (error) {
				console.error('❌ Error fetching food list:', error.message);
				setError('Failed to load foods. Please try again.');
				if (error.response?.status === 401) {
					localStorage.removeItem('authToken');
					window.location.href = '/login';
				}
			}
		};
		fetchFood();
		fetchCategory();
	}, []);

	const handleAddFood = () => {
		setIsAddModalOpen(true);
	};

	const handleEditFood = (food) => {
		setEditFood({
			id: food.id,
			category: food.category,
			name: food.item_name,
			imageFile: null,
			modelFile: null,
			description: food.description,
			price: food.price,
			size: food.size,
			time: food.time,
		});
		setIsEditModalOpen(true);
	};

	const handleAddModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		if (!newFood.imageFile || !newFood.modelFile) {
			setError('Please upload both an image and a 3D model.');
			setIsLoading(false);
			return;
		}

		try {
			const formData = new FormData();
			formData.append('category', newFood.category);
			formData.append('item_name', newFood.name);
			formData.append('normal_picture', newFood.imageFile);
			formData.append('three_d_picture', newFood.modelFile);
			formData.append('description', newFood.description);
			formData.append('price', parseFloat(newFood.price));
			formData.append('size', newFood.size);
			formData.append('time', newFood.time);

			const response = await axiosInstance.post(
				`restaurant/add_food/${newFood.category}/`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.status === 200 || response.status === 201) {
				setMessage('Food item created successfully');
				setSuccessModal(true);
				const foodResponse = await axiosInstance.get(
					'restaurant/get_all_foods/'
				);
				setFoods(foodResponse.data);
				setNewFood({
					category: '',
					name: '',
					imageFile: null,
					modelFile: null,
					description: '',
					price: '',
					size: '',
					time: '',
				});
				setIsAddModalOpen(false);
			}
		} catch (err) {
			console.error('Error creating food item:', err);
			setError('Failed to create food item. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append('category', editFood.category);
			formData.append('item_name', editFood.name);
			if (editFood.imageFile) {
				formData.append('normal_picture', editFood.imageFile);
			}
			if (editFood.modelFile) {
				formData.append('three_d_picture', editFood.modelFile);
			}
			formData.append('description', editFood.description);
			formData.append('price', parseFloat(editFood.price));
			formData.append('size', editFood.size);
			formData.append('time', editFood.time);

			const response = await axiosInstance.patch(
				`restaurant/update_food/${editFood.id}/`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.status === 200) {
				setMessage('Food item updated successfully');
				setSuccessModal(true);
				const foodResponse = await axiosInstance.get(
					'restaurant/get_all_foods/'
				);
				setFoods(foodResponse.data);
				setEditFood({
					id: null,
					category: '',
					name: '',
					imageFile: null,
					modelFile: null,
					description: '',
					price: '',
					size: '',
					time: '',
				});
				setIsEditModalOpen(false);
			} else {
				setError('Failed to update food item.');
			}
		} catch (err) {
			console.error('Error updating food item:', err);
			setError('Failed to update food item. Please try again.');
			if (err.response?.status === 401) {
				localStorage.removeItem('authToken');
				window.location.href = '/login';
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = (id) => {
		setDeleteId(id);
		setMessage('Are you sure you want to delete this menu?');
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (deleteId) {
			setIsDeleteLoading(true);
			setError('');
			setIsDeleteModalOpen(false);

			try {
				const response = await axiosInstance.delete(
					`restaurant/delete_food/${deleteId}/`
				);

				if (response.status === 204 || response.status === 200) {
					setMessage('Food item deleted successfully');
					setSuccessModal(true);
					const foodResponse = await axiosInstance.get(
						'restaurant/get_all_foods/'
					);
					setFoods(foodResponse.data);
				} else {
					throw new Error('Failed to delete food item');
				}
			} catch (err) {
				setError(
					err.response?.data?.message ||
						'Failed to delete food item. Please try again.'
				);
				console.log(err.response);
			} finally {
				setIsDeleteLoading(false);
				setDeleteId(null);
			}
		}
	};

	const handleFoodClick = (model_url, food) => {
		navigate('/ar-view', {
			state: { selectedModel: model_url, foodDetails: food },
		});
	};

	return (
		<Sidebar title={'Menu'}>
			<div className="min-h-screen bg-white p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<button className="text-teal-600"></button>
					<button
						onClick={handleAddFood}
						className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
						disabled={isLoading}>
						Add Menu
					</button>
				</div>

				{/* Food Grid or Skeleton Loader */}
				{isSkeletonLoading ? (
					<div className="">
						<SkeletonLoader />
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
						{foods.map((food, index) => (
							<button
								onClick={() => handleFoodClick(food.three_d_picture, food)}
								key={index}
								className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition relative">
								<img
									src={`${food.normal_picture}`}
									alt={food.item_name}
									className="w-full h-56 object-cover rounded-t-lg"
									onError={(e) => (e.target.src = '/fallback-food.png')}
								/>
								<div className="p-4 flex flex-col items-start">
									<div className="flex 2xl:flex-row flex-col w-full 2xl:justify-between 2xl:items-center items-start 2xl:mb-2">
										<h4 className="text-lg text-left font-bold text-gray-800">
											{food.item_name}
										</h4>
										<span className="text-green-500 font-bold 2xl:text-lg">
											BDT {food.price}
										</span>
									</div>
									<p className="text-green-500 text-left text-sm mb-2">
										Category: {food.category_name}
									</p>
									<div className="absolute top-2 right-2 flex space-x-2">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleEditFood(food);
											}}
											className="bg-slate-50 text-gray-700 text-xs font-bold rounded-full px-2 py-1"
											disabled={isLoading}>
											<FaPencilAlt size={15} color="blue" className="inline" />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(food.id);
											}}
											className="bg-slate-50 text-gray-700 text-xs font-bold rounded-full px-2 py-1"
											disabled={isLoading}>
											<FaTrashAlt size={15} color="red" className="inline" />
										</button>
									</div>
								</div>
							</button>
						))}
					</div>
				)}

				{/* Add Food Modal */}
				{isAddModalOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
						role="dialog"
						aria-modal="true"
						aria-labelledby="add-food-modal-title">
						<div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
							<h2
								id="add-food-modal-title"
								className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">
								Add New Food Item
							</h2>
							{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
							<form onSubmit={handleAddModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Category
									</label>
									<select
										value={newFood.category}
										onChange={(e) =>
											setNewFood({ ...newFood, category: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}>
										<option value="" disabled>
											Select a category
										</option>
										{categories.map((cat, index) => (
											<option key={index} value={cat.id}>
												{cat.category_name}
											</option>
										))}
									</select>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Name
									</label>
									<input
										type="text"
										value={newFood.name}
										onChange={(e) =>
											setNewFood({ ...newFood, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Image
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) =>
											setNewFood({ ...newFood, imageFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										3D Model
									</label>
									<input
										type="file"
										accept=".glb,.gltf"
										onChange={(e) =>
											setNewFood({ ...newFood, modelFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Description
									</label>
									<textarea
										value={newFood.description}
										onChange={(e) =>
											setNewFood({ ...newFood, description: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										rows="3"
										required
										disabled={isLoading}></textarea>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-4">
									<div>
										<label className="block text-gray-700 mb-2 text-sm sm:text-base">
											Size
										</label>
										<input
											type="text"
											value={newFood.size}
											onChange={(e) =>
												setNewFood({ ...newFood, size: e.target.value })
											}
											className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
									<div>
										<label className="block text-gray-700 mb-2 text-sm sm:text-base">
											Prepared Time
										</label>
										<input
											type="text"
											value={newFood.time}
											onChange={(e) =>
												setNewFood({ ...newFood, time: e.target.value })
											}
											className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Price
									</label>
									<input
										type="number"
										value={newFood.price}
										onChange={(e) =>
											setNewFood({ ...newFood, price: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										step="0.01"
										min="0"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<button
										type="button"
										onClick={() => setIsAddModalOpen(false)}
										className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
										disabled={isLoading}>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base disabled:bg-green-300"
										disabled={isLoading}>
										{isLoading ? (
											<span className="flex items-center">
												<ClipLoader size={20} color="#fff" className="mr-2" />
												Adding...
											</span>
										) : (
											'Add'
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Edit Food Modal */}
				{isEditModalOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
						role="dialog"
						aria-modal="true"
						aria-labelledby="edit-food-modal-title">
						<div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
							<h2
								id="edit-food-modal-title"
								className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">
								Edit Food Item
							</h2>
							{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
							<form onSubmit={handleEditModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Category
									</label>
									<select
										value={editFood.category}
										onChange={(e) =>
											setEditFood({ ...editFood, category: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}>
										<option value="" disabled>
											Select a category
										</option>
										{categories.map((cat, index) => (
											<option key={index} value={cat.id}>
												{cat.category_name}
											</option>
										))}
									</select>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Name
									</label>
									<input
										type="text"
										value={editFood.name}
										onChange={(e) =>
											setEditFood({ ...editFood, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Image (optional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) =>
											setEditFood({ ...editFood, imageFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										3D Model (optional)
									</label>
									<input
										type="file"
										accept=".glb,.gltf"
										onChange={(e) =>
											setEditFood({ ...editFood, modelFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Description
									</label>
									<textarea
										value={editFood.description}
										onChange={(e) =>
											setEditFood({ ...editFood, description: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										rows="3"
										required
										disabled={isLoading}></textarea>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-4">
									<div>
										<label className="block text-gray-700 mb-2 text-sm sm:text-base">
											Size
										</label>
										<input
											type="text"
											value={editFood.size}
											onChange={(e) =>
												setEditFood({ ...editFood, size: e.target.value })
											}
											className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
									<div>
										<label className="block text-gray-700 mb-2 text-sm sm:text-base">
											Prepared Time
										</label>
										<input
											type="text"
											value={editFood.time}
											onChange={(e) =>
												setEditFood({ ...editFood, time: e.target.value })
											}
											className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Price
									</label>
									<input
										type="number"
										value={editFood.price}
										onChange={(e) =>
											setEditFood({ ...editFood, price: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
										step="0.01"
										min="0"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<button
										type="button"
										onClick={() => setIsEditModalOpen(false)}
										className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
										disabled={isLoading}>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base disabled:bg-green-300"
										disabled={isLoading}>
										{isLoading ? (
											<span className="flex items-center">
												<ClipLoader size={20} color="#fff" className="mr-2" />
												Updating...
											</span>
										) : (
											'Update'
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Global Loader for Form Submission and Delete */}
				{isDeleteLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="loader"></div>
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
			</div>
		</Sidebar>
	);
}
