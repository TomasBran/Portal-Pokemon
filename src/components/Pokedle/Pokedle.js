import React, { useEffect, useRef, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import { getPokemon } from '../../services/pokemon';
import { generateRandomPokemonNumber } from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';
import settings from '../../assets/settings.png';

const attributes = [
	'Foto',
	'Nombre',
	'Generación',
	'Tipo 1',
	'Tipo 2',
	'Fuerza',
	'Peso (kg)',
	'Altura (mts)',
];

const Pokedle = () => {
	const MySwal = withReactContent(Swal);

	const [comparisons, setComparisons] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [originalPokemon, setOriginalPokemon] = useState({});
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
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);

	const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

	useEffect(() => {
		startNewGame();
	}, []);

	const startNewGame = async () => {
		const newPokemon = await getPokemon(
			generateRandomPokemonNumber(currentGenerations)
		);
		setOriginalPokemon(newPokemon);
	};

	const comparePokemon = async (originalPokemon) => {
		const newChosenPokemon = await getPokemon(inputValue.toLowerCase());

		if (newChosenPokemon === undefined) {
			return;
		}

		const results = {};

		for (const property in newChosenPokemon) {
			if (property === 'hasBeenChosen' || property === 'id') {
				setComparisons([results, ...comparisons]);
				break;
			}
			if (property === 'img') {
				results[property] = {
					img: newChosenPokemon[property],
					class: 'image-guess',
				};
			} else if (property === 'name') {
				results[property] = { value: newChosenPokemon[property] };
			} else if (
				newChosenPokemon.hasOwnProperty(property) &&
				originalPokemon.hasOwnProperty(property)
			) {
				if (newChosenPokemon[property] === originalPokemon[property]) {
					results[property] = {
						value: newChosenPokemon[property],
						class: 'correct-guess',
					};
				} else if (property === 'type_1' || property === 'type_2') {
					const otherType = property === 'type_1' ? 'type_2' : 'type_1';
					if (originalPokemon[otherType] === newChosenPokemon[property]) {
						results[property] = {
							value: newChosenPokemon[property],
							class: 'partial-correct-guess',
						};
					} else {
						results[property] = {
							value: checkCorrection(property, newChosenPokemon[property]),
							class: 'wrong-guess',
						};
					}
				} else {
					results[property] = {
						value: checkCorrection(property, newChosenPokemon[property]),
						class: 'wrong-guess',
					};
				}
			}
		}

		if (originalPokemon.name === newChosenPokemon.name) {
			const response = await MySwal.fire({
				title: `Felicitaciones! El Pokemon era <span class="text-green-500 font-bold">${originalPokemon.name.replace(/-/g, ' ')}</span>.`,
				text: `${comparisons.length !== 0 ? `Adivinaste en ${comparisons.length + 1} intentos` : 'Adivinaste a la primera. Wow.'}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: 'green',
				confirmButtonText: 'Jugar otra vez',
				cancelButtonText: 'Ver el tablero',
			});
			if (response.isConfirmed) {
				reloadGame();
			} else {
				setGuessButtonDisabled(true);
			}
		}
	};

	const checkCorrection = (element, value) => {
		let newValue = value;

		if (
			element === 'height' ||
			element === 'weight' ||
			element === 'power' ||
			element === 'generation'
		) {
			if (originalPokemon[element] > value) {
				newValue += ' ↑';
			} else {
				newValue += ' ↓';
			}
		}

		return newValue;
	};

	const getGenerations = (childGenerations) => {
		setCurrentGenerations(childGenerations);
	};

	const reloadGame = () => {
		setComparisons([]);
		startNewGame();
		setGuessButtonDisabled(false);
	};

	const resetGame = async () => {
		if (document.getElementById('guess-button').disabled === true) {
			reloadGame();
			return;
		}

		const response = await MySwal.fire({
			title: `Seguro que quieres reiniciar la partida?.`,
			text: `Esto borrará tu progreso e iniciará una nueva partida`,
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Confirmar',
			confirmButtonColor: 'rgb(99 102 241)',
			cancelButtonColor: 'rgb(239 68 68)',
		});
		if (response.isConfirmed) {
			await MySwal.fire({
				title: `La partida ha finalizado.`,
				html: `No has adivinado. El Pokémon era <span class="text-red-500 font-bold">${originalPokemon.name.replace(/-/g, ' ')}</span>`,
				icon: 'error',
				showCancelButton: false,
				confirmButtonText: 'Confirmar',
			});
			reloadGame();
		}
	};

	const handleInputChange = (value) => {
		setInputValue(value);
	};

	const putDataStyle = (data) => {
		switch (data) {
			case 'correct-guess':
				return 'bg-green-500';
			case 'wrong-guess':
				return 'bg-red-500';

			case 'partial-correct-guess':
				return 'bg-yellow-500';

			default:
				return 'bg-blue-500';
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

	const openPokedleTutorial = () => {
		setShowSettings(false);
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Debes adivinar el Pokemon escondido. Comienza eligiendo uno y continúa a partir de las pistas que éste te otorgue.<br>
			Por ejemplo, si el pokemon que tocó es <span class='font-bold text-gray-500'>Magnemite</span>, y yo elegí a <span class='font-bold text-yellow-500'>Pikachu</span>, me dirá que coinciden en su primer tipo (<span class='font-bold text-yellow-500'>Eléctrico</span>), pero no coincidirán en el segundo, ya que <span class='font-bold text-yellow-500'>Pikachu</span> es monotipo y <span class='font-bold text-gray-500'>Magnemite</span> es tipo <span class='font-bold text-yellow-500'>Eléctrico</span>/<span class='font-bold text-gray-500'>Acero</span>. También me comparará el resto de los datos.<br><br>
			<span class='font-bold text-green-500'>Dato</span>: En la generación, fuerza, peso y altura habrá una flecha hacia arriba/abajo que indica si el número del Pokemon objetivo es mayor o menor en caso de no coincidir.
			.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	return (
		<div className='bg-zinc-200 min-h-screen pb-4'>
			<div className='flex justify-center items-center gap-4 py-20'>
				<span>Elige un Pokemon:</span>
				<PokemonSearch
					onInputChange={handleInputChange}
					searchPokemon={() => comparePokemon(originalPokemon)}
					showSearchButton={false}
				/>
				<button
					id='guess-button'
					className='bg-blue-500 enabled:hover:bg-blue-600 enabled:active:bg-blue-800 enabled:active:scale-95 transition duration-150 rounded-lg py-4 px-8 text-white font-bold disabled:opacity-40'
					onClick={() => {
						comparePokemon(originalPokemon);
						setInputValue('');
					}}
					disabled={guessButtonDisabled}>
					ADIVINAR
				</button>
				<button
					className={`bg-blue-500 enabled:active:bg-blue-800 enabled:active:scale-95 transition duration-150 enabled:hover:bg-blue-600 disabled:opacity-40 rounded-lg py-4 px-8 text-white font-bold`}
					onClick={() => resetGame()}
					disabled={comparisons.length === 0}>
					REINICIAR
				</button>
			</div>

			{comparisons.length !== 0 && (
				<div className='flex flex-col gap-5'>
					<div className='flex justify-center w-full gap-8'>
						{attributes.map((attribute, index) => (
							<div
								key={index}
								className='bg-blue-700 rounded-lg py-2 px-4 w-1/12 cursor-default flex items-center justify-center'>
								<p className='font-bold text-white text-sm'>{attribute}</p>
							</div>
						))}
					</div>
					{comparisons.map((result, index) => (
						<div
							className='flex justify-center w-full gap-8'
							key={index}>
							{Object.entries(result).map(([property, data]) => (
								<div
									className='w-1/12 flex justify-center'
									key={property}>
									<div
										key={property}
										className={`w-5/6 h-20 border-2 border-white text-white flex justify-center items-center rounded-lg ${putDataStyle(data.class)} bg-contain bg-center bg-no-repeat`}
										style={
											data.img !== undefined
												? { backgroundImage: `url(${data.img})` }
												: {}
										}>
										{data.value}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
			<div className='fixed right-0 bottom-0 m-4'>
				<div
					ref={settingsRef}
					className={`${showSettings ? '' : 'hidden'} fixed right-0 bottom-0 m-3 bg-blue-500 h-auto w-[20vw] flex flex-col items-center rounded-xl text-white font-medium`}>
					<div className='w-full hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500 rounded-t-xl'>
						<Generations
							getGenerations={getGenerations}
							resetGame={reloadGame}
							padding={2}
						/>
					</div>

					<div
						className='w-full py-2 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer hover:text-blue-500'
						onClick={openPokedleTutorial}>
						¿Cómo se juega?
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
	);
};

export default Pokedle;
