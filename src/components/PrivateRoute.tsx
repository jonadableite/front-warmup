import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const isAuthenticated = () => {
		// Verifica se o token está presente no localStorage
		return !!localStorage.getItem("token");
	};

	return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
