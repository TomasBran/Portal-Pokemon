import { useState, useEffect, React } from "react";
import { useSelection } from "../../context/SelectionContext";
import "./Calculator.css";
import  pokedex  from "../../assets/pokedex.webp"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PokemonSearch from "../PokemonSearch/PokemonSearch";
import { getPokemon } from "../../services/pokemon";
import { capitalizeFirstLetter } from "../../utils/functions";
import { ProgressSpinner } from 'primereact/progressspinner';




    const steel = "steel"
    const water = "water"
    const bug = "bug"
    const dragon = "dragon"
    const electric = "electric"
    const ghost = "ghost"
    const fire = "fire"
    const fairy = "fairy"
    const ice = "ice"
    const fighting = "fighting"
    const normal = "normal"
    const grass = "grass"
    const psychic = "psychic"
    const rock = "rock"
    const dark = "dark"
    const ground = "ground"
    const poison = "poison"
    const flying = "flying"


const pokemonTypes = [
    {
        name: fire,
        isEffectiveAgainst: [grass, ice, steel, bug],
        isNotEffectiveAgainst: [water, dragon, fire, rock],
        isResistantAgainst: [steel, bug, fire, fairy, ice, grass],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [water, rock, ground],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: water,
        isEffectiveAgainst: [fire, rock, ground],
        isNotEffectiveAgainst: [water, dragon, grass],
        isResistantAgainst: [steel, water, fire, ice],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [electric, grass],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: grass,
        isEffectiveAgainst: [water, rock, ground],
        isNotEffectiveAgainst: [steel, bug, dragon, fire, grass, poison, flying],
        isResistantAgainst: [water, electric, grass, ground],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [bug, fire, ice, poison, flying],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: psychic,
        isEffectiveAgainst: [fighting, poison],
        isNotEffectiveAgainst: [steel, psychic],
        isResistantAgainst: [fighting, psychic],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [bug, ghost, dark],
        isImmuneAgainstMyAttacks: [dark]
    },
    {
        name: steel ,
        isEffectiveAgainst: [fairy,ice, rock],
        isNotEffectiveAgainst: [steel, water, electric, fire],
        isResistantAgainst: [steel, bug, dragon, fairy, ice, normal, grass, psychic, rock, flying],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [fire, fighting, ground],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: bug,
        isEffectiveAgainst: [grass, psychic, dark],
        isNotEffectiveAgainst: [steel, ghost, fire, fairy, fighting, poison, flying],
        isResistantAgainst: [fighting, grass, ground],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [fire, rock, flying],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: dragon,
        isEffectiveAgainst: [dragon],
        isNotEffectiveAgainst: [steel],
        isResistantAgainst: [water, electric, fire, grass],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [dragon, fairy, ice],
        isImmuneAgainstMyAttacks: [fairy]
    },
    {
        name: electric,
        isEffectiveAgainst: [water, flying],
        isNotEffectiveAgainst: [dragon, electric, grass],
        isResistantAgainst: [steel, electric, flying],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [ground],
        isImmuneAgainstMyAttacks: [ground]
    },
    {
        name: ghost,
        isEffectiveAgainst: [ghost, psychic],
        isNotEffectiveAgainst: [dark],
        isResistantAgainst: [bug, poison],
        hasImmunityAgainst: [fighting, normal],
        isEffectiveAgainstMe: [ghost, dark],
        isImmuneAgainstMyAttacks: [normal]
    },
    {
        name: fairy,
        isEffectiveAgainst: [dragon, fighting, dark],
        isNotEffectiveAgainst: [steel, fire, poison],
        isResistantAgainst: [bug, fighting, dark],
        hasImmunityAgainst: [dragon],
        isEffectiveAgainstMe: [steel, poison],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: ice,
        isEffectiveAgainst: [dragon, grass, ground, flying],
        isNotEffectiveAgainst: [steel, water, fire, ice],
        isResistantAgainst: [ice],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [steel, fire, fighting, rock],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: fighting,
        isEffectiveAgainst: [steel, ice, normal, rock, dark],
        isNotEffectiveAgainst: [bug, fairy, psychic, poison, flying],
        isResistantAgainst: [bug, rock, dark],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [fairy, psychic, flying],
        isImmuneAgainstMyAttacks: [ghost]
    },
    {
        name: normal,
        isEffectiveAgainst: [],
        isNotEffectiveAgainst: [steel, rock],
        isResistantAgainst: [],
        hasImmunityAgainst: [ghost],
        isEffectiveAgainstMe: [fighting],
        isImmuneAgainstMyAttacks: [ghost]
    },
    {
        name: rock,
        isEffectiveAgainst: [bug, fire, ice, flying],
        isNotEffectiveAgainst: [steel, fighting, ground],
        isResistantAgainst: [fire, normal, poison, flying],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [steel, water, fighting, grass, ground],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: dark,
        isEffectiveAgainst: [ghost, psychic],
        isNotEffectiveAgainst: [fairy, fighting, dark],
        isResistantAgainst: [ghost, dark],
        hasImmunityAgainst: [psychic],
        isEffectiveAgainstMe: [bug, fairy, fighting],
        isImmuneAgainstMyAttacks: []
    },
    {
        name: ground,
        isEffectiveAgainst: [steel, electric, fire, rock, poison],
        isNotEffectiveAgainst: [bug, grass],
        isResistantAgainst: [rock, poison],
        hasImmunityAgainst: [electric],
        isEffectiveAgainstMe: [water, ice, grass],
        isImmuneAgainstMyAttacks: [flying]
    },
    {
        name: poison,
        isEffectiveAgainst: [fairy, grass],
        isNotEffectiveAgainst: [ghost, rock, ground, poison],
        isResistantAgainst: [bug, fairy, fighting, grass, poison],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: [psychic, ground],
        isImmuneAgainstMyAttacks: [steel]
    },
    {
        name: flying,
        isEffectiveAgainst: [bug, fighting, grass],
        isNotEffectiveAgainst: [steel, electric, rock],
        isResistantAgainst: [bug, fighting, grass],
        hasImmunityAgainst: [ground],
        isEffectiveAgainstMe: [electric, ice, rock],
        isImmuneAgainstMyAttacks: []
    }
]

const Calculator = () => {

    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [currentPokemonImage, setCurrentPokemonImage] = useState()
    const [currentPokemonName, setCurrentPokemonName] = useState("")
    const [currentPokemonId, setCurrentPokemonId] = useState("")

    const [ types_x4,   setTypes_x4  ] = useState([])
    const [ types_x2,   setTypes_x2  ] = useState([])
    const [ types_x1,   setTypes_x1  ] = useState([])
    const [ types_x05,  setTypes_x05 ] = useState([])
    const [ types_x025, setTypes_x025] = useState([])
    const [ types_x0,   setTypes_x0  ] = useState([])

    const {currentFirstSelection, currentSecondSelection, setSelection, deleteSelection, setBothTypes, deleteBothTypes} = useSelection()
    

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    const handleClick = (type) => {
        if(type===currentFirstSelection || type===currentSecondSelection){
            type===currentFirstSelection ? deleteSelection(1) : deleteSelection(2)
            resetTypes()
            setIsVisible(false)
        } else {
            let shouldReset = true
            currentSecondSelection==="" ? setSelection(type) : currentFirstSelection==="" ? setSelection(type) : shouldReset=false

            if(shouldReset){
                resetTypes()
                setIsVisible(false)
            } else{
                
                toast.error(`Ya estás utilizando 2 tipos. Elimina uno primero`, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    })
            }
        }


    }

    const resetTypes = () => {
        setTypes_x4([])
        setTypes_x2([])
        setTypes_x1([])
        setTypes_x05([])
        setTypes_x025([])
        setTypes_x0([])
    }
 
    const HandleEffectiveness = (currentType1, currentType2) => {
        pokemonTypes.forEach((type) =>{
            let efectiveness = 1;
            type.isEffectiveAgainst.includes(currentType1) && (efectiveness *= 2)
            type.isEffectiveAgainst.includes(currentType2) && (efectiveness *= 2)
            type.isNotEffectiveAgainst.includes(currentType1) && (efectiveness /= 2)
            type.isNotEffectiveAgainst.includes(currentType2) && (efectiveness /= 2)
            type.isImmuneAgainstMyAttacks.includes(currentType1) && (efectiveness *= 0)
            type.isImmuneAgainstMyAttacks.includes(currentType2) && (efectiveness *= 0)

            efectiveness === 4 && setTypes_x4(prev => [...prev, type.name])
            efectiveness === 2 && setTypes_x2(prev => [...prev, type.name])
            efectiveness === 1 && setTypes_x1(prev => [...prev, type.name])

            if (currentType1==="" && currentType2===""){
                setTypes_x1([])
            }

            efectiveness === 0.5 && setTypes_x05(prev => [...prev, type.name])
            efectiveness === 0.25 && setTypes_x025(prev => [...prev, type.name])
            efectiveness === 0 && setTypes_x0(prev => [...prev, type.name])
             
        })
    }

    useEffect(() => {
      HandleEffectiveness(currentFirstSelection, currentSecondSelection)
    
    }, [currentFirstSelection, currentSecondSelection])
    
    const searchPokemon = async (selectedPokemon) => {
        setLoading(true);

        try{
            const searchedPokemon = await getPokemon(selectedPokemon)
            
            searchedPokemon.type_1=searchedPokemon.type_1.toLowerCase()
            searchedPokemon.type_2=searchedPokemon.type_2.toLowerCase()
            
            renderPokemon(searchedPokemon.img, searchedPokemon.name, searchedPokemon.id)
            deleteBothTypes()
            if(searchedPokemon.type_2!=="ninguno"){
                (searchedPokemon.type_1 !== currentFirstSelection || searchedPokemon.type_2 !== currentSecondSelection) && resetTypes()
                setBothTypes(searchedPokemon.type_1, searchedPokemon.type_2)
            } else{
                resetTypes()
                setSelection(searchedPokemon.type_1)
            }
        } catch (error){
            setLoading(false)
            setIsVisible(false)
            deleteBothTypes()
            resetTypes()
        }
        
        
    }


    const renderPokemon = (url, name, id) => {
        const imgElement = new Image();
        imgElement.src = url;
        imgElement.onload = () => {
            setCurrentPokemonImage(url)
            setCurrentPokemonName(name)
            setCurrentPokemonId(id)
            setIsVisible(true)
            setLoading(false)
        }
    }




    return (

        <div className='main-container'>
              <h2 className='main-title'>Tipos del pokemon enemigo:</h2>
              <div className="type-container">


                <div className="flex-container">

                    <div className="selector-container">
                        <div className="button-container">
                            {pokemonTypes.map((type) => 
                            <button onClick={() => handleClick(type.name)} className={`${type.name} button`} key={type.name}><span>{type.name}</span></button>
                            )}
                        </div>

                        <div className={`pokedex-container ${isVisible ? (currentFirstSelection!=="" ? currentFirstSelection : currentSecondSelection) : "empty-pokedex"} ${(currentFirstSelection==="" && currentSecondSelection==="") && "empty-pokedex"}`}>
                            <div className="pokedex-info">
                                <img alt="" src={pokedex} className="pokedex-image"/>
                                <PokemonSearch onInputChange={handleInputChange}/>
                                <button className="search-button" onClick={() => searchPokemon(inputValue)}>Buscar</button>
                                
                            </div>

                            {loading
                                ? ( <ProgressSpinner/> )
                                : (
                                    <div className={`pokemon-preview ${isVisible ? "visible" : "invisible"}`}>
                                        <div className="pokemon-info-display">
                                            <span className="pokemon-name">#{currentPokemonId} - {currentPokemonName}</span>
                                            <div className="pokemon-types">
                                                <p className={`${currentFirstSelection!=="" ? currentFirstSelection : "invisible"} types`}>{capitalizeFirstLetter(currentFirstSelection)}</p>
                                                <p className={`${currentSecondSelection!=="" ? currentSecondSelection : "invisible"} types`}>{capitalizeFirstLetter(currentSecondSelection)}</p>
                                            </div>
                                        </div>
                                        <img alt="" src={currentPokemonImage} className="pokemon-image" loading="lazy"/>
                                        
                                    </div>
                                )}
                            
                        </div>
                    </div>
                    <div className="selected-container">
                        <h2>Seleccionados:</h2>
                        <div className="selections">
                            <button className={` ${currentFirstSelection!=="" ? `${currentFirstSelection} button selected-type` : "empty"}`} onClick={() => handleClick(currentFirstSelection)}><span>{currentFirstSelection}</span></button>
                            <button className={currentSecondSelection!== "" ? `${currentSecondSelection} button selected-type` : "empty"} onClick={() => handleClick(currentSecondSelection)}><span>{currentSecondSelection}</span></button>
                        </div>
                    </div>

                    <div className={`main-type-container ${(currentFirstSelection==="" && currentSecondSelection==="") ? "invisible" : ""}`}>
                        <div className="effective-container">
                            <h2>Efectivo:</h2>
                            <div className={`${types_x4.length===0 ? "invisible" : ""}`}>
                                <h2>x4:</h2>
                                <div className="types-container">
                                    {types_x4.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                                </div>
                            </div>
                            <div className={`${types_x2.length===0 ? "invisible" : ""}`}>
                                <h2>x2:</h2>
                                <div className="types-container">
                                    {types_x2.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                                </div>
                            </div>
                        </div>
                        <div className="neutral-container">
                            <h2>Neutral:</h2>
                            <h2>x1:</h2>
                            <div className="types-container">
                                {types_x1.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                            </div>
                        </div>
                        <div className={`uneffective-container ${(types_x05.length===0 && types_x025.length===0) ? "invisible" : ""}`}>
                            <h2>Poco efectivo:</h2>
                            <div className={`${types_x05.length===0 ? "invisible" : ""}`}>
                                <h2>x1/2:</h2>
                                <div className="types-container">
                                    {types_x05.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                                </div>

                            </div>
                            <div className={`${types_x025.length===0 ? "invisible" : ""}`}>
                                <h2>x1/4:</h2>
                                <div className="types-container">
                                    {types_x025.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                                </div>
                            </div>
                        </div>

                        <div className={`immune-container ${types_x0.length===0 ? "invisible" : ""}`}>
                            <h2>Inmune:</h2>
                            <h2>x0:</h2>
                            <div className="types-container">
                                {types_x0.map((type) => <div className={`${type} types`} key={type}><span>{type}</span></div>)}
                            </div>

                        </div>
                    </div>
                </div>
              </div>
              <ToastContainer autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
            </div>
    )
}

export default Calculator