# 01 — Backend API (`brainsort-api`)

> **Repositorio**: https://github.com/BrainSort/brainsort-api
> **Framework**: NestJS sobre Node.js con adaptador Fastify
> **Base de datos**: PostgreSQL v15+ con Prisma ORM
> **Lenguaje**: TypeScript

---

## 1. Estructura de Carpetas (Según Doc. Arquitectura §4.3)

```
brainsort-api/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint, test, build en cada PR
│       └── cd.yml                  # Build Docker + deploy a Railway
├── prisma/
│   ├── schema.prisma               # Modelos de datos (ver 03-base-de-datos.md)
│   ├── migrations/                  # Historial de migraciones
│   └── seed.ts                      # Datos iniciales (algoritmos, ejercicios)
├── src/
│   ├── main.ts                      # Bootstrap: NestFactory + Fastify + Swagger
│   ├── app.module.ts                # Módulo raíz (importa todos los módulos)
│   │
│   ├── auth/                        # AuthModule
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts       # POST /auth/register, POST /auth/login
│   │   ├── auth.service.ts          # Lógica: bcrypt, JWT, refresh tokens
│   │   ├── dto/
│   │   │   ├── register.dto.ts      # { nombre, correo, rol, contrasena }
│   │   │   └── login.dto.ts         # { correo, contrasena }
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts    # Verificar token en cada request protegido
│   │   │   └── roles.guard.ts       # RBAC: @Roles('Administrador')
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts      # Passport JWT strategy
│   │   └── decorators/
│   │       └── roles.decorator.ts   # @Roles() custom decorator
│   │
│   ├── users/                       # UsersModule
│   │   ├── users.module.ts
│   │   ├── users.controller.ts      # GET /users/me, PATCH /users/me
│   │   ├── users.service.ts         # Consulta y actualización de perfiles
│   │   └── dto/
│   │       └── update-user.dto.ts
│   │
│   ├── algorithms/                  # AlgorithmsModule
│   │   ├── algorithms.module.ts
│   │   ├── algorithms.controller.ts # GET /biblioteca, GET /algoritmos/:id
│   │   ├── algorithms.service.ts    # Consulta de biblioteca, detalle y filtros
│   │   └── dto/
│   │       ├── create-algorithm.dto.ts   # Solo Administrador
│   │       └── algorithm-response.dto.ts
│   │
│   ├── simulations/                 # SimulationsModule
│   │   ├── simulations.module.ts
│   │   ├── simulations.controller.ts    # POST /simulaciones
│   │   ├── simulations.service.ts       # Genera pasos del algoritmo
│   │   ├── engines/                     # Lógica de cada algoritmo
│   │   │   ├── bubble-sort.engine.ts
│   │   │   ├── selection-sort.engine.ts
│   │   │   ├── insertion-sort.engine.ts
│   │   │   └── engine.interface.ts      # Interfaz común para todos
│   │   └── dto/
│   │       ├── create-simulation.dto.ts
│   │       └── simulation-step.dto.ts
│   │
│   ├── exercises/                   # ExercisesModule
│   │   ├── exercises.module.ts
│   │   ├── exercises.controller.ts  # GET /ejercicios/:algoId, POST /ejercicios/:id/responder
│   │   ├── exercises.service.ts     # Evalúa respuestas, calcula puntos
│   │   └── dto/
│   │       ├── answer-exercise.dto.ts
│   │       └── exercise-result.dto.ts
│   │
│   ├── progress/                    # ProgressModule
│   │   ├── progress.module.ts
│   │   ├── progress.controller.ts   # GET /progreso/me, GET /ranking
│   │   ├── progress.service.ts      # Actualiza puntos, niveles, rachas
│   │   └── dto/
│   │       └── progress-response.dto.ts
│   │
│   ├── badges/                      # BadgesModule
│   │   ├── badges.module.ts
│   │   ├── badges.controller.ts     # GET /insignias, GET /insignias/me
│   │   ├── badges.service.ts        # Verifica criterios de desbloqueo
│   │   └── dto/
│   │       └── badge-response.dto.ts
│   │
│   ├── offline/                     # OfflineModule
│   │   ├── offline.module.ts
│   │   ├── offline.controller.ts    # GET /modules/offline, GET /modules/offline/:id/download
│   │   ├── offline.service.ts       # Genera URLs de descarga
│   │   └── dto/
│   │       └── offline-module.dto.ts
│   │
│   ├── sync/                        # SyncModule
│   │   ├── sync.module.ts
│   │   ├── sync.controller.ts       # POST /progress/sync
│   │   ├── sync.service.ts          # Sincronización batch de progreso offline
│   │   └── dto/
│   │       └── sync-progress.dto.ts
│   │
│   ├── prisma/                      # PrismaModule (compartido)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts        # Instancia centralizada de PrismaClient
│   │
│   └── common/                      # Utilidades compartidas
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── transform.interceptor.ts   # Formato estándar de respuesta
│       └── pipes/
│           └── validation.pipe.ts         # DTO validation con class-validator
│
├── test/                             # Tests e2e
│   ├── auth.e2e-spec.ts
│   ├── algorithms.e2e-spec.ts
│   └── simulations.e2e-spec.ts
│
├── Dockerfile                        # Containerización para producción
├── docker-compose.yml                # Dev: API + PostgreSQL local
├── .env                              # Variables de entorno (DATABASE_URL, JWT_SECRET)
├── .env.example                      # Template sin valores sensibles
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 2. Módulos NestJS — Detalle de Responsabilidades

### 2.1 AuthModule
**Responsabilidad**: Registro, login, gestión de tokens JWT y control de acceso por roles.

| Endpoint | Método | Acceso | Descripción | Contrato |
|---|---|---|---|---|
| `/api/auth/register` | POST | Público | Registra nuevo usuario | CO2 (parcial) |
| `/api/auth/login` | POST | Público | Autentica y retorna JWT | — |
| `/api/auth/refresh` | POST | Autenticado | Renueva access token | — |

**Lógica interna**:
- `register()`: Valida unicidad de `correo`, hashea contraseña con `bcrypt.hash(password, 10)`, crea Usuario y ProgresoUsuario (con valores default: puntosTotales=0, nivelActual=1, rachaDías=0).
- `login()`: Busca por `correo`, compara con `bcrypt.compare()`, genera `accessToken` (15min) y `refreshToken` (7 días).
- Si es Administrador: actualizar `últimoAcceso` con timestamp actual al autenticarse.

**DTOs**:
```typescript
// register.dto.ts
export class RegisterDto {
  @IsString() nombre: string;
  @IsEmail() correo: string;
  @IsEnum(['Estudiante', 'Profesor', 'Autodidacta']) rol: string;
  @IsString() @MinLength(8) contrasena: string;
}
```

### 2.2 UsersModule
**Responsabilidad**: Consulta y actualización del perfil del usuario autenticado.

| Endpoint | Método | Acceso | Descripción |
|---|---|---|---|
| `/api/users/me` | GET | Autenticado | Obtiene perfil del usuario actual |
| `/api/users/me` | PATCH | Autenticado | Actualiza nombre o contraseña |

### 2.3 AlgorithmsModule
**Responsabilidad**: Consulta del catálogo de algoritmos y detalle. Implementa **CO1 - getLibrary()** y **CO2 - getAlgoritmo()** en la línea base actual.

| Endpoint | Método | Acceso | Descripción | Contrato |
|---|---|---|---|---|
| `/api/biblioteca` | GET | Público/Autenticado | Lista completa de algoritmos por categoría | CO1 |
| `/api/algoritmos/:id` | GET | Autenticado | Detalle del algoritmo con pseudocódigo | CO2 |
| `/api/algoritmos` | POST | Administrador | Crear nuevo algoritmo | Extensión planificada; no implementada en U4-EJ26 |
| `/api/algoritmos/:id` | PUT | Administrador | Actualizar algoritmo existente | Extensión planificada; no implementada en U4-EJ26 |
| `/api/algoritmos/:id` | DELETE | Administrador | Eliminar algoritmo | Extensión planificada; no implementada en U4-EJ26 |

**Lógica CO1 - getLibrary()**:
1. Consultar todos los algoritmos agrupados por `categoría`.
2. Retornar: `categorías[]`, `totalAlgoritmos`, `algoritmos[]` (cada uno con nombre, descripción corta ≤140 chars, dificultad, complejidadTiempo, complejidadEspacio, categoría).
3. Para cada algoritmo crear una "tarjeta" con información resumida (incluye dificultad para indicador visual HU-01).

**Lógica CO2 - getAlgoritmo()**:
1. Obtener algoritmo por ID con pseudocódigo completo.
2. Crear/actualizar registro de ProgresoUsuario para asociar avance con cuenta actual.

### 2.4 SimulationsModule
**Responsabilidad**: Genera los pasos de ejecución de un algoritmo sobre un conjunto de datos. Implementa **CO3 - getSimulation()**.

| Endpoint | Método | Acceso | Descripción | Contrato |
|---|---|---|---|---|
| `/api/simulaciones` | POST | Autenticado | Genera simulación con pasos | CO3 |

**Lógica CO3 - getSimulation()**:
1. Recibir `algoritmoId` y `conjuntoDeDatos` (valores, tipoOrigen, tamaño).
2. Validar datos: sin caracteres no válidos, sin valores nulos, tamaño coherente.
3. Si `tipoOrigen === "Predeterminado"`: generar arreglo aleatorio de 8-15 elementos (no pre-ordenado).
4. Ejecutar el engine del algoritmo correspondiente paso a paso.
5. Por cada paso registrar: `numeroPaso`, `tipoOperacion` (comparacion/intercambio/insercion), `indicesActivos`, `estadoArray`, `lineaPseudocodigo`.
6. Retornar simulación completa con todos los pasos.
7. Asociar avance de simulación con la cuenta del usuario.

**Engines** (carpeta `engines/`) — Patrón **Engine + contenido en DB** (ver `cambios-en-documentacion/CHANGELOG.md` CDR-009 y CDR-010):

> Cada engine define metadatos operativos y lógica de ejecución. El texto del pseudocódigo y la configuración visual viven en DB para permitir correcciones de contenido sin redeploy. El engine solo emite `lineaPseudocodigo` y datos de paso.
