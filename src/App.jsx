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

function App() {

	return (
		<>
			<Router>
				<Routes>
					{/* 
						Route = el componente que enruta al componente
						path = El 'camino' al que llama el componente (ejemplo: www.web.com/login , el path sería ="/login")
						element = El coponente como tal. <Componente />
						IMPORTANTE* Cada componente debe estar reflejado en los import (arriba) con la ruta real
					*/}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />}></Route>
					<Route path="/dashboard" element={<Dashboard />}></Route>
					<Route path="/dashboard/register" element={<Register />}></Route>
				</Routes>
			</Router>
		</>
	)
}

export default App
