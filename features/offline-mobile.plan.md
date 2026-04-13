# Offline & Mobile Technical Plan

## 1. Architectural Impact
This feature adds a significant offline-first layer to the `brainsort-app` repository. The core simulation logic lives in `packages/core` (pure TypeScript, no UI dependencies), enabling local step generation without network calls. Storage and caching strategies differ per platform (Web vs Mobile).

### Storage Architecture
| Platform | Primary Storage | Cache Strategy | Module Storage |
|---|---|---|---|
| **Web (PWA)** | IndexedDB | Service Workers (Workbox) | IndexedDB |
| **iOS** | expo-sqlite | NSURLCache | Local filesystem |
| **Android** | expo-sqlite | OkHttp Cache | Local filesystem + optional WASM |

## 2. API Design (Offline Domain)

**Get Available Offline Modules:**
```json
// GET /api/modules/offline
// Response -> 200 OK
[
  {
    "algoritmoId": "uuid-bubble-sort",
    "nombre": "Bubble Sort",
    "tamanoMB": 2.3,
    "version": "1.0.0",
    "wasmDisponible": true
  }
]
```

**Download Module Assets (Signed URL):**
```json
// GET /api/modules/offline/:id/download
// Response -> 200 OK
{
  "url": "https://s3.amazonaws.com/brainsort-assets/bubble-sort-v1.0.0.json?signature=...",
  "wasmUrl": "https://s3.amazonaws.com/brainsort-assets/bubble-sort-v1.0.0.wasm?signature=...",
  "expiresIn": 3600
}
```

**Sync Progress (batch upload on reconnect):**
```json
// POST /api/progress/sync
{
  "sesiones": [
    {
      "algoritmoId": "uuid",
      "fechaInicio": "2026-04-06T10:00:00Z",
      "fechaFin": "2026-04-06T10:15:00Z",
      "pasosCompletados": 45
    }
  ]
}
// Response -> 200 OK
{
  "sincronizados": 1,
  "puntosActualizados": 5
}
```

## 3. Data Models
- **OfflineModule** (client-side only, not in PostgreSQL):
  - `algoritmoId`: UUID
  - `version`: String
  - `datosAlgoritmo`: JSON (pseudocode, complexity, metadata)
  - `wasmBinary`: Blob (optional, Android only)
  - `fechaDescarga`: Date
  - `tamanoBytes`: Integer

- **PendingSync** (client-side queue):
  - `id`: UUID (local)
  - `tipo`: String (session | exercise_attempt)
  - `payload`: JSON
  - `fechaCreacion`: Date
  - `sincronizado`: Boolean

## 4. Third-Party Integrations

**Documentadas en la Arquitectura:**
- **Service Workers**: Para PWA caching en Web (según Doc. Arquitectura §2.4.2).
- **expo-sqlite**: SQLite database para persistencia offline en móvil (según Doc. Arquitectura §2.4.3).
- **expo-file-system**: Acceso al sistema de archivos para módulos WASM en móvil (según Doc. Arquitectura §2.4.3).
- **Expo EAS Build**: Pipeline CI/CD para builds móviles y actualizaciones OTA (según Doc. Arquitectura §2.4.3).
- **TanStack Query**: Caché asíncrona y reintentos automáticos para sincronización (según Doc. Arquitectura §Vista de Datos).

**⚠️ Propuestas de extensión (NO en documentación original):**
- **Workbox**: Tooling específico para Service Workers en PWA.
- **@aws-sdk/s3-request-presigner**: Generación de URLs firmadas para descargas seguras. La doc. original solo dice "propia infraestructura".
- **expo-secure-store**: Almacenamiento seguro de tokens en móvil.

## 5. WASM Strategy
- WASM modules are **optional performance enhancements**, not required for core functionality.
- JavaScript fallback is always available via `packages/core`.
- WASM modules are pre-compiled for each sorting algorithm and hosted on the project's own infrastructure (20–50 MB per module) — según Doc. Arquitectura: "se sirven bajo demanda como descargas opcionales desde la propia infraestructura".
- **Android**: WASM download is optional, triggered by user in Offline Manager.
- **iOS**: WASM excluded entirely (Apple App Store restrictions on downloaded executable code). iOS uses JavaScript execution only.
- **Web**: WASM loaded via `WebAssembly.instantiateStreaming()` when available, fallback to JS.

## 6. Security & Validation

**Documentadas en la Arquitectura:**
- Código de usuario aislado en `react-native-webview` (móvil) y Web Workers (web) — según Doc. Arquitectura §2.4.4.
- Validación estricta de datos mediante DTO Pattern en NestJS — según Doc. Arquitectura §2.4.4.

**⚠️ Propuestas de extensión (NO en documentación original):**
- Signed URLs for module downloads expire after 1 hour.
- Module integrity verified via SHA-256 checksum comparison after download.
- Offline progress data is cryptographically signed client-side to prevent tampering before sync.
- expo-sqlite databases encrypted on-device.

---
*Note: This document explains "How" the feature relies on our stack. See the `.spec.md` for "What" the feature is.*
