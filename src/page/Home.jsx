import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import banner from '../assets/banner.png';
import {
	FaSearch,
	FaHamburger,
	FaPizzaSlice,
	FaDrumstickBite,
	FaUtensils,
	FaGlassWhiskey,
} from 'react-icons/fa';
import { MdRiceBowl, MdFastfood } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import SkeletonLoader from '../component/SkeletonLoader'; // Reusable card skeleton
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Mapping of categories to icons
const categoryIcons = {
	All: <MdFastfood size={24} />,
	Burgers: <FaHamburger size={24} />,
	Pizza: <FaPizzaSlice size={24} />,
	Chicken: <FaDrumstickBite size={24} />,
	Rice: <MdRiceBowl size={24} />,
	Combo: <FaUtensils size={24} />,
	Drinks: <FaGlassWhiskey size={24} />,
};

// Function to get dynamic slider settings based on the number of items
const getSliderSettings = (itemCount) => {
	const defaultSlidesToShow = 2;
	const slidesToShow = Math.min(itemCount, defaultSlidesToShow);
	const infinite = itemCount > defaultSlidesToShow;

	return {
		dots: true,
		infinite: infinite,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 640,
				settings: {
					slidesToShow: slidesToShow,
					slidesToScroll: 1,
				},
			},
		],
	};
};

// Circle Skeleton for Categories
const CircleSkeleton = () => (
	<div className="flex flex-col items-center flex-shrink-0">
		<div className="p-3 rounded-full bg-gray-300 animate-pulse w-12 h-12"></div>
		<div className="h-2.5 bg-gray-200 rounded-full w-12 mt-1 animate-pulse"></div>
	</div>
);

// Category Skeleton Loader (4 circles)
const CategorySkeletonLoader = () => (
	<div className="flex space-x-4 overflow-x-auto scrollbar-hide">
		{Array(4)
			.fill(0)
			.map((_, index) => (
				<CircleSkeleton key={index} />
			))}
	</div>
);

export default function ARMenu() {
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [allFoods, setAllFoods] = useState([]);
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Fetch food data from the API
	useEffect(() => {
		const fetchFoods = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get('user_pov/get_all_food/4/');
				if (response.status === 200) {
					console.log('✅ Food List Fetched:', response.data);

					const flattenedFoods = response.data.flatMap((category) =>
						category.foods.map((food) => ({
							...food,
							category: category.category_name,
						}))
					);

					const uniqueFoods = Array.from(
						new Map(flattenedFoods.map((food) => [food.id, food])).values()
					);
					setAllFoods(uniqueFoods);

					const uniqueCategories = response.data
						.filter((category) => category.foods.length > 0)
						.map((category) => category.category_name);
					const output = [...new Set(uniqueCategories)];
					setCategories(['All', ...output]);
				} else {
					console.error('❌ Error fetching food list:', response.data.error);
					setError('Failed to load foods. Please try again.');
				}
			} catch (error) {
				console.error('❌ Error fetching food list:', error.message);
				setError('Failed to load foods. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchFoods();
	}, []);

	// Group foods by category and limit to 4 per category, only for categories with foods
	const groupedFoods = categories
		.filter((category) => category !== 'All')
		.map((category) => ({
			name: category,
			foods: allFoods
				.filter(
					(food) => food.category.toLowerCase() === category.toLowerCase()
				)
				.slice(0, 4),
		}))
		.filter((group) => group.foods.length > 0);

	// Filter foods based on selected category
	const filteredFoods =
		selectedCategory === 'All'
			? allFoods
			: allFoods.filter(
					(food) =>
						food.category.toLowerCase() === selectedCategory.toLowerCase()
			  );

	// Filter foods based on search query
	const searchResults = allFoods.filter((food) =>
		food.item_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleFoodClick = (model_url, food) => {
		navigate('/ar-view', {
			state: { selectedModel: model_url, foodDetails: food },
		});
	};

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="min-h-screen bg-[#ffff] rounded-lg p-4">
			{/* Banner */}
			<div className="text-white rounded-lg mb-4 flex items-center">
				<img src={banner} alt="Banner" className="w-full" />
			</div>

			{/* Search Bar */}
			<div className="relative mb-4">
				<input
					type="text"
					placeholder="Search for food"
					value={searchQuery}
					onChange={handleSearchChange}
					className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
				/>
				<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
			</div>

			{/* Loading Skeleton or Content */}
			{loading ? (
				<>
					{/* Category Skeleton */}
					<div className="mb-4">
						<h3 className="text-lg font-bold text-gray-800 mb-2">Category</h3>
						<CategorySkeletonLoader />
					</div>
					{/* Card Skeleton */}
					<SkeletonLoader />
				</>
			) : error ? (
				<p className="text-red-500 mb-4">{error}</p>
			) : (
				<>
					{/* Search Results Section */}
					{searchQuery && (
						<div className="mb-4">
							<h3 className="text-lg font-bold text-gray-800 mb-2">
								Search Results
							</h3>
							{searchResults.length > 0 ? (
								<div className="grid grid-cols-2 gap-4">
									{searchResults.map((food) => (
										<div
											key={food.id}
											className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
											onClick={() =>
												handleFoodClick(food.three_d_picture, food)
											}>
											<img
												src={
													`${food.normal_picture}` ||
													'https://via.placeholder.com/150'
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
								<p className="text-gray-600">
									No foods found matching your search.
								</p>
							)}
						</div>
					)}

					{!searchQuery && (
						<>
							{/* Category Buttons */}
							<div className="mb-4">
								<h3 className="text-lg font-bold text-gray-800 mb-2">
									Category
								</h3>
								<div className="flex space-x-4 overflow-x-auto scrollbar-hide">
									{categories.map((category, index) => (
										<button
											key={index}
											className="flex flex-col items-center flex-shrink-0"
											onClick={() => handleCategoryClick(category)}>
											<div
												className={`p-3 rounded-full ${
													selectedCategory === category
														? 'bg-teal-600 text-white'
														: 'bg-gray-200'
												}`}>
												{categoryIcons[category] || <MdFastfood size={24} />}
											</div>
											<span className="text-sm mt-1">{category}</span>
										</button>
									))}
								</div>
							</div>

							{/* Selected Category Food */}
							<div className="mb-4">
								<div className="flex justify-between items-center mb-2">
									<h3 className="text-lg font-bold text-gray-800">
										{selectedCategory} Food
									</h3>
									<Link
										to={`/category-food/${selectedCategory.toLowerCase()}`}
										className="text-teal-600">
										See all
									</Link>
								</div>
								{filteredFoods.length > 0 ? (
									filteredFoods.length === 1 ? (
										<div className="p-2">
											<div
												className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
												onClick={() =>
													handleFoodClick(
														filteredFoods[0].three_d_picture,
														filteredFoods[0]
													)
												}>
												<img
													src={
														`${filteredFoods[0].normal_picture}` ||
														'https://via.placeholder.com/150'
													}
													alt={filteredFoods[0].item_name}
													className="w-full h-[100px] object-cover rounded-lg mb-2"
												/>
												<h4 className="text-md text-black font-semibold mb-1">
													{filteredFoods[0].item_name}
												</h4>
												<div className="flex justify-between items-center text-sm text-gray-600">
													<span>{filteredFoods[0].price || '৳29.00'} BDT</span>
													<span>⏰ {filteredFoods[0].time || '4.8'}</span>
												</div>
											</div>
										</div>
									) : (
										<Slider {...getSliderSettings(filteredFoods.length)}>
											{filteredFoods.map((food) => (
												<div key={food.id} className="p-2">
													<div
														className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
														onClick={() =>
															handleFoodClick(food.three_d_picture, food)
														}>
														<img
															src={
																`${food.normal_picture}` ||
																'https://via.placeholder.com/150'
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
												</div>
											))}
										</Slider>
									)
								) : (
									<p className="text-gray-600">
										No foods found in this category.
									</p>
								)}
							</div>

							{/* All Foods by Category (Limited to 4 per Category) */}
							{selectedCategory === 'All' && (
								<div>
									{groupedFoods.map((group) => (
										<div key={group.name} className="mb-4">
											<div className="flex justify-between items-center mb-2">
												<h3 className="text-lg font-bold text-gray-800">
													{group.name} Food
												</h3>
												<Link
													to={`/category-food/${group.name.toLowerCase()}`}
													className="text-teal-600">
													See all
												</Link>
											</div>
											{group.foods.length > 0 ? (
												<Slider {...getSliderSettings(group.foods.length)}>
													{group.foods.map((food) => (
														<div key={food.id} className="p-2">
															<div
																className="bg-[#F5F5F5] rounded-[20px] shadow p-4 cursor-pointer"
																onClick={() =>
																	handleFoodClick(food.three_d_picture, food)
																}>
																<img
																	src={
																		`${food.normal_picture}` ||
																		'https://via.placeholder.com/150'
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
														</div>
													))}
												</Slider>
											) : (
												<p className="text-gray-600">
													No foods found in {group.name} category.
												</p>
											)}
										</div>
									))}
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}
