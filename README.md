# Trabajo Práctico Integrador - Buscaminas
## Paradigmas de la Programación

Este proyecto consiste en una implementación del clásico juego **Buscaminas** utilizando **React** y **TypeScript**, aplicando conceptos del paradigma **Orientado a Objetos** para la lógica del juego y **Programación Funcional/Declarativa** para la interfaz de usuario.

---

### 🚀 Inicialización del Proyecto

Para ejecutar el proyecto localmente, sigue estos pasos:

1.  **Instalar dependencias**:
    Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, ejecuta en la terminal:
    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

3.  **Abrir en el navegador**:
    El servidor iniciará generalmente en `http://localhost:5173/`.

---

### 📂 Estructura del Proyecto

El código fuente se encuentra en la carpeta `src/` y se divide principalmente en dos módulos: **Lógica del Juego** (`game/`) y **Componentes de UI** (`components/`).

#### 1. Lógica del Juego (`src/game/`)
Aquí reside el modelo de dominio, encapsulando el estado y el comportamiento del juego bajo el paradigma Orientado a Objetos.

*   **`Cell.ts`**:
    *   **Rol**: Representa una celda individual del tablero.
    *   **Responsabilidad**: Mantiene el estado interno de la celda (`isMine`, `isRevealed`, `isFlagged`, `neighborMines`) y expone métodos para modificarlo (`reveal()`, `toggleFlag()`, `setMine()`). Encapsula la lógica propia de la celda.

*   **`Board.ts`**:
    *   **Rol**: Representa el tablero de juego completo.
    *   **Responsabilidad**: Gestiona la matriz de celdas (`grid`). Se encarga de la inicialización, colocación aleatoria de minas, cálculo de vecinos, y algoritmos como el *Flood Fill* (expansión automática).
    *   **Inmutabilidad**: Para integrarse correctamente con React, los métodos que modifican el estado del tablero (`revealAt`, `toggleFlagAt`) retornan una **nueva instancia** de `Board` (patrón inmutable), permitiendo que React detecte los cambios y renderice de nuevo.

#### 2. Componentes de Interfaz (`src/components/`)
Estos componentes son responsables de la representación visual (View) y de capturar la interacción del usuario, delegando la lógica al modelo (`game/`).

*   **`Board.tsx`**:
    *   **Rol**: Renderiza la cuadrícula del tablero.
    *   **Responsabilidad**: Recibe la instancia de `Board` y dibuja las filas y columnas. También maneja la lógica de **zoom automático** para adaptar el tablero a pantallas pequeñas sin deformarlo y contiene el componente `LivesDisplay`.

*   **`Cell.tsx`**:
    *   **Rol**: Renderiza una celda individual.
    *   **Responsabilidad**: Muestra el estado visual de la celda (mina, número, bandera o vacía) utilizando iconos de la librería `lucide-react`. Aplica estilos condicionales (colores, animaciones) según el estado.

*   **`LevelSelector.tsx`**:
    *   **Rol**: Menú de selección de dificultad.
    *   **Responsabilidad**: Permite al usuario elegir entre niveles predefinidos (Principiante, Intermedio, Experto) o uno Personalizado.

*   **`LivesDisplay.tsx`**:
    *   **Rol**: Contador de vidas visual.
    *   **Responsabilidad**: Muestra las vidas restantes utilizando corazones. Implementa animaciones CSS personalizadas para cuando se pierde una vida (el corazón "tiembla y cae").

#### 3. Controlador Principal (`src/App.tsx`)
*   **Rol**: Componente raíz y orquestador.
*   **Responsabilidad**:
    *   Mantiene el estado global de la aplicación: instancia del `Board`, vidas, nivel actual, estado de victoria/derrota.
    *   Vincula la lógica del juego con la interfaz: recibe los eventos de clic de los componentes y llama a los métodos correspondientes del objeto `Board`.
    *   Gestiona el flujo del juego (Game Loop): verifica condiciones de victoria/derrota tras cada movimiento.

---

### 🎨 Estética y Diseño
El proyecto cuenta con una estética **"Retro Gamer 80s"**, caracterizada por:
*   Tipografías monoespaciadas.
*   Colores de alto contraste (Verde Neón sobre fondo oscuro).
*   Sombras duras (pixel-art style) en botones y contenedores.
*   Animaciones CSS para interactividad y feedback visual.

---

### 🛠 Tecnologías Utilizadas
*   **React**: Librería para la construcción de la UI.
*   **TypeScript**: Superset de JavaScript para tipado estático y mayor robustez.
*   **Tailwind CSS**: Framework de utilidades para el estilizado rápido y responsivo.
*   **Lucide React**: Librería de iconos vectoriales.
*   **Vite**: Entorno de desarrollo y empaquetador.
