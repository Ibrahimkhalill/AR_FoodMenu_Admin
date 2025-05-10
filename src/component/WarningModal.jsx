import { AlertTriangle } from 'lucide-react';

const WarningModal = ({ isOpen, onClose, message }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 sm:p-8 mx-4">
				<div className="flex items-center justify-center mb-4">
					<AlertTriangle className="h-10 w-10 text-red-600" />
				</div>
				<h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-2">
					Warning
				</h3>
				<p className="text-sm sm:text-base text-gray-600 text-center mb-6">
					{message}
				</p>
				<div className="flex justify-center">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm sm:text-base">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default WarningModal;
