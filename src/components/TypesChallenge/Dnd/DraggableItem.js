import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import '../../Calculator/types.css'
import steelLogo from '../../../assets/type_icons/steel.svg';
import waterLogo from '../../../assets/type_icons/water.svg';
import bugLogo from '../../../assets/type_icons/bug.svg';
import dragonLogo from '../../../assets/type_icons/dragon.svg';
import electricLogo from '../../../assets/type_icons/electric.svg';
import ghostLogo from '../../../assets/type_icons/ghost.svg';
import fireLogo from '../../../assets/type_icons/fire.svg';
import fairyLogo from '../../../assets/type_icons/fairy.svg';
import iceLogo from '../../../assets/type_icons/ice.svg';
import fightingLogo from '../../../assets/type_icons/fighting.svg';
import normalLogo from '../../../assets/type_icons/normal.svg';
import grassLogo from '../../../assets/type_icons/grass.svg';
import psychicLogo from '../../../assets/type_icons/psychic.svg';
import rockLogo from '../../../assets/type_icons/rock.svg';
import darkLogo from '../../../assets/type_icons/dark.svg';
import groundLogo from '../../../assets/type_icons/ground.svg';
import poisonLogo from '../../../assets/type_icons/poison.svg';
import flyingLogo from '../../../assets/type_icons/flying.svg';

export const typeLogos = {
  steel: steelLogo,
  water: waterLogo,
  bug: bugLogo,
  dragon: dragonLogo,
  electric: electricLogo,
  ghost: ghostLogo,
  fire: fireLogo,
  fairy: fairyLogo,
  ice: iceLogo,
  fighting: fightingLogo,
  normal: normalLogo,
  grass: grassLogo,
  psychic: psychicLogo,
  rock: rockLogo,
  dark: darkLogo,
  ground: groundLogo,
  poison: poisonLogo,
  flying: flyingLogo,
};


const DraggableItem = ({ id, name, shortenText }) => {
  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id, name },
  }));


  return (
    <div ref={drag} className={`border text-xs border-gray-300 p-2 m-2 cursor-move w-[5%] ${!shortenText ? 'w-[6vw]' : 'w-[3vw] '} min-h-[4vh] flex justify-center items-center text-white font-medium rounded-lg active:scale-90 gap-1 ${name.toLowerCase()}`}>
      
      <img src={typeLogos[name.toLowerCase()]} alt={`${name} Logo`} className='h-[3.5vh]'/>
      {!shortenText && name}
    </div>
  );
};

export default DraggableItem;
