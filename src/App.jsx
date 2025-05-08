import React from 'react';

import { Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './component/admin/AuthContext';
import Menu from './page/admin/Menu';
import Categories from './page/admin/Categories';
import NotFound from './page/admin/NotFound';
import Login from './authentication/Login';
import './App.css';
import ARView from './page/ARView';
import Model from './page/admin/Model';
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<NotFound />} />
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<ProtectedRoute component={<Menu />} />} />
				<Route
					path="/category"
					element={<ProtectedRoute component={<Categories />} />}
				/>
				<Route
					path="/ar-view"
					element={<ProtectedRoute component={<ARView />} />}
				/>
				<Route
					path="/model"
					element={<ProtectedRoute component={<Model />} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
const ProtectedRoute = ({ component }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? component : <Navigate to="/login" replace />;
};
export default App;
