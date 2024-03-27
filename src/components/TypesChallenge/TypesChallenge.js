import { toast } from 'sonner';
import React, { useEffect, useRef, useState } from 'react';
import DroppableArea from './Dnd/DropContainer';
import { typeLogos } from './Dnd/DraggableItem';
import { capitalizeFirstLetter } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { types } from './types';
import settings from '../../assets/settings.png';
import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '../../utils/localStorage';

const zonesData = [
	{ id: 'zone_1', title: 'Efectivo' },
	{ id: 'zone_2', title: 'Neutral' },
	{ id: 'zone_3', title: 'Poco efectivo' },
	{ id: 'zone_4', title: 'Inmune' },
];

const TypesChallenge = () => {
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //
	const testing = true; // PONER FALSE AL NO TESTEAR
	if (testing) console.log('EL MODO TESTING ESTA ON');
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //

	const [streak, setStreak] = useState(0);

	if (getFromLocalStorage('types_streak') === null) {
		saveToLocalStorage('types_streak', 0);
	}
	if (getFromLocalStorage('types_highscore') === null) {
		saveToLocalStorage('types_highscore', 0);
	}

	useEffect(() => {
		setStreak(getFromLocalStorage('types_streak'));
	}, []);

	const MySwal = withReactContent(Swal);
	const settingsRef = useRef(null);

	const [gameStarted, setGameStarted] = useState(false);
	const [gameEnded, setGameEnded] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
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

		if (testing) {
			setOriginalType('Normal');
			return;
		}
		setOriginalType(getRandomType);
	};

	const getRandomType = () => {
		const typeNames = Object.keys(types);
		const randomIndex = Math.floor(Math.random() * typeNames.length);
		return capitalizeFirstLetter(typeNames[randomIndex]);
	};

	const handleShowSettings = () => {
		setShowSettings((prev) => !prev);
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
				text: `Hiciste todo correcto al 100%. Racha actual: ${streak + 1}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				confirmButtonText: 'Volver a jugar',
				cancelButtonText: 'Ver el tablero',
				width: '70vw',
			});
			setStreak((prev) => prev + 1);
			saveToLocalStorage('types_streak', streak + 1);
			checkHighscore(streak + 1);
		} else {
			response = await MySwal.fire({
				title: `Todavia te falta.`,
				text: `Tuviste algunos errores. A practicar! Racha actual: 0`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				confirmButtonText: 'Volver a jugar',
				cancelButtonText: 'Ver el tablero',
				width: '70vw',
			});
			setStreak(0);
			saveToLocalStorage('types_streak', 0);
		}

		if (response.isConfirmed) {
			handleRestart();
			return;
		}
		setGameEnded(true);
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
		setGameEnded(false);
		setGameStarted(false);
	};

	const checkHighscore = (newScore) => {
		const currentHighscore = getFromLocalStorage('types_highscore');

		if (newScore > currentHighscore) {
			saveToLocalStorage('types_highscore', newScore);
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
			elementsInZone2.length === typeChosen.isNeutralAgainstMe.length &&
			typeChosen.isNeutralAgainstMe.every((element) =>
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

	const handleZoneClick = (targetZone) => {
		const mainItems = zones.main;
		const existingItems = zones[targetZone];

		if (mainItems.length === 0) {
			setZones((prevZones) => ({
				...prevZones,
				main: existingItems,
				[targetZone]: [],
			}));
		} else {
			setZones((prevZones) => ({
				...prevZones,
				main: [],
				[targetZone]: [...existingItems, ...mainItems],
			}));
		}
	};

	const openTypesChallengeTutorial = () => {
		setShowSettings(false);
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Debes posicionar todos los tipos en su posición correcta.<br>
			Por ejemplo, si me toca el tipo <span class='font-bold text-red-500'>Fuego</span> yo ya se que uno de los tipos que le pega efectivo es <span class='font-bold text-blue-500'>Agua</span>, y con esa premisa debo completar toda la tabla del tipo que me toque.<br>
			Si presionas "Adivinar" te dirá si está bien o mal y te dejará ver el tablero. Si seleccionas esta última opción podrás reacomodar los tipos para ver en qué te equivocaste.<br>
			Si presionas en alguna de las zonas, se enviarán todos los tipos que aún no estén asignados. En caso de no haber ninguno, se desasignarán todos los tipos de esa zona.
			<br><br><br><br>
			<span class='text-sm text-gray-400'>
			Psst! No me acabas de dar una pista si me toca el tipo Fuego?
			</span><br>
			<span class='text-sm text-black'>
			Si, pero si no sabías esa debilidad, capaz incluso necesites otra pista.
			</span>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	return (
		<div
			className={`${gameStarted ? 'justify-start' : 'justify-center'} pt-16 p-6 flex flex-col gap-10 bg-zinc-200 h-screen`}>
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
						<div className='flex flex-col gap-4'>
							<div
								className='bg-indigo-500 py-6 px-10 rounded-lg text-white font-bold cursor-pointer hover:bg-indigo-600 active:bg-indigo-700 active:scale-95'
								onClick={startNewGame}>
								Comenzar partida
							</div>
							<div className='text-xl '>
								{`Racha actual: ${getFromLocalStorage('types_streak')}`}
							</div>
							<div className='text-xl '>
								{`Racha más larga: ${getFromLocalStorage('types_highscore')}`}
							</div>
						</div>
					)}
				</div>
				{gameStarted && (
					<div className='bg-white w-full h-5/6 flex rounded-lg'>
						<DroppableArea
							id='main'
							items={zones.main}
							onDrop={handleDrop}
							enabledContainer={true}
						/>
					</div>
				)}
			</div>

			{gameStarted && (
				<div className='w-full h-3/12 gap-4 flex flex-wrap justify-center'>
					{zonesData.map((zone) => (
						<div
							key={zone.id}
							className='w-[24%] h-full flex flex-col gap-1'>
							<div
								onClick={() => handleZoneClick(zone.id)}
								className={`h-1/6 text-lg font-medium border-black border-2 rounded-lg flex justify-center items-center 
								${!gameEnded ? 'hover:bg-blue-400 cursor-pointer' : ''}

								${
									correctZone[zone.id] === undefined
										? 'bg-white'
										: correctZone[zone.id]
											? 'bg-green-300'
											: 'bg-red-300'
								}`}>
								{zone.title}
							</div>
							<div className='w-full rounded-lg h-[45vh] '>
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
			<div className='fixed right-0 bottom-0 m-4'>
				{showSettings && (
					<div
						ref={settingsRef}
						className='fixed right-0 bottom-0 m-3 bg-blue-500 h-auto w-[20vw] flex flex-col items-center rounded-xl text-white font-medium'>
						<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl'></div>

						<div
							className='w-full py-2 rounded-t-xl hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={openTypesChallengeTutorial}>
							¿Cómo se juega?
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
						className='w-10 cursor-pointer bg-gray-700 rounded-lg p-2 hover:bg-gray-600 active:scale-95 active:hover:bg-gray-500 transition-all ease-in-out duration-150'
						onClick={handleShowSettings}>
						<img
							src={settings}
							alt='settings'
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default TypesChallenge;
