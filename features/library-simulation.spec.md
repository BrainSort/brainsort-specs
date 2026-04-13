# Library & Simulation Specification

> **Fuente de verdad**: `BrainSort-Historias_de_Usuario.docx` (HU-01 a HU-07), `BrainSort-Contratos.docx`, `BrainSort-Glosario.docx`

## 1. Context & Motivation
La propuesta de valor central de BrainSort es visualizar algoritmos interactuando con datos. Un diccionario estático no es suficiente. Se necesita un motor que resuelva dinámicamente los pasos de un arreglo siendo ordenado.

## 2. User Experience (UX) — Según Historias de Usuario

### HU-01: Navegar la Biblioteca
- Pantalla principal tipo "Dashboard" o "Biblioteca".
- Algoritmos agrupados por categorías (ej. Ordenamiento, Búsqueda, Estructuras Lineales).
- Cada tarjeta de algoritmo muestra: nombre, nivel de dificultad (visual, colores o estrellas), descripción corta (máx. 140 caracteres).
- Al hacer clic en una categoría, se expanden o muestran solo los algoritmos de esa categoría.
- Si búsqueda no arroja resultados: "No se encontraron algoritmos con ese criterio".
- **Métricas**: Tiempo de navegación hasta seleccionar algoritmo < 15 segundos.
- Usar Lazy Loading para imágenes de tarjetas.

### HU-02: Seleccionar un Algoritmo
- Clic/tap en tarjeta redirige a vista de detalle/simulación.
- Indicador de progreso ("spinner" temático) durante carga.
- Vista destino muestra título del algoritmo en cabecera.
- Si módulo marcado "Próximamente": modal informativo, no redirigir.

### HU-03: Datos Predeterminados
- Al cargar pantalla, área de visualización NO debe estar vacía.
- Generar arreglo aleatorio de **8 a 15 elementos** (números enteros).
- Datos representados visualmente (barras de altura proporcional al valor).
- Datos generados no deben estar ya ordenados ni vacíos.
- Botón "Generar nuevos datos" para refrescar arreglo aleatorio.

### HU-04: Controlar y Visualizar la Animación
- Barra de control con botón "Play/Pausa".
- **Color Coding (según Constitution del proyecto)**:
  - Azul: Elemento inactivo / base.
  - Amarillo: Comparando.
  - Rojo: Intercambiando.
  - Verde: Posición final correcta.
  > *Nota: La HU-04 original menciona "rojo para comparar, verde para intercambiar" como ejemplos. El esquema de 4 colores es la extensión oficial del proyecto.*
- Animación fluida (sin saltos bruscos).
- Resaltar visualmente elementos procesándose en el instante actual.
- Capacidad de ajustar velocidad en rango **[0.25x, 2.0x]** en incrementos de 0.25x (según Glosario). La HU-04 menciona 0.5x, 1x, 2x como ejemplos representativos.
- **Rendimiento**: 24 FPS o más en dispositivos de gama media/baja.

### HU-06: Seguimiento hasta Finalización
- Animación no se detiene prematuramente (a menos que el usuario pause).
- Al finalizar: todos los elementos cambian a estado "Completado" (color verde uniforme).
- Controles deshabilitan "Play" y habilitan "Reiniciar".
- Timeout de seguridad si se detecta bucle infinito.
- Feedback visual de completitud claro para daltónicos (iconos además de color).

### HU-07: Mensaje de Finalización
- Al concluir animación: notificación no intrusiva "¡Algoritmo completado!".
- Opciones rápidas: "Reiniciar", "Siguiente Algoritmo", "Ver Código".
- Desaparece automáticamente después de 5 segundos si no hay interacción.

## 3. Core Requirements

**In-Scope:**
- Biblioteca de algoritmos categorizada con tarjetas descriptivas.
- Motor de simulación visual paso a paso con controles Play/Pausa.
- Velocidad ajustable en rango **[0.25x, 2.0x]** en incrementos de 0.25x (según Glosario).
- Datos de entrada: **Predeterminados** (auto-generados) y **Personalizados** (del usuario) — según Modelo del Dominio.
- Administrador puede hacer CRUD sobre los algoritmos de la biblioteca.

**Out-of-Scope:**
- Algoritmos de búsqueda en primera versión.

## 4. Contratos de Operación (Según BrainSort-Contratos.docx)
- **CO1 - getLibrary()**: Crea instancia de BibliotecaDeAlgoritmos, lista de algoritmos con descripciones, tarjeta por algoritmo, rutas de aprendizaje. (Pre: Se solicitó la biblioteca).
- **CO2 - getAlgoritmo()**: Crea instancia del algoritmo, asocia avance con cuenta actual. (Pre: Se seleccionó un algoritmo).
- **CO3 - getSimulation()**: Crea instancia de simulación del algoritmo, asocia avance en simulación con cuenta actual. (Pre: Se seleccionó mostrar simulación).

## 5. Edge Cases & Error Handling (Según HUs)
- Sin conexión: mostrar solo algoritmos cacheados, indicar "Sin conexión".
- Error de carga: mensaje claro con opciones de recuperación.
- Error en visualización (animación congelada): permitir reiniciar o reportar fallo.
- Datos personalizados inválidos: error si formato no coincide o valores nulos.
