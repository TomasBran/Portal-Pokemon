


const generateRandomPokemonNumber = (currentGenerations, chosenTeam, currentTeam) => {
    const pokemonNumberLimits = [
        151, 251, 386, 493, 649, 721, 809, 898
    ]
    let randomNum = 0;
    let tries = 0;
    let numberIsValid = false;
    //(!currentGenerations || !chosenTeam || !currentTeam)
    if(!currentGenerations){
        randomNum = Math.floor(Math.random() * (898)) + 1;
        return randomNum
    }

    
    do {
        randomNum = Math.floor(Math.random() * (898)) + 1;
        
        tries++;

        numberIsValid = pokemonNumberLimits.some((element, index) => {
            if (randomNum > element) {
                return false;
            } else if (currentGenerations[index] === true && (randomNum > pokemonNumberLimits[index - 1] || index === 0)) {
                return true;
            } else {
                return false;
            }
        });

    } while (!numberIsValid && tries<50);

    if(!numberIsValid){
        return 1
    }

    return randomNum
}


export { generateRandomPokemonNumber }