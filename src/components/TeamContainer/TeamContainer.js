import './TeamContainer.css'

const TeamContainer = ({team}) => {

    return(
        <div className="team-container">
                {team.map((pokemon, index) => {
                    return(
                        <div className="team-pokemon-container" key={index}>
                            <img alt="" src={pokemon.img} className={`pokemon-team-image ${pokemon.name}`}/>
                        </div>
                )})}
            </div>
    )
}

export default TeamContainer