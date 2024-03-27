import { Link } from 'react-router-dom';
import gym from '../../assets/gym.png';
import calculator from '../../assets/calculator.png';
import pokedle from '../../assets/pokedle.png';
import moveset from '../../assets/moveset_background.jpg';
import typesChallenge from '../../assets/types_challenge.webp';
import coming_soon from '../../assets/coming_soon.webp';

const buttonsArray = [
	{
		url: 'calculator',
		text: 'Calculadora',
		image: calculator,
		typeText: 'Herramienta',
		isDisabled: false,
	},
	{
		url: 'gym',
		text: 'Gimnasio',
		image: gym,
		typeText: 'Mini-game',
		isDisabled: false,
	},
	{
		url: 'pokedle',
		text: 'Pokedle',
		image: pokedle,
		typeText: 'Mini-game',
		isDisabled: false,
	},
	{
		url: 'moveset',
		text: 'Adivina el MoveSet (WIP)',
		image: moveset,
		typeText: 'Mini-game',
		isDisabled: false,
	},
	{
		url: 'types-challenge',
		text: 'Desafío de Tipos (WIP)',
		image: typesChallenge,
		typeText: 'Mini-game',
		isDisabled: false,
	},
	{
		url: 'Portal-Pokemon',
		text: 'Coming Soon',
		image: coming_soon,
		typeText: '',
		isDisabled: true,
	},
];

const Home = () => {
	return (
		<div className='min-h-screen pt-10 bg-yellow-200 flex items-center'>
			<div className='flex flex-col'>
				{/* <span className='text-4xl my-8 text-yellow-900'>
					¿Dónde quieres ir?
				</span> */}
				<div className='flex justify-evenly flex-wrap gap-7 w-screen'>
					{buttonsArray.map((button, index) => (
						<Link
							className='no-underline'
							to={`/${button.url}`}
							key={index}>
							<button
								disabled={button.isDisabled}
								className={`p-2 md:p-4 w-[25vw] h-[35vh] rounded-lg border-none text-white no-underline bg-cover bg-center ease-in duration-150 enabled:active:scale-95 enabled:hover:shadow-gray-400 enabled:hover:shadow-lg disabled:cursor-default group
								${button.url !== 'Portal-Pokemon' ? 'group-hover:bg-white/90' : ''}`}
								style={{ backgroundImage: `url(${button.image})` }}>
								<div className='flex items-end justify-between w-full h-full flex-col'>
									{!button.isDisabled && (
										<div
											className={`bg-zinc-300 text-gray-700 py-2 px-3 rounded-md transition duration-150 ease-in font-bold text-shadow-md`}>
											<span>{button.typeText}</span>
										</div>
									)}
									{!button.isDisabled && (
										<div className='bg-zinc-300/80 text-gray-700 p-1 w-full rounded-md transition duration-150  ease-in group-hover:bg-yellow-300 group-hover:text-yellow-800'>
											<span className='no-underline font-bold text-lg text-shadow-md'>
												{button.text}
											</span>
										</div>
									)}
								</div>
							</button>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
