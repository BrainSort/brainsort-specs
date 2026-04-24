# 📝 Registro de Cambios en Documentación

> **Propósito**: Este archivo documenta los cambios **significativos** que se han hecho en las SPECS y que **difieren o extienden** la documentación original (`.docx`, `.uml`, `.pdf`). Cada cambio incluye la justificación técnica y la referencia al documento original afectado.

---

## CDR-001: Engine Auto-Contenido (Pseudocódigo migrado de DB a Engine)

**Fecha**: 2026-04-16
**Documentación original afectada**: `BrainSort-Modelo_del_Dominio.docx` — Entidad `Algoritmo`
**Archivos SPECS modificados**:
- `plan-de-implementacion/01-backend-api.md` — §2.4 SimulationsModule (interfaz AlgorithmDefinition)
- `plan-de-implementacion/03-base-de-datos.md` — Modelo Algoritmo (pseudo eliminado de DB)
- `plan-de-implementacion/04-contratos-api.md` — Respuesta de simulación incluye pseudocode[]
- `features/library-simulation.plan.md` — Modelo de datos actualizado
- `task/task_breakdown.md` — Tareas T-BE-059 a T-BE-063 reescritas

### ¿Qué cambió?
El campo `pseudocódigo` del modelo `Algoritmo` fue **removido de la base de datos** y trasladado al **archivo engine** de cada algoritmo.

### ¿Por qué?
El Modelo del Dominio original define `Algoritmo.pseudocódigo: Text`. Para 3 algoritmos, almacenarlo en la DB y mapear líneas aparte funciona. Pero BrainSort escalará a **120+ algoritmos**, lo que hace insostenible:
1. Mantener el pseudocódigo en la DB **Y** el mapeo de líneas en el engine por separado → se desincronizan.
2. Un cambio en el pseudocódigo requiere tocar el seed Y el engine → doble mantenimiento.
3. 120+ strings largos de pseudocódigo en el seed → archivo inmanejable.

### ¿Cómo queda ahora?
Cada engine es un archivo **auto-contenido** que exporta una interfaz `AlgorithmDefinition`:
```typescript
export interface AlgorithmDefinition {
  meta: { nombre, descripcion, complejidadTiempo, complejidadEspacio, categoria };
  pseudocode: PseudocodeLine[];   // ← Ahora vive AQUÍ, no en la DB
  execute(data: number[]): SimulationStep[];
}
```

- **1 archivo = 1 algoritmo** (meta + pseudocódigo + lógica + mapeo de líneas).
- La DB solo guarda metadatos del algoritmo (nombre, descripción, complejidad, categoría).
- El pseudocódigo y sus líneas **nunca se desincronizan** porque están en el mismo archivo.

### Impacto en el Modelo del Dominio original
| Campo original | Estado | Justificación |
|---|---|---|
| `Algoritmo.nombre` | ✅ Se mantiene en DB | Necesario para búsqueda y unicidad |
| `Algoritmo.descripción` | ✅ Se mantiene en DB | Contenido editable por Admin |
| `Algoritmo.complejidadTiempo` | ✅ Se mantiene en DB | Metadata de visualización |
| `Algoritmo.complejidadEspacio` | ✅ Se mantiene en DB | Metadata de visualización |
| `Algoritmo.pseudocódigo` | ⚠️ **Migrado al engine** | Ahora es propiedad del archivo engine, no de la DB |
| `Algoritmo.categoría` | ✅ Se mantiene en DB | Necesario para filtros |

---

## CDR-002: ESLint 9.x → 8.57.0

**Fecha**: 2026-04-16
**Documentación original afectada**: `BrainSort-Documento_Arquitectura_Software.docx` (dice "ESLint & Prettier" sin versión)
**Archivos SPECS modificados**: `01-backend-api.md`, `02-frontend-app.md`, `task_breakdown.md`

### ¿Qué cambió?
ESLint `^9.x` rebajado a `^8.57.0` en ambos repositorios.

### ¿Por qué?
ESLint 9 usa Flat Config de forma mandatoria. `eslint-config-expo` (requerido por el stack documentado) usa configuraciones legacy incompatibles. La doc original no especifica versión, por lo que `^8.57.0` (compatible nativo con Expo) es la elección correcta.

---

## CDR-003: Criterios de Insignias — Evaluación Hardcoded

**Fecha**: 2026-04-16
**Documentación original afectada**: `BrainSort-Modelo_del_Dominio.docx` — Entidad `Insignia.criterioDesbloqueo`
**Archivos SPECS modificados**: `features/gamification-exercises.plan.md` §6

### ¿Qué cambió?
Se definió formalmente **cómo** se evalúan los criterios de desbloqueo de insignias.

### ¿Por qué?
El modelo original define `criterioDesbloqueo: String` pero no especifica el mecanismo de evaluación. Se adoptó un enfoque hardcoded (map de funciones booleanas en `BadgesService`) con triggers event-driven y caché en memoria.

### Impacto
Ningún cambio en el esquema de datos. Solo se documentó la lógica de evaluación que era implícita.

---

## CDR-004: Módulos Offline — JSON Directo (Sin Bucket Externo)

**Fecha**: 2026-04-16
**Documentación original afectada**: `BrainSort-Documento_Arquitectura_Software.docx` §Offline
**Archivos SPECS modificados**:
- `plan-de-implementacion/04-contratos-api.md` — §8 Offline Module (respuestas reescritas)
- `task/tareas-faltantes.md` — Punto 6 resuelto

### ¿Qué cambió?
El endpoint `GET /api/modules/offline/:id/download` ya **no** retorna URLs a un bucket externo (`brainsort-assets.example.com`). Ahora retorna el contenido completo del módulo como JSON directamente.

### ¿Por qué?
1. `brainsort-assets.example.com` era un **placeholder** — no existía ningún bucket real.
2. Con el patrón Engine Auto-Contenido (CDR-001), el backend ya tiene todo lo que el módulo offline necesita: metadatos (DB) + pseudocódigo (engine) + ejercicios (DB).
3. Cada módulo pesa ~10-15 KB en JSON — no justifica un bucket externo.
4. Presupuesto de almacenamiento: $0 (se sirve desde Railway).

### ¿Cuándo SÍ se necesitaría un bucket externo?
Solo si se implementan los módulos WASM opcionales (20-50 MB, solo Android), que están en el punto 7 como prioridad 🟢 Baja.

---

## CDR-006: Enforcement Local de Ramas y Format con Husky

**Fecha**: 2026-04-19
**Documentación original afectada**: N/A (Estrategia DevOps implícita)
**Archivos SPECS modificados**: `plan-de-implementacion/05-despliegue-devops.md`

### ¿Qué cambió?
Se agregó la dependencia `husky` en la configuración de `devDependencies` de ambos repositorios (`brainsort-api`, `brainsort-app`) y se estructuró un script de Bash para el hook `pre-commit`.

### ¿Por qué?
El plan DevOps original definía una política estricta de nombramiento de Git (`feature/<nombre>`, `dev`, `main`) y ejecución obligatoria del linter (ESLint/Prettier). Sin embargo, esto solo se comprobaba de forma tardía en el pipeline remoto de *Integración Continua (CI)* de GitHub Actions. Esto generaba un mal Developer Experience (DX) ya que el desarrollador descubría sus violaciones del linter después de empujar el PR. 

Al instalar un *hook* local (*Shift-Left Testing*), la validación a la Expresión Regular de DevOps y el chequeo estático del linter suceden en la computadora del desarrollador un segundo antes de poder crear el *commit*, evitando saturar la nube con PRs defectuosos.

### Impacto
- **Nuevo Bloqueo**: Imposibilidad de guardar código (`git commit`) si la rama tiene nombres como `task/...`, `frontend/...` o `copilot/...`.
- **Nuevo Bloqueo**: Imposibilidad de guardar código si `npm run lint` halla errores estáticos o de formato en `brainsort-api` y `brainsort-app`.

---

## CDR-007: Corrección de Trazabilidad HU-01 (Evidencia vs Estado)

**Fecha**: 2026-04-19
**Documentación original afectada**: `task/task_roadmap_HU01.md`, `task/task_breakdown.md`
**Archivos SPECS modificados**:
- `task/task_roadmap_HU01.md`
- `task/task_breakdown.md`

### ¿Qué cambió?
Se corrigió el estado de tareas marcadas como completadas para reflejar únicamente trabajo con evidencia de ejecución en entorno:
- `Fase 4`, punto `Verificar que los datos queden disponibles para la biblioteca` volvió a estado pendiente.
- `T-BE-022` (`npx prisma migrate dev --name init`) volvió a estado pendiente.

### ¿Por qué?
Durante la implementación se completaron cambios de código (schema, seed y migración SQL), pero no se pudo ejecutar la verificación end-to-end de datos en biblioteca ni correr la migración inicial con base PostgreSQL activa en el entorno local de esta sesión.

### Impacto
Mejora la confiabilidad del tracking del proyecto: el tablero refleja avance real validado y evita falsos positivos de cierre de fase.

---

## CDR-008: Corrección del Modelo del Dominio — Campo `dificultad` en Algoritmo

**Fecha**: 2026-04-23
**Documentación original afectada**: `BrainSort-Modelo_del_Dominio.docx`, `BrainSort-Historias_de_Usuario.docx` (HU-01)
**Archivos SPECS modificados**:
- `plan-de-implementacion/03-base-de-datos.md` — Modelo Algoritmo (dificultad añadido)
- `plan-de-implementacion/01-backend-api.md` — DTOs de algoritmo (dificultad añadido)
- `plan-de-implementacion/04-contratos-api.md` — Respuestas CO1/CO2 incluyen dificultad

### ¿Qué cambió?
El campo `dificultad` fue **añadido al modelo `Algoritmo`** en la base de datos. Este campo había sido omitido inicialmente en la traducción a SPECS, pero existe en la documentación original del modelo del dominio y es requerido por la HU-01 para la visualización de tarjetas en la biblioteca.

### ¿Por qué?
La Historia de Usuario HU-01 especifica que cada tarjeta de algoritmo en la biblioteca debe mostrar un **nivel de dificultad visual** (colores o estrellas) para que el usuario pueda decidir qué estudiar. Este atributo existe explícitamente en el modelo conceptual del dominio original.

### Impacto en el Modelo del Dominio
| Campo | Estado | Justificación |
|---|---|---|
| `Algoritmo.dificultad` | ✅ **Añadido a la DB** | Requerido por HU-01 para nivel visual en tarjetas (Facil, Medio, Dificil) |

### Diferencia con EjercicioPrediccion.dificultad
Es importante notar que **ambos** modelos tienen un campo `dificultad`:
- `Algoritmo.dificultad`: Describe la dificultad general del algoritmo (para tarjetas de biblioteca, HU-01).
- `EjercicioPrediccion.dificultad`: Describe la dificultad específica del ejercicio (para cálculo de puntos, gamificación).
