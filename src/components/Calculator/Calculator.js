import { useState, useEffect, React, useRef } from 'react';
import { useSelection } from '../../context/SelectionContext';
import './types.css';
import pokedex from '../../assets/pokedex.webp';
import { toast } from 'sonner';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { getPokemon } from '../../services/pokemon';
import { ProgressSpinner } from 'primereact/progressspinner';
import { typeLogos } from '../TypesChallenge/Dnd/DraggableItem';
import settings from '../../assets/settings.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Type from './Type';

const steel = 'steel';
const water = 'water';
const bug = 'bug';
const dragon = 'dragon';
const electric = 'electric';
const ghost = 'ghost';
const fire = 'fire';
const fairy = 'fairy';
const ice = 'ice';
const fighting = 'fighting';
const normal = 'normal';
const grass = 'grass';
const psychic = 'psychic';
const rock = 'rock';
const dark = 'dark';
const ground = 'ground';
const poison = 'poison';
const flying = 'flying';

const pokemonTypes = [
	{
		name: fire,
		isEffectiveAgainst: [grass, ice, steel, bug],
		isNotEffectiveAgainst: [water, dragon, fire, rock],
		isResistantAgainst: [steel, bug, fire, fairy, ice, grass],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [water, rock, ground],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: water,
		isEffectiveAgainst: [fire, rock, ground],
		isNotEffectiveAgainst: [water, dragon, grass],
		isResistantAgainst: [steel, water, fire, ice],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [electric, grass],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: grass,
		isEffectiveAgainst: [water, rock, ground],
		isNotEffectiveAgainst: [steel, bug, dragon, fire, grass, poison, flying],
		isResistantAgainst: [water, electric, grass, ground],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [bug, fire, ice, poison, flying],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: psychic,
		isEffectiveAgainst: [fighting, poison],
		isNotEffectiveAgainst: [steel, psychic],
		isResistantAgainst: [fighting, psychic],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [bug, ghost, dark],
		isImmuneAgainstMyAttacks: [dark],
	},
	{
		name: steel,
		isEffectiveAgainst: [fairy, ice, rock],
		isNotEffectiveAgainst: [steel, water, electric, fire],
		isResistantAgainst: [
			steel,
			bug,
			dragon,
			fairy,
			ice,
			normal,
			grass,
			psychic,
			rock,
			flying,
		],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [fire, fighting, ground],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: bug,
		isEffectiveAgainst: [grass, psychic, dark],
		isNotEffectiveAgainst: [
			steel,
			ghost,
			fire,
			fairy,
			fighting,
			poison,
			flying,
		],
		isResistantAgainst: [fighting, grass, ground],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [fire, rock, flying],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: dragon,
		isEffectiveAgainst: [dragon],
		isNotEffectiveAgainst: [steel],
		isResistantAgainst: [water, electric, fire, grass],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [dragon, fairy, ice],
		isImmuneAgainstMyAttacks: [fairy],
	},
	{
		name: electric,
		isEffectiveAgainst: [water, flying],
		isNotEffectiveAgainst: [dragon, electric, grass],
		isResistantAgainst: [steel, electric, flying],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [ground],
		isImmuneAgainstMyAttacks: [ground],
	},
	{
		name: ghost,
		isEffectiveAgainst: [ghost, psychic],
		isNotEffectiveAgainst: [dark],
		isResistantAgainst: [bug, poison],
		hasImmunityAgainst: [fighting, normal],
		isEffectiveAgainstMe: [ghost, dark],
		isImmuneAgainstMyAttacks: [normal],
	},
	{
		name: fairy,
		isEffectiveAgainst: [dragon, fighting, dark],
		isNotEffectiveAgainst: [steel, fire, poison],
		isResistantAgainst: [bug, fighting, dark],
		hasImmunityAgainst: [dragon],
		isEffectiveAgainstMe: [steel, poison],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: ice,
		isEffectiveAgainst: [dragon, grass, ground, flying],
		isNotEffectiveAgainst: [steel, water, fire, ice],
		isResistantAgainst: [ice],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [steel, fire, fighting, rock],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: fighting,
		isEffectiveAgainst: [steel, ice, normal, rock, dark],
		isNotEffectiveAgainst: [bug, fairy, psychic, poison, flying],
		isResistantAgainst: [bug, rock, dark],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [fairy, psychic, flying],
		isImmuneAgainstMyAttacks: [ghost],
	},
	{
		name: normal,
		isEffectiveAgainst: [],
		isNotEffectiveAgainst: [steel, rock],
		isResistantAgainst: [],
		hasImmunityAgainst: [ghost],
		isEffectiveAgainstMe: [fighting],
		isImmuneAgainstMyAttacks: [ghost],
	},
	{
		name: rock,
		isEffectiveAgainst: [bug, fire, ice, flying],
		isNotEffectiveAgainst: [steel, fighting, ground],
		isResistantAgainst: [fire, normal, poison, flying],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [steel, water, fighting, grass, ground],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: dark,
		isEffectiveAgainst: [ghost, psychic],
		isNotEffectiveAgainst: [fairy, fighting, dark],
		isResistantAgainst: [ghost, dark],
		hasImmunityAgainst: [psychic],
		isEffectiveAgainstMe: [bug, fairy, fighting],
		isImmuneAgainstMyAttacks: [],
	},
	{
		name: ground,
		isEffectiveAgainst: [steel, electric, fire, rock, poison],
		isNotEffectiveAgainst: [bug, grass],
		isResistantAgainst: [rock, poison],
		hasImmunityAgainst: [electric],
		isEffectiveAgainstMe: [water, ice, grass],
		isImmuneAgainstMyAttacks: [flying],
	},
	{
		name: poison,
		isEffectiveAgainst: [fairy, grass],
		isNotEffectiveAgainst: [ghost, rock, ground, poison],
		isResistantAgainst: [bug, fairy, fighting, grass, poison],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: [psychic, ground],
		isImmuneAgainstMyAttacks: [steel],
	},
	{
		name: flying,
		isEffectiveAgainst: [bug, fighting, grass],
		isNotEffectiveAgainst: [steel, electric, rock],
		isResistantAgainst: [bug, fighting, grass],
		hasImmunityAgainst: [ground],
		isEffectiveAgainstMe: [electric, ice, rock],
		isImmuneAgainstMyAttacks: [],
	},
];

const Calculator = () => {
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [currentPokemonImage, setCurrentPokemonImage] = useState();
	const [currentPokemonName, setCurrentPokemonName] = useState('');
	const [currentPokemonId, setCurrentPokemonId] = useState('');
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);
	const [showIcons, setShowIcons] = useState(false);
	const [gimmickForms, setGimmickForms] = useState(false);
	const [types_x4, setTypes_x4] = useState([]);
	const [types_x2, setTypes_x2] = useState([]);
	const [types_x1, setTypes_x1] = useState([]);
	const [types_x05, setTypes_x05] = useState([]);
	const [types_x025, setTypes_x025] = useState([]);
	const [types_x0, setTypes_x0] = useState([]);

	const MySwal = withReactContent(Swal);

	const {
		currentFirstSelection,
		currentSecondSelection,
		setSelection,
		deleteSelection,
		setBothTypes,
		deleteBothTypes,
	} = useSelection();

	useEffect(() => {
		deleteSelection();
		deleteBothTypes();
	}, []);

	const handleInputChange = (value) => {
		setInputValue(value);
	};

	const handleShowSettings = () => {
		setShowSettings((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showSettings &&
				settingsRef.current &&
				!settingsRef.current.contains(event.target) &&
				!Swal.isVisible()
			) {
				setShowSettings(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSettings]);

	const handleClick = (type) => {
		if (type === currentFirstSelection || type === currentSecondSelection) {
			type === currentFirstSelection ? deleteSelection(1) : deleteSelection(2);
			resetTypes();
			setIsVisible(false);
		} else {
			let shouldReset = true;
			currentSecondSelection === ''
				? setSelection(type)
				: currentFirstSelection === ''
					? setSelection(type)
					: (shouldReset = false);

			if (shouldReset) {
				resetTypes();
				setIsVisible(false);
			} else {
				toast.error(`Ya estás utilizando 2 tipos. Elimina uno primero`);
			}
		}
	};

	const resetTypes = () => {
		setTypes_x4([]);
		setTypes_x2([]);
		setTypes_x1([]);
		setTypes_x05([]);
		setTypes_x025([]);
		setTypes_x0([]);
	};

	const HandleEffectiveness = (currentType1, currentType2) => {
		pokemonTypes.forEach((type) => {
			let efectiveness = 1;
			type.isEffectiveAgainst.includes(currentType1) && (efectiveness *= 2);
			type.isEffectiveAgainst.includes(currentType2) && (efectiveness *= 2);
			type.isNotEffectiveAgainst.includes(currentType1) && (efectiveness /= 2);
			type.isNotEffectiveAgainst.includes(currentType2) && (efectiveness /= 2);
			type.isImmuneAgainstMyAttacks.includes(currentType1) &&
				(efectiveness *= 0);
			type.isImmuneAgainstMyAttacks.includes(currentType2) &&
				(efectiveness *= 0);

			efectiveness === 4 && setTypes_x4((prev) => [...prev, type.name]);
			efectiveness === 2 && setTypes_x2((prev) => [...prev, type.name]);
			efectiveness === 1 && setTypes_x1((prev) => [...prev, type.name]);

			if (currentType1 === '' && currentType2 === '') {
				setTypes_x1([]);
			}

			efectiveness === 0.5 && setTypes_x05((prev) => [...prev, type.name]);
			efectiveness === 0.25 && setTypes_x025((prev) => [...prev, type.name]);
			efectiveness === 0 && setTypes_x0((prev) => [...prev, type.name]);
		});
	};

	useEffect(() => {
		HandleEffectiveness(currentFirstSelection, currentSecondSelection);
	}, [currentFirstSelection, currentSecondSelection]);

	const searchPokemon = async (selectedPokemon) => {
		setLoading(true);

		try {
			const searchedPokemon = await getPokemon(selectedPokemon);

			searchedPokemon.type_1 = searchedPokemon.type_1.toLowerCase();
			searchedPokemon.type_2 = searchedPokemon.type_2.toLowerCase();

			renderPokemon(
				searchedPokemon.img,
				searchedPokemon.name,
				searchedPokemon.id
			);
			deleteBothTypes();
			if (searchedPokemon.type_2 !== 'ninguno') {
				(searchedPokemon.type_1 !== currentFirstSelection ||
					searchedPokemon.type_2 !== currentSecondSelection) &&
					resetTypes();
				setBothTypes(searchedPokemon.type_1, searchedPokemon.type_2);
			} else {
				resetTypes();
				setSelection(searchedPokemon.type_1);
			}
		} catch (error) {
			setLoading(false);
			setIsVisible(false);
			deleteBothTypes();
			resetTypes();
		}
	};

	const renderPokemon = (url, name, id) => {
		const imgElement = new Image();
		imgElement.src = url;
		imgElement.onload = () => {
			setCurrentPokemonImage(url);
			setCurrentPokemonName(name);
			setCurrentPokemonId(id);
			setIsVisible(true);
			setLoading(false);
		};
	};

	function isArrayEmpty(array) {
		return array.length === 0;
	}

	const pickRandomType = () => {
		const randomIndex = Math.floor(Math.random() * pokemonTypes.length);
		const randomPokemonType = pokemonTypes[randomIndex];
		setSelection(randomPokemonType.name);
	};

	const pickTwoRandomTypes = () => {
		let randomIndex = Math.floor(Math.random() * pokemonTypes.length);
		let randomPokemonType = pokemonTypes[randomIndex];

		let randomIndex2;
		let randomPokemonType2;

		do {
			randomIndex2 = Math.floor(Math.random() * pokemonTypes.length);
			randomPokemonType2 = pokemonTypes[randomIndex2];
		} while (randomPokemonType2.name === randomPokemonType.name);

		setBothTypes(randomPokemonType.name, randomPokemonType2.name);
	};

	const openCalculatorTutorial = () => {
		MySwal.fire({
			title: '¿Cómo funciona la Calculadora Pokemon?',
			html: `Debes elegir uno o dos tipos para que te muestre sus puntos débiles, inmunidades, o fortalezas frente a otros ataques.<br>
			Existe la opción de dejar que se elija al azar, o buscar al Pokemon en cuestión en la Pokedex en caso de que no sepas sus tipos!<br><br>
			Formas Gimmick: Son las formas especiales de los Pokemon (por ej. Mega evoluciones). Se puede elegir verlas o no en la Pokedex.`,
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(69 168 68)',
			confirmButtonText: 'Excelente!',
			cancelButtonText: 'Magnífico!',
		});
	};

	const handleShowIcons = () => {
		setShowIcons((prev) => !prev);
	};

	const handleShowGimmickForms = () => {
		setGimmickForms((prev) => !prev);
	};

	return (
		<div className=' min-h-screen bg-teal-200 pt-16 flex flex-col items-center'>
			<div className='flex justify-center flex-col items-center'>
				<div className='flex items-center justify-center gap-14'>
					<div className='flex justify-center items-center w-6/12 h-[32vh] flex-wrap gap-3 p-8 bg-teal-700 rounded-lg'>
						{pokemonTypes.map((type) => (
							<button
								onClick={() => handleClick(type.name)}
								className={`${type.name} px-1 py-2 my-1 text-white font-bold text-md rounded-lg shadow hover:shadow-black/80 active:scale-95 transition duration-150 capitalize w-[6.5vw] flex justify-center gap-1 `}
								key={type.name}>
								<img
									src={typeLogos[type.name.toLowerCase()]}
									alt={`${type.name} Logo`}
									className='h-[3.5vh] '
								/>
								<span>{type.name}</span>
							</button>
						))}
					</div>

					<div
						className={`w-5/12 h-[32vh] px-6 py-3 rounded-lg ${isVisible ? (currentFirstSelection !== '' ? currentFirstSelection : currentSecondSelection) : 'bg-teal-700'} ${currentFirstSelection === '' && currentSecondSelection === '' && 'bg-teal-700'}`}>
						<div className='flex gap-2 justify-between w-full mb-2'>
							<img
								alt=''
								src={pokedex}
								className='relative h-14'
							/>
							<PokemonSearch
								onInputChange={handleInputChange}
								searchPokemon={() => searchPokemon(inputValue)}
								gimmickForms={gimmickForms}
							/>
						</div>

						{loading ? (
							<ProgressSpinner />
						) : (
							<div
								className={`items-center justify-evenly ${isVisible ? 'flex' : 'hidden'}`}>
								<div className='flex flex-col items-center'>
									<span className='text-3xl text-gray-800 bg-white rounded-lg outline outline-3 outline-white/50 min-w-10/12 p-2 capitalize'>
										{currentPokemonId < 1026 && `#${currentPokemonId} - `}{' '}
										{currentPokemonName.replace(/-/g, ' ')}
									</span>
									<div className='flex gap-2 cursor-default py-2 '>
										<div
											className={`${currentFirstSelection !== '' ? currentFirstSelection : 'hidden'} p-2 border-2 border-white rounded-2xl `}>
											<img
												className={`h-[7vh]`}
												src={typeLogos[currentFirstSelection]}
												alt={`${currentFirstSelection} logo`}
											/>
										</div>

										<div
											className={`${currentSecondSelection !== '' ? currentSecondSelection : 'hidden'} p-2 border-2 border-white rounded-2xl `}>
											<img
												className={`h-[7vh]`}
												src={typeLogos[currentSecondSelection]}
												alt={`${currentSecondSelection} logo`}
											/>
										</div>
									</div>
								</div>
								<img
									alt=''
									src={currentPokemonImage}
									className='h-24'
									loading='lazy'
								/>
							</div>
						)}
					</div>
				</div>
				<div className='bg-teal-700/80 p-8 m-4 rounded-2xl w-4/12 h-2 cursor-default'>
					{currentFirstSelection || currentSecondSelection ? (
						<div className=' flex justify-between items-center w-full h-full'>
							<p className='text-xl text-white font-semibold'>Seleccionados:</p>
							<div className='flex justify-evenly w-8/12'>
								<button
									className={` ${currentFirstSelection !== '' ? `${currentFirstSelection} px-4 py-2 my-1 text-white font-bold text-sm rounded-lg shadow hover:shadow-black/80 capitalize w-[7vw] justify-center items-center flex cursor-pointer hover:bg-red-500 active:scale-95 transition duration-150` : 'hidden'}`}
									onClick={() => handleClick(currentFirstSelection)}>
									<span>{currentFirstSelection}</span>
								</button>
								<button
									className={
										currentSecondSelection !== ''
											? `${currentSecondSelection} px-4 py-2 my-1 text-white font-bold text-sm rounded-lg shadow hover:shadow-black/80 capitalize w-[7vw] justify-center items-center flex cursor-pointer hover:bg-red-500 active:scale-95 transition duration-150`
											: 'hidden'
									}
									onClick={() => handleClick(currentSecondSelection)}>
									<span>{currentSecondSelection}</span>
								</button>
							</div>
						</div>
					) : (
						<div className=' flex justify-evenly items-center w-full h-full'>
							<p className='text-lg text-white font-bold'>
								Selecciona un tipo, o random
							</p>
							<p
								className='text-white font-semibold bg-teal-500 cursor-pointer p-2 rounded-lg hover:bg-teal-400 active:bg-teal-300 active:scale-90 transition '
								onClick={pickRandomType}>
								1 Random
							</p>
							<p
								className='text-white font-semibold bg-teal-500 cursor-pointer p-2 rounded-lg hover:bg-teal-400 active:bg-teal-300 active:scale-90 transition '
								onClick={pickTwoRandomTypes}>
								2 Random
							</p>
						</div>
					)}
				</div>

				<div
					className={`flex justify-evenly gap-4 cursor-default ${currentFirstSelection === '' && currentSecondSelection === '' ? 'hidden' : ''}`}>
					<div
						className={`bg-teal-500  min-h-[43vh] w-[23vw] rounded-lg p-4 ${isArrayEmpty(types_x4) && isArrayEmpty(types_x2) ? 'hidden' : ''}`}>
						<p>Efectivo:</p>
						<div className={`${isArrayEmpty(types_x4) ? 'hidden' : ''}`}>
							<p className='my-3'>x4:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x4.map((type) => (
									<Type
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
						<div className={`${isArrayEmpty(types_x2) ? 'hidden' : ''}`}>
							<p className='my-3'>x2:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x2.map((type) => (
									<Type
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
					</div>
					<div
						className={`bg-teal-500  min-h-[43vh] w-[23vw] rounded-lg p-4 ${isArrayEmpty(types_x1) ? 'hidden' : ''}`}>
						<p>Neutral:</p>
						<p className='my-3'>x1:</p>
						<div className='flex justify-center flex-wrap gap-4'>
							{types_x1.map((type) => (
								<Type
									type={type}
									showIcon={showIcons}
								/>
							))}
						</div>
					</div>
					<div
						className={`bg-teal-500  min-h-[43vh] w-[23vw] rounded-lg p-4 ${isArrayEmpty(types_x05) && isArrayEmpty(types_x025) ? 'hidden' : ''}`}>
						<p>Poco efectivo:</p>
						<div className={`${isArrayEmpty(types_x05) ? 'hidden' : ''}`}>
							<p className='my-3'>x1/2:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x05.map((type) => (
									<Type
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
						<div className={`${isArrayEmpty(types_x025) ? 'hidden' : ''}`}>
							<p className='my-3'>x1/4:</p>
							<div className='flex justify-center flex-wrap gap-4'>
								{types_x025.map((type) => (
									<Type
										type={type}
										showIcon={showIcons}
									/>
								))}
							</div>
						</div>
					</div>

					<div
						className={`bg-teal-500  min-h-[43vh] w-[23vw] rounded-lg p-4 ${isArrayEmpty(types_x0) ? 'hidden' : ''}`}>
						<p>Inmune:</p>
						<p className='my-3'>x0:</p>
						<div className='flex justify-center flex-wrap gap-4'>
							{types_x0.map((type) => (
								<Type
									type={type}
									showIcon={showIcons}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			{showSettings && (
				<div
					ref={settingsRef}
					className='fixed right-0 bottom-0 m-3 bg-blue-500 h-auto w-[20vw] flex flex-col items-center rounded-xl text-white font-medium'>
					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl'
						onClick={() => {
							openCalculatorTutorial();
							setShowSettings(false);
						}}>
						¿Cómo funciona?
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={handleShowIcons}>
						{`Mostrar ${showIcons ? 'nombres' : 'iconos'}`}
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={handleShowGimmickForms}>
						{`Formas Gimmick en Pokedex: ${gimmickForms ? 'SI' : 'NO'} `}
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-b-xl'
						onClick={() => setShowSettings(false)}>
						Cerrar
					</div>
				</div>
			)}
			{!showSettings && (
				<div
					className='w-10 cursor-pointer bg-gray-700 rounded-lg p-2 hover:bg-gray-600 active:scale-95 active:hover:bg-gray-500 transition-all ease-in-out duration-150 absolute right-4 bottom-4'
					onClick={handleShowSettings}>
					<img
						src={settings}
						alt='settings'
					/>
				</div>
			)}
		</div>
	);
};

export default Calculator;
