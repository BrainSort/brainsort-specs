# Tasks del Sprint — Algoritmos de Búsqueda, Recorrido de Grafos y Gamificación

> **Base de análisis**: `Backend-api.md` (NestJS + Fastify + Prisma + PostgreSQL) y `Frontend-app.md` (Expo / React Native + `packages/core` + react-native-svg + D3 solo para matemática).  
> **Objetivos de calidad que cubre**: (1) 100 % de algoritmos nuevos pasan sus pruebas funcionales, (2) 0 defectos críticos/altos abiertos al cerrar el sprint, (3) 100 % de tareas y retos de gamificación cumplen sus criterios de aceptación.

---

## Contrato de datos propuesto (base técnica de las tasks)

Este contrato garantiza paridad total entre backend (`brainsort-api`) y frontend (`packages/core`), manteniendo **100 % de compatibilidad con las estructuras ya existentes**.

```typescript
// ─── OPERACIONES DE SIMULACIÓN ───────────────────────────────────────────────
export type TipoOperacion =
  | 'idle' | 'comparacion' | 'intercambio' | 'insercion' | 'final' // Existentes (preservados)
  | 'descarte'                                                    // Búsqueda binaria: mitad descartada
  | 'encontrado' | 'no_encontrado'                                // Búsqueda lineal y binaria
  | 'visita' | 'encolar' | 'desencolar' | 'apilar' | 'desapilar'; // Grafos (BFS / DFS)

// ─── MARCADORES Y ESTRUCTURAS COMPARTIDAS ────────────────────────────────────
export interface SimulationMarker {
  index: number;
  label: string;
  role: string;
  color: string;
}

export interface SimulationTreeNode {
  index: number;
  value: number | null;
  level: number;
  position: number;
  label?: string;
}

// ─── PASOS DE SIMULACIÓN (UNIÓN DISCRIMINADA) ────────────────────────────────
export interface PasoBase {
  numeroPaso: number;            // Consecutivo base 1
  tipoOperacion: TipoOperacion;
  lineaPseudocodigo: number;     // Índice base 1 correspondiente a DB
  marcadores?: SimulationMarker[];
}

export interface PasoArray extends PasoBase {
  tipoEstructura?: 'array';      // Opcional con default 'array' para compatibilidad
  indicesActivos: number[];
  estadoArray: number[];
  rango?: { bajo: number; medio: number; alto: number }; // Búsqueda binaria
  nodosArbol?: SimulationTreeNode[];                     // Compatible con árboles
}

export interface PasoGrafo extends PasoBase {
  tipoEstructura: 'grafo';
  nodoActual: string | null;
  visitados: string[];           // Nodos visitados en orden cronológico
  frontera: string[];            // Cola (BFS) o Pila (DFS)
  aristaActiva?: [string, string]; // Arista explorada en el paso
}

export type SimulationStep = PasoArray | PasoGrafo;

// ─── ENTRADA POLIMÓRFICA A LOS ENGINES ───────────────────────────────────────
export interface GrafoData {
  nodos: string[];
  aristas: [string, string][];
  dirigido: boolean;
}

export interface SimulationInput {
  tipoOrigen: 'Predeterminado' | 'Personalizado';
  // Para algoritmos de arreglo (ordenamiento, estructuras lineales, búsqueda):
  data?: number[];
  objetivo?: number;             // Obligatorio en Búsqueda Lineal y Binaria
  // Para algoritmos de grafos:
  grafo?: GrafoData;             // Obligatorio en BFS y DFS
  nodoInicio?: string;           // Nodo raíz de inicio del recorrido
}

// ─── DTO DE SOLICITUD DE SIMULACIÓN (API) ───────────────────────────────────
export interface ConjuntoDeDatosDto {
  tipoOrigen: 'Predeterminado' | 'Personalizado';
  valores?: number[];            // Arreglo numérico (búsqueda y ordenamiento)
  tamano?: number;
  objetivo?: number;             // Valor objetivo para búsquedas
  grafo?: GrafoData;             // Estructura de grafo para BFS/DFS
  nodoInicio?: string;           // Nodo de partida para BFS/DFS
}

export interface CreateSimulationDto {
  algoritmoId: string;
  conjuntoDeDatos: ConjuntoDeDatosDto;
}
```

> **Regla de Determinismo**: Para BFS y DFS, los vecinos de cada nodo deben recorrerse en **orden ascendente de ID de nodo** (alfabético/numérico). Sin esta regla, las secuencias emitidas no son deterministas y los fixtures fallarían.

---

# PARTE A — BACKEND (`brainsort-api`)

## A.1 Contrato y datos

### Task 1.0 — BE-01: Readaptar el contrato de pasos y DTOs de simulación
- **Archivos**: `src/simulations/dto/simulation-step.dto.ts`, `src/simulations/dto/create-simulation.dto.ts`, `src/simulations/engines/engine.interface.ts`
- **Subtasks**:
  - [x] Implementar la unión discriminada `PasoArray | PasoGrafo` con clases y decoradores de `class-validator` (`@ValidateNested`, discriminador `tipoEstructura`).
  - [x] Asegurar retrocompatibilidad estricta: si `tipoEstructura` no viene definido en un paso, asumir `'array'`; preservar los campos existentes `marcadores`, `nodosArbol` y `contexto`.
  - [x] Ampliar `CreateSimulationDto` y `ConjuntoDeDatosDto` para soportar `objetivo?` (número entero opcional/condicional), `grafo?` (objeto con `nodos`, `aristas`, `dirigido`) y `nodoInicio?` (string).
  - [x] Generalizar `AlgorithmDefinition` y su interfaz en `engine.interface.ts`: `execute(input: SimulationInput): SimulationStep[]`, permitiendo sobrecarga compatible hacia atrás con `execute(data: number[])`.
  - [x] Decorar todas las nuevas propiedades con `@ApiProperty` de `@nestjs/swagger` para generación precisa de esquema OpenAPI.
- **Aceptación**: Swagger `/docs` documenta los esquemas de unión discriminada; los 11 algoritmos preexistentes compilan y se ejecutan sin regresiones.

### Task 2.0 — BE-02: Schema Prisma y migración para categoría Grafos
- **Archivos**: `prisma/schema.prisma`, `prisma/migrations/`
- **Subtasks**:
  - [x] En `schema.prisma`, agregar el valor `Grafos` al enum `CategoriaAlgoritmo`.
  - [x] Verificar que el modelo `EjercicioPrediccion` permita representar secuencias de nodos (orden de visita) en `contenido Json?` y `respuestaCorrecta String`.
  - [x] Confirmar que `Insignia` soporte criterios basados en la categoría `Grafos` y que `RespuestaEjercicio` registre las respuestas adecuadamente.
  - [x] Ejecutar `npx prisma migrate dev --name add-grafos-category` y versionar el archivo generado en `prisma/migrations/`.
- **Aceptación**: `npx prisma validate` pasa limpio; la migración se aplica sin errores sobre base de datos vacía o existente.

### Task 3.0 — BE-03: Seed de contenido nuevo y sincronización (`prisma/seed.ts`)
- **Archivos**: `prisma/seed.ts`
- **Subtasks**:
  - [x] Sincronizar y validar que los registros existentes de `Linear Search` y `Binary Search` en `seed.ts` cumplan descripción $\le 140$ caracteres y que su pseudocódigo coincida con los índices emitidos por los engines.
  - [x] Agregar con `upsert` los algoritmos `Breadth-First Search (BFS)` y `Depth-First Search (DFS)` en la categoría `Grafos`, con complejidades $O(V+E)$ tiempo / $O(V)$ espacio, pseudocódigo estructurado por líneas numeradas y configuración visual.
  - [x] Agregar ejercicios de predicción de secuencia de recorrido para BFS y DFS.
  - [x] Crear las nuevas insignias "Explorador de Grafos" y "Rastreador Eficiente" con sus criterios de desbloqueo.
- **Aceptación**: `npx prisma db seed` ejecutado consecutivamente es completamente idempotente; `GET /api/biblioteca` expone todas las categorías y algoritmos activos.

---

## A.2 Engines

### Task 4.0 — BE-04: Refactorizar `LinearSearch` con soporte de objetivo y nuevos pasos
- **Archivos**: `src/simulations/engines/advanced-engines.ts` (o `linear-search.engine.ts`)
- **Subtasks**:
  - [ ] Refactorizar `LinearSearch` para consumir `input.data` e `input.objetivo` (con fallback de seguridad en caso de invocaciones legacy).
  - [ ] Emitir en cada iteración del bucle `tipoOperacion: 'comparacion'` con `indicesActivos: [i]`.
  - [ ] Si `data[i] === target`: emitir paso final con `tipoOperacion: 'encontrado'`, `indicesActivos: [i]` y terminar.
  - [ ] Si se agota el arreglo sin coincidencias: emitir paso final con `tipoOperacion: 'no_encontrado'`, `indicesActivos: []`.
- **Aceptación**: Produce la secuencia exacta de pasos definida en los fixtures dorados (objetivo en extremos, intermedio y ausente).

### Task 5.0 — BE-05: Refactorizar `BinarySearch` eliminando ordenación silenciosa y soportando descarte
- **Archivos**: `src/simulations/engines/advanced-engines.ts` (o `binary-search.engine.ts`)
- **Subtasks**:
  - [ ] Eliminar la llamada interna silenciosa `.sort()` en `BinarySearch`. Si los datos no vienen ordenados, lanzar error de validación de dominio.
  - [ ] Calcular punto medio con fórmula determinista `mid = Math.floor((low + high) / 2)`.
  - [ ] Emitir `tipoOperacion: 'comparacion'` en `indicesActivos: [mid]`, registrando `rango: { bajo: low, medio: mid, alto: high }`.
  - [ ] Si `data[mid] === target`: emitir `tipoOperacion: 'encontrado'` con `indicesActivos: [mid]` y finalizar.
  - [ ] Si no coincide: emitir `tipoOperacion: 'descarte'` indicando el sub-rango descartado con marcadores visuales, actualizar límites (`low = mid + 1` o `high = mid - 1`) y continuar.
  - [ ] Si `low > high`: emitir paso final con `tipoOperacion: 'no_encontrado'`.
- **Aceptación**: Pasa los fixtures dorados sin reordenar datos internamente; emite transiciones semánticas de descarte y encontrado/no encontrado.

### Task 6.0 — BE-06: Implementar `BfsEngine` (Recorrido en Anchura)
- **Archivos**: `src/simulations/engines/bfs.engine.ts`, exportado en `registry.ts`
- **Subtasks**:
  - [ ] Implementar `BfsEngine` utilizando una cola FIFO explícita (`cola = [nodoInicio]`).
  - [ ] Mantener lista cronológica de nodos visitados y conjunto de visitados.
  - [ ] Emitir pasos de tipo `PasoGrafo`: `visita` con `nodoActual`, `frontera` (cola actual) y `visitados`.
  - [ ] Al descubrir vecinos no visitados, explorar en **orden ascendente por ID de nodo** y emitir `encolar` con `aristaActiva: [nodoActual, vecino]`.
  - [ ] Al vaciar la cola, emitir paso final con `tipoOperacion: 'final'`, `nodoActual: null` y la lista completa de visitados.
- **Aceptación**: Pasa los fixtures dorados para grafos lineales, árboles, grafos con ciclos y componentes no conexas.

### Task 7.0 — BE-07: Implementar `DfsEngine` (Recorrido en Profundidad Iterativo)
- **Archivos**: `src/simulations/engines/dfs.engine.ts`, exportado en `registry.ts`
- **Subtasks**:
  - [ ] Implementar `DfsEngine` de forma **iterativa con pila explícita LIFO** (`pila = [nodoInicio]`).
  - [ ] Explorar vecinos no visitados en orden determinista y emitir pasos semánticos de `visita`, `apilar`, `desapilar`.
  - [ ] Al vaciar la pila, emitir paso final con `tipoOperacion: 'final'`.
- **Aceptación**: Pasa los fixtures dorados; el orden de visita difiere de BFS sobre grafos con ciclos demostrando la naturaleza de profundidad.

### Task 8.0 — BE-08: Adaptar `registry.ts` para soporte multi-input y registro de nuevos engines
- **Archivos**: `src/simulations/engines/registry.ts`, `src/simulations/simulations.module.ts`
- **Subtasks**:
  - [ ] Registrar en `ENGINES: Record<string, AlgorithmDefinition>` los nuevos motores `'Breadth-First Search'` y `'Depth-First Search'`.
  - [ ] Adaptar la firma `executeWithTimeout(nombre: string, input: SimulationInput | number[]): Promise<SimulationStep[]>` envolviendo arreglos planos para mantener retrocompatibilidad.
  - [ ] Mantener y validar el timeout de seguridad de 10 segundos contra bucles infinitos (HU-06).
- **Aceptación**: Permite ejecutar indistintamente motores de arreglo y motores de grafo con captura adecuada de timeouts.

---

## A.3 API de simulación

### Task 9.0 — BE-09: Validación y generación de datos en `SimulationsService` (CO3)
- **Archivos**: `src/simulations/simulations.service.ts`
- **Subtasks**:
  - [ ] En búsquedas: validar que `objetivo` esté presente y sea un entero entre 0 y 999.
  - [ ] Para Búsqueda Binaria con `Personalizado`: validar que `valores` esté ordenado ascendentemente; si no lo está, lanzar `BadRequestException('Para la Búsqueda Binaria, el conjunto de datos personalizado debe estar ordenado ascendentemente')`.
  - [ ] Para Búsqueda Binaria con `Predeterminado`: generar arreglo aleatorio de 8 a 15 elementos y **ordenarlo ascendentemente** antes de simular, seleccionando un objetivo coherente.
  - [ ] Para Grafos: validar estructura de `grafo` (`nodos` $\ge 2$, `aristas` válidas, `nodoInicio` existente); en `Predeterminado`, asignar un grafo estándar predefinido.
  - [ ] Construir `SimulationInput`, delegar a `executeWithTimeout` y mapear los pasos en la respuesta respetando la unión discriminada.
- **Aceptación**: Petición de Búsqueda Binaria desordenada retorna 400 descriptivo; peticiones válidas de búsqueda y grafos retornan simulación estructurada según CO3.

### Task 10.0 — BE-10: Exportación de contrato Swagger / OpenAPI
- **Archivos**: `src/main.ts`
- **Subtasks**:
  - [ ] Verificar que los endpoints de simulación documenten la unión discriminada de pasos y los nuevos DTOs en `/docs` y `/docs-json`.
  - [ ] Exportar el archivo JSON de OpenAPI actualizado para su consumo en frontend.
- **Aceptación**: Endpoint `/docs-json` emite el contrato enriquecido sin errores de tipado en Swagger.

---

## A.4 Gamificación y Offline (Backend)

### Task 11.0 — BE-11: Biblioteca con categoría Grafos y Búsqueda
- **Archivos**: `src/algorithms/algorithms.service.ts`
- **Subtasks**:
  - [ ] Asegurar que `GET /api/biblioteca` devuelva dinámicamente las categorías disponibles (incluyendo `Busqueda` y `Grafos`), calculando `totalAlgoritmos` y tarjetas con `descripcion <= 140` caracteres.
- **Aceptación**: La respuesta agrupa los 4 algoritmos bajo sus categorías correspondientes.

### Task 12.0 — BE-12: Nuevos ejercicios de predicción y retos
- **Archivos**: `src/exercises/exercises.service.ts`, `src/exercises/dto/answer-exercise.dto.ts`
- **Subtasks**:
  - [ ] Ampliar la evaluación de ejercicios para validar respuestas de tipo secuencia de visita (para BFS/DFS), comparando arreglos de IDs de nodos en orden exacto.
  - [ ] Asegurar que un ejercicio completado correctamente otorgue puntos una sola vez (idempotencia en puntaje).
- **Aceptación**: Responder ejercicio de orden de visita con secuencia correcta otorga puntos; respuesta incorrecta devuelve feedback negativo sin sumar puntos.

### Task 13.0 — BE-13: Progreso e insignias
- **Archivos**: `src/progress/progress.service.ts`, `src/badges/badges.service.ts`
- **Subtasks**:
  - [ ] Registrar criterios de desbloqueo para las nuevas insignias de Búsqueda y Grafos al completar simulaciones o ejercicios.
- **Aceptación**: Insignias otorgadas correctamente en `GET /api/insignias/me`.

### Task 14.0 — BE-14: Sincronización offline (Sync)
- **Archivos**: `src/sync/sync.service.ts`, `src/offline/offline.service.ts`
- **Subtasks**:
  - [ ] Incluir módulos de búsqueda y grafos en `GET /api/modules/offline`.
  - [ ] Asegurar que `POST /api/progress/sync` acepte respuestas a ejercicios de secuencias de grafos con `clientEventId` idempotente.
- **Aceptación**: El reenvío de un mismo evento offline no duplica puntos ni altera la racha de días.

---

## A.5 Pruebas y Aseguramiento (Backend)

### Task 15.0 — BE-15: Suite de fixtures dorados compartidos
- **Archivos**: `test/fixtures/*.json`
- **Subtasks**:
  - [ ] Crear `linear-search.fixture.json` (búsqueda exitosa, fallida, casos borde).
  - [ ] Crear `binary-search.fixture.json` (búsqueda exitosa, fallida, descartes paso a paso).
  - [ ] Crear `bfs.fixture.json` (grafo conexo con ciclos, orden ascendente).
  - [ ] Crear `dfs.fixture.json` (grafo conexo con ciclos, orden ascendente con pila).
  - [ ] Copiar los mismos archivos de fixtures al repositorio frontend para pruebas de paridad offline.
- **Aceptación**: Los tests unitarios de backend pasan al 100 % contra estos fixtures.

### Task 16.0 — BE-16: Pruebas unitarias y de integración de engines y servicio
- **Archivos**: `src/simulations/engines/*.spec.ts`, `src/simulations/simulations.service.spec.ts`
- **Subtasks**:
  - [ ] Crear pruebas de invariantes: `numeroPaso` consecutivo desde 1, `lineaPseudocodigo` válida, determinismo en salida.
  - [ ] Crear test de rechazo 400 en Búsqueda Binaria con arreglo desordenado.
  - [ ] Crear test de generación aleatoria ordenada en Búsqueda Binaria predeterminada.
- **Aceptación**: 100 % de los tests funcionales de algoritmos en verde.

---

# PARTE B — FRONTEND (`brainsort-app`)

## B.1 Núcleo (`packages/core`)

### Task 17.0 — FE-01: Tipos compartidos y regeneración de contratos
- **Archivos**: `packages/core/src/types/step.types.ts`, `packages/core/src/types/simulation.types.ts`, `src/generated/api-types.ts`
- **Subtasks**:
  - [ ] En `step.types.ts`: actualizar `TipoOperacion` incorporando `descarte`, `encontrado`, `no_encontrado`, `visita`, `encolar`, `desencolar`, `apilar`, `desapilar`, preservando `idle`, `comparacion`, `intercambio`, `insercion`, `final`.
  - [ ] Definir la unión discriminada `SimulationStep = PasoArray | PasoGrafo` con `tipoEstructura?: 'array'` por defecto.
  - [ ] Definir `SimulationInput` en `simulation.types.ts` soportando tanto `data` + `objetivo` como `grafo` + `nodoInicio`.
  - [ ] Regenerar `src/generated/api-types.ts` a partir de OpenAPI una vez publicado Task 10.0 (BE-10).
- **Aceptación**: `tsc --noEmit` compila sin errores en `packages/core` y en `brainsort-app`.

### Task 18.0 — FE-02: Refactorización e implementación de engines en `packages/core`
- **Archivos**: `packages/core/src/engines/linear-search.ts`, `binary-search.ts`, `bfs.ts`, `dfs.ts`, `engine.interface.ts`, `index.ts`
- **Subtasks**:
  - [ ] Generalizar `AlgorithmEngine`: `execute(input: SimulationInput | number[]): SimulationStep[]`, manteniendo alias retrocompatible `SortEngine`.
  - [ ] Refactorizar `LinearSearchEngine`: recibir `input.objetivo`, emitir `comparacion` y terminar en `encontrado` o `no_encontrado`.
  - [ ] Refactorizar `BinarySearchEngine`: recibir `input.objetivo`, eliminar `.sort()` automático, emitir `comparacion`, `descarte`, `encontrado`, `no_encontrado`.
  - [ ] Implementar `BfsEngine`: idéntico a backend, vecinos en orden ascendente, pasos `visita`, `encolar`, `desencolar`, `final`.
  - [ ] Implementar `DfsEngine`: idéntico a backend, pila iterativa, vecinos en orden ascendente, pasos `visita`, `apilar`, `desapilar`, `final`.
  - [ ] Validar los 4 motores contra los mismos fixtures dorados de Task 15.0 (BE-15).
- **Aceptación**: 100 % de los casos de prueba de fixtures dorados pasan idénticos a los del backend; paridad offline garantizada.

### Task 19.0 — FE-03: Validadores de dataset en cliente (`dataset.validator.ts`)
- **Archivos**: `packages/core/src/validators/dataset.validator.ts`
- **Subtasks**:
  - [ ] Validar que algoritmos de búsqueda incluyan `objetivo` numérico entero.
  - [ ] Para Búsqueda Binaria: validar orden ascendente (`arr[i] <= arr[i+1]`); retornar error descriptivo y proveer helper `sugerirOrdenamiento(arr)`.
  - [ ] Validar grafos: al menos 2 nodos, sin aristas a nodos inexistentes, nodo de inicio válido.
- **Aceptación**: El validador bloquea entradas inválidas en el cliente antes de ser enviadas a la API o al motor local.

### Task 20.0 — FE-04: Layout geométrico determinista de grafos (`math/graph-layout.ts`)
- **Archivos**: `packages/core/src/math/graph-layout.ts`, `packages/core/src/math/coordinates.ts`
- **Subtasks**:
  - [ ] Implementar cálculo de coordenadas SVG de grafos mediante distribución circular determinista (sin `d3-force`).
  - [ ] Retornar posiciones de nodos `{ id, x, y, r, label }` y aristas `{ from, to, x1, y1, x2, y2, dirigida }`.
  - [ ] En `coordinates.ts`: agregar utilidades para marcar elementos descartados y punteros (`low`, `mid`, `high`) en barras.
- **Aceptación**: Mismo grafo de entrada produce exactamente las mismas coordenadas `(x, y)` estables en cada ejecución.

---

## B.2 Visualización

### Task 21.0 — FE-05: Implementar `ColorMapper` unificado y accesibilidad
- **Archivos**: `src/visualization/ColorMapper.ts`, `src/styles/colors.ts`, `src/visualization/AccessibilityIcons.tsx`, `src/components/simulation/BarChart.tsx`
- **Subtasks**:
  - [ ] Implementar `ColorMapper.ts` formalizando la paleta completa:
    - `idle` $\rightarrow$ `#4A90D9` (Azul)
    - `comparacion` $\rightarrow$ `#F5A623` (Amarillo)
    - `intercambio` $\rightarrow$ `#D0021B` (Rojo)
    - `insercion` $\rightarrow$ `#9B51E0` (Púrpura / Violeta)
    - `final` / `encontrado` $\rightarrow$ `#7ED321` (Verde)
    - `descarte` $\rightarrow$ `#6B7280` (Gris atenuado con opacidad 0.25)
    - `no_encontrado` $\rightarrow$ `#D0021B` (Rojo)
    - `visita` $\rightarrow$ `#F5A623` (Amarillo)
    - `encolar` / `apilar` $\rightarrow$ `#00D4FF` (Cian brillante)
    - `desencolar` / `desapilar` $\rightarrow$ `#FF8C00` (Naranja oscuro)
  - [ ] En `AccessibilityIcons.tsx`: asignar íconos SVG para cada estado (lupa, flechas, flecha abajo, cruz, check, línea tachada).
  - [ ] En `BarChart.tsx`: actualizar `getBarColor` para invocar a `ColorMapper` directamente y reflejar `insercion` con su color asignado.
- **Aceptación**: Ningún estado de simulación carece de color ni ícono; Insertion Sort y descartes se visualizan con sus colores correspondientes.

### Task 22.0 — FE-06: Renderizado de grafos (`GraphRenderer.tsx`) y selección dinámica de Canvas
- **Archivos**: `src/visualization/GraphRenderer.tsx`, `src/components/simulation/SimulationCanvas.tsx`
- **Subtasks**:
  - [ ] Crear `GraphRenderer.tsx` utilizando `react-native-svg` (`Circle`, `Line`, `Text`, `G`, marcadores para flechas).
  - [ ] Renderizar nodos coloreados según su estado (`idle`, `visita`, `frontera`, `final`), mostrando etiqueta y borde activo.
  - [ ] En `SimulationCanvas.tsx`: detectar `tipoEstructura`; si es `'array'`, renderizar `BarChart`; si es `'grafo'`, renderizar `GraphRenderer`.
  - [ ] Asegurar rendimiento fluido $\ge 24$ FPS en transiciones de paso (HU-04 DoD).
- **Aceptación**: Al abrir BFS o DFS se renderiza el grafo vectorial; al abrir algoritmos de ordenamiento se renderizan las barras.

### Task 23.0 — FE-07: Panel pedagógico de frontera y visitados (`FrontierPanel.tsx`)
- **Archivos**: `src/components/simulation/FrontierPanel.tsx`, `src/components/simulation/ComplexityInfo.tsx`
- **Subtasks**:
  - [ ] Crear `FrontierPanel.tsx`: mostrar visualmente la estructura de datos activa (Cola para BFS, Pila para DFS) con IDs de nodos en espera.
  - [ ] Mostrar en `FrontierPanel.tsx` la secuencia cronológica acumulada de nodos visitados en tiempo real.
  - [ ] En `ComplexityInfo.tsx`: dar soporte a notaciones Big-O compuestas ($O(V+E)$, $O(V)$, $O(\log n)$).
- **Aceptación**: El usuario ve cómo entran y salen nodos de la cola/pila en cada paso de BFS y DFS.

---

## B.3 Lógica (Hooks) y Servicios

### Task 24.0 — FE-08: Adaptación de hooks de simulación y dataset
- **Archivos**: `src/hooks/useDataset.ts`, `src/hooks/useSimulation.ts`, `src/hooks/useSimulationEngine.ts`, `src/context/SimulationContext.tsx`
- **Subtasks**:
  - [ ] En `useDataset.ts`: incorporar control del valor `objetivo` para búsquedas, validación de orden en binaria con helper de auto-ordenado, y selector de grafos/nodo de inicio.
  - [ ] En `useSimulation.ts` y `SimulationContext.tsx`: generalizar el estado de frame para almacenar tanto barras como nodos/aristas, manteniendo controles universales (play, pausa, paso a paso, velocidad $[0.25, 2.0]$, reinicio).
  - [ ] En `useSimulationEngine.ts`: ejecutar el engine del core enviando el objeto `SimulationInput`.
- **Aceptación**: Controles de simulación funcionan idénticos para búsqueda y grafos; Búsqueda Binaria previene ejecución con datos desordenados en cliente.

### Task 25.0 — FE-09: Adaptación de servicios API
- **Archivos**: `src/services/simulation.service.ts`, `src/services/exercise.service.ts`
- **Subtasks**:
  - [ ] En `simulation.service.ts`: enviar el payload completo `CreateSimulationDto` con `objetivo` o `grafo` y tipar la respuesta con la unión discriminada.
  - [ ] En `exercise.service.ts`: soportar envío de secuencias de visita en respuestas de ejercicios.
- **Aceptación**: Las llamadas a la API envían el payload validado y reciben los pasos sin errores de tipado.

---

## B.4 Pantallas, Navegación y UI

### Task 26.0 — FE-10: Pantalla de detalle de algoritmo y enlace a ejercicios (D9)
- **Archivos**: `src/screens/library/AlgorithmDetailScreen.tsx`, `src/navigation/LibraryStackNavigator.tsx`
- **Subtasks**:
  - [ ] En `AlgorithmDetailScreen.tsx`: mostrar contenido teórico de Búsqueda Lineal, Búsqueda Binaria, BFS y DFS con sus complejidades.
  - [ ] Incorporar un botón destacado: "Practicar Ejercicios", que permita al usuario ir directamente a los ejercicios de predicción del algoritmo en estudio.
  - [ ] En `LibraryStackNavigator.tsx`: registrar la pantalla `ExerciseScreen` como ruta dentro del stack de Biblioteca con parámetro `{ algoritmoId, algoritmoNombre }`.
- **Aceptación**: El usuario puede acceder a los ejercicios del algoritmo desde su vista de detalle sin perder el contexto.

### Task 27.0 — FE-11: Pantalla de simulación con entradas contextuales y `CompletionOverlay` (D9)
- **Archivos**: `src/screens/simulation/SimulationScreen.tsx`, `src/components/simulation/CompletionOverlay.tsx`
- **Subtasks**:
  - [ ] En `SimulationScreen.tsx`: renderizar controles contextuales (`TargetInput` si es búsqueda; selector de grafo y picker de `nodoInicio` si es grafo).
  - [ ] En `CompletionOverlay.tsx`: mostrar resumen y mensaje de finalización según el algoritmo (encontrado/no encontrado en búsqueda; secuencia visitada en grafos).
  - [ ] Agregar en `CompletionOverlay.tsx` el botón de acción directa: "Practicar con un ejercicio" hacia `ExerciseScreen` con `algoritmoId`.
  - [ ] Mantener botones "Reiniciar" y "Siguiente Algoritmo"; auto-cierre tras 5 segundos de inactividad.
- **Aceptación**: Al finalizar la simulación, el overlay ofrece feedback claro y permite saltar directamente a ejercitar lo aprendido.

### Task 28.0 — FE-12: Gamificación (Tareas y Retos de Predicción)
- **Archivos**: `src/components/gamification/PredictionExercise.tsx`, `src/screens/gamification/ExerciseScreen.tsx`
- **Subtasks**:
  - [ ] En `PredictionExercise.tsx`: dar soporte al modo de respuesta de secuencia (tocar nodos del grafo en el orden que los visitaría el algoritmo).
  - [ ] Bloqueo de doble envío mientras la respuesta está en tránsito; feedback inmediato explicativo.
- **Aceptación**: El usuario puede completar retos de secuencia de BFS/DFS y recibe sus puntos.

---

## B.5 Offline

### Task 29.0 — FE-13: Almacenamiento local y sincronización de nuevos algoritmos
- **Archivos**: `src/storage/sqlite/modules.dao.ts`, `src/storage/indexeddb/modules.store.ts`, `src/hooks/useSync.ts`
- **Subtasks**:
  - [ ] Asegurar que los módulos descargables de Búsqueda y Grafos se almacenen localmente (pseudocódigo, teoría y ejercicios).
  - [ ] Al completar ejercicios sin conexión, encolar en `pending-sync` con `clientEventId` y sincronizar automáticamente al reconectar.
- **Aceptación**: Simulación y ejercicios funcionan en modo avión; al restablecer red, el progreso se refleja en el servidor.

---

# PARTE C — Orden sugerido y criterios de cierre

## C.1 Orden de ejecución por fases

| Fase | Tasks | Objetivo |
|---|---|---|
| **1** | Task 1.0 (BE-01), Task 2.0 (BE-02), Task 17.0 (FE-01) | Modelos de datos, migración de base de datos y tipos compartidos |
| **2** | Task 15.0 (BE-15 Fixtures), Task 4.0 (BE-04), Task 5.0 (BE-05), Task 6.0 (BE-06), Task 7.0 (BE-07), Task 18.0 (FE-02) | Motores de ejecución en backend y core alineados al 100 % con fixtures dorados |
| **3** | Task 3.0 (BE-03), Task 8.0 (BE-08), Task 9.0 (BE-09), Task 19.0 (FE-03), Task 20.0 (FE-04), Task 21.0 (FE-05) | Seed, servicio de simulación, matemáticas de grafos y ColorMapper unificado |
| **4** | Task 22.0 (FE-06), Task 23.0 (FE-07), Task 24.0 (FE-08), Task 26.0 (FE-10), Task 27.0 (FE-11) | UI, Canvas de grafos, panel de frontera, navegación y CompletionOverlay |
| **5** | Task 11.0 (BE-11), Task 12.0 (BE-12), Task 13.0 (BE-13), Task 14.0 (BE-14), Task 28.0 (FE-12), Task 29.0 (FE-13) | Gamificación (retos y ejercicios) y módulo offline |
| **6** | Task 16.0 (BE-16) | Ejecución de pruebas y validación final de criterios de cierre |

---

## C.2 Definición de "Terminado" (DoD del Sprint)

- [ ] **Meta 1 — Correctitud**: Los 4 algoritmos (Lineal, Binaria, BFS, DFS) pasan el 100 % de los casos de prueba definidos en backend (`brainsort-api`) y en cliente (`packages/core`) contra los mismos fixtures dorados sin ninguna divergencia.
- [ ] **Meta 2 — Cero Defectos**: 0 defectos críticos o altos abiertos al cerrar el sprint; Búsqueda Binaria maneja consistentemente arreglos ordenados y rechaza desordenados con 400 descriptivo.
- [ ] **Meta 3 — Gamificación**: 100 % de los nuevos ejercicios y retos cumplen criterios de aceptación, son accesibles desde el detalle y final de simulación y otorgan puntos una sola vez de forma idempotente.
- [ ] **Regresión**: Los 11 algoritmos preexistentes (Bubble, Selection, Insertion, Merge, Quick, Heap, Stack, Queue, Linked List, Deque, Priority Queue, Segment Tree) siguen compilando y ejecutándose sin regresión.
- [ ] **Accesibilidad y Rendimiento**: Ningún estado de simulación depende exclusivamente del color (`AccessibilityIcons`); el renderizado de grafos y barras sostiene $\ge 24$ FPS.