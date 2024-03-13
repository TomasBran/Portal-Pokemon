import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';

const DroppableArea = ({ id, items, onDrop, enabledContainer = true }) => {
	const [shortenText, setShortenText] = useState(false);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: enabledContainer ? 'ITEM' : 'none',
		drop: (item) => {
			onDrop(item, id);
			setShortenText(id !== 'main');
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	return (
		<div
			ref={drop}
			className={`h-full w-full items-start flex flex-wrap justify-center gap-2 p-2 border-2 rounded-lg ${isOver ? 'border-blue-800 bg-blue-300' : 'border-slate-800 bg-slate-300'}`}>
			{items.map((item) => (
				<DraggableItem
					key={item.id}
					id={item.id}
					name={item.name}
					text={item.text}
					shortenText={shortenText}
				/>
			))}
		</div>
	);
};

export default DroppableArea;
