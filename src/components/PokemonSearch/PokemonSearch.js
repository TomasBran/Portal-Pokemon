import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import './PokemonSearch.css';

function PokemonSearch(props) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905&offset=0');
        const data = await response.json();
        const pokemonList = data.results;
        setPokemonData(pokemonList);
      } catch (error) {
        console.error('Error al cargar los datos de Pokemon', error);
      }
    }

    fetchData();
  }, []);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return pokemonData.filter(pokemon =>
      pokemon.name.toLowerCase().includes(inputValueLowerCase)
    );
  };

  const onChange = (event, { newValue }) => {
    const capitalizedValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    setValue(capitalizedValue);
    props.onInputChange(capitalizedValue);
  };
  

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.name}
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    // console.log('Pokemon seleccionado:', suggestion)
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Buscar Pokemon',
    value,
    onChange,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionSelected={onSuggestionSelected}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={suggestion => suggestion.name}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
}

export default PokemonSearch;
