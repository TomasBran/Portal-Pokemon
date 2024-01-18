import { Link } from 'react-router-dom'
import './Home.css'
import gym from '../../assets/gym.png'
import calculator from '../../assets/calculator.png'
import pokedle from '../../assets/pokedle.png'
import moveset from '../../assets/moveset_background.jpg'
import coming_soon from '../../assets/coming_soon.webp'





const buttonsArray = [
    {
        url:"calculator",
        text:"Calculadora",
        image: calculator,
    },
    {
        url:"gym",
        text:"Gimnasio",
        image: gym,
    },
    {
        url:"pokedle",
        text:"Pokedle",
        image: pokedle,
    },
    {
        url:"moveset",
        text:"Adivina el MoveSet (WIP)",
        image: moveset,
    },
    {
        url:"Portal-Pokemon",
        text:"Coming Soon",
        image: coming_soon,
    },
    {
        url:"Portal-Pokemon",
        text:"Coming Soon",
        image: coming_soon,
    },
]




const Home = () => {
    
    return(
        <div className='min-h-screen pt-10 bg-zinc-200'>
            <div className='flex flex-col'>
                <span className='text-4xl my-8 text-gray-800'>¿Dónde quieres ir?</span>
                <div className='flex justify-evenly flex-wrap gap-7 w-screen'>

                {buttonsArray.map((button, index) => (
                    <Link className='no-underline' to={`/${button.url}`} key={index}>
                        <button disabled={button.url==='Portal-Pokemon'}
                        className={`p-2 md:p-4 w-[25vw] h-[35vh] flex justify-end items-end rounded-lg border-none text-white no-underline bg-cover bg-center ease-in duration-150 enabled:active:scale-95 enabled:hover:shadow-gray-400 enabled:hover:shadow-lg disabled:cursor-default`}
                        style={{backgroundImage:`url(${button.image})`}}
                        >
                            <div className={`bg-zinc-300/80 p-1 w-full rounded-md ${button.url!=='Portal-Pokemon' && 'hover:bg-zinc-100/80  ease-in duration-150'}`}>
                                <span className='text-gray-700 no-underline font-bold text-lg text-shadow-md transition'>{button.text}</span>

                            </div>
                        </button>
                    </Link>
                ))}
                    

                </div>
                
            </div>
        </div>
    )
    
}

export default Home
