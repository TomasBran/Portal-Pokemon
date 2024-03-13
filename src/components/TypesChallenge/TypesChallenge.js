import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import DroppableArea from './Dnd/DropContainer';
import { typeLogos } from './Dnd/DraggableItem';
import { capitalizeFirstLetter } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const types = {
	fire: {
		id: 1,
		name: 'fire',
		isEffectiveAgainst: ['grass', 'ice', 'steel', 'bug'],
		isNotEffectiveAgainst: ['water', 'dragon', 'fire', 'rock'],
		isResistantAgainst: ['steel', 'bug', 'fire', 'fairy', 'ice', 'grass'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['water', 'rock', 'ground'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'psychic',
			'dragon',
			'electric',
			'ghost',
			'fighting',
			'normal',
			'dark',
			'poison',
			'flying',
		],
	},
	water: {
		id: 2,
		name: 'water',
		isEffectiveAgainst: ['fire', 'rock', 'ground'],
		isNotEffectiveAgainst: ['water', 'dragon', 'grass'],
		isResistantAgainst: ['steel', 'water', 'fire', 'ice'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['electric', 'grass'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'psychic',
			'bug',
			'dragon',
			'ghost',
			'fairy',
			'fighting',
			'normal',
			'rock',
			'dark',
			'ground',
			'poison',
			'flying',
		],
	},
	grass: {
		id: 3,
		name: 'grass',
		isEffectiveAgainst: ['water', 'rock', 'ground'],
		isNotEffectiveAgainst: [
			'steel',
			'bug',
			'dragon',
			'fire',
			'grass',
			'poison',
			'flying',
		],
		isResistantAgainst: ['water', 'electric', 'grass', 'ground'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['bug', 'fire', 'ice', 'poison', 'flying'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'psychic',
			'steel',
			'dragon',
			'ghost',
			'fairy',
			'fighting',
			'normal',
			'rock',
			'dark',
		],
	},
	psychic: {
		id: 4,
		name: 'psychic',
		isEffectiveAgainst: ['fighting', 'poison'],
		isNotEffectiveAgainst: ['steel', 'psychic'],
		isResistantAgainst: ['fighting', 'psychic'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['bug', 'ghost', 'dark'],
		isImmuneAgainstMyAttacks: ['dark'],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'steel',
			'dragon',
			'electric',
			'fairy',
			'ice',
			'normal',
			'rock',
			'ground',
			'poison',
			'flying',
		],
	},
	steel: {
		id: 5,
		name: 'steel',
		isEffectiveAgainst: ['fairy', 'ice', 'rock'],
		isNotEffectiveAgainst: ['steel', 'water', 'electric', 'fire'],
		isResistantAgainst: [
			'steel',
			'bug',
			'dragon',
			'fairy',
			'ice',
			'normal',
			'grass',
			'psychic',
			'rock',
			'flying',
		],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['fire', 'fighting', 'ground'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: ['water', 'electric', 'ghost', 'dark'],
	},
	bug: {
		id: 6,
		name: 'bug',
		isEffectiveAgainst: ['grass', 'psychic', 'dark'],
		isNotEffectiveAgainst: [
			'steel',
			'ghost',
			'fire',
			'fairy',
			'fighting',
			'poison',
			'flying',
		],
		isResistantAgainst: ['fighting', 'grass', 'ground'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['fire', 'rock', 'flying'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'water',
			'psychic',
			'steel',
			'bug',
			'dragon',
			'electric',
			'ghost',
			'fairy',
			'ice',
			'normal',
			'dark',
			'poison',
		],
	},
	dragon: {
		id: 7,
		name: 'dragon',
		isEffectiveAgainst: ['dragon'],
		isNotEffectiveAgainst: ['steel'],
		isResistantAgainst: ['water', 'electric', 'fire', 'grass'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['dragon', 'fairy', 'ice'],
		isImmuneAgainstMyAttacks: ['fairy'],
		isNeutralAgainst: [
			'psychic',
			'steel',
			'bug',
			'ghost',
			'fighting',
			'normal',
			'rock',
			'dark',
			'ground',
			'poison',
			'flying',
		],
	},
	electric: {
		id: 8,
		name: 'electric',
		isEffectiveAgainst: ['water', 'flying'],
		isNotEffectiveAgainst: ['dragon', 'electric', 'grass'],
		isResistantAgainst: ['steel', 'electric', 'flying'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['ground'],
		isImmuneAgainstMyAttacks: ['ground'],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'psychic',
			'bug',
			'dragon',
			'ghost',
			'fairy',
			'ice',
			'fighting',
			'normal',
			'rock',
			'dark',
			'poison',
			'flying',
		],
	},
	ghost: {
		id: 9,
		name: 'ghost',
		isEffectiveAgainst: ['ghost', 'psychic'],
		isNotEffectiveAgainst: ['dark'],
		isResistantAgainst: ['bug', 'poison'],
		hasImmunityAgainst: ['fighting', 'normal'],
		isEffectiveAgainstMe: ['ghost', 'dark'],
		isImmuneAgainstMyAttacks: ['normal'],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'psychic',
			'steel',
			'dragon',
			'electric',
			'fairy',
			'ice',
			'rock',
			'ground',
			'flying',
		],
	},
	fairy: {
		id: 10,
		name: 'fairy',
		isEffectiveAgainst: ['dragon', 'fighting', 'dark'],
		isNotEffectiveAgainst: ['steel', 'fire', 'poison'],
		isResistantAgainst: ['bug', 'fighting', 'dark'],
		hasImmunityAgainst: ['dragon'],
		isEffectiveAgainstMe: ['steel', 'poison'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'psychic',
			'electric',
			'ghost',
			'ice',
			'normal',
			'rock',
			'ground',
			'poison',
			'flying',
		],
	},
	ice: {
		id: 11,
		name: 'ice',
		isEffectiveAgainst: ['dragon', 'grass', 'ground', 'flying'],
		isNotEffectiveAgainst: ['steel', 'water', 'fire', 'ice'],
		isResistantAgainst: ['ice'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['steel', 'fire', 'fighting', 'rock'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'fire',
			'water',
			'psychic',
			'bug',
			'dragon',
			'electric',
			'ghost',
			'fairy',
			'normal',
			'dark',
			'ground',
			'poison',
			'flying',
		],
	},
	fighting: {
		id: 12,
		name: 'fighting',
		isEffectiveAgainst: ['steel', 'ice', 'normal', 'rock', 'dark'],
		isNotEffectiveAgainst: ['bug', 'fairy', 'psychic', 'poison', 'flying'],
		isResistantAgainst: ['bug', 'rock', 'dark'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['fairy', 'psychic', 'flying'],
		isImmuneAgainstMyAttacks: ['ghost'],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'steel',
			'dragon',
			'electric',
			'ghost',
			'ice',
			'normal',
			'rock',
			'ground',
			'poison',
		],
	},
	normal: {
		id: 13,
		name: 'normal',
		isEffectiveAgainst: [],
		isNotEffectiveAgainst: ['steel', 'rock'],
		isResistantAgainst: [],
		hasImmunityAgainst: ['ghost'],
		isEffectiveAgainstMe: ['fighting'],
		isImmuneAgainstMyAttacks: ['ghost'],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'psychic',
			'steel',
			'bug',
			'dragon',
			'electric',
			'fairy',
			'ice',
			'rock',
			'dark',
			'ground',
			'poison',
			'flying',
		],
	},
	rock: {
		id: 14,
		name: 'rock',
		isEffectiveAgainst: ['bug', 'fire', 'ice', 'flying'],
		isNotEffectiveAgainst: ['steel', 'fighting', 'ground'],
		isResistantAgainst: ['fire', 'normal', 'poison', 'flying'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['steel', 'water', 'fighting', 'grass', 'ground'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'psychic',
			'bug',
			'dragon',
			'electric',
			'ghost',
			'fairy',
			'ice',
			'rock',
			'dark',
		],
	},
	dark: {
		id: 15,
		name: 'dark',
		isEffectiveAgainst: ['ghost', 'psychic'],
		isNotEffectiveAgainst: ['fairy', 'fighting', 'dark'],
		isResistantAgainst: ['ghost', 'dark'],
		hasImmunityAgainst: ['psychic'],
		isEffectiveAgainstMe: ['bug', 'fairy', 'fighting'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'fire',
			'water',
			'grass',
			'steel',
			'dragon',
			'electric',
			'ice',
			'normal',
			'rock',
			'ground',
			'poison',
			'flying',
		],
	},
	ground: {
		id: 16,
		name: 'ground',
		isEffectiveAgainst: ['steel', 'electric', 'fire', 'rock', 'poison'],
		isNotEffectiveAgainst: ['bug', 'grass'],
		isResistantAgainst: ['rock', 'poison'],
		hasImmunityAgainst: ['electric'],
		isEffectiveAgainstMe: ['water', 'ice', 'grass'],
		isImmuneAgainstMyAttacks: ['flying'],
		isNeutralAgainst: [
			'fire',
			'psychic',
			'steel',
			'bug',
			'dragon',
			'ghost',
			'fairy',
			'fighting',
			'normal',
			'dark',
			'poison',
			'flying',
		],
	},
	poison: {
		id: 17,
		name: 'poison',
		isEffectiveAgainst: ['fairy', 'grass'],
		isNotEffectiveAgainst: ['ghost', 'rock', 'ground', 'poison'],
		isResistantAgainst: ['bug', 'fairy', 'fighting', 'grass', 'poison'],
		hasImmunityAgainst: [],
		isEffectiveAgainstMe: ['psychic', 'ground'],
		isImmuneAgainstMyAttacks: ['steel'],
		isNeutralAgainst: [
			'fire',
			'water',
			'steel',
			'dragon',
			'electric',
			'ghost',
			'ice',
			'normal',
			'rock',
			'dark',
			'flying',
		],
	},
	flying: {
		id: 18,
		name: 'flying',
		isEffectiveAgainst: ['bug', 'fighting', 'grass'],
		isNotEffectiveAgainst: ['steel', 'electric', 'rock'],
		isResistantAgainst: ['bug', 'fighting', 'grass'],
		hasImmunityAgainst: ['ground'],
		isEffectiveAgainstMe: ['electric', 'ice', 'rock'],
		isImmuneAgainstMyAttacks: [],
		isNeutralAgainst: [
			'fire',
			'water',
			'psychic',
			'steel',
			'dragon',
			'ghost',
			'fairy',
			'normal',
			'dark',
			'poison',
		],
	},
};

const zonesData = [
	{ id: 'zone_1', title: 'Efectivo' },
	{ id: 'zone_2', title: 'Neutral' },
	{ id: 'zone_3', title: 'Poco efectivo' },
	{ id: 'zone_4', title: 'Inmune' },
];

const TypesChallenge = () => {
	const MySwal = withReactContent(Swal);

	const [gameStarted, setGameStarted] = useState(false);
	const [gameEnded, setGameEnded] = useState(false);
	const [originalType, setOriginalType] = useState('');
	const [correctZone, setCorrectZone] = useState({
		zone_1: undefined,
		zone_2: undefined,
		zone_3: undefined,
		zone_4: undefined,
	});

	const [zones, setZones] = useState({
		main: Object.values(types).map((tipo) => ({
			id: tipo.id,
			name: `${capitalizeFirstLetter(tipo.name)}`,
		})),
		...Object.fromEntries(zonesData.map((zone) => [zone.id, []])),
	});

	const handleDrop = (item, targetZone) => {
		setZones((prevZones) => {
			const updatedZones = { ...prevZones };

			Object.keys(updatedZones).forEach((zone) => {
				updatedZones[zone] = updatedZones[zone].filter(
					(zoneItem) => zoneItem.id !== item.id
				);
			});

			updatedZones[targetZone] = [...updatedZones[targetZone], item];

			return updatedZones;
		});
	};

	const startNewGame = () => {
		setGameStarted(true);
		setZones({
			main: Object.values(types).map((tipo) => ({
				id: tipo.id,
				name: `${capitalizeFirstLetter(tipo.name)}`,
			})),
			...Object.fromEntries(zonesData.map((zone) => [zone.id, []])),
		});

		setOriginalType(getRandomType);
	};

	const getRandomType = () => {
		const typeNames = Object.keys(types);
		const randomIndex = Math.floor(Math.random() * typeNames.length);
		return capitalizeFirstLetter(typeNames[randomIndex]);
	};

	const handleGuess = async () => {
		if (zones.main.length !== 0) {
			toast.error(`Aun hay tipos sin asignar.`);
			return;
		}

		const result = checkZones(zones);

		let response;

		if (result) {
			response = await MySwal.fire({
				title: `Excelente!`,
				text: `Hiciste todo correcto al 100%`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				confirmButtonText: 'Volver a jugar',
				cancelButtonText: 'Ver el tablero',
				width: '70vw',
			});
		} else {
			response = await MySwal.fire({
				title: `Todavia te falta.`,
				text: `Tuviste algunos errores. A practicar!`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				confirmButtonText: 'Volver a empezar',
				cancelButtonText: 'Ver el tablero',
				width: '70vw',
			});
		}

		if (!response.isConfirmed) {
			setGameEnded(true);
		}
	};

	useEffect(() => {
		if (gameEnded) {
			checkZones(zones);
		}
	}, [handleDrop]);

	useEffect(() => {
		setCorrectZone({
			zone_1: undefined,
			zone_2: undefined,
			zone_3: undefined,
			zone_4: undefined,
		});
	}, [gameStarted]);

	const handleRestart = async () => {
		let response = await MySwal.fire({
			title: `Queres reiniciar la partida?`,
			text: `Si tenias una racha, volvera a 0.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: 'Reiniciar',
			cancelButtonText: 'Cancelar',
			width: '70vw',
		});

		if (response.isConfirmed) {
			setGameEnded(false);
			startNewGame();
		}
	};

	const checkZones = (zones) => {
		const result = {
			zone_1: false,
			zone_2: false,
			zone_3: false,
			zone_4: false,
		};

		const typeChosen = types[originalType.toLowerCase()];

		const elementsInZone1 = zones.zone_1.map((element) =>
			element.name.toLowerCase()
		);
		const elementsInZone2 = zones.zone_2.map((element) =>
			element.name.toLowerCase()
		);
		const elementsInZone3 = zones.zone_3.map((element) =>
			element.name.toLowerCase()
		);
		const elementsInZone4 = zones.zone_4.map((element) =>
			element.name.toLowerCase()
		);

		result.zone_1 =
			elementsInZone1.length === typeChosen.isEffectiveAgainstMe.length &&
			typeChosen.isEffectiveAgainstMe.every((element) =>
				elementsInZone1.includes(element)
			);

		result.zone_2 =
			elementsInZone2.length === typeChosen.isNeutralAgainst.length &&
			typeChosen.isNeutralAgainst.every((element) =>
				elementsInZone2.includes(element)
			);

		result.zone_3 =
			elementsInZone3.length === typeChosen.isResistantAgainst.length &&
			typeChosen.isResistantAgainst.every((element) =>
				elementsInZone3.includes(element)
			);

		result.zone_4 =
			elementsInZone4.length === typeChosen.hasImmunityAgainst.length &&
			typeChosen.hasImmunityAgainst.every((element) =>
				elementsInZone4.includes(element)
			);

		setCorrectZone(result);

		return Object.values(result).every((value) => value === true);
	};

	return (
		<div className='pt-16 p-6 flex flex-col gap-10 justify-start bg-zinc-300 h-screen'>
			<div className='w-full m-4 h-2/6 '>
				<div className='h-1/6 flex justify-center gap-2 items-center mb-4'>
					{gameStarted ? (
						<div className='h-[6vh] w-full flex justify-center items-center gap-2'>
							<h2 className='font-bold text-lg'>Tipo seleccionado:</h2>

							<div
								className={`border-2 text-sm font-bold border-white p-2 m-2 cursor-default w-1/12 h-full flex justify-center items-center text-white font-medium rounded-lg gap-1 ${originalType.toLowerCase()}`}>
								<img
									src={typeLogos[originalType.toLowerCase()]}
									alt={`${originalType} Logo`}
									className='h-[3.5vh]'
								/>
								{originalType}
							</div>
							<button
								className='bg-indigo-500 disabled:opacity-50 h-full px-6 rounded-lg text-white font-bold enabled:cursor-pointer enabled:hover:bg-indigo-600 enabled:active:bg-indigo-700 enabled:active:scale-95 flex justify-center items-center'
								disabled={gameEnded}
								onClick={handleGuess}>
								Adivinar
							</button>

							{gameEnded && (
								<div
									className='bg-indigo-500 h-full px-6 rounded-lg text-white font-bold cursor-pointer hover:bg-indigo-600 active:bg-indigo-700 active:scale-95 flex justify-center items-center'
									onClick={handleRestart}>
									Reiniciar
								</div>
							)}
						</div>
					) : (
						<div
							className='bg-indigo-500 p-3 rounded-lg text-white font-bold cursor-pointer hover:bg-indigo-600 active:bg-indigo-700 active:scale-95'
							onClick={startNewGame}>
							Comenzar partida
						</div>
					)}
				</div>
				<div className='bg-white w-full h-5/6 flex rounded-lg'>
					<DroppableArea
						id='main'
						items={zones.main}
						onDrop={handleDrop}
						enabledContainer={true}
					/>
				</div>
			</div>

			{gameStarted && (
				<div className='w-full h-3/12 gap-4 flex flex-wrap justify-center'>
					{zonesData.map((zone) => (
						<div
							key={zone.id}
							className='w-[24%] h-full flex flex-col gap-1'>
							<div
								className={`h-1/6 text-lg font-medium border-black border-2 rounded-lg flex justify-center items-center ${
									correctZone[zone.id] === undefined
										? 'bg-white'
										: correctZone[zone.id]
											? 'bg-green-300'
											: 'bg-red-300'
								}`}>
								{zone.title}
							</div>
							<div className='bg-white w-full rounded-lg h-[45vh] '>
								<DroppableArea
									id={zone.id}
									items={zones[zone.id] || []}
									onDrop={handleDrop}
									enabledContainer={gameStarted}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TypesChallenge;
