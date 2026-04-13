# Gamification & Exercises Technical Plan

> **Fuente de verdad**: `BrainSort-Modelo_del_Dominio.docx`, `BrainSort-Modelo_del_Dominio.uml`

## 1. Architectural Impact
La gamificación agrega estado significativo a los perfiles de usuario. Los atributos del ProgresoUsuario (`puntosTotales`, `nivelActual`, `rachaDías`, `posiciónRanking`) cambian frecuentemente. Transacciones ACID recomendadas para actualizaciones concurrentes.

## 2. API Design (Gamification & Exercises)

**Evaluar Ejercicio:**
```json
// POST /api/ejercicios/{id}/responder
{
  "respuesta": "[3, 1, 5, 8]"
}

// Response -> 200 OK
{
  "correcto": true,
  "feedbackPositivo": "Correcto. Bubble Sort mueve el 5 a la derecha.",
  "puntosGanados": 25,
  "rachaDias": 4,
  "posicionRanking": 12
}
```

## 3. Data Models (Según Modelo del Dominio)

### ProgresoUsuario
- `puntosTotales`: Integer (Default 0)
- `nivelActual`: Integer
- `rachaDías`: Integer (Default 0)
- `posiciónRanking`: Integer

### EjercicioPredicción
- `pregunta`: Text
- `respuestaCorrecta`: String
- `dificultad`: String
- `feedbackPositivo`: Text
- `feedbackNegativo`: Text
- FK: `algoritmoId` → Algoritmo

### Insignia
- `nombre`: String
- `descripción`: Text
- `imagen`: String (URL/ruta)
- `criterioDesbloqueo`: String
- `fechaObtención`: DateTime

### Relación ProgresoUsuario ↔ Insignia
- Según UML: ProgresoUsuario **registra** Insignia (1:0..*)
- Tabla intermedia: `ProgresoUsuario_Insignia` con `progresoId`, `insigniaId`, `fechaObtencion`.

## 4. Leaderboard Strategy
- Índice global en DB sobre `puntosTotales DESC` para consultas rápidas.
- El `posiciónRanking` existe como atributo del dominio y debe actualizarse cuando cambien los puntos de cualquier usuario.

## 5. Security & Validation
- Los estudiantes no pueden asignar puntos manualmente. El endpoint evalúa las respuestas internamente.
- Validar que el ejercicio pertenezca a un algoritmo existente en la biblioteca.
