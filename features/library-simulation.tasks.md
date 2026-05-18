# Tareas de Implementación: Library & Simulation

## Backend Tasks
- [ ] Implementar el endpoint `POST /api/simulaciones` en `controllers/` (genera pasos de simulación).
- [ ] Implementar el Step Generator (motor que calcula comparaciones, intercambios y posiciones finales).
- [ ] Mantener los 6 algoritmos base en biblioteca: Bubble Sort, Insertion Sort, Selection Sort, Linked List, Queue y Stack.
- [ ] Implementar expansión mínima del catálogo con 7 elementos nuevos: Merge Sort, Quick Sort, Heap Sort, Binary Search, Linear Search, Deque y Priority Queue.
- [ ] Crear engines auto-contenidos para cada algoritmo nuevo simulable (`meta`, `pseudocode`, `execute`).
- [ ] Registrar los engines nuevos en `src/simulations/engines/registry.ts`.
- [ ] Actualizar `seed.ts` con metadatos, dificultad, categoría y tags de los algoritmos nuevos.
- [ ] Implementar CRUD de `Algoritmo` para el dashboard de administrador.
- [ ] Validaciones de entrada (array: min 2, max 50, enteros positivos hasta 999).
- [ ] Sanitizar inputs manuales: filtrar no-enteros, restringir longitud ≤ 50.
- [ ] Pruebas unitarias para cada algoritmo del Step Generator.
- [ ] Pruebas unitarias para el endpoint de simulación.

## Frontend Tasks
- [ ] Crear la solicitud Axios/Fetch para `POST /api/simulaciones`.
- [ ] Desarrollar la Biblioteca de Algoritmos: grid layout responsive para 13+ algoritmos categorizados.
- [ ] Implementar filtro por categoría y búsqueda por nombre (instantáneo).
- [ ] Verificar que los filtros y búsqueda soporten tags de algoritmos nuevos.
- [ ] Agregar estado visual para algoritmos no navegables o `activo = false` ("Próximamente").
- [ ] Desarrollar el Simulation Viewer:
  - [ ] Gráfico de barras central representando los números del array.
  - [ ] Sidebar con pseudocódigo y resaltado de la línea en ejecución (`lineaPseudocodigo`).
  - [ ] Controles inferiores: Play (▶️), Pause (⏸️), Step-Forward (⏭️), Step-Back (⏮️).
  - [ ] Slider de velocidad ajustable (125ms a 2000ms).
- [ ] Implementar Data Intake: generación aleatoria, arrays casi-ordenados, input manual (CSV: `4,2,7,1`).
- [ ] Implementar motor de renderizado con `requestAnimationFrame` o CSS Transitions para animaciones a 60FPS.
- [ ] Implementar color coding según `constitution.md` (Azul: inactivo, Amarillo: comparando, Rojo: intercambiando, Verde: ordenado).
- [ ] Manejar el estado `currentStepIndex` con `useState` para navegación entre pasos.
- [ ] Manejar edge case: step forward cuando simulación está completa (no-op seguro).
- [ ] Confirmar compatibilidad y color coding con `constitution.md`.

## Integration
- [ ] Conectar ambos entornos y verificar flujo de trabajo (End-to-End).
- [ ] Verificar flujo: seleccionar algoritmo → ingresar datos → ver simulación paso a paso.
- [ ] Verificar flujo para al menos 1 algoritmo nuevo de cada categoría: Ordenamiento, Búsqueda y Estructuras Lineales.
- [ ] Verificar que el admin puede hacer CRUD de algoritmos desde su dashboard.
