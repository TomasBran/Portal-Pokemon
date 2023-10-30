import { Link } from 'react-router-dom'
import './Home.css'


const Home = () => {
    
    return(
        <div className='home-container'>
            <div className='home-panel'>
                <p className='home-title'>¿Dónde quieres ir?</p>
                <div className='home-button-container'>

                    <Link className='no-underline' to="/calculator"><button className='home-button calculator-button'><span className='home-button-text'>Calculadora</span></button></Link>
                    <Link className='no-underline' to="/gym"><button className='home-button gym-button'><span className='home-button-text'>Gimnasio (WIP)</span></button></Link>
                    <Link className='no-underline' to="/pokedle"><button className='home-button pokedle-button'><span className='home-button-text'>Pokedle (WIP)</span></button></Link>
                    <Link className='no-underline' to="/portal-pokemon"><button className='home-button coming-soon-button' disabled><span className='home-button-text'>Coming Soon</span></button></Link>
                    <Link className='no-underline' to="/portal-pokemon"><button className='home-button coming-soon-button' disabled><span className='home-button-text'>Coming Soon</span></button></Link>
                    <Link className='no-underline' to="/portal-pokemon"><button className='home-button coming-soon-button' disabled><span className='home-button-text'>Coming Soon</span></button></Link>

                </div>
                
            </div>
        </div>
    )
    
}

export default Home