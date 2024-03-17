import TypeIcon from '../TypeIcon/TypeIcon';

const Type = ({ type, showIcon }) => {
	return (
		<div
			className={`${type} p-1.5 md:p-4 text-white font-semibold rounded-xl border-2 border-white text-xs md:text-sm flex justify-center items-center min-w-[4vw] max-w-[6vw] h-[5vh] capitalize shadow shadow-black/30`}
			key={type}>
			{showIcon ? <TypeIcon type={type} /> : <span>{type}</span>}
		</div>
	);
};

export default Type;
