import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FaArrowLeft,
	FaDrumstickBite,
	FaFish,
	FaUtensils,
	FaPizzaSlice,
} from 'react-icons/fa';
import { MdRiceBowl } from 'react-icons/md';
import axiosInstance from '../component/axiosInstance';

export default function AllFood() {
	const navigate = useNavigate();
	const [allFoods, setAllFoods] = useState([]); // Store flattened food items
	const [error, setError] = useState(null);

	// Fetch food data from the API
	useEffect(() => {
		const fetchFoods = async () => {
			try {
				const response = await axiosInstance.get('user_pov/get_all_food/4/');
				if (response.status === 200) {
					console.log('✅ Food List Fetched:', response.data);

					// Flatten the foods arrays from all categories into a single array
					const flattenedFoods = response.data.flatMap((category) =>
						category.foods.map((food) => ({
							...food,
							category: category.category_name, // Add the category name to each food item
						}))
					);
					setAllFoods(flattenedFoods);
				} else {
					console.error('❌ Error fetching food list:', response.data.error);
					setError('Failed to load foods. Please try again.');
				}
			} catch (error) {
				console.error('❌ Error fetching food list:', error.message);
				setError('Failed to load foods. Please try again.');
			}
		};

		fetchFoods();
	}, []);
	const handleFoodClick = (model_url) => {
		// Navigate to ARView
		navigate('/ar-view', {
			state: { selectedModel: model_url },
		});
	};
	return (
		<div className="min-h-screen bg-[#fff] p-4">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<button onClick={() => navigate(-1)} className="text-teal-600">
					<FaArrowLeft size={20} />
				</button>
				<h1 className="text-xl font-bold text-gray-800">ALL Food</h1>
				<div className="w-6"></div> {/* Spacer for alignment */}
			</div>

			{/* Error Message */}
			{error && <p className="text-red-500 mb-4">{error}</p>}

			{/* Food Grid */}
			<div className="grid grid-cols-2 gap-4">
				{allFoods.length > 0 ? (
					allFoods.map((food, index) => (
						<div
							key={index}
							className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
							onClick={() => handleFoodClick(food.three_d_picture)}>
							{/* Discount Badge */}
							{food.discount && (
								<div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1">
									{food.discount}
								</div>
							)}
							<img
								src={
									`${import.meta.env.VITE_REACT_BASE_API_URL}${
										food.normal_picture
									}` || 'https://via.placeholder.com/150'
								}
								alt={food.item_name}
								className="w-full h-32 object-cover rounded-lg mb-2"
							/>
							<div className="flex justify-between items-center mb-2">
								<h4 className="text-md font-bold">{food.item_name}</h4>
							</div>
							<div className="flex justify-between items-center text-sm text-gray-600">
								<span>{food.price || '$29.00'}</span>
								<span>⏰ {food.time || '20 min'}</span>
							</div>
						</div>
					))
				) : (
					<p className="text-gray-600 col-span-2 text-center">
						No foods available.
					</p>
				)}
			</div>
		</div>
	);
}
