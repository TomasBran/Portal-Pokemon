import { useEffect, useState } from "react"
import './PokeGym.css'
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeamContainer from "../TeamContainer/TeamContainer";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



const PokeGym = () => {

    const MySwal = withReactContent(Swal);

    const pokemonNumberLimits = [
        151, 251, 386, 493, 649, 721, 809, 898
    ]
    

    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])
    const [currentPokemonLimit, setCurrentPokemonLimit] = useState(898)
    const [currentTeam, setCurrentTeam] = useState([])
    const [chosenTeam, setChosenTeam] = useState([])
    const [rerollsLeft, setRerollsLeft] = useState(4)
    const [rollButtonText, setRollButtonText] = useState(`Generar ${6-chosenTeam.length} pokemon (3 REROLLS)`)
    
    const [shouldDisable, setShouldDisable] = useState(false)

    const generationsContainer = document.getElementsByClassName("generation-container")[0]
        
    

     const lockInPokemon = (pokemon) => {
        if(pokemon.hasBeenChosen===true){
            toast.error(`Has quitado a ${pokemon.name} de tu equipo`, {
                autoClose: 3000,
                position: "bottom-right",
            });
            pokemon.hasBeenChosen=false
            setChosenTeam(previousTeam => previousTeam.filter(poke => poke.name !== pokemon.name))
            return
        }
        toast.success(`Has incluido a ${pokemon.name} en tu equipo`, {
            autoClose: 2000,
            position: "bottom-right",
        });
        pokemon.hasBeenChosen=true
        if(!chosenTeam.find((element) => element.name === pokemon.name)){
            setChosenTeam(team => [...team, pokemon])
        }
        
    }

   
    const updatePokemonTeam = () => {
        
        setCurrentTeam([])
        setRerollsLeft(prev => prev-1)

        for (let index = 0; index < 6-chosenTeam.length; index++) {
            const randomNum = generateRandomPokemonNumber()
            
            fetch('https://pokeapi.co/api/v2/pokemon/' + randomNum)
                .then(res => res.json())
                .then(pokemonFromApi => {
    
                    const sprite = pokemonFromApi.sprites.other.dream_world.front_default ? pokemonFromApi.sprites.other.dream_world.front_default : pokemonFromApi.sprites.other.home.front_default

                    const pokemonName = pokemonFromApi.name.charAt(0).toUpperCase() + pokemonFromApi.name.slice(1)

                    const currentPokemon = {
                        id: pokemonFromApi.id,
                        name:pokemonName,
                        img:sprite,
                        power:calculatePower(pokemonFromApi.stats),
                        hasBeenChosen:false
                    }

                    setCurrentTeam(team => [...team, currentPokemon])


                    
                })

                
        }
        
        
      };

    
    useEffect(() => {
        handleButtonText();
    }, [chosenTeam, updatePokemonTeam]);


    const generateRandomPokemonNumber = () => {
        let randomNum = 0;
        let tries = 0;
        let numberIsValid = false;
    
        do {
            randomNum = Math.floor(Math.random() * (currentPokemonLimit)) + 1;
            
            tries++;
    
            numberIsValid = pokemonNumberLimits.some((element, index) => {
                if (randomNum > element) {
                    return false;
                } else if (currentGenerations[index] === true && (randomNum > pokemonNumberLimits[index-1] || index===0)) {
                    return true;
                } else {
                    return false;
                }
            });
        } while (!numberIsValid && tries<100);
    
        if(!numberIsValid){
            return 1
        }

        return randomNum
    };
    


    const calculatePower = (pokemonStats) => {
        let totalStats = 0
        pokemonStats.forEach(stat => {
            totalStats += stat.base_stat
        })
        return totalStats
    }

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


    const toggleGeneration = (index) => {

        const trueCount = currentGenerations.filter((value) => value === true).length;

        if (trueCount === 1 && currentGenerations[index]) {
            toast.error(`Se necesita por lo menos 1 generación disponible`, {
                autoClose: 3000,
                position: "top-right",
            });
            return;
        }
        
        
        let newGenerations = currentGenerations.slice()
        newGenerations[index] = !newGenerations[index]
        setCurrentGenerations(newGenerations)
    }


   
      

    const toggleGenerationPanel = async () => {

        setShouldDisable(true);

        if (!generationsContainer.classList.contains("invisible")) {
            generationsContainer.classList.toggle("invisible");
            setShouldDisable(false);
            return;
          }

        let result = await MySwal.fire({
            title: '¿Querés cambiar las generaciones disponibles?',
            text: 'Esto reiniciará tu partida',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cambiar'
          });

          if(result.isConfirmed){
              generationsContainer.classList.toggle("invisible")
              resetGame(false)
          }

        setShouldDisable(false);
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

    const  getRandomArbitrary = (min, max) => {
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
            excessPower = ((power - 2250) % 150)/150*100
            // excessPower = (((power-2250) % 150 === 0) ? 0 : 150 - ((power-2250) % 150))/150*100;
            
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
        let testing = false  //CAMBIAR CUANDO ESTOY TESTEANDO
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
            setRerollsLeft(4)
            setRollButtonText("Iniciar")
            setShouldDisable(false)
        } 


    }
    
    return(
        <div className="poke-gym-container">
            <div className="poke-gym-game">
                {currentTeam.map((pokemon, index) => {
                    
                    return(
                        <div className="poke-card" key={index} onClick={() => lockInPokemon(pokemon)}>
                            <span>#{pokemon.id} - {pokemon.name}</span>
                            <img alt="" src={pokemon.img} className="pokemon-image"/>
                            {handleStars(pokemon.power)}
                            <span className={`locked-in ${pokemon.hasBeenChosen ? "visible" : "invisible"}`}>ELEGIDO</span>
                        </div>
                )})}
            </div>

            <div className="bottom-container">
                
                <TeamContainer team={chosenTeam}/>

                <div className="gym-game-button-container">

                    <button className="gym-game-button" style={{marginTop:24, padding:16}} onClick={() => updatePokemonTeam()} disabled={shouldDisable}>{rollButtonText}</button>
                    <button className="gym-game-button" disabled={chosenTeam.length!==6} onClick={fightGymLeaders}>PELEAR</button>
                    <button className="gym-game-button" disabled={rollButtonText==="Iniciar"} onClick={() => resetGame(true)}>REINICIAR JUEGO</button>
                </div>
                
                <div className="generation-selector-button-container">
                    <button className="generation-selector-button" onClick={toggleGenerationPanel}>Cambiar Generación</button>
                </div>
            </div>

            
            <div className="generation-container invisible">
                <div  className="generation-selector-panel">
                    {currentGenerations.map((element, index) => (
                        <span key={index} className={`generation-panel ${element===true ? "enabled-panel" : "disabled-panel"}`} onClick={() => toggleGeneration(index)}>{index+1}° Generación</span>
                    ))}

                </div>

                <button className="generation-selector-panel-button" onClick={toggleGenerationPanel}>Listo</button>

            </div>


            <ToastContainer newestOnTop={false} rtl={true} theme="colored" pauseOnHover/>

        </div>
    )
}

export default PokeGym