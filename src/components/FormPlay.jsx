import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import useGame from '../hooks/useGame';
const FormPlay = () => {
	const { requestCards, cantCards, win } = useGame();
	const handleClick = async e => {
		if (cantCards == 0 || win) {
			e.target.disabled = true;
			alert('Fin del juego');
			console.log('0');
		} else {
			// console.log(e);
			await requestCards();
		}
	};
	return (
		<Stack gap={2} className='col-md-5 mx-auto'>
			<Button onClick={handleClick} variant='secondary'>
				Cards
			</Button>
		</Stack>
	);
};

export default FormPlay;
