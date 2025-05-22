import { useState, useEffect } from 'react';
import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';
import { FaTrashAlt } from 'react-icons/fa';
import CategorySkelton from '../../component/admin/CategorySkelton';
import SuccessModal from '../../component/SuccessModal';
import WarningModal from '../../component/WarningModal';
import DeleteConfirmationModal from '../../component/DeleteConfirmationModal';
import { ClipLoader } from 'react-spinners';

export default function Categories() {
	const [categories, setCategories] = useState([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
	const [newCategory, setNewCategory] = useState({ name: '' });
	const [editCategory, setEditCategory] = useState({ id: null, name: '' });
	const [error, setError] = useState(null);
	const [successModal, setSuccessModal] = useState(false);
	const [message, setMessage] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	// Fetch categories from API
	useEffect(() => {
		fetchcategoryData();
	}, []);

	const fetchcategoryData = async () => {
		setIsSkeletonLoading(true);
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
			if (error.response?.status === 401) {
				localStorage.removeItem('authToken');
				window.location.href = '/login';
			}
		} finally {
			setIsSkeletonLoading(false);
		}
	};

	const handleAddCategory = () => {
		setIsAddModalOpen(true);
	};

	const handleEditCategory = (category) => {
		setEditCategory({ id: category.id, name: category.category_name });
		setIsEditModalOpen(true);
	};

	const handleAddModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const response = await axiosInstance.post('restaurant/create_category/', {
				category_name: newCategory.name,
			});

			if (response.status === 200 || response.status === 201) {
				setMessage('Category created successfully');
				setSuccessModal(true);
				await fetchcategoryData();
				setNewCategory({ name: '' });
				setIsAddModalOpen(false);
			}
		} catch (err) {
			console.error('Error creating category:', err);
			setError('Failed to create category. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditModalSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const response = await axiosInstance.patch(
				`restaurant/update_category/${editCategory.id}/`,
				{
					category_name: editCategory.name,
				}
			);

			if (response.status === 200) {
				setMessage('Category updated successfully');
				setSuccessModal(true);
				await fetchcategoryData();
				setEditCategory({ id: null, name: '' });
				setIsEditModalOpen(false);
			} else {
				setError('Failed to update category.');
			}
		} catch (err) {
			console.error('Error updating category:', err);
			setError('Failed to update category. Please try again.');
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
		setMessage('Are you sure you want to delete this category?');
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (deleteId) {
			setIsDeleteLoading(true);
			setError('');
			setIsDeleteModalOpen(false);

			try {
				const response = await axiosInstance.delete(
					`restaurant/delete_category/${deleteId}/`
				);

				if (response.status === 204 || response.status === 200) {
					console.log('✅ Category deleted successfully');
					setMessage('Category deleted successfully');
					setSuccessModal(true);
					await fetchcategoryData();
				} else {
					throw new Error('Failed to delete category');
				}
			} catch (err) {
				setError(
					err.response?.data?.message ||
						'Failed to delete category. Please try again.'
				);
			} finally {
				setIsDeleteLoading(false);
				setDeleteId(null);
			}
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
						Add Category
					</button>
				</div>

				{/* Category Grid or Skeleton Loader */}
				{isSkeletonLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 2xl:grid-cols-12 gap-4">
						{Array.from({ length: 6 }).map((_, index) => (
							<CategorySkelton key={index} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-12 gap-4">
						{categories.map((category, index) => (
							<div
								key={index}
								className="bg-white px-2 py-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
								onClick={() => handleEditCategory(category)}>
								<img
									src={
										'https://e7.pngegg.com/pngimages/80/950/png-clipart-computer-icons-foodie-blog-categories-miscellaneous-food.png'
									}
									alt={category.category_name}
									className="w-full h-22 object-cover rounded-t-lg"
									onError={(e) => (e.target.src = '/fallback-category.png')}
								/>
								<div className="flex justify-between items-center">
									<h4 className="text-sm font-semibold text-gray-800">
										{category.category_name}
									</h4>
									<button
										onClick={(e) => {
											e.stopPropagation();
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

				{/* Add Category Modal */}
				{isAddModalOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
						role="dialog"
						aria-modal="true"
						aria-labelledby="add-category-modal-title">
						<div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
							<h2
								id="add-category-modal-title"
								className="text-lg sm:text-xl font-bold mb-4">
								Add New Category
							</h2>
							{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
							<form onSubmit={handleAddModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Category Name
									</label>
									<input
										type="text"
										value={newCategory.name}
										onChange={(e) =>
											setNewCategory({ ...newCategory, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
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

				{/* Edit Category Modal */}
				{isEditModalOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
						role="dialog"
						aria-modal="true"
						aria-labelledby="edit-category-modal-title">
						<div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
							<h2
								id="edit-category-modal-title"
								className="text-lg sm:text-xl font-bold mb-4">
								Edit Category
							</h2>
							{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
							<form onSubmit={handleEditModalSubmit}>
								<div className="mb-4">
									<label className="block text-gray-700 mb-2 text-sm sm:text-base">
										Category Name
									</label>
									<input
										type="text"
										value={editCategory.name}
										onChange={(e) =>
											setEditCategory({ ...editCategory, name: e.target.value })
										}
										className="w-full p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
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
					message={message}
					isOpen={successModal}
					onClose={() => setSuccessModal(false)}
				/>
				<WarningModal
					message={error}
					isOpen={!!error}
					onClose={() => setError(null)}
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
