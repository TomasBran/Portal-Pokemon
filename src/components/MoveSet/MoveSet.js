import './MoveSet.css'
import unknown_pokemon from '../../assets/unresolved_pokemon.png'
import { getPokemonMovements } from '../../services/movements'
import { useEffect, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { generateRandomPokemonNumber } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';
import { getPokemonsGeneration, pokemonExists } from '../../services/pokemon';
import { ToastContainer } from 'react-toastify';

const MoveSet = () => {

    const MySwal = withReactContent(Swal);
    const [originalPokemonMovements, setOriginalPokemonMovements] = useState([])
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    const [movesShown, setMovesShown] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [guessedPokemons, setGuessedPokemons] = useState([])

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

    return(
        <div className="moveset-main-container flex flex-col">
            WORK IN PROGRESS
            <div className='moveset-game-container'>

                <div className='moveset-left-container'>
                    <div className='pokemon-image-container'>
                        <img alt="" src={unknown_pokemon}></img>
                    </div>

                    <div className='search-container'>
                        <PokemonSearch onInputChange={handleInputChange}/>
                        <button onClick={() => guess(inputValue)} className='moveset-guess-button'>ADIVINAR ({5-movesShown} pistas)</button>           
                    </div>
                    <div className='restart-button-container'>
                        <button onClick={() => resetGame(true)} className='restart-button'>RESET GAME</button> 
                    </div>
                </div>



                <div className='moveset-guessed-pokemons'>
                    <span className='guessed-title'>Intentos ({guessedPokemons.length}):</span>
                    <div className='guessed-pokemon-list'>
                        {guessedPokemons.map((pokemon, index) => (
                            <div key={index}>
                                <span className='guessed-pokemon'>{pokemon}</span>
                            </div>
                        ))}

                    </div>
                </div>


                <div className='moveset-container'>
                    <div>
                        <span>Generación: {getPokemonsGeneration(originalPokemonMovements[6])}</span>
                    </div>
                    <div className='movements'>
                        <div className={`moveset-item movement ${movesShown>=1 ? "shown-moveset" : "hidden-moveset"}`}>
                            <span>{`Movimiento 1`}<br />{movesShown>=1 ? originalPokemonMovements[0] : "???"}</span>
                        </div>
                        <div className={`moveset-item movement ${movesShown>=2 ? "shown-moveset" : "hidden-moveset"}`}>
                            <span>{`Movimiento 2:`}<br />{movesShown >= 2 ? originalPokemonMovements[1] : "???"}</span>
                        </div>
                        <div className={`moveset-item movement ${movesShown>=3 ? "shown-moveset" : "hidden-moveset"}`}>
                            <span>{`Movimiento 3:`}<br />{movesShown>=3 ? originalPokemonMovements[2] : "???"}</span>
                        </div>
                        <div className={`moveset-item movement ${movesShown>=4 ? "shown-moveset" : "hidden-moveset"}`}>
                            <span>{`Movimiento 4:`}<br />{movesShown>=4 ? originalPokemonMovements[3] : "???"}</span>
                        </div>
                    </div>
                    <div className={`moveset-item ability ${movesShown>=5 ? "shown-moveset" : "hidden-moveset"}`}>{`Habilidad: ${movesShown>=5 ? originalPokemonMovements[4] : "???"}`}</div>
                </div>

            </div>

            <ToastContainer/>
            <Generations getGenerations={getGenerations} resetGame={resetGame}/>
        </div>
    )
}

export default MoveSet