# Testing & Quality Assurance Specification

> **Fuente de verdad**: Entregable U4-EJ26, IEEE 829-2008, `constitution.md`, `library-simulation.spec.md`, `architecture-auth.spec.md`

## 1. Context & Motivation

BrainSort requiere un proceso de pruebas formal que valide la correcta implementación de sus funcionalidades principales: autenticación, biblioteca de algoritmos, simulaciones visuales, ejercicios de predicción, gamificación e insignias. Las pruebas automatizadas garantizan la estabilidad del software durante su evolución y proporcionan evidencia verificable de calidad.

## 2. Alcance de Pruebas

### In-Scope

**Backend (`brainsort-api`) — 13 módulos:**
- `AuthModule`: Registro, login dual (usuario/admin), refresh tokens, rate-limiting
- `UsersModule`: Consulta y actualización de perfil
- `AlgorithmsModule`: Biblioteca categorizada, CRUD (admin), filtros por categoría/nombre/tags
- `SimulationsModule`: Generación de simulaciones, validación de datos, engines de ordenamiento
- `ExercisesModule`: Evaluación de respuestas, cálculo de puntos, feedback, rachas
- `ProgressModule`: Progreso del usuario, niveles, ranking
- `BadgesModule`: Sistema de insignias con criterios de desbloqueo y caché
- `SyncModule`: Sincronización batch de progreso offline
- `OfflineModule`: Descarga de módulos para modo offline
- `DiagnosticsModule`: Test diagnóstico inicial
- `LearningPathModule`: Ruta de aprendizaje personalizada
- `PrismaModule`: Capa de acceso a datos
- `CommonModule`: Filtros de excepción, interceptores, pipes de validación

**Frontend (`brainsort-app`) — Lógica pura:**
- `packages/core/engines/`: Engines de Bubble Sort, Selection Sort, Insertion Sort, Merge Sort
- `packages/core/validators/`: Validación de datasets de entrada
- `packages/core/math/`: Cálculos de escalas y coordenadas SVG

### Out-of-Scope
- Pruebas de rendimiento en dispositivos físicos (requiere lab)
- Pruebas de seguridad/penetración (requiere herramientas especializadas)
- Pruebas de usabilidad con usuarios reales (requiere participantes)

## 3. Estrategia de Pruebas

### 3.1 Niveles de Prueba

| Nivel | Qué se prueba | Herramienta | Ubicación |
|---|---|---|---|
| **Unitarias** | Services individuales con mocks de Prisma y dependencias | Jest + @nestjs/testing | `src/**/*.service.spec.ts` |
| **Integración** | Flujos HTTP completos endpoint-a-endpoint | Fastify inject + Jest | `test/*.e2e-spec.ts` |
| **Sistema (E2E)** | Flujo de usuario completo multi-módulo | Manual / Expo Go | Documentado en informe |
| **Rendimiento** | FPS durante animación, tiempo de carga | React DevTools Profiler | Documentado en informe |

### 3.2 Enfoque por Módulo

| Módulo | Unitarias | E2E | Prioridad |
|---|---|---|---|
| Auth | ✅ 10 tests | ✅ 9 tests | Crítica |
| Users | ✅ 7 tests | — | Alta |
| Algorithms | ✅ 4 tests | ✅ Existente | Crítica |
| Simulations | ✅ 10 tests | ✅ Existente | Crítica |
| Exercises | ✅ 7 tests | ✅ Nuevo | Crítica |
| Progress | ✅ 6 tests | ✅ Nuevo | Alta |
| Badges | ✅ 7 tests | — | Alta |
| Sync | ✅ 5 tests | — | Media |
| Engines (FE) | ✅ 18 tests (6×3) | — | Crítica |
| Validators (FE) | ✅ 5 tests | — | Alta |

## 4. Criterios de Aceptación

| Criterio | Métrica | Umbral |
|---|---|---|
| Cobertura de líneas (services) | Jest `--coverage` | ≥ 80% |
| Cobertura de líneas (controllers) | Jest `--coverage` | ≥ 70% |
| Casos críticos | Tests marcados como Crítica | 100% PASADOS |
| Total de tests | Todos los CPs del catálogo | ≥ 95% pasando |
| Defectos bloqueantes | Severidad Crítica abiertos | 0 |
| FPS simulación | Bubble Sort 15 elem, 2.0x | ≥ 24 FPS |
| Tiempo de carga | Desde tap hasta barras visibles | < 3 segundos |

### Criterios de Rechazo
- Más de 1 defecto Crítico sin resolver
- Build roto (`npm run build` o `tsc --noEmit` falla)
- FPS < 18 en cualquier algoritmo con 15 elementos
- Tests E2E de autenticación fallando

## 5. Ambiente de Pruebas

| Componente | Especificación |
|---|---|
| SO Desarrollo | Windows 11 |
| Runtime | Node.js v20.x LTS, npm v10.x |
| Backend | NestJS 10.x, Fastify 10.x, Prisma 5.x |
| Frontend | Expo SDK 51, React Native 0.74.x, React 18.x |
| Base de datos | PostgreSQL v15+ (Docker local) |
| IDE | VS Code con ESLint + Prettier |
| Framework de test | Jest 29.x, @nestjs/testing 10.x |

### Datos de Prueba
- Arreglo base: `[5, 2, 8, 1, 9, 3, 7, 4]`
- Arreglo mínimo: `[3, 1]` (2 elementos)
- Arreglo máximo: `[15,14,13,...,2,1]` (15 elementos, orden inverso)
- Arreglo ya ordenado: `[1, 2, 3, 4, 5, 6, 7, 8]`
- Arreglo con duplicados: `[5, 3, 5, 1, 3, 8, 1]`
- Email válido: `test@example.com`
- Contraseña válida: `Password123!` (≥8 chars)
- Contraseña inválida: `123` (< 8 chars)

## 6. Trazabilidad con Historias de Usuario

| HU | Funcionalidad | Módulos Probados | IDs de Caso |
|---|---|---|---|
| HU-01 | Navegar Biblioteca | AlgorithmsService, LibraryScreen | CP-ALG-001 a CP-ALG-005 |
| HU-02 | Seleccionar Algoritmo | AlgorithmsService, AlgorithmDetailScreen | CP-ALG-006 a CP-ALG-008 |
| HU-03 | Datos Predeterminados | SimulationsService, generateRandomArray | CP-SIM-001 a CP-SIM-003 |
| HU-04 | Controlar Animación | SimulationsService, Engines, ControlBar | CP-SIM-004 a CP-SIM-008 |
| HU-06 | Seguimiento Finalización | SimulationsService, updateSessionProgress | CP-SIM-009 a CP-SIM-011 |
| HU-07 | Mensaje Finalización | BadgesService, CompletionOverlay | CP-SIM-012, CP-INS-* |
| — | Autenticación | AuthService | CP-AUTH-001 a CP-AUTH-009 |
| — | Ejercicios | ExercisesService | CP-EJR-001 a CP-EJR-006 |
| — | Gamificación | ProgressService, BadgesService | CP-PRG-*, CP-INS-* |

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Engine genera bucle infinito con datos corruptos | Media | Crítico | Timeout en registry.ts (max 10s) + test de timeout |
| FPS < 24 en Insertion Sort con 15 elementos | Media | Alto | Profiling con React DevTools, optimizar re-renders |
| PseudocodePanel se desfasa del paso actual | Baja | Alto | Verificar lineaPseudocodigo en cada step del engine |
| Tests E2E fallan por estado residual en DB | Media | Medio | Usar emails únicos con `Date.now()`, cleanup en afterAll |
| Mocks de Prisma no reflejan schema real | Baja | Alto | Validar mocks contra schema.prisma en code review |

## 8. Edge Cases & Error Handling

- **Login con email inexistente**: Mensaje genérico "Invalid credentials" (no revelar si falla email o password)
- **Registro con email duplicado**: `409 Conflict`
- **Simulación con datos nulos**: `400 BadRequest` con mensaje descriptivo
- **Tamaño inconsistente con array**: `400 BadRequest`
- **Ejercicio inexistente**: `404 Not Found`
- **Refresh token expirado**: `401 Unauthorized`, cliente fuerza re-login
- **5 intentos fallidos de login**: Bloqueo temporal 15 min (429)

---

*Nota: Este documento define "Qué" se prueba. Para detalles de implementación de las pruebas, ver las tareas T-QA-* en `task/task_breakdown.md`.*
