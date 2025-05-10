import { Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 sm:p-8 mx-4">
				<div className="flex items-center justify-center mb-4">
					<Trash2 className="h-10 w-10 text-red-600" />
				</div>
				<h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-2">
					Confirm Deletion
				</h3>
				<p className="text-sm sm:text-base text-gray-600 text-center mb-6">
					{message}
				</p>
				<div className="flex justify-center space-x-4">
					<button
						onClick={onCancel}
						className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 text-sm sm:text-base">
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm sm:text-base">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal;
