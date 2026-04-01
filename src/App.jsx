import { Navigate, Routes, Route } from 'react-router-dom';

// Páginas
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import DashboardStaff from "./Pages/Dashboard-Staff";

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
import Contact from './Pages/Contact';
import Empleados from './Components/Empleados';
import UniqueEmpleado from './Components/UniqueEmpleado';
import About from './Pages/About';
import Mesas from './Pages/Mesas';
import MesaDetail from './Pages/MesaDetail';
import Pedidos from './Pages/Pedidos';
import UniquePedido from './Pages/UniquePedido';
import Facturas from './Pages/Facturas';
import UniqueFactura from './Pages/UniqueFactura';
import PlatosAdmin from './Pages/PlatosAdmin';
import UniquePlatoAdmin from './Pages/UniquePlatoAdmin';
import PlatosPublic from './Pages/PlatosPublic';
import UniquePlatoPublic from './Pages/UniquePlatoPublic';
import MesaQrMenu from './Pages/MesaQrMenu';
import CustomerRegister from './Pages/CustomerRegister';
import CustomerVerifyEmail from './Pages/CustomerVerifyEmail';
import OnlineOrder from './Pages/OnlineOrder';
import CustomerAccount from './Pages/CustomerAccount';
import CustomerOrders from './Pages/CustomerOrders';
import CustomerAddresses from './Pages/CustomerAddresses';
import CustomerPaymentMethods from './Pages/CustomerPaymentMethods';
import CustomerProtectedRoute from './Routes/CustomerProtectedRoute';
import PedidosOnline from './Pages/PedidosOnline';
import Clientes from './Pages/Clientes';
import { ADMIN_ROLES, BILLING_ROLES, STAFF_ROLES } from './constants/roles';

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
					<Route path="/carta" element={<PlatosPublic />} />
					<Route path="/carta/:id" element={<UniquePlatoPublic />} />
					<Route path="/mesa/:id" element={<MesaQrMenu />} />
					<Route path="/pedido-online" element={<OnlineOrder />} />
					<Route path="/checkout" element={<OnlineOrder />} />
					<Route path="/cuenta/register" element={<CustomerRegister />} />
					<Route path="/cuenta/verificar-email" element={<CustomerVerifyEmail />} />
					<Route path="/cuenta/login" element={<Navigate to="/login" replace />} />
					<Route path="/about" element={<About />} />
					<Route path="/contacto" element={<Contact />} />
					<Route element={<CustomerProtectedRoute />}>
						<Route path="/cuenta" element={<CustomerAccount />} />
						<Route path="/cuenta/pedidos" element={<CustomerOrders />} />
						<Route path="/cuenta/direcciones" element={<CustomerAddresses />} />
						<Route path="/cuenta/metodos-pago" element={<CustomerPaymentMethods />} />
					</Route>
				</Route>

				{/* STAFF */}
				<Route element={<ProtectedRoute role={STAFF_ROLES} />}>
					<Route path="staff" element={<LayoutStaff />}>
						<Route index element={<DashboardStaff />} />
						<Route path="mesas" element={<Mesas />} />
						<Route path="mesas/:id" element={<MesaDetail />} />
						<Route path="pedidos" element={<Pedidos />} />
						<Route path="pedidos/:id" element={<UniquePedido />} />
						<Route path="online" element={<PedidosOnline />} />
						<Route path="entregas" element={<Navigate to="/staff/online?view=recogida" replace />} />
						<Route path="reparto" element={<Navigate to="/staff/online?view=reparto" replace />} />
						<Route element={<ProtectedRoute role={BILLING_ROLES} />}>
							<Route path="facturas" element={<Facturas />} />
							<Route path="facturas/:id" element={<UniqueFactura />} />
							<Route path="clientes" element={<Clientes />} />
						</Route>
					</Route>
				</Route>

				{/* ADMIN */}
				<Route element={<ProtectedRoute role={ADMIN_ROLES} />}>
					<Route path="dashboard" element={<LayoutAdmin />}>
						<Route index element={<Dashboard />} />
						<Route path="register" element={<Register />} />
						<Route path="empleados" element={<Empleados />} />
						<Route path="empleados/:id" element={<UniqueEmpleado />} />
						<Route path="facturas" element={<Facturas />} />
						<Route path="facturas/:id" element={<UniqueFactura />} />
						<Route path="clientes" element={<Clientes />} />
						<Route path="mesas" element={<Mesas />} />
						<Route path="mesas/:id" element={<MesaDetail />} />
						<Route path="carta" element={<PlatosAdmin />} />
						<Route path="plato/:id" element={<UniquePlatoAdmin />} />
					</Route>
				</Route>
			</Routes>
		</>
	)
}

export default App;
