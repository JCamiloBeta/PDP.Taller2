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
		name: 'PEDRO',
		cards: [],
	});
	const [playerTwo, setPlayerTwo] = useState({
		name: 'JUAN',
		cards: [],
	});

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

	const deckFull = cards => {
		if (cards[0].cant == 4 && cards[1].cant == 3 && cards[2].cant == 3) {
			return true;
		} else {
			return false;
		}
	};

	const requestCards = () => {
		const deckFullPlayerOne = deckFull(playerOne.cards);
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
