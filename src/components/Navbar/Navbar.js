import { Link } from 'react-router-dom'
import './Navbar.css'


const Navbar = () => {
    
    return(
        <div>
            <div className='navbar'>
                <Link to="/Portal-Pokemon"><button className='navbar-button'>Home</button></Link>
                <Link to="/calculator"><button className='navbar-button'>Calculadora</button></Link>
                <Link to="/gym"><button className='navbar-button'>Gimnasio (WIP)</button></Link>
                
            </div>
        </div>
    )
    
}

export default Navbar