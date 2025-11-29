# Documentación del Proyecto Buscaminas

Este documento describe la estructura de clases y la lógica del juego Buscaminas implementado en Pharo Smalltalk.

## Visión General

El proyecto implementa el clásico juego Buscaminas utilizando la biblioteca gráfica Morphic de Pharo. El diseño sigue el paradigma de Orientación a Objetos, separando la lógica del juego, la representación visual y el manejo de estados como puntaje y vidas.

## Clases Principales

### 1. Buscaminas
**Superclase:** `Morph`
**Paquete:** `Buscaminas`

Es la clase principal del juego y actúa como el contenedor visual (el tablero) y el controlador de la lógica del juego.

**Responsabilidades:**
*   **Inicialización del Juego:** Configura la dificultad (tamaño del tablero y vidas) a través de un menú de selección.
*   **Gestión del Tablero:** Crea y posiciona las celdas (`Celda`) y gestiona la lógica de las bombas (`Bomba`).
*   **Manejo de Eventos:** Recibe los eventos de clic desde las celdas y decide qué acción tomar (revelar celda, colocar bandera).
*   **Estado del Juego:** Controla si el juego está activo (`gameState`), el puntaje y las vidas restantes.
*   **Interfaz de Usuario:** Muestra el puntaje, vidas, contador de banderas y botones de control (Cerrar, Reiniciar).

**Variables de Instancia Clave:**
*   `cells`: Matriz (`Array2D`) que contiene los objetos visuales `Celda`.
*   `bombs`: Matriz (`Array2D`) que contiene los objetos lógicos `Bomba`.
*   `gameState`: Booleano que indica si el juego está en curso.
*   `puntos`: Instancia de la clase `Puntos`.
*   `vidas`: Instancia de la clase `Vidas`.
*   `cellsPerSide`: Entero que define el tamaño del tablero (ej. 10 para 10x10).

**Métodos Importantes:**
*   `initialize`: Configura las opciones iniciales y diccionarios de dificultad.
*   `crearTablero`: Genera la grilla visual, instancia las celdas y bombas, y dibuja la UI.
*   `clickEnFila:columna:conEvento:`: Método central que procesa la interacción del usuario.
*   `checkNeighbour:at:`: Lógica para revelar celdas vecinas (recursividad para espacios vacíos).
*   `toggleFlagAt:at:`: Coloca o quita una bandera en una celda.

---

### 2. Celda
**Superclase:** `Morph`
**Paquete:** `Buscaminas`

Representa cada casilla individual en el tablero visualmente.

**Responsabilidades:**
*   **Representación Visual:** Muestra el estado de la casilla (oculta, revelada, con bandera).
*   **Captura de Eventos:** Detecta los clics del mouse (`mouseDown:`) y delega la acción al objeto `Buscaminas` (su `owner`).

**Variables de Instancia:**
*   `isOn`: Indica si la celda ha sido revelada.
*   `bandera`: Indica si la celda tiene una bandera colocada.
*   `tieneVida`: Indica si la celda contiene una vida extra (power-up).

**Interacción:**
Cuando el usuario hace clic en una `Celda`, el método `mouseDown:` captura el evento, determina si fue clic izquierdo o derecho, y llama a `checkNeighbour:at:` o `toggleFlagAt:at:` en la instancia de `Buscaminas`.

---

### 3. Bomba
**Superclase:** `Object`
**Paquete:** `Buscaminas`

Representa la lógica interna de una posición en el tablero. A diferencia de `Celda` que es visual, `Bomba` parece mantener el estado lógico sobre si una posición contiene una mina.

**Responsabilidades:**
*   Almacenar si una posición específica tiene una bomba.

**Variables de Instancia:**
*   `tieneBomba`: Booleano, verdadero si hay una mina en esta posición.
*   `vecesMarcada`: Posiblemente usado para estadísticas o lógica de banderas.
*   `noExploto`: Estado para verificar condiciones de fin de juego.

---

### 4. Puntos
**Superclase:** `Object`
**Paquete:** `Buscaminas`

Clase auxiliar para gestionar el puntaje del jugador.

**Responsabilidades:**
*   Mantener el contador de puntos acumulados.

**Variables de Instancia:**
*   `puntaje`: El valor numérico del puntaje actual.

---

### 5. Vidas
**Superclase:** `Object`
**Paquete:** `Buscaminas`

Clase auxiliar para gestionar las vidas del jugador.

**Responsabilidades:**
*   Mantener el contador de vidas. Permite que el jugador cometa errores (detonar minas) sin perder inmediatamente, dependiendo de la dificultad.

**Variables de Instancia:**
*   `cantidad`: El número de vidas restantes.

---

## Flujo de Ejecución (OOP)

1.  **Inicio:** Al instanciar `Buscaminas`, se ejecuta `initialize`. Se pide al usuario la dificultad.
2.  **Construcción:** Se llama a `crearTablero`, que llena la matriz `cells` con objetos `Celda` y la matriz `bombs` con objetos `Bomba`. Se añaden los `Morphs` (celdas) a la pantalla.
3.  **Interacción:**
    *   El usuario hace clic en una `Celda`.
    *   `Celda >> mouseDown:` captura el evento.
    *   `Celda` obtiene su posición (guardada como propiedad `#posicion`) y llama a su dueño (`Buscaminas`).
    *   `Buscaminas` ejecuta la lógica correspondiente (verificar bomba, expandir área, poner bandera).
4.  **Actualización:** `Buscaminas` actualiza el estado visual de la `Celda` correspondiente y los contadores de `Puntos` y `Vidas` en la interfaz.

Este diseño desacopla la vista individual de cada celda de la lógica global del juego, centralizando las reglas en `Buscaminas` mientras que `Celda` actúa principalmente como un receptor de eventos y objeto de visualización.
