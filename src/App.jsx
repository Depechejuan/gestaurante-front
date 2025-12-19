import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import './styles/index.css'
import Home from "./Pages/Home";

function App() {

	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</>
	)
}

export default App
