import React, { useState } from 'react';

import { IoEyeOffOutline } from 'react-icons/io5';
import { IoEyeOutline } from 'react-icons/io5';

import { useAuth } from '../component/admin/AuthContext';
import { BiSolidError } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';

const Login = () => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [error, setError] = useState('');
	const { login } = useAuth();
	const navigation = useNavigate();

	const [errors, setErrors] = useState({
		userName: '',
		password: '',
	});

	// Handle Username Change with Real-time Validation
	const handleUserNameChange = (e) => {
		const text = e.target.value;
		setUserName(text);

		// Validate Email
		if (text === '') {
			setErrors((prev) => ({ ...prev, userName: 'Email cannot be empty' }));
		} else {
			setErrors((prev) => ({ ...prev, userName: '' }));
		}
	};

	// Handle Password Change with Real-time Validation
	const handlePasswordChange = (e) => {
		const text = e.target.value;

		setPassword(text);

		// Validate Password Length
		if (text === '') {
			setErrors((prev) => ({ ...prev, password: 'Password cannot be empty' }));
			setIsVisible(false);
		} else {
			setErrors((prev) => ({ ...prev, password: '' }));
			setIsVisible(true);
		}
	};

	const handleUserLogin = async (e) => {
		e.preventDefault();

		// Final validation before submission
		let valid = true;
		const formErrors = { userName: '', password: '' };

		if (userName === '') {
			formErrors.userName = 'Email cannot be empty';
			valid = false;
		}

		if (password === '') {
			formErrors.password = 'Password cannot be empty';
			valid = false;
		}

		setErrors(formErrors);

		if (!valid) return;

		setIsLoading(true);

		try {
			const response = await axiosInstance.post('/auth/login/', {
				email: userName,
				password: password,
			});
			console.log('res', response.data);

			if (response.status === 200) {
				login(response.data.access_token, userName);
				navigation('/');
			} else {
				setError('Invalid username or password');
			}
		} catch (error) {
			if (error.response) {
				console.log("d", error.response.data.Message)
				// If the server returned a response (e.g., 400 status)
				const serverErrors = error.response.data.Message; // Adjust based on your API structure
				const formErrors = { userName: '', password: '' };

				setErrors(formErrors);

				setError("Invalid username or password");
			} else {
				// Handle other types of errors (e.g., network issues)
				console.log('Error without response:', error.message);

				setError('Network error. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className=" flex lg:flex-row flex-col px-5 py-5 items-center rounded-md relative">
				{error && (
					<div className=" absolute top-[-80px] mt-5 lg:left-[30%]    bg-red-100 rounded-md border border-red-300 flex items-center gap-5 px-2 py-3">
						<div className="flex items-center gap-1">
							<BiSolidError color="red" size={20} />
							{error}
						</div>{' '}
						<IoMdClose
							size={20}
							color="red"
							className="cursor-pointer"
							onClick={() => setError('')}
						/>
					</div>
				)}

				{/* Login Form Section */}
				<div className="lg:w-[500px] w-full background_color p-8 rounded-lg box-shadow  lg:ml-12">
					<h2 className="lg:text-[40px] text-white text-[24px] font-bold mb-2 text-center">
						Login to Account
					</h2>
					<p className="text-sm text-gray-600 text-center mb-6 ">
						Please enter your email and password to continue
					</p>
					<form onSubmit={handleUserLogin}>
						<div className="mb-5 relative">
							<label
								htmlFor="email"
								className="block text-base font-medium text-white">
								Email
							</label>
							<input
								type="email"
								id="email"
								placeholder="jvai@gmail.com"
								className={`${
									errors.userName
										? 'border  px-1 border-red-700 '
										: 'px-1 focus:ring-yellow-500 focus:outline-none focus:ring-2'
								} w-full p-3 border outline-none rounded-[4px] bg-[#fff]`}
								// value={userName}`}
								onChange={handleUserNameChange}
							/>
							<div className="absolute top-[72px] left-0 text-[red] text-sm">
								{errors.userName ? errors.userName : ''}
							</div>
						</div>
						<div className="mb-7 relative">
							<label
								htmlFor="password"
								className="block text-base font-medium text-white">
								Password
							</label>
							<input
								type={passwordVisible ? 'text' : 'password'}
								id="password"
								placeholder="********"
								className={`${
									errors.password
										? 'border px-1 border-red-700 '
										: 'px-1 focus:ring-yellow-500 focus:outline-none focus:ring-2'
								} w-full p-3 border outline-none rounded-[4px] bg-[#fff] `}
								onChange={handlePasswordChange}
							/>
							<button
								type="button"
								className="absolute top-1/2 right-3 flex items-center"
								onClick={togglePasswordVisibility}>
								{isVisible &&
									(passwordVisible ? (
										<IoEyeOutline size={24} color="#575757" />
									) : (
										<IoEyeOffOutline size={24} color="#575757" />
									))}
							</button>
							<div className="absolute top-[72px] left-0 text-[red] text-sm">
								{errors.password ? errors.password : ''}
							</div>
						</div>
						{/* <div className="mb-6 flex items-center">
							<input
								type="checkbox"
								id="remember"
								className="h-4 w-4 text-yellow-500  rounded focus:ring-yellow-500"
							/>
							<label
								htmlFor="remember"
								className="ml-2 text-sm font-medium text-white">
								Remember Password
							</label>
						</div> */}
						<button
							disabled={isLoading}
							type="submit"
							className="w-full border border-[#fff] hover:text-white font-bold py-3 rounded-[50px] hover:bg-[#7aa792] hover:border-[#07ac5e] transition">
							{isLoading ? (
								<span className="loader_spain"></span>
							) : (
								<span className="text-white"> LOG IN</span>
							)}
						</button>
					</form>
				</div>
			</div>
			{/* Logo Section */}
		</div>
	);
};

export default Login;
