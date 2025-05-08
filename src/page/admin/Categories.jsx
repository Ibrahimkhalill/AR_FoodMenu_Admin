import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import CategorySkelton from '../../component/admin/CategorySkelton';

export default function Categories() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // For form submission and delete
	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true); // For skeleton loader
	const [newCategory, setNewCategory] = useState({ name: '', image: '' });
	const [error, setError] = useState(null);

	// Fetch categories from API
	useEffect(() => {
		fetchSeminarData();
	}, []);

	const fetchSeminarData = async () => {
		setIsSkeletonLoading(true); // Show skeleton loader
		try {
			const response = await axiosInstance.get('restaurant/get_categories/');
			if (response.status === 200) {
				console.log('✅ Category List Fetched:', response.data);
				setCategories(response.data);
			} else {
				console.error('❌ Error fetching category list:', response.data.error);
				setError('Failed to load categories. Please try again.');
			}
		} catch (error) {
			console.error('❌ Error fetching category list:', error.message);
			setError('Failed to load categories. Please try again.');
		} finally {
			setIsSkeletonLoading(false); // Hide skeleton loader
		}
	};

	const handleCategoryClick = (categoryName) => {
		navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
	};

	const handleAddCategory = () => {
		setIsModalOpen(true);
	};

	const handleModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true); // Show form submission loader

		try {
			// Send POST request to create a new category
			const response = await axiosInstance.post('restaurant/create_category/', {
				category_name: newCategory.name,
			});

			if (response.status === 200 || response.status === 201) {
				alert('Category created successfully');
				// Refresh category list
				await fetchSeminarData();
				setNewCategory({ name: '', image: '' });
				setIsModalOpen(false);
			}
		} catch (err) {
			console.error('Error creating category:', err);
			setError('Failed to create category. Please try again.');
		} finally {
			setIsLoading(false); // Hide loader
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this category?')) {
			return;
		}

		setIsLoading(true); // Show loader for delete
		setError('');

		try {
			const response = await axiosInstance.delete(
				`restaurant/delete_category/${id}/`
			);

			if (response.status === 204 || response.status === 200) {
				console.log('✅ Category deleted successfully');
				await fetchSeminarData(); // Refresh the category list
			} else {
				throw new Error('Failed to delete category');
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to delete category. Please try again.'
			);
		} finally {
			setIsLoading(false); // Hide loader
		}
	};

	return (
		<Sidebar title={'Categories'}>
			<div className="min-h-screen bg-white p-4">
				{/* Header with Add Category Button */}
				<div className="flex justify-end mb-4">
					<button
						onClick={handleAddCategory}
						className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
						disabled={isLoading}>
						ADD CATEGORY
					</button>
				</div>

				{/* Category Grid or Skeleton Loader */}
				{isSkeletonLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-4">
						{/* Render 6 skeleton placeholders */}
						{Array.from({ length: 6 }).map((_, index) => (
							<CategorySkelton key={index} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-4">
						{categories.map((category, index) => (
							<div
								key={index}
								className="bg-white px-2 py-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
								onClick={() => handleCategoryClick(category.category_name)}>
								<img
									src={
										'https://e7.pngegg.com/pngimages/80/950/png-clipart-computer-icons-foodie-blog-categories-miscellaneous-food.png'
									}
									alt={category.category_name}
									className="w-full h-16 object-cover rounded-t-lg"
								/>
								<div className="flex justify-between items-center">
									<h4 className="text-md font-semibold text-gray-800">
										{category.category_name}
									</h4>
									<button
										onClick={(e) => {
											e.stopPropagation(); // Prevent navigating when clicking delete
											handleDelete(category.id);
										}}
										className="text-gray-700 text-xs font-bold rounded-full px-2 py-1"
										disabled={isLoading}>
										<FaTrashAlt size={15} color="red" className="inline" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Modal for Adding Category */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
							<h2 className="text-xl font-bold mb-4">Add New Category</h2>
							{error && <p className="text-red-500 mb-4">{error}</p>}
							<form onSubmit={handleModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2">
										Category Name
									</label>
									<input
										type="text"
										value={newCategory.name}
										onChange={(e) =>
											setNewCategory({ ...newCategory, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg"
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
										className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-green-300"
										disabled={isLoading}>
										{isLoading ? 'Adding...' : 'Add'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Loader for Form Submission and Delete */}
				{isLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="loader"></div>
					</div>
				)}
			</div>
		</Sidebar>
	);
}
