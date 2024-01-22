import './Pokedle.css'
import React, { useEffect, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import 'react-toastify/dist/ReactToastify.css';
import { getPokemon } from '../../services/pokemon';
import { generateRandomPokemonNumber } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';
import { ToastContainer } from 'react-toastify';


const attributes = [
  'Foto',
  'Nombre',
  'Generación',
  'Tipo 1',
  'Tipo 2',
  'Fuerza',
  'Peso (kg)',
  'Altura (mts)',
];


const Pokedle = () => {

    
    const MySwal = withReactContent(Swal);

    const [comparisons, setComparisons] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [originalPokemon, setOriginalPokemon] = useState({})
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(false)


    useEffect(() => {
        startNewGame()
    }, []);



    const startNewGame = async() => {
        
        const newPokemon = await getPokemon(generateRandomPokemonNumber(currentGenerations));
        // const newPokemon = await(getPokemon(25))
        setOriginalPokemon(newPokemon);
    }


    const comparePokemon = async (originalPokemon) => {

        const newChosenPokemon = await getPokemon(inputValue.toLowerCase());
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
            const response = await MySwal.fire({
                title: `Felicitaciones! El Pokemon era <span class="text-green-500 font-bold">${originalPokemon.name}</span>.`,
                text: `${comparisons.length!==0 ? `Adivinaste en ${comparisons.length+1} intentos` : "Adivinaste a la primera. Wow."}`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: 'green',
                confirmButtonText: 'Jugar otra vez',
                cancelButtonText: 'Ver el tablero'
              })
              if(response.isConfirmed){
                reloadGame()
              } else {
                setGuessButtonDisabled(true);
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

    const getGenerations = (childGenerations) => {
        setCurrentGenerations(childGenerations)
    }

    const reloadGame = () => {
      setComparisons([])
      startNewGame()
      setGuessButtonDisabled(false)
    }

    const resetGame = async () => {
      if(document.getElementById('guess-button').disabled === true){
        reloadGame()
        return
      }


      const response = await MySwal.fire({
        title: `Seguro que quieres reiniciar la partida?.`,
        text: `Esto borrará tu progreso e iniciará una nueva partida`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
      })
      if(response.isConfirmed){
        await MySwal.fire({
          title: `La partida ha finalizado.`,
          html: `No has adivinado. El Pokémon era <span class="text-red-500 font-bold">${originalPokemon.name}</span>`,
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Confirmar',
        })
        reloadGame()
      }
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    const putDataStyle = (data) => {
      switch (data) {
        case 'correct-guess':
            return 'bg-green-500'
        case 'wrong-guess':
            return 'bg-red-500'
            
        case 'partial-correct-guess':
          return 'bg-yellow-500'
      
        default:
        return 'bg-blue-500'
      }
    }


  //   useEffect(() => {
  //     const handleKeyPress = (event) => {
  //       const key = event.key;

  //       if(key==='r' && event.target.tagName !== "INPUT"){
  //         resetGame()
  //       }
  //     };
  
  //     document.addEventListener('keydown', handleKeyPress);
  
  //     return () => {
  //       document.removeEventListener('keydown', handleKeyPress);
  //     };
  // }, [originalPokemon]);

    return(
        <div className="bg-zinc-200 min-h-screen pb-4">
            <div className='flex justify-center items-center gap-4 py-20'>
                <span>Elige un Pokemon:</span>
                <PokemonSearch onInputChange={handleInputChange}/>
              <button id='guess-button' className='bg-blue-500 enabled:hover:bg-blue-600 enabled:active:bg-blue-800 enabled:active:scale-95 transition duration-150 rounded-lg py-4 px-8 text-white font-bold disabled:opacity-40' onClick={() => comparePokemon(originalPokemon)} disabled={guessButtonDisabled}>ADIVINAR</button>
              <button
              className={`bg-blue-500 enabled:active:bg-blue-800 enabled:active:scale-95 transition duration-150 enabled:hover:bg-blue-600 disabled:opacity-40 rounded-lg py-4 px-8 text-white font-bold`} 
              onClick={() => resetGame()}
              disabled={comparisons.length===0}>
                REINICIAR
                </button>
            </div>

            {comparisons.length!==0 && <div className='flex flex-col gap-5'>
                <div className='flex justify-center w-full gap-8'>
                  {attributes.map((attribute, index) => (
                    <div key={index} className='bg-blue-700 rounded-lg py-2 px-4 w-1/12 cursor-default flex items-center justify-center'>
                      <p className='font-bold text-white text-sm'>{attribute}</p>
                    </div>
                  ))}

                </div>
                {comparisons.map((result, index) => (
                <div className="flex justify-center w-full gap-8" key={index}>
                    {Object.entries(result).map(([property, data]) => (
                    <div className='w-1/12 flex justify-center'>
                      <div key={property} className={`w-5/6 h-20 border-2 border-white text-white flex justify-center items-center rounded-lg ${putDataStyle(data.class)} bg-contain bg-center bg-no-repeat`} style={data.img !== undefined ? { backgroundImage: `url(${data.img})` } : {}}>
                          {data.value}
                      </div>

                    </div>
                    ))}
                </div>
                ))}
            </div>}
            <div className='fixed -right-6 bottom-0'>
                <Generations getGenerations={getGenerations} resetGame={reloadGame}/>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Pokedle