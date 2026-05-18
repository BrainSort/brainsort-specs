# UI/UX Enhancement Spec

> **Objetivo**: Proveer una dirección visual profesional, moderna y consistente para BrainSort, asegurando que los Agentes de IA implementen una interfaz "Premium" y coherente, basándose en los tokens y temas ya definidos en el código fuente.

## 1. Dirección visual del producto

**Personalidad visual de la app:**
BrainSort debe sentirse como una herramienta educativa "Premium", inmersiva y tecnológica. Su modo por defecto debe ser un *Dark Mode* profundo que haga resaltar las animaciones vibrantes de los algoritmos de ordenamiento.

**Referencias de estilo:**
- Herramientas modernas de productividad para desarrolladores (ej. VS Code themes oscuros, Vercel, Linear).
- Plataformas Ed-Tech de alta gama.

**Sensación al usuario:**
Debe sentirse confiable, enfocada, responsiva y fluida. Las animaciones (especialmente en la simulación) deben ser el centro de atención, evitando cualquier distracción innecesaria. No debe parecer un "prototipo escolar", sino una aplicación pulida lista para producción.

**Qué evitar visualmente:**
- Interfaces genéricas o estilos predeterminados del navegador/sistema.
- Exceso de bordes afilados o sombras sucias.
- Colores planos sin propósito semántico.
- Re-renders abruptos o saltos de layout (*Layout Shifts*).

## 2. Sistema de diseño

Basado estrictamente en los archivos en `brainsort-app/src/styles/` (`colors.ts`, `typography.ts`, `spacing.ts`, `theme.ts`).

### Colores
- **Color Primario**: `#2275C8` (azul profundo, `Primary[500]`). En modo oscuro, se utilizan los tonos más claros como `#4A9CF9` (`Primary[400]`) para mayor contraste.
- **Color Secundario (Accent)**: `#00D4FF` (cyan vívido, `Accent[500]`) para elementos interactivos y focos.
- **Color de Fondo**: `#080B0F` (modo oscuro, `Neutral[950]`) y `#F7F8FA` (modo claro, `Neutral[50]`).
- **Color de Cards / Surfaces**: `#0F1318` (modo oscuro, `Neutral[900]`) y `#FFFFFF` (modo claro, `Neutral[0]`).
- **Color de Texto Principal**: `#FFFFFF` (`Neutral[0]`) en oscuro; `#060E28` (`Neutral[900]`) en claro.
- **Color de Texto Secundario**: `#C2C7D0` (`Neutral[300]`) en oscuro; `#4E5764` (`Neutral[600]`) en claro.
- **Color de Bordes**: `#343B45` (`Neutral[700]`) en oscuro; `#DDE0E6` (`Neutral[200]`) en claro.
- **Colores Semánticos (Usados también en Simulación)**:
  - Éxito / Final: `#7ED321` (Verde)
  - Advertencia / Comparación: `#F5A623` (Amarillo)
  - Error / Intercambio: `#D0021B` (Rojo)
  - Info / Inactivo: `#4A90D9` (Azul)

### Tipografía
- **Fuente recomendada**: `Inter` (cargada vía expo-font), y fallbacks a `Courier New` / `monospace` para código.
- **h1**: 36pt (`4xl`), peso Extra-Bold u 800. Altura de línea *tight*.
- **h2**: 28pt (`3xl`), peso Bold o 700.
- **h3**: 22pt (`2xl`), peso SemiBold o 600.
- **Body**: 16pt (Lg) o 14pt (Md), peso Regular o 400. Altura de línea *normal*.
- **Caption**: 10pt (xs), peso Regular o 400.

### Espaciado
Basado en una unidad de 4dp (`Spacing` object en `spacing.ts`):
- **Sistema base**: Múltiplos de 4 (ej. 8, 12, 16, 24).
- **Padding recomendado para secciones**: 24dp (`Spacing[6]`) a los lados de la pantalla (`screenPaddingX`).
- **Padding recomendado para cards**: 16dp (`Spacing[4]`).
- **Separación entre componentes**: 12dp (`Spacing[3]`) para grid de tarjetas, 8dp (`Spacing[2]`) entre listas/iconos.

### Bordes y sombras
- **Border radius estándar**:
  - `sm` (4dp): tags, pequeñas insignias.
  - `md` (8dp): botones, inputs.
  - `lg` (12dp): tarjetas (Cards).
  - `xl` (16dp): modales, paneles grandes.
- **Estilo de sombras**:
  - `sm` (Elevación 2): Lift sutil para cards.
  - `md` (Elevación 6): Acciones flotantes, toasts.
  - `lg` (Elevación 12): Modales, bottom sheets.
  - `accent` (Elevación 8, sombra color cyan): Elementos altamente interactivos o glows.
- **Uso**: Usar bordes sutiles en modo oscuro para separar jerarquías. Usar sombras preferentemente en modo claro, o "glows" en modo oscuro.

## 3. Componentes visuales

- **Button**
  - Uso: Acciones primarias y secundarias.
  - Variantes: `primary`, `secondary` (bordes), `ghost` (transparente).
  - Estados: Al hacer `disabled` u ocultarlo en `loading` baja la opacidad al 60%.
- **Input / Textarea**
  - Uso: Formularios de autenticación o entrada de datos personalizados.
  - Estados: Hover/Focus debe iluminar el borde con `Primary[400]` o `Primary[600]`.
- **Card**
  - Uso: Listar algoritmos, insignias, módulos.
  - Estados: `onPress` disminuye la opacidad al 70%.
- **Modal / Alert / Toast**
  - Uso: Confirmaciones, errores, "Algoritmo completado!".
  - Visual: Toast flotante no intrusivo con shadow `md`. Modales con radio `xl` y fondo de overlay oscurecido (75% negro en modo oscuro).
- **Badge / DifficultyBadge**
  - Uso: Mostrar la dificultad de algoritmos, categorías o niveles gamificados.
  - Visual: Redondos completos (radius `full` o 9999).
- **SimulationCanvas & Bar**
  - Uso: El motor central de renderizado SVG.
  - Reglas visuales: Transiciones matemáticas suaves usando D3. Los colores de las barras **JAMÁS** deben inventarse, deben usar el objeto `SimulationColors` (idle, comparacion, intercambio, final). Soporte obligatorio de accesibilidad visual (iconos).

## 4. Layout y responsive design

- **Ancho máximo de contenido**: Para web/desktop, el contenido central no debe expandirse infinitamente; usar anchos máximos (ej. 1024px o 1200px) y centrar.
- **Estructura de columnas**:
  - Desktop (≥1024px): Grid de 4 columnas para tarjetas.
  - Tablet (≥768px): Grid de 3 columnas.
  - Phablet (≥480px): Grid de 2 columnas.
  - Móvil (<480px): 1 columna.
- **Layout principal**: Pantallas envueltas en un `SafeAreaWrapper`. En web/tablet, usar navegación superior o sidebar. En móvil, el `BottomTabBar` estándar (Altura: 60dp).
- **Jerarquía visual**: Títulos grandes a la izquierda o centro superior, y siempre acompañados de subtítulos descriptivos (`textMuted`).

## 5. Reglas por pantalla

### Welcome / Auth Screens (Login/Register)
- **Propósito**: Introducción e ingreso al sistema.
- **Importante**: Logo de la marca. Hero Title gigante usando el gradiente `brandHero`.
- **Mejoras**: Evitar pantallas blancas o negras planas. Usar un fondo sutil texturizado o el gradiente oscuro `['#0F1318', '#1A3A6B', '#0F1318']`.

### LibraryScreen (Dashboard Principal)
- **Propósito**: Explorar los algoritmos disponibles.
- **Importante**: La cuadrícula de tarjetas de algoritmo (`AlgorithmCard`).
- **Mejoras**: Usar efecto Skeleton para indicar que se está cargando la biblioteca. Mostrar insignias sutiles de dificultad en cada tarjeta. Si no hay algoritmos, mostrar un Empty State amigable.

### AlgorithmDetailScreen & SimulationScreen
- **Propósito**: Aprender la teoría y ver el algoritmo en acción.
- **Importante**: El lienzo de la simulación.
- **Jerarquía**: El Canvas SVG es el 60% de la pantalla. El panel de pseudocódigo (`PseudocodePanel`) es el 20-30%. Los controles de reproducción anclados (`ControlBar`) en la zona inferior.
- **Mejoras**: El código en pantalla debe lucir como un mini IDE, con fuente monospace (`code` o `codeMd`). El slider de velocidad debe tener ticks claros de 0.25 a 2.0.

### ProgressScreen & LeaderboardScreen
- **Propósito**: Gamificación, ver nivel e insignias.
- **Importante**: Barra de progreso hacia el siguiente nivel, medallas obtenidas.
- **Mejoras**: Usar el gradiente `successGlow` para destacar los logros o la "Racha de días".

## 6. Reglas de UX

- **Feedback visual (Toasts)**: Acciones clave ("Módulo descargado", "Algoritmo completado") deben arrojar un `Toast` que auto-desaparezca en 5 segundos sin bloquear la pantalla (HU-07).
- **Accesibilidad**: Soportar daltónicos. Las barras que se comparan/intercambian no solo cambian de color, sino que incluyen iconos SVG `🔍` (comparar), `↔️` (intercambiar), y `✓` (éxito final).
- **Transiciones**: Evitar spinners bloqueantes donde sea posible; usar lazy loading y Skeletons para mejorar el "Perceived Performance".
- **Empty States**: Cuando no hay módulos offline descargados, o la biblioteca falla, proveer un estado vacío con una ilustración SVG amigable y un CTA principal (ej. "Volver a cargar", "Explorar biblioteca").

## 7. Antes y después esperado

**Antes:**
- Proyecto con componentes básicos de React Native.
- Interfaz mayormente funcional pero que luce genérica, colores predeterminados sin jerarquía clara, botones toscos.
- Animaciones bruscas y experiencia parecida a un trabajo de curso.

**Después:**
- El sistema se sentirá como una aplicación Ed-Tech *premium*.
- **Dark Mode envolvente**: El contenido técnico (código, barras de arreglos) brilla sobre fondos profundos, concentrando la atención del usuario en el algoritmo.
- Botones de acción (`Play`, `Pausa`) llamativos, legibles.
- Respuesta inmediata y fluida: Todo input del usuario es respondido con estados activos/presionados claros.

## 8. Checklist para agentes de IA

Cualquier agente que modifique o implemente UI **DEBE** verificar:

- [ ] He leído completamente esta SPEC y la `constitution.md` antes de modificar o crear componentes visuales.
- [ ] No estoy inventando colores; estoy importando y usando el objeto `Colors` (o el `theme`) de `src/styles/colors.ts`.
- [ ] No estoy utilizando fuentes genéricas por defecto; estoy importando `TextVariants` de `src/styles/typography.ts`.
- [ ] Estoy reutilizando `Button`, `Card`, y `Input` de `src/components/common/` si aplican.
- [ ] No estoy alterando los *endpoints* definidos en los servicios, ni la lógica de negocio (*Clean Architecture*).
- [ ] Mis componentes son responsivos (adaptables usando `useResponsiveColumns` o Flexbox).
- [ ] He añadido o utilizado los estados de UI necesarios: `loading` (Skeleton o Spinner), `empty` (Empty State) y `error` (mensajes amigables/Toasts).
- [ ] Respeté la paleta inmutable de la simulación (`idle`, `comparacion`, `intercambio`, `final`).
- [ ] Puedo explicar claramente qué archivos fueron modificados y cómo respetan la jerarquía visual del sistema de diseño.
