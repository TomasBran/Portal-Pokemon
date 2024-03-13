const TeamContainer = ({ team }) => {
	return (
		<div className='flex justify-evenly bg-white w-full h-full border-2 border-black rounded-2xl p-4 items-center'>
			{team.length === 0 && <span className='text-2xl'>Equipo Vacio</span>}
			{team.map((pokemon, index) => {
				return (
					<div
						className='flex justify-center items-center w-2/12 h-full'
						key={index}>
						<img
							alt=''
							src={pokemon.img}
							className={`w-4/6 h-full`}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default TeamContainer;
