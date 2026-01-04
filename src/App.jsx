import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import Home from "./Pages/Home";
import Dashboard from './Pages/Dashboard';

// Componentes
import Login from './Components/Forms/Login';
import Register from './Components/Forms/Register';

// Estilos
import './styles/App.css'
import './styles/index.css'

// Otros
import ProtectedRoute from "./Routes/ProtectedRoute";
import LayoutCliente from './Layouts/Layout-Clientes';
import LayoutStaff from './Layouts/Layout-Staff';
import LayoutAdmin from './Layouts/Layout-Admin';
import DashboardStaff from './Pages/Dashboard-Staff';

function App() {

	return (
		<>
				<Routes>
					{/* 
						Route = el componente que enruta al componente
						path = El 'camino' al que llama el componente (ejemplo: www.web.com/login , el path sería ="/login")
						element = El coponente como tal. <Componente />
						IMPORTANTE* Cada componente debe estar reflejado en los import (arriba) con la ruta real
					*/}

					
					{/* CLIENTE */}
						<Route element={<LayoutCliente />}>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						{/* <Route path="/order" element={<Order />} /> */}
					</Route>

					{/* STAFF */}
					<Route element={
						<ProtectedRoute role={["Camarero", "Cocinero"]}>
							<Route element={<LayoutStaff />}/>
							<Route path="/staff" element={<DashboardStaff />} />
						</ProtectedRoute>
					}>
						{/* <Route path="/staff" element={<StaffDashboard />} /> */}
					</Route>

					{/* ADMIN */}
					<Route element={
						<ProtectedRoute role={["Administrador"]}>
							<LayoutAdmin />
						</ProtectedRoute>
						}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/dashboard/register" element={<Register />} />
					</Route>



					{/* <Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />}></Route>
					<Route path="/dashboard" element={<Dashboard />}></Route>
					<Route path="/dashboard/register" element={<Register />}></Route> */}
				</Routes>
		</>
	)
}

export default App
