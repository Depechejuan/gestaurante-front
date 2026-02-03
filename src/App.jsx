import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import Home from "./Pages/Home";

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
import Carta from './Components/Carta';
import Contact from './Pages/Contact';
import Empleados from './Components/Empleados';
import UniqueEmpleado from './Components/UniqueEmpleado';
import About from './Pages/About';
import Mesas from './Pages/Mesas';
import Pedidos from './Pages/Pedidos';
import UniquePedido from './Pages/UniquePedido';
import Facturas from './Pages/Facturas';
import UniqueFactura from './Pages/UniqueFactura';
import PlatosAdmin from './Pages/PlatosAdmin';

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
						<Route path="/carta" element={<Carta />} />
						<Route path="/about" element={<About />} />
						<Route path="/contacto" element={<Contact />} />
					</Route>

					{/* STAFF */}
					<Route element={<ProtectedRoute role={["Camarero", "Cocinero", "Administrador"]} />}>
						<Route path="staff" element={<LayoutStaff />}>
							<Route path="mesas" element={<Mesas />} />
							<Route path="pedidos" element={<Pedidos />} />
							<Route path="pedidos/:id" element={<UniquePedido />} />
							
							{/* <Route index element={<DashboardStaff />} /> */}
						</Route>
					</Route>

					{/* ADMIN */}
					<Route element={<ProtectedRoute role={["Administrador"]} />}>
						<Route path="dashboard" element={<LayoutAdmin />}>
							<Route path="register" element={<Register />} />
							<Route path="empleados" element={<Empleados />} />
							<Route path="empleados/:id" element={<UniqueEmpleado />} />
							<Route path="facturas" element={<Facturas />} />
							<Route path="facturas/:id" element={<UniqueFactura />} />
							<Route path="carta" element={<PlatosAdmin />} />
							
							{/* <Route index element={<Dashboard />} /> */}
						</Route>
					</Route>
				</Routes>
		</>
	)
}

export default App;
