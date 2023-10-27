import { useState, useEffect } from "react";
import { useSelection } from "../../context/SelectionContext";
import "./TypeButtons.css";
import  pokedex  from "../../assets/pokedex.webp"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const TypeButtons = () => {


    const searchErrorMessage = () => toast.error(`El pokemon "${input.toUpperCase()}" no existe`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        })

    const [input, setInput] = useState('')
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
    
    const searchPokemon = (selectedPokemon) => {
        fetch('https://pokeapi.co/api/v2/pokemon/' + selectedPokemon.toLowerCase())
            .then(res => res.json())
            .then(data => {
                let sprite = data.sprites.other.dream_world.front_default
                renderPokemon(sprite, data.name, data.id)
                deleteBothTypes()
                
                if(data.types.length>1){

                    (data.types[0].type.name !== currentFirstSelection || data.types[1].type.name !== currentSecondSelection) && resetTypes()

                    setBothTypes(data.types[0].type.name, data.types[1].type.name)
                } else{
                    resetTypes()
                    setSelection(data.types[0].type.name)
                }
            }
            )
            .catch(() =>{
                setIsVisible(false)
                deleteBothTypes()
                resetTypes()
                searchErrorMessage()
            })
            
            setInput("")
    }


    const renderPokemon = (url, name, id) => {
        setCurrentPokemonImage(url)
        setCurrentPokemonName(name)
        setCurrentPokemonId(id)
        setIsVisible(true)
    }


    const handleEnter = (e) => {
        if(e.key === "Enter"){
            searchPokemon(input)
        }
    }


    return (

        <div className='mainContainer'>
              <h2 className='mainTitle'>Tipos del pokemon enemigo:</h2>
              <div className="type-container">


                <div className="flexContainer">

                    <div className="selectorContainer">
                        <div className="button-container">
                            {pokemonTypes.map((type) => 
                            <button onClick={() => handleClick(type.name)} className={`${type.name} button`} key={type.name}>{type.name}</button>
                            )}
                        </div>

                        <div className={`pokedexContainer ${isVisible ? (currentFirstSelection!=="" ? currentFirstSelection : currentSecondSelection) : "emptyPokedex"} ${(currentFirstSelection==="" && currentSecondSelection==="") && "emptyPokedex"}`}>
                            <div className="pokedexInfo">
                                <img alt="" src={pokedex} className="pokedexImage"/>
                                <div className="searchInfo">
                                    <button className="searchButton" onClick={() => searchPokemon(input)}>Buscar</button>
                                    <input className="searchInput" placeholder="Ej: Pikachu" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => handleEnter(e)}></input>
                                </div>
                            </div>
                            
                            <div className={`pokemonPreview ${isVisible ? "visible" : "invisible"}`}>
                                <div className="pokemonInfoDisplay">
                                    <span className="pokemonName">#{currentPokemonId} - {currentPokemonName}</span>
                                    <div className="pokemonTypes">
                                        <p className={`${currentFirstSelection!=="" ? currentFirstSelection : "invisible"} types`}>{currentFirstSelection}</p>
                                        <p className={`${currentSecondSelection!=="" ? currentSecondSelection : "invisible"} types`}>{currentSecondSelection}</p>
                                    </div>
                                </div>
                                <img alt="" src={currentPokemonImage} className="pokemonImage"/>
                                
                            </div>    
                        </div>
                    </div>
                    <div className="selectedContainer">
                        <h2>Seleccionados:</h2>
                        <button className={currentFirstSelection!=="" ? `${currentFirstSelection} button selectedType` : "empty"} onClick={() => handleClick(currentFirstSelection)}>{currentFirstSelection}</button>
                        <button className={currentSecondSelection!== "" ? `${currentSecondSelection} button selectedType` : "empty"} onClick={() => handleClick(currentSecondSelection)}>{currentSecondSelection}</button>
                    </div>

                    <div className="mainTypeContainer">
                        <div className="EffectiveContainer">
                            <h2>Efectivo:</h2>
                            <h2>x4:</h2>
                            <div className="typesContainer">
                                {types_x4.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>
                            <h2>x2:</h2>
                            <div className="typesContainer">
                                {types_x2.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>
                        </div>
                        <div className="NeutralContainer">
                            <h2>Neutral:</h2>
                            <h2>x1:</h2>
                            <div className="typesContainer">
                                {types_x1.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>
                        </div>
                        <div className="UneffectiveContainer">
                            <h2>Poco efectivo:</h2>
                            <h2>x1/2:</h2>
                            <div className="typesContainer">
                                {types_x05.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>
                            <h2>x1/4:</h2>
                            <div className="typesContainer">
                                {types_x025.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>
                        </div>

                        <div className="ImmuneContainer">
                            <h2>Inmune:</h2>
                            <h2>x0:</h2>
                            <div className="typesContainer">
                                {types_x0.map((type) => <p className={`${type} types`} key={type}>{type}</p>)}
                            </div>

                        </div>
                    </div>
                </div>
              </div>
              <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
            </div>
    )
}

export default TypeButtons