# ⚠️ Tareas Faltantes — Información No Especificada en los SPECS

> **Propósito**: Este documento registra los puntos que **no están definidos** en la documentación original del proyecto y que requieren decisión del equipo antes o durante la implementación.
> **Regla**: Ninguno de estos valores ha sido inventado. Cada punto lista el contexto donde se necesita y el impacto si no se define.

---

## 1. Ejercicios de Predicción — Datos Iniciales (Seed)

**Contexto**: El archivo `03-base-de-datos.md` define seed data para `Algoritmo` (3 algoritmos) e `Insignia` (4 insignias), pero **no incluye datos iniciales** para la entidad `EjercicioPrediccion`.

**Impacto**: Sin ejercicios pre-cargados, los endpoints `GET /api/ejercicios/:algoId` y `POST /api/ejercicios/:id/responder` retornarán listas vacías, haciendo la funcionalidad de gamificación inoperativa al inicio.

**Decisión requerida**:
- [ ] Definir al menos 3 ejercicios por algoritmo de ordenamiento.
- [ ] Especificar: `pregunta`, `respuestaCorrecta`, `dificultad` (Facil/Medio/Dificil), `feedbackPositivo`, `feedbackNegativo`.
- [ ] Asociar cada ejercicio a un `algoritmoId`.

**Ejemplo de estructura esperada**:
```json
{
  "pregunta": "Dado el arreglo [5, 2, 8, 1], ¿cuál es el resultado después de la primera pasada completa de Bubble Sort?",
  "respuestaCorrecta": "[2, 5, 1, 8]",
  "dificultad": "Facil",
  "feedbackPositivo": "¡Correcto! Bubble Sort mueve el elemento mayor al final en cada pasada.",
  "feedbackNegativo": "Incorrecto. Recuerda que Bubble Sort compara elementos adyacentes y los intercambia si están desordenados.",
  "algoritmoId": "<uuid-bubble-sort>"
}
```

---

## 2. Fórmula de Cálculo de Niveles

**Contexto**: El modelo `ProgresoUsuario` tiene `nivelActual` (default 1) y `puntosTotales` (default 0). Los SPECS mencionan que el nivel se actualiza al ganar puntos, pero **no especifican la fórmula** o umbrales para subir de nivel.

**Impacto**: Sin esta definición, `progress.service.ts` y `exercises.service.ts` no pueden recalcular `nivelActual` correctamente.

**Decisión requerida**:
- [ ] Definir fórmula o tabla de umbrales (ej: `nivel = floor(puntosTotales / 100) + 1`).
- [ ] ¿Existe un nivel máximo?
- [ ] ¿Los niveles siguen una progresión lineal o exponencial?

**Ejemplo de posibles estrategias**:
| Estrategia | Fórmula | Nivel 1 | Nivel 5 | Nivel 10 |
|---|---|---|---|---|
| Lineal (100 pts c/u) | `floor(pts/100) + 1` | 0 pts | 400 pts | 900 pts |
| Exponencial | `floor(sqrt(pts/50)) + 1` | 0 pts | 800 pts | 4,500 pts |
| Por tabla | Definido manualmente | 0 pts | Personalizado | Personalizado |

---

## 3. Puntos Otorgados por Tipo de Actividad

**Contexto**: Los SPECS mencionan "sumar puntos" al responder correctamente un ejercicio y en la sincronización, pero **no definen cuántos puntos** se otorgan por cada tipo de actividad. Solo aparece `25` en un ejemplo de response de ejercicio (04-contratos-api.md, línea 354).

**Impacto**: Sin esta información, la lógica de `exercises.service.ts`, `progress.service.ts` y `sync.service.ts` no puede calcular puntos correctamente.

**Decisión requerida**:
- [ ] Puntos por ejercicio correcto (¿varía según dificultad?).
- [ ] Puntos por simulación completada.
- [ ] Puntos por racha de días (¿bonus?).
- [ ] ¿Se otorgan puntos por sesiones sincronizadas offline?

**Ejemplo de tabla necesaria**:
| Actividad | Puntos |
|---|---|
| Ejercicio correcto (Fácil) | ¿? |
| Ejercicio correcto (Medio) | ¿? |
| Ejercicio correcto (Difícil) | ¿? |
| Simulación completada | ¿? |
| Bonus racha 7 días | ¿? |

---

## 4. Criterios Exactos de Desbloqueo de Insignias

**Contexto**: El seed de `03-base-de-datos.md` define 4 insignias con `criterioDesbloqueo` como texto descriptivo:
1. "Completar 1 simulación"
2. "Visualizar 3 algoritmos"
3. "rachaDías >= 7"
4. "Completar todos los algoritmos de Ordenamiento"

Pero **no define reglas programáticas** formales (queries, condiciones, triggers).

**Impacto**: `badges.service.ts` necesita saber exactamente cuándo verificar y otorgar insignias.

**Decisión requerida**:
- [ ] ¿Se verifican insignias automáticamente después de cada actividad o bajo demanda?
- [ ] Para "Completar todos los algoritmos de Ordenamiento": ¿se requiere completar la simulación, los ejercicios, o ambos?
- [ ] ¿Se pueden agregar insignias nuevas desde el panel de administrador?
- [ ] Definir la lógica booleana exacta para cada criterio.

---

## 5. Gestión de Autenticación del Administrador

**Contexto**: El modelo de datos define `Administrador` como entidad **separada** de `Usuario` (tabla `administradores` vs. tabla `usuarios`). Sin embargo, el `AuthModule` en `01-backend-api.md` solo describe lógica de login que busca por `correo` en la tabla `Usuario`.

**Impacto**: No queda claro cómo se autentica un administrador en el sistema.

**Decisión requerida**:
- [ ] ¿El administrador usa el mismo endpoint `/api/auth/login`? Si es así, ¿el service busca primero en `Usuario` y luego en `Administrador`?
- [ ] ¿O existe un endpoint separado como `/api/auth/admin/login`?
- [ ] ¿El campo `credencialesAdmin` del modelo Administrador reemplaza al campo `rol` del modelo Usuario?
- [ ] ¿Puede un Administrador tener también un registro en la tabla `Usuario`?

---

## 6. Almacenamiento de Assets para Módulos Offline

**Contexto**: El endpoint `GET /api/modules/offline/:id/download` retorna URLs de descarga:
```json
{
  "url": "https://brainsort-assets.example.com/bubble-sort-v1.0.0.json",
  "wasmUrl": "https://brainsort-assets.example.com/bubble-sort-v1.0.0.wasm",
  "expiresIn": 3600
}
```

Pero `brainsort-assets.example.com` es un **placeholder**. No se especifica el proveedor real de almacenamiento.

**Impacto**: `offline.service.ts` no puede generar URLs reales de descarga sin saber dónde se alojan los archivos.

**Decisión requerida**:
- [ ] ¿Qué servicio de almacenamiento se usará? (AWS S3, Google Cloud Storage, Railway, Cloudflare R2, etc.)
- [ ] ¿Las URLs serán pre-firmadas (signed URLs) con expiración?
- [ ] ¿Los archivos se generan estáticamente o se construyen dinámicamente?
- [ ] ¿Presupuesto estimado para almacenamiento?

---

## 7. WASM: Compilación y Módulos Soportados

**Contexto**: La documentación menciona:
- Emscripten SDK para compilar intérpretes C++/Python → WebAssembly.
- Solo Android soporta WASM (iOS excluido por restricciones Apple).
- Módulos WASM opcionales de 20-50 MB cada uno.

Pero **no se detalla**:
- Qué intérpretes específicos compilar.
- Qué flujo de build usar.
- Qué funcionalidad exacta se ejecuta en WASM vs. JS/TS.

**Impacto**: No se pueden crear los módulos WASM ni el pipeline de compilación.

**Decisión requerida**:
- [ ] ¿Qué intérpretes compilar a WASM? (ej: CPython, MicroPython, Clang REPL)
- [ ] ¿Para qué se usarán? (ej: permitir al usuario escribir código en C++/Python para ejecutar algoritmos)
- [ ] ¿Cuál es la versión target de cada intérprete?
- [ ] ¿Se necesita un CI pipeline separado para la compilación WASM?

---

## 8. Mapeo de Líneas de Pseudocódigo para Engines

**Contexto**: Cada `SimulationStep` incluye `lineaPseudocodigo` (número de línea del pseudocódigo que se está ejecutando). El seed de `03-base-de-datos.md` define el pseudocódigo de 3 algoritmos, pero **solo Bubble Sort tiene ejemplo** de mapeo en el response de simulación.

**Impacto**: Los engines de Selection Sort e Insertion Sort no pueden generar `lineaPseudocodigo` correctamente sin un mapeo explícito.

**Decisión requerida**:
- [ ] Definir el mapeo línea-por-línea del pseudocódigo de **Selection Sort**.
- [ ] Definir el mapeo línea-por-línea del pseudocódigo de **Insertion Sort**.
- [ ] ¿Se numera desde 1 o desde 0?
- [ ] ¿Cada operación del engine corresponde exactamente a una línea, o pueden existir pasos intermedios?

**Pseudocódigos a mapear**:

### Selection Sort
```
Línea 1: PARA i = 0 HASTA n-1
Línea 2:   minIdx = i
Línea 3:   PARA j = i+1 HASTA n
Línea 4:     SI arreglo[j] < arreglo[minIdx]
Línea 5:       minIdx = j
Línea 6:   INTERCAMBIAR(arreglo[i], arreglo[minIdx])
```

### Insertion Sort
```
Línea 1: PARA i = 1 HASTA n
Línea 2:   clave = arreglo[i]
Línea 3:   j = i - 1
Línea 4:   MIENTRAS j >= 0 Y arreglo[j] > clave
Línea 5:     arreglo[j+1] = arreglo[j]
Línea 6:     j = j - 1
Línea 7:   arreglo[j+1] = clave
```

---

## Resumen

| # | Tema | Prioridad | Bloquea |
|---|---|---|---|
| 1 | Seed de ejercicios | 🔴 Alta | Gamificación completa |
| 2 | Fórmula de niveles | 🔴 Alta | ProgressService, ExercisesService |
| 3 | Puntos por actividad | 🔴 Alta | ProgressService, ExercisesService, SyncService |
| 4 | Criterios de insignias | 🟡 Media | BadgesService |
| 5 | Auth de Administrador | 🔴 Alta | AuthModule, CRUD de algoritmos |
| 6 | Storage de assets offline | 🟡 Media | OfflineService |
| 7 | WASM compilación | 🟢 Baja | Módulos WASM Android (feature opcional) |
| 8 | Mapeo pseudocódigo | 🟡 Media | Engines Selection/Insertion Sort |
