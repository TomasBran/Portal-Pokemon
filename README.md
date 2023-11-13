
# Portal Pokemon

Portal Pokemon es un proyecto de React.js basado en el mundo Pokemon, que posee distintas herramientas actualmente, y otras que vendrán futuras.

Inició como una calculadora de tipos, luego quise incluir una Pokedex para buscar al Pokemon que necesitase y posteriormente fue evolucionando en lo que es ahora, que aún está en camino de algo más grande.

Lo pueden ver en: https://tomasbran.github.io/Portal-Pokemon/

## Dependencias


```bash
  npm install react-router-dom
  npm install react-autosuggest --save
  npm install --save sweetalert2 sweetalert2-react-content
  npm install --save react-toastify
  npm install react-icons --save
  npm install react-autosuggest --save
```
    

## Features

- Calculadora Pokemon - Para calcular fortalezas y debilidades.
- Gimnasio - Minijuego para probar tu valía como entrenador.
- Pokedle - Una versión Pokemon del famoso juego Wordle.


## Coming Soon

- Minijuego adivinar set de movimientos
- Minijuego adivinar generación del Pokemon
- Minijuego desafio tabla de tipos
- Login/Profile
- Tienda Pokemon y sistema de recompensas


## Calculadora Pokemon

Tendrás a disposición los 18 tipos para elegir y ver los movimientos ultra efectivos (x4), efectivos (x2), neutrales (x1), poco efectivos (x0.5), muy poco efectivos (x0.25) e inmunes (x0).
Asímismo, está la herramienta Pokedex, para buscar cualquier Pokemon que quieras y/o que no conozcas sus tipos. Podés agregar y quitar tipos cuanto quieras, haciéndoles click a sus respectivos íconos, pero siempre con un límite de 2 (dos), como en el videojuego.

Esta sección utiliza una llamada a la PokeApi, y posee un Autocompletar de la librería AutoSuggest de React.

## Gimnasio (W.I.P)

En el gimnasio, luego de darle a "Iniciar", podrás elegir la cantidad de Pokemon que quieras dentro de 6 opciones elegidas al azar. Luego podrás rollear nuevos Pokemon al azar, hasta 3 veces, o hasta que completes el equipo de 6.

La cantidad de Pokemon a rollear, será de 6 menos tu equipo hasta ahora seleccionado, es decir, si seleccionaste 2 Pokemon en tu equipo, se rollearan 4 nuevos para elegir. Hasta que completes tu equipo de 6.

Existe un sistema de selección de generaciones, para poder jugar con las que quieras. En este momento están habilitadas desde la 1° hasta la 8° inclusive por temas a resolver con la API (Algunos Pókemon de la novena generación no poseen ningun sprite)


WIP:

- Feature: Se implementará un sistema que premie distintas sinergias.

## Pokedle (W.I.P)

Una versión Pokemon del famoso juego Wordle.

En Pokedle tendrás que averiguar el Pokemon misterioso elegido al azar, usando como pistas algunas propiedades que puedan o no tener en común con el Pokemon que elijas (Generación, Tipos 1 y 2, Fuerza, Peso y Altura)

WIP:

- Design: Algunas cosas respecto al diseño están apenas siendo incluidas, con lo cual serán vistas en las próximas versiones.
