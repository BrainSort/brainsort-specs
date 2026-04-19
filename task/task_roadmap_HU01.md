# Roadmap HU-01

## Objetivo
Entregar una Biblioteca de Algoritmos funcional para que el usuario pueda explorar categorías, filtrar resultados, buscar algoritmos y seleccionar uno para continuar al detalle.

## Resultado esperado del MVP
- Biblioteca responsive con algoritmos seed.
- Filtro por categoría.
- Búsqueda por nombre.
- Tarjetas con nombre, dificultad y descripción corta.
- Navegación a pantalla de detalle.
- Estado vacío: `No se encontraron algoritmos con ese criterio`.
- Estado offline básico con contenido cacheado y etiqueta `Sin conexión`.

## Fase 1: Alineación y alcance
1. [x] Confirmar que HU-01 cubrirá solo biblioteca y selección de algoritmo.
2. [x] Mantener la arquitectura actual del frontend y adaptarla al dominio real.
3. [x] Registrar ajuste funcional:
   - El modelo `Algoritmo` debe incluir `dificultad`.
   - La biblioteca debe incluir búsqueda por texto.
   - La biblioteca debe tener estado offline básico.

## Fase 2: Base técnica backend
1. [x] Completar configuración mínima de backend.
   - `nest-cli.json`
   - `.env.example`
   - conexión Prisma
   - configuración base de `main.ts`
2. [x] Configurar Prisma para usar `DATABASE_URL`.
3. [ ] Verificar que la API levante localmente sin errores.

## Fase 3: Modelo de datos
1. [x] Crear y ajustar modelo `Algoritmo`.
   - `id`
   - `nombre`
   - `descripcion`
   - `dificultad`
   - `complejidadTiempo`
   - `complejidadEspacio`
   - `categoria`
   - `activo`
2. [x] Crear enum `CategoriaAlgoritmo`.
3. [x] Crear migración inicial de catálogo.

## Fase 4: Seed del catálogo
1. [x] Crear seed con al menos 3 algoritmos del MVP:
   - Bubble Sort
   - Selection Sort
   - Insertion Sort
2. [x] Asegurar que cada algoritmo tenga:
   - descripción corta
   - dificultad
   - categoría
3. [ ] Verificar que los datos queden disponibles para la biblioteca.

## Fase 5: API de biblioteca
1. [x] Crear `AlgorithmsModule`.
2. [x] Implementar `GET /api/biblioteca`.
3. [x] Devolver datos listos para UI:
   - `categorias`
   - `totalAlgoritmos`
   - `algoritmos`
4. [x] Incluir soporte para:
   - filtro por categoría
   - búsqueda por nombre
5. [x] Implementar DTO de respuesta.

## Fase 6: Validación backend
1. Crear pruebas para `GET /api/biblioteca`.
2. Validar:
   - respuesta exitosa
   - estructura correcta
   - filtro por categoría
   - búsqueda por nombre
   - catálogo vacío

## Fase 7: Base frontend
1. Adaptar navegación actual.
2. Reemplazar pantallas placeholder por flujo real:
   - `LibraryScreen`
   - `AlgorithmDetailScreen`
3. Crear estructura mínima:
   - `services/`
   - `hooks/`
   - `components/algorithm/`
   - `screens/library/`

## Fase 8: Consumo de API
1. Crear servicio `library.service.ts`.
2. Definir tipos del catálogo.
3. Implementar fetch de biblioteca.
4. Preparar manejo de:
   - loading
   - error
   - datos vacíos

## Fase 9: Lógica de biblioteca
1. Crear `useLibrary.ts`.
2. Implementar:
   - carga inicial
   - filtro por categoría
   - búsqueda por nombre
   - estado vacío
   - recarga manual
3. Preparar caché simple para modo offline.

## Fase 10: Componentes UI
1. Crear `AlgorithmCard`.
2. Crear `CategoryFilter`.
3. Crear `DifficultyBadge`.
4. Si se usan imágenes, aplicar lazy loading.

## Fase 11: Responsive
1. Crear `useResponsiveColumns`.
2. Definir columnas por ancho:
   - 4 escritorio
   - 3 tablet
   - 2 phablet
   - 1 móvil
3. Validar visualización en móvil y web.

## Fase 12: LibraryScreen
1. Implementar pantalla principal de biblioteca.
2. Integrar:
   - título
   - filtro por categoría
   - búsqueda
   - grid de tarjetas
   - loading
   - empty state
   - error state
3. Navegar al detalle al seleccionar una tarjeta.

## Fase 13: Detail mínimo
1. Crear `AlgorithmDetailScreen` básica.
2. Mostrar:
   - nombre
   - categoría
   - dificultad
   - descripción
3. Dejar CTA para simulación como siguiente paso del producto.

## Fase 14: Offline básico
1. Guardar último catálogo exitoso localmente.
2. Detectar falta de conexión.
3. Mostrar solo contenido cacheado.
4. Mostrar estado `Sin conexión`.

## Fase 15: Accesibilidad y QA
1. Validar navegación por teclado en web.
2. Añadir estados visibles de foco.
3. Validar contraste y legibilidad.
4. Probar flujo completo:
   - abrir biblioteca
   - filtrar
   - buscar
   - seleccionar algoritmo

## Fase 16: Cierre
1. Medir si seleccionar un algoritmo toma menos de 15 segundos.
2. Ajustar detalles de UX.
3. Actualizar `task_breakdown.md` con tareas completadas y nuevas tareas faltantes.

## Orden recomendado
1. Backend base
2. Modelo + migración
3. Seed
4. Endpoint de biblioteca
5. Tests backend
6. Navegación frontend
7. Servicio + hook
8. Componentes UI
9. LibraryScreen
10. Detail mínimo
11. Offline básico
12. QA y cierre
