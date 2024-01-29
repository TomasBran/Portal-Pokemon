import './MoveSet.css'
import unknown_pokemon from '../../assets/unresolved_pokemon.png'
import { getPokemonMovements } from '../../services/movements'
import { useEffect, useRef, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { generateRandomPokemonNumber } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';
import { getPokemonsGeneration, pokemonExists } from '../../services/pokemon';
import settings from '../../assets/settings.png'

const MoveSet = () => {

    const MySwal = withReactContent(Swal);
    const [originalPokemonMovements, setOriginalPokemonMovements] = useState([])
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    const [movesShown, setMovesShown] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [guessedPokemons, setGuessedPokemons] = useState([])
    const [showSettings, setShowSettings] = useState(false)
    const settingsRef = useRef(null);

    const startNewGame = async () => {
        const newPokemon = await getPokemonMovements(generateRandomPokemonNumber(currentGenerations));
        // const newPokemon = await getPokemonMovements("eevee")
        setOriginalPokemonMovements(newPokemon)
    }

    
    const resetGame = async (shouldAsk) => {
        let result = false
        if(shouldAsk){
            result = await MySwal.fire({
                title: '¿Querés reiniciar el juego?',
                text: 'Esto borrará la lista de pokemon, y elegirá uno nuevo.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Reiniciar'
              });
              
            }
            
        if(result.isConfirmed || !shouldAsk){

            setMovesShown(0)
            setGuessedPokemons([])
            startNewGame()
        } 
    }

    const getGenerations = (childGenerations) => {
        setCurrentGenerations(childGenerations);
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    const guess = async (pokemon) => {
        const doesPokemonExist = await pokemonExists(pokemon)
        if(!doesPokemonExist){
            return
        }
        setGuessedPokemons(prev => [...prev, pokemon])
        movesShown<=4 && setMovesShown(prev => prev+1)
        if(pokemon.toLowerCase()===originalPokemonMovements[5]){
            MySwal.fire({
                title: `Felicitaciones! El Pokemon era ${pokemon}.`,
                text: `${guessedPokemons.length!==0 ? `Adivinaste en ${guessedPokemons.length+1} intentos` : "Adivinaste con 1 solo movimiento? Quizá pueda aprender una cosa o dos al verte."}`,
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver',
              }).then(() => {
                resetGame(false)
              })
        }
    }

    useEffect(() => {
        
    }, [originalPokemonMovements]);

    useEffect(() => {
        startNewGame()
    }, []);

    
    const handleShowSettings = () => {
        setShowSettings(prev => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            showSettings &&
            settingsRef.current &&
            !settingsRef.current.contains(event.target) &&
            !Swal.isVisible()
          ) {
            setShowSettings(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showSettings]);
 
    return(
        <div className="h-screen bg-gray-200 w-full flex flex-col items-center justify-center">
            <div className='w-full h-9/12 flex justify-around items-center'>

                <div className='w-3/12 h-full flex flex-col justify-center items-center gap-4'>
                    <div className='w-4/6'>
                        <img alt="" src={unknown_pokemon}/>
                    </div>

                    <PokemonSearch onInputChange={handleInputChange}/>

                    <div className='flex justify-center gap-4 text-white font-medium'>
                        <div onClick={() => guess(inputValue)} className='rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 cursor-pointer w-6/12 py-1 px-2 flex items-center justify-center'>ADIVINAR ({5-movesShown} pistas)</div>
                        <div className='bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 cursor-pointer w-6/12 py-2 px-4 rounded-lg flex items-center justify-center' onClick={() => resetGame(true)}>RESET GAME</div>
                    </div>
                </div>



                <div className='w-3/12 h-[50vh] bg-gray-300 text-white rounded-2xl border-2 border-gray-900 flex flex-col items-center overflow-y-auto'>
                    <div className='text-gray-800 font-bold border-b-2 border-black w-1/6 h-2/12 fixed bg-gray-300 flex justify-center pt-2 items-center'>Intentos ({guessedPokemons.length}):</div>
                    <div className='flex flex-col-reverse items-center gap-1 mt-8'>
                        {guessedPokemons.map((pokemon, index) => (
                            <div key={index}>
                                <span className='flex justify-center bg-gradient-to-r from-transparent via-blue-500 to-transparent px-8'>{pokemon}</span>
                            </div>
                        ))}

                    </div>
                </div>


                <div className='w-3/12 h-full flex flex-col flex-wrap items-center justify-center gap-10'>
                    <div className='bg-stone-500 rounded px-10 py-3 text-white font-medium'>Generación: {getPokemonsGeneration(originalPokemonMovements[6])} </div>
                    <div className='flex flex-wrap w-full justify-center items-center gap-3'>

                        {originalPokemonMovements.slice(0, 4).map((movement, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center h-3/6 w-5/12 ${
                                movesShown >= index + 1 ? 'bg-blue-500' : 'bg-red-500'
                                }`}
                            >
                                <span>
                                {`Movimiento ${index + 1}:`}
                                <br />
                                {movesShown >= index + 1 ? movement : '???'}
                                </span>
                            </div>
                        ))}

                    </div>
                    <div className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center w-full ${movesShown>=5 ? "bg-blue-500" : "bg-red-500"}`}>{`Habilidad: ${movesShown>=5 ? originalPokemonMovements[4] : "???"}`}</div>
                </div>

            </div>

            <div className="fixed right-0 bottom-0 m-4">
                    {showSettings &&
                        <div ref={settingsRef} className="fixed right-0 bottom-0 m-3 bg-blue-500 h-auto w-[20vw] flex flex-col items-center rounded-xl text-white font-medium">
                            <div className="w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl">
                                <Generations getGenerations={getGenerations} resetGame={resetGame} padding={4}/>
                            </div>

                            <div className="w-full py-4 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-b-xl" onClick={() => setShowSettings(false)}>Cerrar</div>
                        </div>
                        }

                {!showSettings &&
                    <div className="w-10 cursor-pointer bg-gray-700 rounded-lg p-2 hover:bg-gray-600 active:scale-95 active:hover:bg-gray-500 transition-all ease-in-out duration-150" onClick={handleShowSettings}>
                        <img src={settings} alt='settings'/>
                    </div>
                }
            </div>

            
        </div>
    )
}

export default MoveSet