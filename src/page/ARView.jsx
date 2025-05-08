import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	FaArrowLeft,
	FaClock,
	FaDollarSign,
	FaRuler,
	FaInfoCircle,
} from 'react-icons/fa';
import { MdFastfood } from 'react-icons/md';
import Sidebar from '../component/admin/Sidebar';

export default function ARView() {
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = location;
	const { selectedModel, foodDetails } = state || {}; // Assume foodDetails is passed via state
	const [isARSupported, setIsARSupported] = useState(true);

	console.log('Model URL:', selectedModel);
	console.log('Food Details:', foodDetails);

	useEffect(() => {
		// Check if AR is supported via model-viewer's feature detection
		const checkAR = () => {
			const modelViewer = document.createElement('model-viewer');
			const isSupported = modelViewer.canActivateAR;
			setIsARSupported(isSupported);
			console.log('AR Supported:', isSupported);
		};

		checkAR();
	}, []);

	// Fallback food details if not passed via state
	const defaultFoodDetails = {
		item_name: 'Unknown Food',
		description: 'No description available.',
		size: 'N/A',
		time: 'N/A',
		price: '৳0.00',
	};

	const food = foodDetails || defaultFoodDetails;

	return (
		<Sidebar>
			<div className=" bg-gradient-to-b  p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<button
						onClick={() => navigate(-1)}
						className="text-teal-600 hover:text-teal-800 transition-colors">
						<FaArrowLeft size={24} />
					</button>
					<h1 className="text-xl font-bold text-gray-800">AR View</h1>
					<div className="w-6" />
				</div>

				{/* Main Content */}
				<div className="w-full max-w-2xl mx-auto">
					{/* AR/3D Viewer */}
					<div className="mb-6 flex items-center justify-center flex-col">
						{selectedModel ? (
							<model-viewer
								src={`${import.meta.env.VITE_REACT_BASE_URL}${selectedModel}`}
								alt="3D food model"
								shadow-intensity="1"
								camera-controls
								auto-rotate
								ar
								ar-modes="scene-viewer quick-look webxr"
								className="w-full"
								scale="1.5 1.5 1.5"></model-viewer>
						) : (
							<p className="text-center text-red-500">Model not found.</p>
						)}
					</div>

					{/* Food Details Card */}
					<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
						<h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
							<MdFastfood className="text-teal-600 mr-2" size={28} />
							{food.item_name}
						</h2>

						{/* Description */}
						<div className="mb-4">
							<div className="flex items-start">
								<FaInfoCircle className="text-teal-600 mr-2 mt-1" size={20} />
								<div>
									<p className="text-sm font-semibold text-gray-600">
										Description
									</p>
									<p className="text-gray-700">{food.description}</p>
								</div>
							</div>
						</div>

						{/* Size */}
						<div className="mb-4">
							<div className="flex items-center">
								<FaRuler className="text-teal-600 mr-2" size={20} />
								<div>
									<p className="text-sm font-semibold text-gray-600">Size</p>
									<p className="text-gray-700">{food.size}</p>
								</div>
							</div>
						</div>

						{/* Time */}
						<div className="mb-4">
							<div className="flex items-center">
								<FaClock className="text-teal-600 mr-2" size={20} />
								<div>
									<p className="text-sm font-semibold text-gray-600">
										Preparation Time
									</p>
									<p className="text-gray-700">{food.time}</p>
								</div>
							</div>
						</div>

						{/* Price */}
						<div className="mb-4">
							<div className="flex items-center">
								<FaDollarSign className="text-teal-600 mr-2" size={20} />
								<div>
									<p className="text-sm font-semibold text-gray-600">Price</p>
									<p className="text-gray-700">{food.price} BDT</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Sidebar>
	);
}
