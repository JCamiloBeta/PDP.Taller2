import { useEffect, useState } from 'react';
import DeckOfCardsAPI from '../services/deckofcardsapi';
import GameContext from './GameContext';

const GameProvider = ({ children }) => {
	const [idGame, setIdGame] = useState(null);
	const [cantCards, setCantCards] = useState(null);
	const [win, setWin] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [winName, setWinName] = useState('');
	const [playerOne, setPlayerOne] = useState({
		name: 'Juan',
		cards: [],
	});
	const [playerTwo, setPlayerTwo] = useState({
		name: 'Camilo',
		cards: [],
	});

	const [cantidadOcurrenciaOne, setOcurrenciaOne] = useState([]);

	const playGame = async () => {
		const res = await DeckOfCardsAPI.getIdGame();
		setIdGame(res.deck_id);
		setCantCards(res.remaining);
	};

	/** cuando se logea */
	useEffect(() => {
		if (idGame != null) {
			DeckCardsPlayerOne();
			DeckCardsPlayerTwo();
		}
	}, [idGame]);

	const DeckCardsPlayerOne = async () => {
		const data = await DeckOfCardsAPI.getDeckCards(idGame);
		setCantCards(data.remaining);
		setPlayerOne({ ...playerOne, cards: data.cards });
	};
	const DeckCardsPlayerTwo = async () => {
		const data = await DeckOfCardsAPI.getDeckCards(idGame);
		setCantCards(data.remaining);
		setPlayerTwo({ ...playerTwo, cards: data.cards });
	};

	let aux, auxWord;
	const ordenarPlayerOne = () => {
		for (let j = 0; j < playerOne.cards.length; j++) {
			for (let index = 0; index < playerOne.cards.length-1-j; index++) {
				aux = [];
				if (playerOne.cards[index].value === 'ACE' || playerOne.cards[index].value === 'JACK' || playerOne.cards[index].value === 'QUEEN' || playerOne.cards[index].value === 'KING') {
					auxWord = 10;
					if(auxWord > playerOne.cards[index+1].value){
						aux = playerOne.cards[index];
						playerOne.cards[index] = playerOne.cards[index+1];
						playerOne.cards[index+1] = aux;
					}
				} else {
					if(playerOne.cards[index].value > playerOne.cards[index+1].value){
						aux = playerOne.cards[index];
						playerOne.cards[index] = playerOne.cards[index+1];
						playerOne.cards[index+1] = aux;
					}
				}
			}
		}		
	}
	const ordenarPlayerTwo = () => {
		for (let j = 0; j < playerTwo.cards.length; j++) {
			for (let index = 0; index < playerTwo.cards.length-1-j; index++) {
				aux = [];
				if (playerTwo.cards[index].value === 'ACE' || playerTwo.cards[index].value === 'JACK' || playerTwo.cards[index].value === 'QUEEN' || playerTwo.cards[index].value === 'KING') {
					auxWord = 10;
					if(auxWord > playerTwo.cards[index+1].value){
						aux = playerTwo.cards[index];
						playerTwo.cards[index] = playerTwo.cards[index+1];
						playerTwo.cards[index+1] = aux;
					}
				} else {
					if(playerTwo.cards[index].value > playerTwo.cards[index+1].value){
						aux = playerTwo.cards[index];
						playerTwo.cards[index] = playerTwo.cards[index+1];
						playerTwo.cards[index+1] = aux;
					}
				}
			}
		}
		
	}
	const deckFull = cards => {
		console.log(cards[0]);
		console.log(cards[1]);
		console.log(cards[2]);
		if (cards[0].cant === 4 && cards[1].cant === 3 && cards[2].cant === 3) {
			return true;
		} else {
			return false;
		}
	};

	const requestCards = () => {
		console.log('Jugador 1');
		const deckFullPlayerOne = deckFull(playerOne.cards);
		console.log('Jugador 2');
		const deckFullPlayerTwo = deckFull(playerTwo.cards);

		if (deckFullPlayerOne && deckFullPlayerTwo) {
			setWin(true);
			setShowToast(true);
			setWinName('EMPATE');
		}
		if (deckFullPlayerOne || deckFullPlayerTwo) {
			setWin(true);
			setShowToast(true);
			setWinName(deckFullPlayerOne ? playerOne.name : playerTwo.name);
		} else {
			getCards();
		}
	};

	const getCards = async () => {
		const data = await DeckOfCardsAPI.getCards(idGame);
		// console.log(data);
		setCantCards(data.remaining);
		recuento(playerOne.cards, 1, data.cards[0]);
		recuento(playerTwo.cards, 2, data.cards[1]);
	};
	let ternas, cuartas, cartas, contador, bandera;
	const ganador = (cardsPlayer) => {
		ternas = [];
		cuartas = [];
		cartas = [];
		for (let index = 0; index < cardsPlayer.length; index++) {
			debugger;
			bandera = false;
			contador = 1;
			for (let j = 0; j < cardsPlayer.length-1; j++) {
				if (cardsPlayer[index].value === cardsPlayer[j].value && cardsPlayer[index].suit !== cardsPlayer[j].suit)
					contador = contador + 1;
			}
			cartas.forEach( (valor) => {	
				if(valor.name === cardsPlayer[index].value)
					bandera = true;
			});
			if (!bandera) {
				cartas.push({
					name: cardsPlayer[index].value,
					value: contador
				});
			}
		}
		console.log(cartas);
	};
	let res, filtro, nCard, cardDelete, newDeck, checkDelete;
	const recuento = (cardsPlayer, player, newCard) => {
		res = [];
		filtro = [];
		newDeck = [];
		nCard = null;
		cardDelete = null;
		checkDelete = true;
		for (let index = 1; index <= 13; index++) {
			switch (index) {
				case 1:
					nCard = 'ACE';
					break;
				case 11:
					nCard = 'JACK';
					break;
				case 12:
					nCard = 'QUEEN';
					break;
				case 13:
					nCard = 'KING';
					break;
				default:
					nCard = index;
					break;
			}
			res.push({
				value: nCard,
				cant: cardsPlayer.filter(card => card.value == nCard).length,
			});
		}
		filtro = res.filter(card => card.cant > 0);

		filtro = filtro.sort((p1, p2) =>
			p1.cant < p2.cant ? 1 : p1.cant > p2.cant ? -1 : 0
		);
		console.log(filtro);

		if (filtro[1].cant >= 4) {
			cardDelete = filtro.shift();
		} else {
			cardDelete = filtro.pop();
		}
		// console.log(cardDelete);

		cardsPlayer.forEach(card => {
			if (checkDelete && card.value == cardDelete.value) {
				checkDelete = false;
			} else {
				newDeck.push(card);
			}
		});
		newDeck.push(newCard);

		if (player === 1) {
			// console.log(newDeck);
			setPlayerOne({ ...playerOne, cards: newDeck });
		} else {
			setPlayerTwo({ ...playerTwo, cards: newDeck });
		}
	};

	return (
		<GameContext.Provider
			value={{
				idGame,
				playGame,
				win,
				requestCards,
				playerOne,
				setPlayerOne,
				playerTwo,
				setPlayerTwo,
				ordenarPlayerOne,
				ordenarPlayerTwo,
				ganador,
				showToast,
				setShowToast,
				winName,
				cantCards,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
