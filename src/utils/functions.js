
function capitalizeFirstLetter (word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function generateRandomPokemonNumber (currentGenerations, chosenTeam, currentTeam) {
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

        
        if(numberIsValid){
            numberIsValid = !chosenTeam.some(element => element.id === randomNum);
        }

        if(numberIsValid){
            numberIsValid = !currentTeam.includes(randomNum);
        }

    } while (!numberIsValid && tries<75);

    if(!numberIsValid){
        return 1
    }

    return randomNum
}


export { generateRandomPokemonNumber, capitalizeFirstLetter }