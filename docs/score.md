#### Sistema de Cálculo de Puntos

El juego implementa un sistema de puntuación que recompensa las acciones correctas y penaliza los errores:

**Formas de Ganar Puntos:**

1. **Marcar una bomba con bandera (primera vez):** +100 puntos
   - Solo se otorgan puntos la primera vez que se marca correctamente una bomba
   - La celda se colorea de verde para indicar que es una marca correcta
   - Se utiliza la variable `vecesMarcada` en la clase `Bomba` para evitar puntos duplicados

2. **Abrir región vacía:** +15 puntos por cada celda abierta
   - Cuando se hace clic en una celda sin bombas adyacentes, se abre automáticamente toda la región conectada
   - El puntaje se calcula multiplicando el número de celdas abiertas por 15
   - Ejemplo: Si se abren 10 celdas en una región, se suman 150 puntos

3. **Bonus por vida máxima:** +50 puntos
   - Se otorgan cuando el jugador encuentra un power-up de vida y alcanza exactamente 5 vidas
   - Este bonus se aplica tanto en `checkNeighbour:at:` como en `abrirRegionDesde:at:`

**Formas de Perder Puntos:**

1. **Detonar una bomba:** -50 puntos
   - Ocurre cuando se hace clic en una celda que contiene una bomba
   - La penalización se aplica antes de verificar si el jugador pierde el juego
   - El puntaje nunca puede ser negativo (se usa `max: 0` en el método `restar:`)

**Notas Importantes:**
- El puntaje inicial es 0
- El puntaje se actualiza en tiempo real en la interfaz mediante el método `actualizarPuntos`
- El puntaje final se muestra en el mensaje de victoria o derrota
- Las celdas con números (que tienen bombas adyacentes) no otorgan puntos adicionales al ser reveladas