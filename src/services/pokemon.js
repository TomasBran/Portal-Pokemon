

async function getPokemon (pokemonName) {
    let pokemon = {}

    const pokemonNumberLimits = [
        151, 251, 386, 493, 649, 721, 809, 898
    ]

    function capitalizeFirstLetter (word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName)
    .then(res => res.json())
    .then(fetchedPokemon => {
        let totalStats = 0
        let wasGenerationAssigned = false
        fetchedPokemon.stats.forEach(stat => {
            totalStats += stat.base_stat
        })
        pokemon.img = fetchedPokemon.sprites.other.dream_world.front_default
        ? fetchedPokemon.sprites.other.dream_world.front_default
        : fetchedPokemon.sprites.front_default
        pokemon.name = capitalizeFirstLetter(fetchedPokemon.name)
        pokemonNumberLimits.forEach((element, index) => {
            if(fetchedPokemon.id<=element && !wasGenerationAssigned){
             pokemon.generation = index+1
             wasGenerationAssigned = true
            }
        });
        pokemon.type_1 = capitalizeFirstLetter(fetchedPokemon.types[0].type.name)
        pokemon.type_2 = fetchedPokemon.types.length>1 ?  capitalizeFirstLetter(fetchedPokemon.types[1].type.name) : "Ninguno"
        pokemon.power = totalStats
        pokemon.weight = fetchedPokemon.weight/10
        pokemon.height = fetchedPokemon.height/10
        pokemon.id = fetchedPokemon.id
        pokemon.hasBeenChosen = false




        
    }
    )
    .catch((error) =>{
        console.log(error)
        alert(error)
    })


    return pokemon
}




export { getPokemon }