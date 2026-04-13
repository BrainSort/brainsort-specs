# Library & Simulation Technical Plan

> **Fuente de verdad**: `BrainSort-Modelo_del_Dominio.uml`, `BrainSort-Historias_de_Usuario.docx`, `BrainSort-Glosario.docx`

## 1. Architectural Impact
El motor de simulación calcula los pasos del algoritmo. El frontend actúa como un reproductor que avanza por los pasos calculados. La entidad `Simulación` del modelo de dominio mantiene los atributos `velocidadReproducción`, `estadoActual` (Pausa/Play) y `pasoActual`.

## 2. API Design (Simulation Domain)

**CO1 - Obtener Biblioteca (getLibrary):**
```json
// GET /api/biblioteca
// Response -> 200 OK
{
  "categorias": ["Ordenamiento", "Búsqueda", "Estructuras Lineales"],
  "totalAlgoritmos": 8,
  "algoritmos": [
    {
      "nombre": "Bubble Sort",
      "descripcion": "Algoritmo de ordenamiento por intercambio...",
      "complejidadTiempo": "O(n²)",
      "complejidadEspacio": "O(1)",
      "categoria": "Ordenamiento"
    }
  ]
}
```

**CO3 - Obtener Simulación (getSimulation):**
```json
// POST /api/simulaciones
{
  "algoritmoId": "uuid",
  "conjuntoDeDatos": {
    "valores": [5, 2, 8, 1],
    "tipoOrigen": "Predeterminado",
    "tamaño": 4
  }
}

// Response -> 200 OK
{
  "simulacion": {
    "velocidadReproduccion": 1.0,
    "estadoActual": "Pausa",
    "pasoActual": 0
  },
  "totalPasos": 6,
  "pasos": [
    {
      "numeroPaso": 1,
      "tipoOperacion": "comparacion",
      "indicesActivos": [0, 1],
      "estadoArray": [5, 2, 8, 1],
      "lineaPseudocodigo": 3
    }
  ]
}
```

## 3. Data Models (Según Modelo del Dominio)
- **Simulación**: `velocidadReproducción` (Float), `estadoActual` (String: Pausa/Play), `pasoActual` (Integer).
- **ConjuntoDeDatos**: `valores` (Array), `tipoOrigen` (String: **Predeterminado/Personalizado**), `tamaño` (Integer).
- **Algoritmo**: `nombre`, `descripción`, `complejidadTiempo` (String Big-O), `complejidadEspacio` (String Big-O), `pseudocódigo`, `categoría`.

## 4. Frontend Rendering Strategy
- Velocidad ajustable: múltiplos de 0.25 en rango [0.25, 2.0] (según Glosario).
- La simulación debe generar datos predeterminados de **8 a 15 elementos** si el usuario no ingresa datos propios (según HU-03).
- Los datos personalizados deben validarse: formato correcto, sin caracteres no válidos, sin valores nulos (según Glosario).
- Rendimiento mínimo: **24 FPS** en dispositivos de gama media/baja (según HU-04).
- Feedback visual de completitud claro para daltónicos (iconos además de color) (según HU-06).

## 5. Security & Validation
- Sanitizar inputs manuales: filtrar no-enteros.
- Validar `tipoOrigen` contra los valores permitidos: Predeterminado, Personalizado.
- Timeout de seguridad contra bucles infinitos en la simulación (según HU-06).
