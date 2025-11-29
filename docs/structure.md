# Estructura del Proyecto Buscaminas

Este documento describe la arquitectura técnica del proyecto, destacando la implementación del paradigma Orientado a Objetos.

## Arquitectura General

El proyecto está construido con **React** y **TypeScript**. La lógica del juego está desacoplada de la interfaz de usuario, residiendo principalmente en clases dedicadas dentro del directorio `src/game`.

### Directorios Principales

- **`src/game/`**: Contiene el núcleo lógico del juego (Clases OOP).
- **`src/components/`**: Contiene los componentes de React para la interfaz visual.
- **`src/App.tsx`**: Componente raíz que integra la lógica del juego con la UI.

## Clases del Juego (`src/game`)

### 1. `Game` (anteriormente `Board`)
**Archivo:** `src/game/Game.ts`

Es la clase controladora principal. Encapsula todo el estado y las reglas del juego.

- **Responsabilidades**:
    - Generar el tablero y colocar minas y vidas.
    - Gestionar la interacción del usuario (revelar celdas, poner banderas).
    - Controlar el flujo del juego (ganar, perder).
    - Mantener las instancias de `Lives` y `Score`.
- **Propiedades Clave**:
    - `grid`: Matriz de objetos `Cell`.
    - `lives`: Instancia de `Lives`.
    - `score`: Instancia de `Score`.
    - `gameState`: Estado actual (`'playing'`, `'won'`, `'lost'`).

### 2. `Cell`
**Archivo:** `src/game/Cell.ts`

Representa una celda individual en el tablero.

- **Responsabilidades**:
    - Almacenar su estado (mina, vida, revelada, bandera).
    - Conocer su posición y número de minas vecinas.
- **Propiedades Clave**:
    - `isMine`: ¿Tiene mina?
    - `isLife`: ¿Tiene vida extra?
    - `isRevealed`: ¿Está visible?
    - `isFlagged`: ¿Tiene bandera?

### 3. `Lives`
**Archivo:** `src/game/Lives.ts`

Gestiona el contador de vidas del jugador.

- **Métodos**: `loseLife()`, `gainLife()`, `isEmpty()`.

### 4. `Score`
**Archivo:** `src/game/Score.ts`

Gestiona el puntaje del jugador.

- **Métodos**: `add(points)`, `reset()`.

## Interfaz de Usuario (`src/components`)

- **`Board.tsx`**: Renderiza la grilla visual basándose en la instancia de `Game`.
- **`Cell.tsx`**: Renderiza una celda individual y maneja los eventos de clic, delegándolos hacia arriba.
- **`LivesDisplay.tsx`**: Muestra las vidas restantes (corazones).

## Flujo de Datos

1.  **Inicialización**: `App.tsx` crea una instancia de `Game` usando `Game.create()`.
2.  **Renderizado**: `App` pasa la instancia de `Game` a `BoardComponent`, que a su vez renderiza cada `Cell`.
3.  **Interacción**:
    - El usuario hace clic en una celda.
    - El evento sube a `App.tsx`.
    - `App` llama a `game.revealAt(x, y)`.
    - `Game` procesa la lógica (actualiza vidas, puntaje, estado).
    - `Game` devuelve una **nueva instancia** (inmutabilidad para React).
    - `App` actualiza el estado con la nueva instancia, provocando un re-render.
