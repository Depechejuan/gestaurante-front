import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import './styles/index.css'
import Home from "./Pages/Home";
import Login from './Components/Forms/Login';

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
				</Routes>
			</Router>
		</>
	)
}

export default App
