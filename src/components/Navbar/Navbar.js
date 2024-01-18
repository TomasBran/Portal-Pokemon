import { Link } from 'react-router-dom'
import './Navbar.css'

const routes = [
    {
        url: '/Portal-Pokemon',
        text: 'Home',
        isDisabled: false,
    },
    {
        url: '/calculator',
        text: 'Calculadora',
        isDisabled: false,
    },
    {
        url: '/gym',
        text: 'Gimnasio',
        isDisabled: false,
    },
    {
        url: '/pokedle',
        text: 'Pokedle',
        isDisabled: false,
    },
    {
        url: '/moveset',
        text: 'Move Set',
        isDisabled: false,
    },
    // {
    //     url: '/',
    //     text: 'COMING SOON',
    //     isDisabled: true,
    // },
    // {
    //     url: '/',
    //     text: 'COMING SOON',
    //     isDisabled: true,
    // },
]


const Navbar = () => {
    
    return(
        <div>
            <div className='fixed top-0 flex justify-start items-center w-full h-14 bg-yellow-500 z-10'>

                {routes.map((route, index) => (
                    <Link to={route.url} className='h-full' key={index}><button className='h-full font-bold text-blue-500 enabled:hover:text-yellow-500 py-2 w-[10vw] text-white text-sm items-center flex justify-center enabled:hover:bg-blue-500 enabled:active:bg-blue-400 disabled:opacity-50' disabled={route.isDisabled}>{route.text}</button></Link>
                ))}
                
            </div>
        </div>
    )
    
}

export default Navbar