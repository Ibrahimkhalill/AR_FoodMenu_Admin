// src/components/SkeletonLoader.jsx
const CategorySkelton = () => (
	<div className="bg-white rounded-lg shadow-md animate-pulse">
		<div className="w-full h-16 bg-gray-200 rounded-t-lg"></div>
		<div className="p-2">
			<div className="h-4 bg-gray-200 rounded w-3/4"></div>
		</div>
	</div>
);

export default CategorySkelton;
