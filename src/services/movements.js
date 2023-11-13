import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


async function getPokemonMovements (pokemonName) {
    let pokemonMovements = []
    pokemonName+=''

    await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
    .then(res => res.json())
    .then(fetchedPokemon => {

        
    const movementsArray = fetchedPokemon.moves
    const availableMovements = movementsArray.map(movement => movement.move.name.replace(/-/g, ' '));

        
    while (pokemonMovements.length<4) {
        const randomNumber = Math.floor(Math.random() * availableMovements.length);

        if(!pokemonMovements.includes(availableMovements[randomNumber])){
            pokemonMovements.push(availableMovements[randomNumber])
        }
    }

    const randomAbilityNumber = Math.floor(Math.random() * fetchedPokemon.abilities.length)
    pokemonMovements.push(fetchedPokemon.abilities[randomAbilityNumber].ability.name.replace(/-/g, ' '))
    pokemonMovements.push(fetchedPokemon.name)
    })


    return pokemonMovements
}


export { getPokemonMovements }