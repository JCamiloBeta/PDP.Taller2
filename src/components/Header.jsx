import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { TfiGame } from 'react-icons/tfi';
import useGame from '../hooks/useGame';

const Header = () => {
	const { idGame, cantCards } = useGame();
	return (
		<Navbar bg='dark' variant='dark'>
			<Container>
				<Navbar.Brand>
					<div className='d-inline-block align-top'>
						<TfiGame />
					</div>{' '}
					Deck Of Cards Game
					<div>
						<span className='text-align-left'>
							id: {idGame} | Available decks: {cantCards}
						</span>
					</div>
				</Navbar.Brand>
			</Container>
		</Navbar>
	);
};

export default Header;
