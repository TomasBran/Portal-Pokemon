import './App.css';
import PokeGym from './components/PokeGym/PokeGym';
import Calculator from './components/Calculator/Calculator';
import { SelectionProvider } from './context/SelectionContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Link, Routes} from "react-router-dom";
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Pokedle from './components/Pokedle/Pokedle';




function App() {
  return (
    <div className="App">

      <BrowserRouter> 

          <Navbar/>
          <SelectionProvider>

          <Routes>

            <Route path="/Portal-Pokemon" element={<Home/>}/>
            <Route path="/calculator" element={<Calculator/>}/>
            <Route path="/gym" element={<PokeGym/>}/>
            <Route path="/pokedle" element={<Pokedle/>}/>

          </Routes>

          

            

          </SelectionProvider>
      </BrowserRouter>
      

    </div>
  );
}

export default App;
