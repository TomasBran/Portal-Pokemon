import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';

const DroppableArea = ({ id, items, onDrop }) => {

  const [shortenText, setshortenText] = useState(false)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => {
      onDrop(item, id);
      console.log(item, id)
      if(id!=='main'){
        setshortenText(true)
      } else{
        setshortenText(false)
      }

    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`h-full w-full items-center flex flex-wrap justify-center gap-2 p-2 border-4 border-dashed ${isOver ? 'border-blue-600' : 'border-black'}`}>
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id} name={item.name} text={item.text} shortenText={shortenText}/>
      ))}
    </div>
  );
};

export default DroppableArea;