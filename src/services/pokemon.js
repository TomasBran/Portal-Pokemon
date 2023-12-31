import unknown_pokemon from '../assets/unknown_pokemon.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { capitalizeFirstLetter } from '../utils/functions';


const pokemonNumberLimits = [
    151, 251, 386, 493, 649, 721, 809, 898, 1017
]

async function pokemonExists (pokemonName){
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905&offset=0');
    const data = await response.json();
    const pokemonList = data.results;

    if(pokemonList.some(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase())){
        return true
    } else{
        toast.error(`El pokemon "${pokemonName.toUpperCase()}" no existe`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            })
        return false
    }


}

function getPokemonsGeneration (pokemonId) {

    let wasGenerationAssigned = false
    let generation

    pokemonNumberLimits.forEach((element, index) => {
        if(pokemonId<=element && !wasGenerationAssigned){
         generation = index+1
         wasGenerationAssigned = true
        }
    });

    return generation
}


async function getPokemon (pokemonName) {
    let pokemon = {}
    pokemonName+=''



    await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
    .then(res => res.json())
    .then(fetchedPokemon => {
        let totalStats = 0
        fetchedPokemon.stats.forEach(stat => {
            totalStats += stat.base_stat
        })


        pokemon.img = fetchedPokemon.sprites.other.dream_world.front_default !== null
        ? fetchedPokemon.sprites.other.dream_world.front_default
        : (fetchedPokemon.sprites.front_default
            ? fetchedPokemon.sprites.front_default
            : unknown_pokemon)

        if(pokemon.img.length>120){ // ERROR CUANDO PIDE EL NOMBRE EN LUGAR DE NUMERO DE POKEMON, SE CREA MAL LA URL
            pokemon.img = pokemon.img.slice(57)
        }




        pokemon.name = capitalizeFirstLetter(fetchedPokemon.name)

        pokemon.generation = getPokemonsGeneration(fetchedPokemon.id)


        pokemon.type_1 = capitalizeFirstLetter(fetchedPokemon.types[0].type.name)
        pokemon.type_2 = fetchedPokemon.types.length>1 ?  capitalizeFirstLetter(fetchedPokemon.types[1].type.name) : "Ninguno"
        pokemon.power = totalStats
        pokemon.weight = fetchedPokemon.weight/10
        pokemon.height = fetchedPokemon.height/10
        pokemon.id = fetchedPokemon.id
        pokemon.hasBeenChosen = false

        
    }
    )
    .catch((err) =>{
        toast.error(`El pokemon "${pokemonName.toUpperCase()}" no existe`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            })
    })


    return pokemon
}


export { getPokemon, pokemonExists, getPokemonsGeneration}