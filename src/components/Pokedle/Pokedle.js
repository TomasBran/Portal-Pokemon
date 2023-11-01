import './Pokedle.css'
import React, { useEffect, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPokemon } from '../../services/pokemon';
import { generateRandomPokemonNumber } from '../../utils/functions';

const Pokedle = () => {

    const [comparisons, setComparisons] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [originalPokemon, setOriginalPokemon] = useState({})
    const [chosenPokemon, setChosenPokemon] = useState({})

    const searchErrorMessage = () => toast.error(`El pokemon "${inputValue.toUpperCase()}" no existe`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        })

    useEffect(() => {
        startNewGame()
    }, []);



    const startNewGame = async() => {
        
        const newPokemon = await getPokemon(generateRandomPokemonNumber());
        setOriginalPokemon(newPokemon);
    }


    const comparePokemon = async (originalPokemon) => {

        const newChosenPokemon = await getPokemon(inputValue.toLowerCase());
        setChosenPokemon(newChosenPokemon);
        const results = {};
        
            for (const property in newChosenPokemon) {
                if(property==="hasBeenChosen" || property==="id"){
                    setComparisons([results, ...comparisons]);
                    break
                }
                if(property==="img"){
                    results[property] = { img: newChosenPokemon[property], class: 'image-guess'};
                } else if(property==="name"){
                    results[property] = { value: newChosenPokemon[property] };
                } else if (newChosenPokemon.hasOwnProperty(property) && originalPokemon.hasOwnProperty(property)) {
                    if (newChosenPokemon[property] === originalPokemon[property]) {
                    results[property] = { value: newChosenPokemon[property], class: 'correct-guess' };
                    } else {
                    
                    results[property] = { value: checkCorrection(property, newChosenPokemon[property]), class: 'wrong-guess' };
                    }
                }
            }

    }

    const checkCorrection = (element, value) => {
        let newValue = value;

      
        if (element === "height" || element === "weight" || element === "power" || element === "generation") {
          if (originalPokemon[element] > value) {
            newValue += " ↑";
          } else {
            newValue += " ↓";
          }
        }
      
        return newValue;
      };

    const resetGame = () => {
        setComparisons([])
        startNewGame()
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    return(
        <div className="pokedle-main-container">
            <div className='pokedle-title-container'>
                <span>Elige un Pokemon:</span>
                <PokemonSearch onInputChange={handleInputChange}/>
           <button className='guess-button' onClick={() => comparePokemon(originalPokemon)}>ADIVINAR</button>
            <button className='guess-button' onClick={() => resetGame()}>REINICIAR</button>
            </div>

            <div className='pokedle-game-container'>
                <div className='pokedle-options-name'>
                    <div className='title-item'><span>Foto</span></div>
                    <div className='title-item'><span>Nombre</span></div>
                    <div className='title-item'><span>Gen<span className='shorten-text'>eración</span></span></div>
                    <div className='title-item'><span>Tipo 1</span></div>
                    <div className='title-item'><span>Tipo 2</span></div>
                    <div className='title-item'><span>Fuerza</span></div>
                    <div className='title-item'><span>Peso (kg)</span></div>
                    <div className='title-item'><span>Altura (mts)</span></div>

                </div>
                {comparisons.map((result, index) => (
                <div className="guessed-options-container" key={index}>
                    {Object.entries(result).map(([property, data]) => (
                    <div key={property} className={`guessed-item ${data.class}`} style={data.img !== undefined ? { backgroundImage: `url(${data.img})` } : {}}>
                        {data.value}
                    </div>
                    ))}
                </div>
                ))}
            </div>
            
            <ToastContainer/>
        </div>
    )
}

export default Pokedle