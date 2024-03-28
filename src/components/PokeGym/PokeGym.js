import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import settings from '../../assets/settings.png';
import TeamContainer from '../TeamContainer/TeamContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { generateRandomPokemonNumber } from '../../utils/functions';
import { getPokemon } from '../../services/pokemon';
import Generations from '../Generations/Generations';
import { ProgressSpinner } from 'primereact/progressspinner';
import pokeball from '../../assets/pokeball.png';
import { toast } from 'sonner';
import {
	getFromLocalStorage,
	saveToLocalStorage,
} from '../../utils/localStorage';

const PokeGym = () => {
	const testing = false; //CAMBIAR CUANDO ESTOY TESTEANDO

	if (getFromLocalStorage('gym_streak') === null) {
		saveToLocalStorage('gym_streak', 0);
	}
	if (getFromLocalStorage('gym_stats') === null) {
		saveToLocalStorage('gym_stats', {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		});
	}

	const MySwal = withReactContent(Swal);

	const [isLoading, setIsLoading] = useState(false);
	const [currentGenerations, setCurrentGenerations] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);
	const [currentTeam, setCurrentTeam] = useState([]);
	const [chosenTeam, setChosenTeam] = useState([]);
	const [rerollsLeft, setRerollsLeft] = useState(testing ? 100 : 4);
	const [rollButtonText, setRollButtonText] = useState(
		`Generar ${6 - chosenTeam.length} pokemon (3 REROLLS)`
	);
	const [showSettings, setShowSettings] = useState(false);
	const [hardmode, setHardmode] = useState(false);
	const [luckActive, setLuckActive] = useState(true);
	const settingsRef = useRef(null);

	const [shouldDisable, setShouldDisable] = useState(false);

	const lockInPokemon = useCallback(
		(pokemon) => {
			if (pokemon.hasBeenChosen === true) {
				pokemon.hasBeenChosen = false;
				setChosenTeam((previousTeam) =>
					previousTeam.filter((poke) => poke.name !== pokemon.name)
				);
				return;
			}

			pokemon.hasBeenChosen = true;
			if (!chosenTeam.find((element) => element.name === pokemon.name)) {
				setChosenTeam((team) => [...team, pokemon]);
			}
		},
		[chosenTeam, setChosenTeam]
	);

	useEffect(() => {
		const handleKeyPress = (event) => {
			const key = event.key;

			switch (key) {
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
					if (currentTeam.length >= Number(key)) {
						lockInPokemon(currentTeam[Number(key) - 1]);
					}
					break;
				case 'r':
					if (rollButtonText !== 'Iniciar Juego') {
						resetGame(true);
					}
					break;
				case 'p':
					if (chosenTeam.length === 6) {
						fightGymLeaders();
					} else {
						toast.error(
							`Necesitas ${6 - chosenTeam.length} Pokemon más para poder pelear`
						);
					}
					break;

				default:
					break;
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [currentTeam, lockInPokemon, shouldDisable, rollButtonText]);

	const getGenerations = (childGenerations) => {
		console.log('aso algo');
		setCurrentGenerations(childGenerations);
	};

	const updatePokemonTeam = async () => {
		setIsLoading(true);

		const gymButton = document.getElementById('fight-button');
		gymButton.disabled = true;
		const tempText = rollButtonText;

		setTimeout(() => {
			gymButton.textContent = 'Espera';
		}, 1);

		setCurrentTeam([]);
		setRerollsLeft((prev) => prev - 1);

		const imagesToLoad = 6 - chosenTeam.length;
		let loadedImages = 0;
		let currentGivenTeam = [];
		for (let index = 0; index < imagesToLoad; index++) {
			const randomNum = generateRandomPokemonNumber(
				currentGenerations,
				chosenTeam,
				currentGivenTeam
			);
			currentGivenTeam.push(randomNum);

			const newPokemon = await getPokemon(randomNum);

			setCurrentTeam((team) => [...team, newPokemon]);

			const img = new Image();
			img.src = newPokemon.img;
			img.onload = () => {
				loadedImages++;
				if (loadedImages === imagesToLoad) {
					setIsLoading(false);
					setShouldDisable(true);
					setRollButtonText(tempText);
				}
			};
		}
	};

	useEffect(() => {
		handleButtonText();
	}, [chosenTeam, updatePokemonTeam, setShouldDisable]);

	const handleStars = (power) => {
		let stars, halfStars;

		if (power > 560) {
			stars = 3;
			halfStars = 0;
		} else if (power > 500) {
			stars = 2;
			halfStars = 1;
		} else if (power > 375) {
			stars = 2;
			halfStars = 0;
		} else if (power > 300) {
			stars = 1;
			halfStars = 1;
		} else if (power > 200) {
			stars = 1;
			halfStars = 0;
		} else {
			stars = 0;
			halfStars = 1;
		}

		const starsArray = Array.from({ length: 3 }, (_, index) => {
			if (index < stars) {
				return <BsStarFill key={index} />;
			} else if (index === stars && halfStars) {
				return <BsStarHalf key={index} />;
			} else {
				return <BsStar key={index} />;
			}
		});

		return <div className='flex gap-1'>{starsArray}</div>;
	};

	const handleButtonText = () => {
		if (rerollsLeft === 4 || rerollsLeft === 100) {
			setRollButtonText('Iniciar Juego');
			setShouldDisable(false);
			return;
		}
		if (rerollsLeft === 0) {
			setRollButtonText('NO QUEDAN REROLLS');
			setShouldDisable(true);
			return;
		}
		if (chosenTeam.length < 6) {
			setRollButtonText(
				`Generar ${6 - chosenTeam.length} pokemon (${rerollsLeft} ${rerollsLeft !== 1 ? 'RE-ROLLS' : 'RE-ROLL'})`
			);
			setShouldDisable(false);
		} else {
			setRollButtonText('EQUIPO COMPLETO');
			setShouldDisable(true);
		}
	};

	const getRandomArbitrary = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	const fightGymLeaders = async () => {
		let power = 0;
		let beatenGyms;
		let excessPower;
		let finalText = `Gimnasios vencidos: `;
		chosenTeam.forEach((element) => {
			power += element.power;
		});
		const minLuckValue = 97; // 0.97
		const maxLuckValue = 105; // 1.05
		const randomEnhancer = luckActive
			? getRandomArbitrary(minLuckValue / 100, maxLuckValue / 100)
			: 1;
		const bonusLuck = (randomEnhancer * 100).toFixed(0) - 100;

		power *= randomEnhancer;

		if (power >= 3200) {
			beatenGyms = 8;
			excessPower = Math.round((power - 3200).toFixed(0) / 9.5);
			finalText = `Felicitaciones! Conquistaste los <span style="color: green;">${beatenGyms}</span> gimnasios. Un maestro pokemon!\n- Te sobró un <span style="color: green;">${excessPower}%</span> de poder.`;
		} else if (power >= 3000) {
			beatenGyms = 6 + Math.floor((power - 3000) / 100);
			excessPower = (power - 3000) % 100; // MOSTRAR EL PROGRESO
			// excessPower = (power % 100 === 0) ? 0 : 100 - (power % 100); // MOSTRAR EL RESTANTE
			finalText += `<span style="color: green;">${beatenGyms}</span>. Impresionante!`;
		} else {
			beatenGyms = 1 + Math.floor((power - 2250) / 150);
			if (beatenGyms <= 0) {
				beatenGyms = 0;
			}
			finalText += `<span style="color: red;">${beatenGyms}.</span>`;
			excessPower = (((power - 2250) % 150) / 150) * 100; // MOSTRAR PROGRESO
			// excessPower = (((power-2250) % 150 === 0) ? 0 : 150 - ((power-2250) % 150))/150*100; // MOSTRAR RESTANTE

			if (beatenGyms >= 4) {
				finalText += ' Nada mal.';
			} else {
				finalText += ' Aun queda trabajo por hacer.';
			}
			if (beatenGyms === 0) {
				excessPower = ((2250 - power) / 2250) * 100;
				finalText += `\nTe faltó un <span style="color: blue;">~${excessPower.toFixed(0)}%</span> de progreso para conseguir la primera medalla.`;
			}
		}

		finalText += `${beatenGyms !== 8 && beatenGyms !== 0 ? `\n- Progreso hacia la ${beatenGyms + 1}° medalla: <span style="color: blue;">~${excessPower.toFixed(0)}%</span>.` : ''}
        ${luckActive ? `- Bonus Suerte: <span style="color: ${bonusLuck === 0 ? 'blue' : bonusLuck >= 0 ? 'green' : 'red'};">${bonusLuck}%</span>` : ''}`;

		await MySwal.fire({
			title: finalText,
			text: `Tu equipo fue: ${chosenTeam.map((pokemon) => `${pokemon.name} ~${((pokemon.power / power) * 100).toFixed(0)}%`).join(' | ')}`,
			icon: 'success',
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: 'Volver a empezar',
			width: '70vw',
		});
		updateGymStats(hardmode, beatenGyms);
		resetGame(false);
	};

	const resetGame = async (shouldAsk) => {
		let result = false;
		if (shouldAsk && !testing) {
			result = await MySwal.fire({
				title: '¿Querés reiniciar el juego?',
				text: 'Esto borrará todos los pokemon elegidos y ofrecidos',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(99 102 241)',
				cancelButtonColor: 'rgb(239 68 68)',
				cancelButtonText: 'Cancelar',
				confirmButtonText: 'Reiniciar',
			});
		}
		if (result.isConfirmed) {
			updateGymResetNumber();
		}

		if (result.isConfirmed || !shouldAsk || testing) {
			setChosenTeam([]);
			setCurrentTeam([]);
			setRerollsLeft(testing ? 100 : 4);
			setRollButtonText('Iniciar Juego');
			setShouldDisable(false);
		}
	};

	const updateGymResetNumber = () => {
		const gymStats = getFromLocalStorage('gym_stats') || {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		};

		gymStats.games_restarted++;

		saveToLocalStorage('gym_stats', gymStats);
	};

	const updateGymStats = (isHardmodeEnabled, badges) => {
		const gymStats = getFromLocalStorage('gym_stats') || {
			easymode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			hardmode_badges: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
			games_restarted: 0,
		};

		const badgesMode = isHardmodeEnabled
			? gymStats.hardmode_badges
			: gymStats.easymode_badges;

		badgesMode[badges]++;

		saveToLocalStorage('gym_stats', gymStats);
	};

	const handleHardMode = async () => {
		let result = await MySwal.fire({
			title: '¿Querés cambiar la dificultad?',
			text: 'En el modo difícil no se puede ver el poder de los Pokemon. Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			cancelButtonText: 'Cancelar',
			confirmButtonText: `${hardmode ? 'Cambiar a normal' : 'Cambiar a difícil'}`,
		});

		if (result.isConfirmed) {
			setHardmode((prev) => !prev);
			resetGame(false);
			toast.warning(`Modo difícil ${!hardmode ? 'activado' : 'desactivado'}.`);
		}
	};

	const handleLuckActive = async () => {
		let result = await MySwal.fire({
			title: `¿Querés ${luckActive ? 'desactivar' : 'activar'} la suerte?`,
			text: 'El factor suerte varía al azar entre -3% y +5%. Si comenzaste una partida, se reiniciará.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
			cancelButtonText: 'Cancelar',
			confirmButtonText: `${luckActive ? 'Desactivar' : 'Activar'}`,
		});

		if (result.isConfirmed) {
			setLuckActive((prev) => !prev);
			resetGame(false);
			toast.warning(`Suerte ${!luckActive ? 'activada' : 'desactivada'}.`);
		}
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

	const openGymTutorial = () => {
		setShowSettings(false);
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Paso 1: Dale a Iniciar juego.<br>
			Paso 2: Se te ofrecerán 6 Pokemon, puedes elegir la cantidad que quieras.<br>
			Paso 3: Si aun no completaste el equipo de 6, tendrás hasta 3 rerolls.<br>
			Paso 4: Pelea y gana las 8 medallas!!<br><br>
			Tip: Puedes activar/desactivar el modo difícil y la suerte en las opciones.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	const openFAQ = () => {
		setShowSettings(false);
		MySwal.fire({
			title: 'Preguntas Frecuentes',
			html: `<span class='font-bold text-2xl'>¿Como se juega?</span><br>En las opciones está el tutorial.<br><br>
			<span class='font-bold text-2xl'>¿Qué es el modo difícil?</span><br>En el modo difícil no se muestran las estrellas que indican el poder de un Pokemon. Se puede activar y desactivar en las opciones.<br><br>
			<span class='font-bold text-2xl'>¿Cómo funciona la suerte?</span><br>La suerte es un factor al azar que potencia o desmejora tu puntaje final. Varía desde un -3% a un +5%, por lo que en promedio, te beneficiará. Se puede activar y desactivar en las opciones.<br><br>
			<span class='font-bold text-2xl'>¿Por qué no consigo las 8 medallas?</span><br>No te lo quería decir pero... Mejorá.<br><br> Es chiste! No es tan fácil!<br>La práctica hace al maestro.
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	const openStats = () => {
		console.log(currentGenerations);
		const gymStats = getFromLocalStorage('gym_stats');
		setShowSettings(false);
		MySwal.fire({
			title: 'Estadística de gimnasios derrotados.',
			html: `
			<div class='flex w-full justify-evenly'>
				<div>
					<span class='font-bold'>Modo normal:</span>
					<br><br>
					0 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[0]} </span><br>
					1 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[1]} </span><br>
					2 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[2]} </span><br>
					3 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[3]} </span><br>
					4 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[4]} </span><br>
					5 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[5]} </span><br>
					6 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[6]} </span><br>
					7 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[7]} </span><br>
					8 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.easymode_badges[8]} </span><br>
				</div>

				<div>
					<span class='font-bold'>Modo Difícil:</span>
					<br><br>
					0 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[0]} </span><br>
					1 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[1]} </span><br>
					2 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[2]} </span><br>
					3 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[3]} </span><br>
					4 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[4]} </span><br>
					5 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[5]} </span><br>
					6 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[6]} </span><br>
					7 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[7]} </span><br>
					8 Gimnasios: <span class='font-semibold text-blue-800'>${gymStats.hardmode_badges[8]} </span><br>
				</div>
			</div><br><br>
			<span class='font-bold'>Partidas reiniciadas: ${gymStats.games_restarted} </span>
			`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡A seguir ganando!',
		});
	};

	return (
		<div className='bg-zinc-200 pt-6 h-screen w-full flex flex-col justify-center items-center'>
			<div className='pt-7 h-3/4 flex flex-wrap justify-center items-center w-full gap-x-36'>
				{isLoading ? (
					<ProgressSpinner animationDuration='.5s' />
				) : (
					currentTeam.map((pokemon, index) => {
						return (
							<div
								style={{
									backgroundImage: `${pokemon.hasBeenChosen ? `url(${pokeball})` : ''}`,
								}}
								className={`w-[14vw] h-[14vw] ${pokemon.hasBeenChosen ? `bg-cover bg-center ` : 'bg-red-400/60'} m-1 mx-10 cursor-pointer flex flex-col items-center gap-2 p-5 rounded-full`}
								key={index}
								onClick={() => lockInPokemon(pokemon)}>
								<span className='font-bold text-sm'>{pokemon.name}</span>

								<img
									alt=''
									src={pokemon.img}
									className=' h-3/4 drop-shadow-2xl'
								/>

								{!hardmode && handleStars(pokemon.power)}
							</div>
						);
					})
				)}
			</div>

			<div className='flex justify-center items-center w-full m-2'>
				<div className='ml-2 w-3/4 h-full'>
					<TeamContainer team={chosenTeam} />
				</div>

				<div className='flex justify-center gap-4 w-full'>
					<button
						id='fight-button'
						className='bg-gray-700 text-white my-6 p-4 w-3/12 h-24 font-bold transition-all ease-in-out duration-150 rounded-md enabled:hover:shadow-lg enabled:hover:bg-gray-500 enabled:active:scale-95 disabled:opacity-30'
						onClick={() => updatePokemonTeam()}
						disabled={shouldDisable}>
						{rollButtonText}
					</button>
					<button
						className='bg-gray-700 text-white my-6 p-4 w-3/12 h-24 font-bold transition-all ease-in-out duration-150 rounded-md enabled:hover:shadow-lg enabled:hover:bg-gray-500 enabled:active:bg-gray-400 enabled:active:scale-95  disabled:opacity-30'
						disabled={chosenTeam.length !== 6}
						onClick={fightGymLeaders}>
						<span className='text-red-500'>P</span>ELEAR{' '}
						{chosenTeam.length !== 6 ? `(Necesitas 6 Pokemon)` : ''}
					</button>
					<button
						className='bg-gray-700 text-white my-6 p-4 w-3/12 h-24 font-bold transition-all ease-in-out duration-150 rounded-md enabled:hover:shadow-lg enabled:hover:bg-gray-500 enabled:active:bg-gray-400 enabled:active:scale-95  disabled:opacity-30'
						disabled={rollButtonText === 'Iniciar Juego'}
						onClick={() => resetGame(true)}>
						<span className='text-red-500'>R</span>EINICIAR JUEGO
					</button>
				</div>
				<div className='fixed right-0 bottom-0 m-4'>
					<div
						ref={settingsRef}
						className={`${showSettings ? '' : 'hidden'} fixed right-0 bottom-0 m-3 bg-blue-500 h-auto w-[20vw] flex flex-col items-center rounded-xl text-white font-medium`}>
						<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl'>
							<Generations
								getGenerations={getGenerations}
								resetGame={resetGame}
								padding={2}
							/>
						</div>

						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={handleHardMode}>
							Modo difícil: {hardmode ? 'ON' : 'OFF'}
						</div>

						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={handleLuckActive}>
							Suerte: {luckActive ? 'ON' : 'OFF'}
						</div>
						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={openGymTutorial}>
							¿Cómo se juega?
						</div>
						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={openFAQ}>
							Preguntas Frecuentes
						</div>
						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
							onClick={openStats}>
							Estadísticas
						</div>
						<div
							className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-b-xl'
							onClick={() => setShowSettings(false)}>
							Cerrar
						</div>
					</div>

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
		</div>
	);
};

export default PokeGym;
