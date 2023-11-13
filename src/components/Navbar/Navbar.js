import { Link } from 'react-router-dom'
import './Navbar.css'


const Navbar = () => {
    
    return(
        <div>
            <div className='navbar'>
                <Link to="/Portal-Pokemon"><button className='navbar-button'>Home</button></Link>
                <Link to="/calculator"><button className='navbar-button'>Calculadora</button></Link>
                <Link to="/gym"><button className='navbar-button'>Gimnasio</button></Link>
                <Link to="/pokedle"><button className='navbar-button'>Pokedle (WIP)</button></Link>
                <Link to="/moveset"><button className='navbar-button'>Adivina el MoveSet (WIP)</button></Link>
                <button className='navbar-button' disabled>COMING SOON</button>
                <button className='navbar-button' disabled>COMING SOON</button>
                
            </div>
        </div>
    )
    
}

export default Navbar