# Documentación de Especificaciones (SPECS) - BrainSort

Bienvenido al directorio de especificaciones de diseño y desarrollo (**SPEC Driven Development - GitHub Spec Kit Model**) para el proyecto BrainSort. 

Este directorio está diseñado para ser consumido tanto por desarrolladores humanos como por Agentes de IA, separando el "Qué construir" (Specs) del "Cómo construirlo" (Plans).

## 1. Archivos Fundacionales

| Archivo | Descripción |
|---|---|
| [`constitution.md`](./constitution.md) | Principios innegociables del proyecto (Stack, UI/UX, Reglas). Todo Agente IA debe leer esto primero. |

## 2. Características (Features)

Las especificaciones están divididas en dominios funcionales dentro de la carpeta `features/`. Cada dominio cuenta con un archivo `.spec.md` (Requisitos), `.plan.md` (Arquitectura Técnica) y `.tasks.md` (Tareas de Implementación).

| Dominio Funcional | Archivos | Descripción |
|---|---|---|
| **Core & Domain** | [`core-domain.spec.md`](./features/core-domain.spec.md)<br>[`core-domain.plan.md`](./features/core-domain.plan.md)<br>[`core-domain.tasks.md`](./features/core-domain.tasks.md) | Visión General del Producto, Glosario y diagramas de base de datos del Modelo del Dominio en PostgreSQL. |
| **Architecture & Auth** | [`architecture-auth.spec.md`](./features/architecture-auth.spec.md)<br>[`architecture-auth.plan.md`](./features/architecture-auth.plan.md)<br>[`architecture-auth.tasks.md`](./features/architecture-auth.tasks.md) | Modelo C4 del software, requisitos de Autenticación, JWT y control de roles (RBAC). |
| **Biblioteca y Simulación** | [`library-simulation.spec.md`](./features/library-simulation.spec.md)<br>[`library-simulation.plan.md`](./features/library-simulation.plan.md)<br>[`library-simulation.tasks.md`](./features/library-simulation.tasks.md) | Algoritmos implementados (Bubble, Merge, etc.), motor visual paso a paso, y generador de datos. |
| **Gamificación y Ejercicios** | [`gamification-exercises.spec.md`](./features/gamification-exercises.spec.md)<br>[`gamification-exercises.plan.md`](./features/gamification-exercises.plan.md)<br>[`gamification-exercises.tasks.md`](./features/gamification-exercises.tasks.md) | Preguntas predictivas, mecánicas de puntos, niveles, tabla de posiciones e insignias de retención. |
| **Offline & Mobile** | [`offline-mobile.spec.md`](./features/offline-mobile.spec.md)<br>[`offline-mobile.plan.md`](./features/offline-mobile.plan.md)<br>[`offline-mobile.tasks.md`](./features/offline-mobile.tasks.md) | Capacidades offline, descarga selectiva de módulos, WASM, PWA, distribución iOS/Android via Expo. |

## 3. Plan de Implementación

La carpeta [`plan-de-implementacion/`](./plan-de-implementacion/) contiene el detalle técnico de **cómo** se implementará el proyecto en cada repositorio:

| Documento | Descripción |
|---|---|
| [`INDEX.md`](./plan-de-implementacion/INDEX.md) | Visión general, arquitectura de repos separados y orden de implementación. |
| [`01-backend-api.md`](./plan-de-implementacion/01-backend-api.md) | Estructura de `brainsort-api`: módulos NestJS, controladores, servicios, DTOs. |
| [`02-frontend-app.md`](./plan-de-implementacion/02-frontend-app.md) | Estructura de `brainsort-app`: pantallas, hooks, engine, visualización, offline. |
| [`03-base-de-datos.md`](./plan-de-implementacion/03-base-de-datos.md) | Esquema Prisma completo con mapeo Dominio → DB. |
| [`04-contratos-api.md`](./plan-de-implementacion/04-contratos-api.md) | Contrato REST entre frontend y backend: endpoints, DTOs, respuestas. |
| [`05-despliegue-devops.md`](./plan-de-implementacion/05-despliegue-devops.md) | Docker, CI/CD, Railway, Vercel, Expo EAS Build. |

## 4. Plantillas

Las siguientes plantillas se encuentran en `templates/` y dictan la estructura que deben seguir todas las nuevas características agregadas al proyecto:
- `spec-template.md` (Qué es la feature y requisitos)
- `plan-template.md` (Diseño técnico y de base de datos)
- `tasks-template.md` (Despiece de tareas a implementar)

---

> **Metodología:** Las especificaciones aquí documentadas son "Living Documents" (Documentos Vivos). Si una decisión de arquitectura o requerimiento de negocio cambia durante el ciclo de vida de BrainSort, los archivos `.plan.md` y `.spec.md` afectados deben actualizarse antes de escribir el código.

