# Trabajo Práctico Integrador - Buscaminas
## Paradigmas de la Programación

Este proyecto consiste en una implementación del clásico juego **Buscaminas** utilizando **React** y **TypeScript**, aplicando conceptos del paradigma **Orientado a Objetos** para la lógica del juego y **Programación Funcional/Declarativa** para la interfaz de usuario.

---

## 🏗️ Arquitectura Orientada a Objetos

### Diagrama de Clases

La implementación del presente proyecto se fundamenta en una arquitectura orientada a objetos que separa claramente las responsabilidades mediante clases especializadas, siguiendo los principios fundamentales del paradigma OOP.

```mermaid
classDiagram
    class Game {
        -rows: number
        -cols: number
        -mines: number
        -grid: Cell[][]\[]
        -lives: Lives
        -score: Score
        -gameState: string
        +create(rows, cols, mines, lives, hiddenLives) Game
        +revealAt(x, y) Game
        +toggleFlagAt(x, y) Game
        +checkVictory() boolean
        +clone() Game
    }

    class Cell {
        -x: number
        -y: number
        -isMine: boolean
        -isRevealed: boolean
        -isFlagged: boolean
        -isLife: boolean
        -neighborMines: number
        +reveal() void
        +toggleFlag() void
        +setMine() void
        +clone() Cell
    }

    class Lives {
        -count: number
        -maxLives: number
        +loseLife() void
        +gainLife() void
        +isEmpty() boolean
        +reset(lives) void
        +clone() Lives
    }

    class Score {
        -value: number
        +add(points) void
        +reset() void
    }

    Game "1" *-- "many" Cell : contiene
    Game "1" *-- "1" Lives : gestiona
    Game "1" *-- "1" Score : gestiona
```

### Aplicación de Principios del Paradigma Orientado a Objetos

#### 1. **Encapsulación**

El principio de encapsulación se aplica consistentemente en todas las clases del sistema. Cada entidad mantiene su estado interno como propiedades privadas y expone únicamente métodos públicos para su manipulación controlada:

- **`Cell`**: Encapsula el estado de una celda individual (mina, revelada, bandera, vida oculta) y proporciona métodos específicos para su modificación.
- **`Lives`**: Gestiona el contador de vidas del jugador con un sistema de vidas iniciales y máximas. Implementa validaciones internas para garantizar la integridad del estado y métodos para ganar/perder vidas.
- **`Score`**: Controla el sistema de puntuación mediante una interfaz pública restringida, otorgando puntos por celdas reveladas y bonificaciones por vidas encontradas.
- **`Game`**: Actúa como clase orquestadora, encapsulando la lógica completa del juego, las reglas de negocio, y la coordinación entre el sistema de vidas, puntuación y estado del tablero.

#### 2. **Composición sobre Herencia**

El diseño arquitectónico privilegia la composición como mecanismo de reutilización de código. La clase `Game` se compone de:

- Una matriz bidimensional de objetos `Cell` que representa el tablero de juego
- Una instancia de `Lives` para la gestión del sistema de vidas
- Una instancia de `Score` para el control del puntaje

Esta estructura compositiva permite que cada componente sea independiente, favoreciendo la cohesión y reduciendo el acoplamiento entre módulos.

#### 3. **Inmutabilidad (Integración Funcional-OOP)**

Para garantizar la compatibilidad con el modelo de renderizado de React, se implementa un patrón de inmutabilidad en las operaciones de modificación de estado:

- Los métodos `revealAt()` y `toggleFlagAt()` no alteran la instancia actual del objeto.
- En su lugar, retornan una nueva instancia con el estado actualizado.
- Este enfoque permite que el framework detecte cambios de manera eficiente mediante comparación de referencias.

```typescript
// Implementación del patrón de inmutabilidad
revealAt(x: number, y: number): Game {
  const game = this.clone(); // Creación de nueva instancia
  // ... procesamiento de lógica de revelación
  return game; // Retorno de instancia modificada
}
```

#### 4. **Separación de Responsabilidades (MVC)**

La arquitectura implementa el patrón Modelo-Vista-Controlador, estableciendo una clara separación entre capas:

- **Modelo** (`Game`, `Cell`, `Lives`, `Score`): Contiene la lógica de negocio pura, independiente de la interfaz de usuario.
- **Vista** (Componentes React): Responsable exclusivamente del renderizado visual y la captura de eventos de usuario.
- **Controlador** (`App.tsx`): Actúa como mediador entre el modelo y la vista, gestionando el flujo de control del juego.

Esta separación proporciona los siguientes beneficios:

- **Testabilidad**: La lógica del dominio puede ser verificada mediante pruebas unitarias sin dependencias de UI.
- **Mantenibilidad**: Las modificaciones en la interfaz no impactan la lógica de negocio y viceversa.
- **Escalabilidad**: Facilita la incorporación de nuevas funcionalidades mediante extensión modular.

### Flujo de Interacción del Sistema

El flujo de ejecución del sistema sigue el siguiente proceso secuencial:

1. **Captura de Evento**: El usuario interactúa con una celda en la capa de presentación.
2. **Propagación**: El componente `Cell` captura el evento y lo propaga al controlador `App.tsx`.
3. **Invocación del Modelo**: El controlador invoca el método correspondiente del modelo (`game.revealAt(x, y)`).
4. **Procesamiento de Lógica de Negocio**: La clase `Game` ejecuta:
   - Clonación del estado actual para preservar inmutabilidad
   - Revelación de la celda seleccionada
   - Si la celda es una mina: pérdida de una vida y verificación de game over
   - Si la celda es segura: otorgamiento de puntos (10 por celda)
   - Si la celda contiene una vida oculta: ganancia de vida adicional y bonificación de 50 puntos
   - Actualización de las instancias `Lives` y `Score` según corresponda
   - Verificación de condiciones de victoria o derrota
5. **Retorno de Estado**: El modelo retorna una nueva instancia con el estado actualizado.
6. **Actualización de Estado**: El controlador actualiza el estado mediante `setGame(newGame)`.
7. **Re-renderizado**: React detecta el cambio de referencia y ejecuta el ciclo de renderizado de la vista.

---

## 🎮 Sistema de Vidas y Puntuación

### Sistema de Vidas

El juego implementa un innovador **sistema de vidas** que añade una capa estratégica adicional al Buscaminas clásico:

#### Vidas Iniciales
- Cada nivel de dificultad comienza con un número configurable de vidas
- Las vidas se muestran visualmente mediante corazones en la interfaz
- El contador de vidas incluye animaciones CSS cuando se pierde una vida (efecto de "caída")

#### Vidas Ocultas
- El tablero contiene **vidas ocultas** distribuidas aleatoriamente en celdas seguras (no-minas)
- Estas vidas son invisibles hasta que el jugador revela la celda que las contiene
- Al encontrar una vida oculta:
  - Se incrementa el contador de vidas del jugador
  - Se otorga una bonificación de **50 puntos**
  - La celda se marca visualmente (puede implementarse un ícono especial)

#### Mecánica de Pérdida de Vidas
- Al revelar una celda con mina:
  - Se pierde **1 vida**
  - La mina se revela visualmente
  - Si quedan vidas disponibles, el juego continúa
  - Si no quedan vidas (`lives.isEmpty()`), el juego termina en derrota

#### Implementación Técnica

La clase `Lives` gestiona el estado de vidas:

```typescript
class Lives {
  count: number;      // Vidas actuales
  maxLives: number;   // Vidas iniciales del nivel
  
  loseLife()   // Decrementa el contador
  gainLife()   // Incrementa el contador
  isEmpty()    // Verifica si quedan vidas
  clone()      // Crea copia para inmutabilidad
}
```

La inicialización del juego permite configurar tanto las vidas iniciales como las vidas ocultas:

```typescript
Game.create(rows, cols, mines, lives, hiddenLives)
```

### Sistema de Puntuación

El juego implementa un sistema de puntos que recompensa la exploración estratégica:

- **10 puntos** por cada celda segura revelada
- **50 puntos** de bonificación al encontrar una vida oculta
- El puntaje se acumula durante toda la partida
- La clase `Score` encapsula la lógica de puntuación

### Estrategia de Juego

El sistema de vidas transforma la experiencia de juego:

1. **Tolerancia al Error**: Los jugadores pueden cometer errores sin perder inmediatamente
2. **Exploración Recompensada**: Buscar vidas ocultas añade un objetivo secundario
3. **Gestión de Riesgo**: Los jugadores deben decidir cuándo arriesgarse y cuándo ser conservadores
4. **Progresión**: Las vidas ocultas permiten recuperarse de errores anteriores

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
    *   **Responsabilidad**: Mantiene el estado interno de la celda (`isMine`, `isRevealed`, `isFlagged`, `isLife`, `neighborMines`) y expone métodos para modificarlo (`reveal()`, `toggleFlag()`, `setMine()`). La propiedad `isLife` indica si la celda contiene una vida oculta. Encapsula la lógica propia de la celda.

*   **`Game.ts`**:
    *   **Rol**: Representa el juego completo (anteriormente `Board.ts`).
    *   **Responsabilidad**: Gestiona la matriz de celdas (`grid`), el sistema de vidas (`Lives`), y la puntuación (`Score`). Se encarga de:
        - Inicialización del tablero
        - Colocación aleatoria de minas y vidas ocultas
        - Cálculo de vecinos
        - Algoritmos como el *Flood Fill* (expansión automática)
        - Lógica de revelación de celdas con gestión de vidas y puntos
        - Verificación de condiciones de victoria/derrota
    *   **Inmutabilidad**: Para integrarse correctamente con React, los métodos que modifican el estado del juego (`revealAt`, `toggleFlagAt`) retornan una **nueva instancia** de `Game` (patrón inmutable), permitiendo que React detecte los cambios y renderice de nuevo.

*   **`Lives.ts`**:
    *   **Rol**: Gestiona el sistema de vidas del jugador.
    *   **Responsabilidad**: Mantiene el contador de vidas actuales y máximas, proporciona métodos para ganar/perder vidas y verificar si el jugador ha perdido todas sus vidas.

*   **`Score.ts`**:
    *   **Rol**: Gestiona el sistema de puntuación.
    *   **Responsabilidad**: Acumula puntos durante el juego y proporciona métodos para añadir puntos y reiniciar el contador.

#### 2. Componentes de Interfaz (`src/components/`)
Estos componentes son responsables de la representación visual (View) y de capturar la interacción del usuario, delegando la lógica al modelo (`game/`).

*   **`Board.tsx`**:
    *   **Rol**: Renderiza la cuadrícula del tablero.
    *   **Responsabilidad**: Recibe la instancia de `Game` y dibuja las filas y columnas. También maneja la lógica de **zoom automático** para adaptar el tablero a pantallas pequeñas sin deformarlo y contiene el componente `LivesDisplay`.

*   **`Cell.tsx`**:
    *   **Rol**: Renderiza una celda individual.
    *   **Responsabilidad**: Muestra el estado visual de la celda (mina, número, bandera o vacía) utilizando iconos de la librería `lucide-react`. Aplica estilos condicionales (colores, animaciones) según el estado.

*   **`LevelSelector.tsx`**:
    *   **Rol**: Menú de selección de dificultad.
    *   **Responsabilidad**: Permite al usuario elegir entre niveles predefinidos (Principiante, Intermedio, Experto) o uno Personalizado.

*   **`LivesDisplay.tsx`**:
    *   **Rol**: Contador de vidas visual.
    *   **Responsabilidad**: Muestra las vidas restantes y máximas utilizando corazones (iconos de `lucide-react`). Implementa una técnica de **doble capa** con corazones vacíos de fondo y corazones rellenos en primer plano. Cuando se pierde una vida, el corazón correspondiente se anima con el efecto `animate-heart-drop` (definido en CSS) que simula que el corazón "cae" y desaparece.

#### 3. Controlador Principal (`src/App.tsx`)
*   **Rol**: Componente raíz y orquestador.
*   **Responsabilidad**:
    *   Mantiene el estado global de la aplicación: instancia del `Game`, nivel actual, estado de victoria/derrota.
    *   Vincula la lógica del juego con la interfaz: recibe los eventos de clic de los componentes y llama a los métodos correspondientes del objeto `Game`.
    *   Gestiona el flujo del juego (Game Loop): verifica condiciones de victoria/derrota tras cada movimiento.
    *   Coordina la actualización de vidas y puntuación a través del modelo `Game`.

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
