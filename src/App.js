import './App.css';
import PokeGym from './components/PokeGym/PokeGym';
import Calculator from './components/Calculator/Calculator';
import { SelectionProvider } from './context/SelectionContext';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Pokedle from './components/Pokedle/Pokedle';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import MoveSet from './components/MoveSet/MoveSet';
import TypesChallenge from './components/TypesChallenge/TypesChallenge';
import { Toaster } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
	return (
		<div className='App select-none'>
			<BrowserRouter>
				<DndProvider backend={HTML5Backend}>
					<PrimeReactProvider>
						<Navbar />
						<SelectionProvider>
							<Routes>
								<Route
									path='/Portal-Pokemon'
									element={<Home />}
								/>
								<Route
									path='/calculator'
									element={<Calculator />}
								/>
								<Route
									path='/gym'
									element={<PokeGym />}
								/>
								<Route
									path='/pokedle'
									element={<Pokedle />}
								/>
								<Route
									path='/moveset'
									element={<MoveSet />}
								/>
								<Route
									path='/types-challenge'
									element={<TypesChallenge />}
								/>
							</Routes>
						</SelectionProvider>
						<Toaster
							position='bottom-left'
							richColors
							duration={2000}
						/>
					</PrimeReactProvider>
				</DndProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
