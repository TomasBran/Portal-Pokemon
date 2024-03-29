import unknown_pokemon from '../../assets/unresolved_pokemon.png';
import { getPokemonMovements } from '../../services/movements';
import { useEffect, useRef, useState } from 'react';
import PokemonSearch from '../PokemonSearch/PokemonSearch';
import {
	generateRandomPokemonNumber,
	capitalizeFirstLetter,
} from '../../utils/functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Generations from '../Generations/Generations';
import { getPokemonsGeneration, pokemonExists } from '../../services/pokemon';
import settings from '../../assets/settings.png';
import { toast } from 'sonner';

const MoveSet = () => {
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //
	const testing = false; // PONER FALSE AL NO TESTEAR
	if (testing) console.log('EL MODO TESTING ESTA ON');
	// ***IMPORTANTE*** DESHABILITAR CUANDO NO ESTE TESTEANDO //

	const MySwal = withReactContent(Swal);
	const [originalPokemonMovements, setOriginalPokemonMovements] = useState([]);
	const [currentGenerations, setCurrentGenerations] = useState([
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		true,
	]);
	const [movesShown, setMovesShown] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [guessedPokemons, setGuessedPokemons] = useState([]);
	const [showSettings, setShowSettings] = useState(false);
	const settingsRef = useRef(null);
	const [guessButtonDisabled, setGuessButtonDisabled] = useState(false);

	const startNewGame = async () => {
		if (testing) {
			const newPokemon = await getPokemonMovements('eevee');
			setOriginalPokemonMovements(newPokemon);
			return;
		}

		const newPokemon = await getPokemonMovements(
			generateRandomPokemonNumber(currentGenerations)
		);
		setOriginalPokemonMovements(newPokemon);
	};

	const resetGame = async (shouldAsk) => {
		if (guessButtonDisabled) {
			reloadGame();
			return;
		}
		let result = false;
		if (shouldAsk) {
			result = await MySwal.fire({
				title: '¿Querés reiniciar el juego?',
				text: 'Esto borrará la lista de pokemon, y elegirá uno nuevo.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Reiniciar',
			});
			if (result.isConfirmed) {
				await MySwal.fire({
					title: `Estuviste cerca! El Pokemon era <span class='text-red-400'>${capitalizeFirstLetter(originalPokemonMovements[5])}</span>.`,
					text: 'La próxima seguro lo adivinas!',
					icon: 'error',
					showCancelButton: false,
					confirmButtonColor: '#3085d6',
					confirmButtonText: ':(',
				});
			} else {
				return;
			}
		}

		reloadGame();
	};

	const reloadGame = () => {
		setMovesShown(0);
		setGuessButtonDisabled(false);
		setGuessedPokemons([]);
		startNewGame();
	};

	const getGenerations = (childGenerations) => {
		setCurrentGenerations(childGenerations);
	};

	const handleInputChange = (value) => {
		setInputValue(value);
	};

	const guess = async (pokemon) => {
		if (pokemon === '') {
			toast.error(`El buscador está vacío.`);
			return;
		}

		const doesPokemonExist = await pokemonExists(pokemon);
		if (!doesPokemonExist) {
			return;
		}
		setGuessedPokemons((prev) => [...prev, pokemon]);
		if (pokemon.toLowerCase() === originalPokemonMovements[5]) {
			await MySwal.fire({
				title: `Felicitaciones! El Pokemon era ${pokemon}.`,
				text: `${guessedPokemons.length !== 0 ? `Adivinaste en ${guessedPokemons.length + 1} intentos` : 'Adivinaste con 1 solo movimiento? Quizá pueda aprender una cosa o dos al verte.'}`,
				icon: 'success',
				showCancelButton: true,
				confirmButtonColor: 'green',
				confirmButtonText: 'Jugar otra vez',
				cancelButtonText: 'Ver el tablero',
			}).then((response) => {
				if (response.isConfirmed) {
					resetGame(false);
				} else {
					setGuessButtonDisabled(true);
				}
			});
			return;
		}
		movesShown <= 4 && setMovesShown((prev) => prev + 1);
	};

	useEffect(() => {}, [originalPokemonMovements]);

	useEffect(() => {
		startNewGame();
	}, []);

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

	const openMovesetTutorial = () => {
		setShowSettings(false);
		MySwal.fire({
			title: '¿Cómo se juega?',
			html: `Debes adivinar el Pokemon escondido. Comienza eligiendo uno y continúa a partir de las pistas que éste te otorgue.<br>
			Las pistas serán 5, y se te otorgará una por cada intento. Las primeras 4 serán movimientos que el Pokemon oculto sea capaz de aprender por nivel, y la última pista será una de las habilidades que este Pokemon pueda tener (incluso habilidades ocultas).<br><br>
			<span class='font-bold text-green-500'>Dato</span>: Puedes cambiar las generaciones a las que gustes, para que el pokemon a adivinar pertenezca a esas generaciones.
			.`,
			showCancelButton: false,
			confirmButtonColor: 'rgb(99 102 241)',
			confirmButtonText: '¡Estoy listo!',
		});
	};

	return (
		<div className='h-screen bg-gray-200 w-full flex flex-col items-center justify-center'>
			<div className='w-full h-9/12 flex justify-around items-center'>
				<div className='w-3/12 h-full flex flex-col justify-center items-center gap-4'>
					<div className='w-4/6'>
						<img
							alt=''
							src={unknown_pokemon}
						/>
					</div>

					<PokemonSearch
						onInputChange={handleInputChange}
						showSearchButton={false}
						searchPokemon={() => guess(inputValue)}
					/>

					<div className='flex justify-center gap-4 text-white font-medium'>
						<button
							disabled={guessButtonDisabled}
							onClick={() => guess(inputValue)}
							className='rounded-lg disabled:opacity-40 bg-indigo-500  enabled:hover:bg-indigo-400 enabled:active:bg-indigo-300 enabled:cursor-pointer py-4 px-4 flex items-center justify-center'>
							ADIVINAR
						</button>
						<button
							className='bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 cursor-pointer py-4 px-4 rounded-lg flex items-center justify-center'
							onClick={() => resetGame(true)}>
							REINICIAR
						</button>
					</div>
				</div>

				<div className='w-3/12 h-[50vh] bg-white text-white rounded-2xl border-2 border-gray-900 flex flex-col items-center overflow-y-auto'>
					<div className='text-gray-800 font-bold border-b-2 border-black w-1/6 h-2/12 fixed bg-white flex justify-center pt-2 items-center'>
						Intentos ({guessedPokemons.length}):
					</div>
					<div className='flex flex-col-reverse items-center gap-1 mt-10'>
						{guessedPokemons.map((pokemon, index) => (
							<div key={index}>
								<span
									className={`${pokemon.toLowerCase() === originalPokemonMovements[5] ? 'bg-green-500' : 'bg-red-500'} flex justify-center font-bold text-white border-2 rounded-xl px-6 py-1`}>
									{pokemon}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className='w-3/12 h-full flex flex-col flex-wrap items-center justify-center gap-10'>
					<div className='bg-stone-500 rounded px-10 py-3 text-white font-medium'>
						Generación: {getPokemonsGeneration(originalPokemonMovements[6])}{' '}
					</div>
					<div className='flex flex-wrap w-full justify-center items-center gap-3'>
						{originalPokemonMovements.slice(0, 4).map((movement, index) => (
							<div
								key={index}
								className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center h-3/6 w-5/12 ${
									movesShown >= index ? 'bg-blue-500' : 'bg-red-500'
								}`}>
								<span>
									{`Movimiento ${index + 1}:`}
									<br />
									{movesShown >= index ? movement : '???'}
								</span>
							</div>
						))}
					</div>
					<div
						className={`p-4 rounded-xl capitalize text-white font-medium flex justify-center items-center w-full ${movesShown >= 4 ? 'bg-blue-500' : 'bg-red-500'}`}>{`Habilidad: ${movesShown >= 4 ? originalPokemonMovements[4] : '???'}`}</div>
				</div>
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
						onClick={openMovesetTutorial}>
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

export default MoveSet;
