import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import { FaArrowLeft } from 'react-icons/fa';
import SkeletonLoader from '../component/SkeletonLoader'; // Import the skeleton loader component
export default function CategoryFoodPage() {
	const { category } = useParams();
	const [foods, setFoods] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // Add loading state
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFoods = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get('user_pov/get_all_food/4/');
				if (response.status === 200) {
					const flattenedFoods = response.data.flatMap((cat) =>
						cat.foods.map((food) => ({
							...food,
							category: cat.category_name,
						}))
					);

					if (category.toLowerCase() === 'all') {
						setFoods(flattenedFoods);
					} else {
						const filteredFoods = flattenedFoods.filter(
							(food) => food.category.toLowerCase() === category.toLowerCase()
						);
						setFoods(filteredFoods);
					}
				} else {
					setError('Failed to load foods. Please try again.');
				}
			} catch (error) {
				setError('Failed to load foods. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchFoods();
	}, [category]);

	return (
		<div className="min-h-screen bg-[#ffff] rounded-lg p-4">
			<div className="flex justify-between items-center mb-4">
				<button onClick={() => navigate(-1)} className="text-teal-600">
					<FaArrowLeft size={20} />
				</button>
				<h1 className="text-xl font-bold text-gray-800">
					{category.toLowerCase() === 'all'
						? 'All Foods'
						: `${category.charAt(0).toUpperCase() + category.slice(1)} Foods`}
				</h1>
				<div className="w-6"></div>
			</div>

			{loading ? (
				<SkeletonLoader /> // Reuse the component here
			) : error ? (
				<p className="text-red-500 mb-4">{error}</p>
			) : foods.length > 0 ? (
				<div className="grid grid-cols-2 gap-4">
					{foods.map((food) => (
						<div
							key={food.id}
							className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
							onClick={() =>
								navigate('/ar-view', {
									state: {
										selectedModel: food.three_d_picture,
										foodDetails: food,
									},
								})
							}>
							<img
								src={
									`${import.meta.env.VITE_REACT_BASE_URL}${
										food.normal_picture
									}` || 'https://via.placeholder.com/150'
								}
								alt={food.item_name}
								className="w-full h-[100px] object-cover rounded-lg mb-2"
							/>
							<h4 className="text-md text-black font-semibold mb-1 truncate w-full">
								{food.item_name}
							</h4>
							<div className="flex justify-between items-center text-sm text-gray-600">
								<span>{food.price || '৳29.00'} BDT</span>
								<span>⏰ {food.time || '4.8'}</span>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-600">No foods found in this category.</p>
			)}
		</div>
	);
}
