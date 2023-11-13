import './Pokedle.css'
import React, { useEffect, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPokemon } from '../../services/pokemon';
import { generateRandomPokemonNumber } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';

const Pokedle = () => {

    
    const MySwal = withReactContent(Swal);

    const [comparisons, setComparisons] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [originalPokemon, setOriginalPokemon] = useState({})
    const [chosenPokemon, setChosenPokemon] = useState({})
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    


    useEffect(() => {
        startNewGame()
    }, []);



    const startNewGame = async() => {
        
        const newPokemon = await getPokemon(generateRandomPokemonNumber(currentGenerations));
        // const newPokemon = await getPokemon("graveler") // TEST
        setOriginalPokemon(newPokemon);
    }


    const comparePokemon = async (originalPokemon) => {

        const newChosenPokemon = await getPokemon(inputValue.toLowerCase());
        setChosenPokemon(newChosenPokemon);
        const results = {};
        
        for (const property in newChosenPokemon) {
            if(property === "hasBeenChosen" || property === "id"){
              setComparisons([results, ...comparisons]);
              break
            }
            if(property === "img"){
              results[property] = { img: newChosenPokemon[property], class: 'image-guess'};
            } else if(property === "name"){
              results[property] = { value: newChosenPokemon[property] };
            } else if (newChosenPokemon.hasOwnProperty(property) && originalPokemon.hasOwnProperty(property)) {
              if (newChosenPokemon[property] === originalPokemon[property]) {
                results[property] = { value: newChosenPokemon[property], class: 'correct-guess' };
              } else if(property === "type_1" || property === "type_2"){
                const otherType = property === "type_1" ? "type_2" : "type_1";
                if (originalPokemon[otherType] === newChosenPokemon[property]) {
                  results[property] = { value: newChosenPokemon[property], class: 'partial-correct-guess' };
                } else {
                  results[property] = { value: checkCorrection(property, newChosenPokemon[property]), class: 'wrong-guess' };
                }
              } else{
                results[property] = { value: checkCorrection(property, newChosenPokemon[property]), class: 'wrong-guess' };
              }
            }
          }
          

        if(originalPokemon.name === newChosenPokemon.name){
            MySwal.fire({
                title: `Felicitaciones! El Pokemon era ${originalPokemon.name}.`,
                text: `${comparisons.length!==0 ? `Adivinaste en ${comparisons.length+1} intentos` : "Adivinaste a la primera. Wow."}`,
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver',
              }).then(() => {
                resetGame()
              })
            
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

    const getGenerations = (childGenerations) => {
        setCurrentGenerations(childGenerations)
    }

    const resetGame = () => {
        setComparisons([])
        startNewGame()
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    useEffect(() => {
      const handleKeyPress = (event) => {
        const key = event.key;
        if(key==='r' && event.target.tagName !== "INPUT"){
          resetGame()
        }

        

        
      };
  
      document.addEventListener('keydown', handleKeyPress);
  
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
  }, [originalPokemon]);

    return(
        <div className="pokedle-main-container">
            <div className='pokedle-title-container'>
                <span>Elige un Pokemon:</span>
                <PokemonSearch onInputChange={handleInputChange}/>
           <button className='guess-button' onClick={() => comparePokemon(originalPokemon)}>ADIVINAR</button>
            <button className='guess-button' onClick={() => resetGame()}><span className='hotkey'>R</span>EINICIAR</button>
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
            <div className='test1'>
                <Generations getGenerations={getGenerations} resetGame={resetGame}/>
            </div>
        </div>
    )
}

export default Pokedle