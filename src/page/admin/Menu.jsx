import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';

import SkeletonLoader from '../../component/SkeletonLoader';

export default function Menu() {
	const { categoryName } = useParams();
	const navigate = useNavigate();
	const [foods, setFoods] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // For form submission loader
	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true); // For skeleton loader
	const [newFood, setNewFood] = useState({
		category_id: '',
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
			try {
				const response = await axiosInstance.get('restaurant/get_all_foods/');
				if (response.status === 200) {
					console.log('✅ Food List Fetched:', response.data);
					setFoods(response.data);
				} else {
					console.error('❌ Error fetching food list:', response.data.error);
					setError('Failed to load foods. Please try again.');
				}
			} catch (error) {
				console.error('❌ Error fetching food list:', error.message);
				setError('Failed to load foods. Please try again.');
			}
		};

		// Fetch both and hide skeleton when both complete
		Promise.all([fetchCategory(), fetchFood()]).finally(() => {
			setIsSkeletonLoading(false); // Hide skeleton after both API calls
		});
	}, []);

	const handleAddFood = () => {
		setIsModalOpen(true);
	};

	const handleModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true); // Show form submission loader

		// Validate that both files are selected
		if (!newFood.imageFile || !newFood.modelFile) {
			setError('Please upload both an image and a 3D model.');
			setIsLoading(false); // Hide loader
			return;
		}

		try {
			// Create a FormData object
			const formData = new FormData();
			formData.append('category', newFood.category);
			formData.append('item_name', newFood.name);
			formData.append('normal_picture', newFood.imageFile);
			formData.append('three_d_picture', newFood.modelFile);
			formData.append('description', newFood.description);
			formData.append('price', parseFloat(newFood.price));
			formData.append('size', parseFloat(newFood.size));
			formData.append('time', parseFloat(newFood.time));

			// Send the FormData to the API
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
				// Refresh food list
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
				setIsModalOpen(false);
			}
		} catch (err) {
			console.error('Error creating food item:', err);
			setError('Failed to create food item. Please try again.');
		} finally {
			setIsLoading(false); // Hide loader
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this food item?')) {
			return;
		}

		setError('');

		try {
			const response = await axiosInstance.delete(
				`restaurant/delete_food/${id}/`
			);

			if (response.status === 204 || response.status === 200) {
				alert('✅ Food deleted successfully');
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
		}
	};

	const handleFoodClick = (model_url, food) => {
		navigate('/ar-view', {
			state: { selectedModel: model_url, foodDetails: food },
		});
	};

	return (
		<Sidebar>
			<div className="min-h-screen bg-white p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<button onClick={() => navigate(-1)} className="text-teal-600">
						<FaArrowLeft size={24} />
					</button>
					<button
						onClick={handleAddFood}
						className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
						ADD FOOD
					</button>
				</div>

				{/* Food Grid or Skeleton Loader */}
				{isSkeletonLoading ? (
					<div className="">
						{/* Render 6 skeleton placeholders */}
						<SkeletonLoader />
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{foods.map((food, index) => (
							<button
								onClick={() => handleFoodClick(food.three_d_picture, food)}
								key={index}
								className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition relative">
								<img
									src={`https://bdcallingarbackend.duckdns.org${food.normal_picture}`}
									alt={food.item_name}
									className="w-full h-40 object-cover rounded-t-lg"
								/>
								<div className="p-4 flex flex-col items-start">
									<div className="flex w-full justify-between items-center mb-2">
										<h4 className="text-lg font-bold text-gray-800">
											{food.item_name}
										</h4>
										<span className="text-green-500 font-bold text-lg">
											BDT {food.price}
										</span>
									</div>
									<p className="text-green-500 text-sm mb-2">
										Category: {food.category_name}
									</p>
									<p className="text-gray-600 text-sm">{food.description}</p>
									<button
										onClick={() => handleDelete(food.id)}
										className="bg-slate-50 text-gray-700 text-xs font-bold rounded-full px-2 py-1 absolute top-2 right-2">
										<FaTrashAlt size={15} color="red" className="inline" />
									</button>
								</div>
							</button>
						))}
					</div>
				)}

				{/* Modal for Adding Food */}
				{isModalOpen && (
					<div className="fixed inset-0  bg-black bg-opacity-[0.5] flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Add New Food Item
							</h2>
							{error && <p className="text-red-500 mb-4">{error}</p>}
							<form onSubmit={handleModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">Category</label>
									<select
										value={newFood.category}
										onChange={(e) =>
											setNewFood({ ...newFood, category: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
									<label className="block text-gray-700 mb-2">Name</label>
									<input
										type="text"
										value={newFood.name}
										onChange={(e) =>
											setNewFood({ ...newFood, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">Image</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) =>
											setNewFood({ ...newFood, imageFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">3D Model</label>
									<input
										type="file"
										accept=".glb,.gltf"
										onChange={(e) =>
											setNewFood({ ...newFood, modelFile: e.target.files[0] })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">
										Description
									</label>
									<textarea
										value={newFood.description}
										onChange={(e) =>
											setNewFood({ ...newFood, description: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										rows="3"
										required
										disabled={isLoading}></textarea>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-4">
									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Size</label>
										<input
											type="text"
											value={newFood.size}
											onChange={(e) =>
												setNewFood({ ...newFood, size: e.target.value })
											}
											className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
									<div className="mb-4">
										<label className="block text-gray-700 mb-2">
											Prepared Time
										</label>
										<input
											type="number"
											value={newFood.time}
											onChange={(e) =>
												setNewFood({ ...newFood, time: e.target.value })
											}
											className="w-full p-2 border rounded academic-lg focus:outline-none focus:ring-2 focus:ring-green-500"
											required
											disabled={isLoading}
										/>
									</div>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">Price</label>
									<input
										type="number"
										value={newFood.price}
										onChange={(e) =>
											setNewFood({ ...newFood, price: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
										step="0.01"
										min="0"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
										disabled={isLoading}>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isLoading}
										className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-green-300">
										{isLoading ? 'Adding...' : 'Add'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Loader for Form Submission */}
				{isLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="loader"></div>
					</div>
				)}
			</div>
		</Sidebar>
	);
}
