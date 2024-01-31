import { toast } from 'sonner'
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import DraggableItem from './Dnd/DraggableItem';
import DroppableArea from './Dnd/DropContainer';

const types = {
    fire: {
        id: 1,
        name: 'fire',
        isEffectiveAgainst: ["grass", "ice", "steel", "bug"],
        isNotEffectiveAgainst: ["water", "dragon", "fire", "rock"],
        isResistantAgainst: ["steel", "bug", "fire", "fairy", "ice", "grass"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["water", "rock", "ground"],
        isImmuneAgainstMyAttacks: []
    },
    water: {
        id: 2,
        name: 'water',
        isEffectiveAgainst: ["fire", "rock", "ground"],
        isNotEffectiveAgainst: ["water", "dragon", "grass"],
        isResistantAgainst: ["steel", "water", "fire", "ice"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["electric", "grass"],
        isImmuneAgainstMyAttacks: []
    },
    grass: {
        id: 3,
        name: 'grass',
        isEffectiveAgainst: ["water", "rock", "ground"],
        isNotEffectiveAgainst: ["steel", "bug", "dragon", "fire", "grass", "poison", "flying"],
        isResistantAgainst: ["water", "electric", "grass", "ground"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["bug", "fire", "ice", "poison", "flying"],
        isImmuneAgainstMyAttacks: []
    },
    psychic: {
        id: 4,
        name: 'psychic',
        isEffectiveAgainst: ["fighting", "poison"],
        isNotEffectiveAgainst: ["steel", "psychic"],
        isResistantAgainst: ["fighting", "psychic"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["bug", "ghost", "dark"],
        isImmuneAgainstMyAttacks: ["dark"]
    },
    steel: {
        id: 5,
        name: 'steel',
        isEffectiveAgainst: ["fairy", "ice", "rock"],
        isNotEffectiveAgainst: ["steel", "water", "electric", "fire"],
        isResistantAgainst: ["steel", "bug", "dragon", "fairy", "ice", "normal", "grass", "psychic", "rock", "flying"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["fire", "fighting", "ground"],
        isImmuneAgainstMyAttacks: []
    },
    bug: {
        id: 6,
        name: 'bug',
        isEffectiveAgainst: ["grass", "psychic", "dark"],
        isNotEffectiveAgainst: ["steel", "ghost", "fire", "fairy", "fighting", "poison", "flying"],
        isResistantAgainst: ["fighting", "grass", "ground"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["fire", "rock", "flying"],
        isImmuneAgainstMyAttacks: []
    },
    dragon: {
        id: 7,
        name: 'dragon',
        isEffectiveAgainst: ["dragon"],
        isNotEffectiveAgainst: ["steel"],
        isResistantAgainst: ["water", "electric", "fire", "grass"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["dragon", "fairy", "ice"],
        isImmuneAgainstMyAttacks: ["fairy"]
    },
    electric: {
        id: 8,
        name: 'electric',
        isEffectiveAgainst: ["water", "flying"],
        isNotEffectiveAgainst: ["dragon", "electric", "grass"],
        isResistantAgainst: ["steel", "electric", "flying"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["ground"],
        isImmuneAgainstMyAttacks: ["ground"]
    },
    ghost: {
        id: 9,
        name: 'ghost',
        isEffectiveAgainst: ["ghost", "psychic"],
        isNotEffectiveAgainst: ["dark"],
        isResistantAgainst: ["bug", "poison"],
        hasImmunityAgainst: ["fighting", "normal"],
        isEffectiveAgainstMe: ["ghost", "dark"],
        isImmuneAgainstMyAttacks: ["normal"]
    },
    fairy: {
        id: 10,
        name: 'fairy',
        isEffectiveAgainst: ["dragon", "fighting", "dark"],
        isNotEffectiveAgainst: ["steel", "fire", "poison"],
        isResistantAgainst: ["bug", "fighting", "dark"],
        hasImmunityAgainst: ["dragon"],
        isEffectiveAgainstMe: ["steel", "poison"],
        isImmuneAgainstMyAttacks: []
    },
    ice: {
        id: 11,
        name: 'ice',
        isEffectiveAgainst: ["dragon", "grass", "ground", "flying"],
        isNotEffectiveAgainst: ["steel", "water", "fire", "ice"],
        isResistantAgainst: ["ice"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["steel", "fire", "fighting", "rock"],
        isImmuneAgainstMyAttacks: []
    },
    fighting: {
        id: 12,
        name: 'fighting',
        isEffectiveAgainst: ["steel", "ice", "normal", "rock", "dark"],
        isNotEffectiveAgainst: ["bug", "fairy", "psychic", "poison", "flying"],
        isResistantAgainst: ["bug", "rock", "dark"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["fairy", "psychic", "flying"],
        isImmuneAgainstMyAttacks: ["ghost"]
    },
    normal: {
        id: 13,
        name: 'normal',
        isEffectiveAgainst: [],
        isNotEffectiveAgainst: ["steel", "rock"],
        isResistantAgainst: [],
        hasImmunityAgainst: ["ghost"],
        isEffectiveAgainstMe: ["fighting"],
        isImmuneAgainstMyAttacks: ["ghost"]
    },
    rock: {
        id: 14,
        name: 'rock',
        isEffectiveAgainst: ["bug", "fire", "ice", "flying"],
        isNotEffectiveAgainst: ["steel", "fighting", "ground"],
        isResistantAgainst: ["fire", "normal", "poison", "flying"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["steel", "water", "fighting", "grass", "ground"],
        isImmuneAgainstMyAttacks: []
    },
    dark: {
        id: 15,
        name: 'dark',
        isEffectiveAgainst: ["ghost", "psychic"],
        isNotEffectiveAgainst: ["fairy", "fighting", "dark"],
        isResistantAgainst: ["ghost", "dark"],
        hasImmunityAgainst: ["psychic"],
        isEffectiveAgainstMe: ["bug", "fairy", "fighting"],
        isImmuneAgainstMyAttacks: []
    },
    ground: {
        id: 16,
        name: 'ground',
        isEffectiveAgainst: ["steel", "electric", "fire", "rock", "poison"],
        isNotEffectiveAgainst: ["bug", "grass"],
        isResistantAgainst: ["rock", "poison"],
        hasImmunityAgainst: ["electric"],
        isEffectiveAgainstMe: ["water", "ice", "grass"],
        isImmuneAgainstMyAttacks: ["flying"]
    },
    poison: {
        id: 17,
        name: 'poison',
        isEffectiveAgainst: ["fairy", "grass"],
        isNotEffectiveAgainst: ["ghost", "rock", "ground", "poison"],
        isResistantAgainst: ["bug", "fairy", "fighting", "grass", "poison"],
        hasImmunityAgainst: [],
        isEffectiveAgainstMe: ["psychic", "ground"],
        isImmuneAgainstMyAttacks: ["steel"]
    },
    flying: {
        id: 18,
        name: 'flying',
        isEffectiveAgainst: ["bug", "fighting", "grass"],
        isNotEffectiveAgainst: ["steel", "electric", "rock"],
        isResistantAgainst: ["bug", "fighting", "grass"],
        hasImmunityAgainst: ["ground"],
        isEffectiveAgainstMe: ["electric", "ice", "rock"],
        isImmuneAgainstMyAttacks: []
    }
};

const zonesData = [
    { id: 'zone1', title: 'Efectivo' },
    { id: 'zone2', title: 'Neutral' },
    { id: 'zone3', title: 'Poco efectivo' },
    { id: 'zone4', title: 'Inmune' },
  ];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

const TypesChallenge = () => {
   
    const [zones, setZones] = useState({
        main: Object.values(types).map((tipo) => ({ id: tipo.id, name: `${capitalize(tipo.name)}` })),
        ...Object.fromEntries(zonesData.map((zone) => [zone.id, []])),
      });
    
    const handleDrop = (item, targetZone) => {
    setZones((prevZones) => {
        const updatedZones = { ...prevZones };
    
        Object.keys(updatedZones).forEach((zone) => {
        updatedZones[zone] = updatedZones[zone].filter((zoneItem) => zoneItem.id !== item.id);
        });
    
        updatedZones[targetZone] = [...updatedZones[targetZone], item];
    
        return updatedZones;
    });
    
    };
    
      return (
        <div className='pt-10 p-6 flex flex-col gap-10 items-start justify-center bg-gray-200 h-screen'>
          <div className='w-full m-4 h-2/6 '>
            <div className='h-1/6 flex justify-center gap-2 items-center'>
                <h2>Tipo seleccionado:</h2>
                <div className='fighting h-4/6 w-[6vw] justify-center flex items-center p-2 rounded text-white font-medium border-black border-2'>Fighting</div>

            </div>
            <div className='bg-white w-full h-5/6 flex'>
                <DroppableArea id="main" items={zones.main} onDrop={handleDrop} />
            </div>
          </div>

          <div className='w-full h-3/12 flex flex-wrap'>
            {zonesData.map((zone) => (
                    <div key={zone.id} className="w-3/12 h-full">
                        <h2 className='h-1/6'>{zone.title}</h2>
                        <div className="bg-white w-full h-[40vh] ">
                            <DroppableArea id={zone.id} items={zones[zone.id] || []} onDrop={handleDrop} />
                        </div>
                    </div>
                ))}
          </div>


        </div>
      );
    
};

export default TypesChallenge