import { useCallback, useEffect, useState } from "react"
import './PokeGym.css'
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeamContainer from "../TeamContainer/TeamContainer";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { generateRandomPokemonNumber } from "../../utils/functions";
import { getPokemon } from "../../services/pokemon";
import Generations from "../Generations/Generations";
import { ProgressSpinner } from 'primereact/progressspinner';



const PokeGym = () => {


    const testing = false  //CAMBIAR CUANDO ESTOY TESTEANDO

    const MySwal = withReactContent(Swal);

    
    const [isLoading, setIsLoading] = useState(false);
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    const [currentTeam, setCurrentTeam] = useState([])
    const [chosenTeam, setChosenTeam] = useState([])
    const [rerollsLeft, setRerollsLeft] = useState(testing ? 100 : 4)
    const [rollButtonText, setRollButtonText] = useState(`Generar ${6-chosenTeam.length} pokemon (3 REROLLS)`)
    
    const [shouldDisable, setShouldDisable] = useState(false)

    

    const lockInPokemon = useCallback((pokemon) => {
        if (pokemon.hasBeenChosen === true) {
          toast.error(`Has quitado a ${pokemon.name} de tu equipo`, {
            autoClose: 3000,
            position: "bottom-right",
          });
          pokemon.hasBeenChosen = false;
          setChosenTeam((previousTeam) =>
            previousTeam.filter((poke) => poke.name !== pokemon.name)
          );
          return;
        }
        toast.success(`Has incluido a ${pokemon.name} en tu equipo`, {
          autoClose: 2000,
          position: "bottom-right",
        });
        pokemon.hasBeenChosen = true;
        if (!chosenTeam.find((element) => element.name === pokemon.name)) {
          setChosenTeam((team) => [...team, pokemon]);
        }
      }, [chosenTeam, setChosenTeam]);
      

    useEffect(() => {
        const handleKeyPress = (event) => {
          const key = event.key;
    
          switch (key) {
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
                  if (currentTeam.length >= Number(key)) {
                      lockInPokemon(currentTeam[Number(key) - 1]);
                  }
                  break;
              
              case ' ':
                    if(!shouldDisable){
                        updatePokemonTeam()
                    } else{
                        toast.warn(`${rollButtonText}`, {
                            autoClose: 3000,
                            position: "bottom-right",
                        });
                    }
                    break;
                case 'r':
                    if(rollButtonText!=="Iniciar"){
                        resetGame(true)
                    }
                    break;
                case 'p':
                    if(chosenTeam.length===6){
                        fightGymLeaders()
                      } else{
                        toast.warn(`Necesitas ${6-chosenTeam.length} Pokemon más para poder pelear`, {
                            autoClose: 3000,
                            position: "bottom-right",
                        });
                      }
                    break;
                    
              default:
                  break;
          }
        };
    
        document.addEventListener('keydown', handleKeyPress);
    
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentTeam, lockInPokemon, shouldDisable, rollButtonText]);
    
        

      

    const getGenerations = (childGenerations) => {
        setCurrentGenerations(childGenerations);
       }
    

    const updatePokemonTeam = async () => {
        setIsLoading(true);
      
        const gymButton = document.getElementsByClassName("gym-game-button")[0];
        gymButton.disabled = true;
        const tempText = rollButtonText;
      
        setTimeout(() => {
          gymButton.textContent = "Espera";
        }, 1);
      
        setTimeout(() => {
          if (rerollsLeft > 1) {
            gymButton.disabled = false;
          }
          setRollButtonText(tempText);
        }, 750);
      
        setCurrentTeam([]);
        setRerollsLeft((prev) => prev - 1);
      
        const imagesToLoad = 6 - chosenTeam.length;
        let loadedImages = 0;
        let currentGivenTeam = []
        for (let index = 0; index < imagesToLoad; index++) {
          const randomNum = generateRandomPokemonNumber(currentGenerations, chosenTeam, currentGivenTeam);
          currentGivenTeam.push(randomNum)

      
          const newPokemon = await getPokemon(randomNum);
      
          setCurrentTeam((team) => [...team, newPokemon]);
      
          const img = new Image();
          img.src = newPokemon.img;
          img.onload = () => {
            loadedImages++;
            if (loadedImages === imagesToLoad) {
              setIsLoading(false);
            }
          };
        }

      };
      

    
    useEffect(() => {
        handleButtonText();
    }, [chosenTeam, updatePokemonTeam]);

    
  
    const handleStars = (power) => {

        if(power>560){
            return (<div><BsStarFill/> <BsStarFill/> <BsStarFill/></div>)
        } else if (power > 500){
            return (<div><BsStarFill/> <BsStarFill/> <BsStarHalf/></div>)
        } else if (power > 375){
            return (<div><BsStarFill/> <BsStarFill/> <BsStar/></div>)
        } else if (power > 300){
            return (<div><BsStarFill/> <BsStarHalf/> <BsStar/></div>)
        } else if (power > 200){
            return (<div><BsStarFill/> <BsStar/> <BsStar/></div>)
        } else {
            return (<div><BsStarHalf/> <BsStar/> <BsStar/></div>)
        }
        
    }


    const handleButtonText = () => {
        if(rerollsLeft===4){
            setRollButtonText("Iniciar")
            setShouldDisable(false)
            return
        }
        if(rerollsLeft===0){
            setRollButtonText("NO QUEDAN REROLLS")
            setShouldDisable(true)
            return
        }
        if(chosenTeam.length<6){
            setRollButtonText(`Generar ${6-chosenTeam.length} pokemon ${chosenTeam.length!==5 ? "nuevos" : "nuevo"} (${rerollsLeft} ${rerollsLeft!==1 ? "RE-ROLLS" : "RE-ROLL"})`)
            setShouldDisable(false)
        } else{
            setRollButtonText("EQUIPO COMPLETO")
            setShouldDisable(true)
        }
    }

    const getRandomArbitrary = (min, max) => {
        return Math.random() * (max - min) + min;
      }

    const fightGymLeaders = async () => {
        let power = 0
        let beatenGyms
        let excessPower
        let finalText = `Gimnasios vencidos: `
        chosenTeam.forEach(element => {
            power += element.power
        });
        const minLuckValue = 97 // 0.97
        const maxLuckValue = 105 // 1.05
        const randomEnhancer = getRandomArbitrary(minLuckValue/100, maxLuckValue/100)
        const bonusLuck = (randomEnhancer*100).toFixed(0)-100
        power*=randomEnhancer


        if(power>=3200){
            beatenGyms=8
            excessPower=Math.round((power-3200).toFixed(0)/9.5)
            finalText=`Felicitaciones! Conquistaste los <span style="color: green;">${beatenGyms}</span> gimnasios. Un maestro pokemon!\n- Te sobró un <span style="color: green;">${excessPower}%</span> de poder.`
        } else if (power >= 3000){
            beatenGyms = 6+Math.floor((power-3000)/100)
            excessPower = (power-3000) % 100; // MOSTRAR EL PROGRESO
            // excessPower = (power % 100 === 0) ? 0 : 100 - (power % 100); // MOSTRAR EL RESTANTE 
            finalText+=`<span style="color: green;">${beatenGyms}</span>. Impresionante!`
        } else {
            beatenGyms = 1+Math.floor((power-2250)/150)
            if(beatenGyms<=0){
                beatenGyms=0
            } 
            finalText+=`<span style="color: red;">${beatenGyms}.</span>`
            excessPower = ((power - 2250) % 150)/150*100 // MOSTRAR PROGRESO
            // excessPower = (((power-2250) % 150 === 0) ? 0 : 150 - ((power-2250) % 150))/150*100; // MOSTRAR RESTANTE
            
            if(beatenGyms>=4){
                finalText+= " Nada mal."
            } else{
                finalText+= " Aun queda trabajo por hacer."
            }
            if(beatenGyms===0){
                excessPower = (2250 - power)/2250*100
                finalText += `\nTe faltó un <span style="color: blue;">~${excessPower.toFixed(0)}%</span> de progreso para conseguir la primera medalla.`
            }
            
        }

        finalText+=
        `${beatenGyms!==8 && beatenGyms!==0 ? `\n- Progreso hacia la ${beatenGyms+1}° medalla: <span style="color: blue;">~${excessPower.toFixed(0)}%</span>.` : ""}
        - Bonus Suerte: <span style="color: ${bonusLuck===0 ? "blue" : bonusLuck>=0 ? "green" : "red"};">${bonusLuck}%</span>`

        await MySwal.fire({
            title: finalText,
            text: `Tu equipo fue: ${chosenTeam.map(pokemon => pokemon.name).join(' | ')}`,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Volver a empezar',
            width: '70vw',
          });
        resetGame(false)
    }

    const resetGame = async (shouldAsk) => {
        let result = false
        if(shouldAsk && !testing){
            result = await MySwal.fire({
                title: '¿Querés reiniciar el juego?',
                text: 'Esto borrará todos los pokemon elegidos y ofrecidos',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Reiniciar'
              });
              
            }
            
        if(result.isConfirmed || !shouldAsk || testing){

            setChosenTeam([])
            setCurrentTeam([])
            setRerollsLeft(testing ? 100 : 4)
            setRollButtonText("Iniciar")
            setShouldDisable(false)
        } 


    }
    

    return(
        <div className="poke-gym-container">
            <div className="poke-gym-game">
                {isLoading ? (
                    <ProgressSpinner animationDuration=".5s"/>
                ) : (
                    currentTeam.map((pokemon, index) => {
                        
                        return(  
                            <div className={`${pokemon.hasBeenChosen ? "selected-poke-card" : "poke-card"}`} key={index} onClick={() => lockInPokemon(pokemon)}>
                                <span><span className="pokemon-number">#{pokemon.id} - </span>{pokemon.name}</span>

                                
                                <img alt="" src={pokemon.img} className="pokemon-image"/>


                                {handleStars(pokemon.power)}
                                <span className={`locked-in ${pokemon.hasBeenChosen ? "visible" : "invisible"}`}>ELEGIDO</span>
                            </div>
                    )})

                )}
            </div>

            <div className="bottom-container">
                
                <TeamContainer team={chosenTeam}/>

                <div className="gym-game-button-container">

                    <button className="gym-game-button" onClick={() => updatePokemonTeam()} disabled={shouldDisable}>{rollButtonText}</button>
                    <button className="gym-game-button" disabled={chosenTeam.length!==6} onClick={fightGymLeaders}><span className="hotkey">P</span>ELEAR {chosenTeam.length!==6 ? `(Necesitas 6 Pokemon)` : ""}</button>
                    <button className="gym-game-button" disabled={rollButtonText==="Iniciar"} onClick={() => resetGame(true)}><span className="hotkey">R</span>EINICIAR JUEGO</button>
                </div>
                
                <Generations getGenerations={getGenerations} resetGame={resetGame}/>
                
            </div>

            


            <ToastContainer newestOnTop={false} rtl={true} theme="colored" pauseOnHover/>

        </div>
    )
}

export default PokeGym