import { typeLogos } from '../TypesChallenge/Dnd/DraggableItem';

const TypeIcon = ({ type }) => {
	return (
		<div className=''>
			<img
				src={typeLogos[type.toLowerCase()]}
				alt={`${type} Logo`}
				className='h-[3.5vh] '
			/>
		</div>
	);
};

export default TypeIcon;
