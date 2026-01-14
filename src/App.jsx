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

function App() {

	return (
		<>
				<Routes>
					{/* 
						Route = el componente que enruta al componente que quedemos acceder
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
					<Route element={<ProtectedRoute role={["Camarero", "Cocinero", "Administrador"]} />}>
						<Route path="staff" element={<LayoutStaff />}>
							{/* <Route index element={<DashboardStaff />} /> */}
						</Route>
					</Route>

					{/* ADMIN */}
					<Route element={<ProtectedRoute role={["Administrador"]} />}>
						<Route path="dashboard" element={<LayoutAdmin />}>
							{/* <Route index element={<Dashboard />} /> */}
							<Route path="register" element={<Register />} />
						</Route>
					</Route>
				</Routes>
		</>
	)
}

export default App;
