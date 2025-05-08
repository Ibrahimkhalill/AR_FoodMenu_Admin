import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const LogoutModal = ({ isVisible, onClose, logout }) => {
	const navigate = useNavigate();
	if (!isVisible) return null; // Don't render the modal if it's not visible

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="absolute top-24 w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
				<div className="m-auto flex justify-center items-center w-fit rounded-[5px]">
					<div className="bg-white border-t-2 border-t-green-500 shadow-2xl rounded-lg p-4 min-w-full md:min-w-[420px]">
						<div className="flex flex-col items-center justify-center gap-4">
							<div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffeaea]">
								<IoMdInformationCircleOutline
									className="text-red-600"
									size={23}
								/>
							</div>
							<p className="text-black">Do you want to logout?</p>
						</div>
						<hr className="my-4" />
						<div className="flex justify-between w-full items-center gap-4 ">
							<button
								type="button"
								className="btn bg-[#f3f2e1] text-black border border-[#22852d] hover:bg-[#54c254] hover:text-white"
								style={{
									borderRadius: '5px',
									height: '40px',
									padding: '8px 24px',
									fontSize: '14px',
								}}
								onClick={() => {
									logout();
									onClose();
									navigate('/');
								}}>
								<div className="flex justify-center items-center gap-2">
									<p className="whitespace-nowrap font-medium uppercase">
										Logout
									</p>
									<div className="flex justify-center items-center">
										<RiLogoutBoxRLine size={17} />
									</div>
								</div>
							</button>
							<button
								type="button"
								className="btn bg-green-600 hover:bg-[#22852d]  active:bg-[#23771f] focus:bg-[#23771f] text-[#fff]"
								style={{
									borderRadius: '5px',
									height: '40px',
									padding: '8px 24px',
									fontSize: '14px',
								}}
								onClick={onClose}>
								<div className="flex justify-center items-center gap-2 font-medium uppercase">
									<p className="whitespace-nowrap">Cancel</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogoutModal;
