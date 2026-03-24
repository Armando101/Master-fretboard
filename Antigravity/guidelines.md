# Architecture Guidelines

## Objetivo

Esta aplicación debe construirse con una arquitectura sostenible, escalable y mantenible a largo plazo.
Todas las decisiones de estructura, naming, separación de lógica y organización de archivos deben favorecer:

* alta cohesión
* bajo acoplamiento
* reutilización real
* facilidad de pruebas
* claridad de lectura
* evolución segura del sistema

La prioridad no es solo que el código funcione, sino que sea fácil de entender, extender, refactorizar y mantener.

---

## Principios generales

### 1. Diseñar por responsabilidad, no por conveniencia

Cada archivo, componente, hook, función o módulo debe tener una responsabilidad clara y limitada.
No se deben crear módulos “todoterreno” que mezclen UI, lógica de negocio, acceso a datos, validaciones y transformación de datos en un mismo lugar.

### 2. Favorecer cohesión alta y acoplamiento bajo

Todo lo que pertenece a un mismo dominio o feature debe vivir cerca.
Todo lo que pueda cambiar por razones distintas debe separarse.

### 3. Optimizar para mantenimiento, no para rapidez inicial

Evitar decisiones que parezcan rápidas al inicio pero generen desorden al crecer la aplicación.

### 4. Preferir composición sobre complejidad

Se deben construir piezas pequeñas, enfocadas y combinables en lugar de piezas grandes, rígidas y difíciles de reutilizar.

### 5. La arquitectura debe expresar el negocio

La estructura del proyecto debe reflejar el dominio de la aplicación.
El código debe organizarse por features o dominios, no únicamente por tipo técnico.

---

## Aplicación de principios SOLID

### S — Single Responsibility Principle

Cada módulo debe tener un único motivo de cambio.

Reglas:

* un componente presentacional no debe contener lógica de negocio
* un servicio no debe renderizar UI
* un hook no debe actuar como componente, servicio, validador y store al mismo tiempo
* un mapper solo transforma datos
* un archivo de constantes solo define constantes
* un schema solo valida estructuras o reglas declarativas

### O — Open/Closed Principle

Los módulos deben estar abiertos a extensión, pero cerrados a modificación innecesaria.

Reglas:

* evitar condicionales gigantes que obliguen a editar el mismo archivo cada vez que crece un flujo
* diseñar componentes y funciones extensibles mediante composición y configuración
* reutilizar abstracciones estables en vez de duplicar comportamiento

### L — Liskov Substitution Principle

Las implementaciones deben respetar el contrato esperado sin comportamientos inesperados.

Reglas:

* si un componente comparte la interfaz de otro, debe comportarse de forma consistente
* no reutilizar tipos o contratos si semánticamente representan cosas distintas
* no usar herencia o abstracciones artificiales que rompan expectativas

### I — Interface Segregation Principle

Los consumidores no deben depender de interfaces demasiado grandes.

Reglas:

* dividir tipos grandes en contratos pequeños y específicos
* no pasar objetos gigantes como props si el componente solo necesita 2 o 3 campos
* exponer APIs simples y enfocadas

### D — Dependency Inversion Principle

Los módulos de alto nivel no deben depender directamente de detalles de implementación.

Reglas:

* la lógica de negocio no debe depender del framework ni de la UI
* los componentes no deben depender de detalles internos de infraestructura
* el acceso a datos debe estar encapsulado
* los módulos deben depender de contratos claros, no de detalles acoplados

---

## Organización general del proyecto

La aplicación debe organizarse principalmente por **feature** o **dominio funcional**, no por tipo de archivo global.

### Estructura base recomendada

```txt
src/
  app/
  features/
  shared/
  styles/
  store/
  middleware.ts
```

### Responsabilidad de cada nivel

#### `app/`

Debe contener únicamente:

* rutas
* layouts
* pages
* loading
* error boundaries
* templates
* archivos específicos del App Router

`app/` no debe convertirse en un contenedor de lógica de negocio.

#### `features/`

Debe contener la lógica y estructura de cada dominio o funcionalidad de negocio.

Ejemplos:

* `features/auth`
* `features/projects`
* `features/users`
* `features/billing`

Cada feature debe ser lo más autónomo posible.

#### `shared/`

Debe contener únicamente elementos realmente compartidos entre varios features.

Ejemplos válidos:

* componentes base de UI
* utilidades genéricas
* constantes globales
* cliente HTTP
* helpers transversales
* tipos globales

No debe usarse `shared/` como basurero de cosas mal ubicadas.

---

## Organización interna de un feature

Cada feature debe agrupar todo lo necesario para operar su dominio, manteniendo una separación clara entre UI, lógica, tipos y acceso a datos.

### Estructura sugerida

```txt
features/
  projects/
    components/
      smart/
      ui/
    hooks/
    services/
    actions/
    domain/
    utils/
    tests/
    index.ts
```

### Responsabilidad de cada carpeta

#### `components/ui`

Componentes presentacionales o dumb components.

Reglas:

* reciben props
* renderizan UI
* no hacen fetch
* no contienen reglas de negocio
* no dependen directamente de servicios
* no conocen detalles de infraestructura

#### `components/smart`

Componentes contenedores o smart components.

Reglas:

* coordinan hooks, navegación, estado de pantalla y composición
* pueden conectar la vista con casos de uso o servicios
* deben delegar el render complejo a componentes presentacionales
* no deben concentrar lógica de negocio pesada

#### `hooks`

Hooks del feature.

Reglas:

* encapsulan lógica de interacción o estado de presentación
* pueden componer otros hooks y servicios
* no deben convertirse en contenedores de toda la lógica del sistema
* si un hook empieza a contener reglas de negocio complejas, esa lógica debe extraerse

#### `services`

Acceso a datos, integración con APIs, repositorios o adaptadores externos.

Reglas:

* encapsular llamadas HTTP o acceso a infraestructura
* no retornar datos crudos si requieren normalización
* transformar respuestas mediante mappers cuando sea necesario
* no mezclar render ni lógica de negocio de pantalla

#### `actions`

Casos de uso operativos, server actions o flujos específicos de mutación.

Reglas:

* representar acciones concretas del sistema
* orquestar validación, acceso a datos y flujo
* evitar meter lógica directamente en componentes o pages

#### `domain`

Núcleo del feature.

Debe contener:

* tipos
* interfaces
* constantes
* reglas de negocio
* schemas
* mappers
* contratos del dominio

Esta carpeta representa el lenguaje del negocio.

#### `utils`

Helpers específicos del feature.

Reglas:

* solo si realmente son utilidades del dominio
* si el util es transversal, debe vivir en `shared/utils`

---

## Separación de archivos por responsabilidad

Para mantener claridad, cada responsabilidad debe tener su archivo o módulo independiente.

### Tipos

Los tipos y aliases deben vivir en archivos separados.

Ejemplo:

* `project.types.ts`

### Interfaces o contratos

Las interfaces deben definir contratos claros y pequeños.

Ejemplo:

* `project.interfaces.ts`

### Constantes

Las constantes del dominio deben vivir fuera de componentes y hooks.

Ejemplo:

* `project.constants.ts`

### Schemas

Las validaciones estructurales deben estar en archivos dedicados.

Ejemplo:

* `project.schema.ts`

### Mappers

Toda transformación entre capas debe centralizarse.

Ejemplo:

* `project.mapper.ts`

### Reglas de negocio

Las reglas del dominio deben vivir fuera de la UI.

Ejemplo:

* `project.rules.ts`

---

## Reglas de componentes

### Componentes presentacionales

Un componente presentacional:

* recibe props claras
* no conoce endpoints
* no conoce stores globales salvo casos muy justificados
* no contiene fetch
* no conoce reglas del negocio
* no transforma payloads de backend
* no debe depender de un feature ajeno

### Componentes contenedores

Un componente smart:

* compone UI
* consume hooks o casos de uso
* adapta datos para la vista
* maneja eventos de interacción
* coordina navegación o flujos

Aun así, no debe convertirse en una clase de servicio disfrazada de componente.

### Reutilización

Un componente solo debe promoverse a `shared` si:

* es genérico
* no está acoplado a un dominio particular
* tiene valor en más de un feature
* su API es estable y pequeña

Si algo solo se usa en un feature, debe permanecer en ese feature.

---

## Reglas de lógica de negocio

La lógica de negocio nunca debe vivir dispersa dentro del JSX, handlers de eventos o páginas.

Debe extraerse a:

* reglas de dominio
* casos de uso
* servicios
* validadores
* mappers

Ejemplos de lógica que no debe vivir en componentes:

* permisos
* validaciones de negocio
* decisiones de flujo
* normalización de datos
* transformaciones API → UI
* comparación de estados complejos
* reglas condicionales de dominio

---

## Reglas de acceso a datos

### Encapsular infraestructura

No se debe llamar `fetch`, `axios` o cualquier cliente HTTP de forma desordenada desde múltiples componentes.

Debe existir una capa clara para:

* cliente HTTP base
* manejo de errores
* serialización
* headers
* autenticación
* adaptación de respuesta

### No propagar payloads crudos

Los componentes no deben trabajar directamente con la forma exacta del backend si esta no coincide con la necesidad de UI.

Reglas:

* mapear payloads al modelo que usa el dominio o la vista
* aislar cambios de API en la capa de servicios o mappers
* evitar que nombres de backend contaminen toda la aplicación

---

## Reglas de hooks

Los hooks deben existir para encapsular comportamiento reutilizable o lógica de presentación.

Deben:

* tener una responsabilidad clara
* devolver una API pequeña
* evitar dependencias innecesarias
* delegar lógica de negocio compleja a otras capas

No deben:

* contener demasiadas responsabilidades
* actuar como repositorio, validador, mapper y controller al mismo tiempo
* ocultar side effects complejos sin necesidad

---

## Reglas de imports y dependencia entre módulos

### Dependencias permitidas

Un feature puede depender de:

* `shared`
* su propio feature

### Dependencias restringidas

Un feature no debe importar detalles internos de otro feature de manera directa.

Reglas:

* evitar importar archivos internos profundos de otro dominio
* si un feature necesita usar algo de otro, debe hacerlo a través de una API pública estable
* usar `index.ts` para exponer contratos controlados

### Dirección del acoplamiento

La UI puede depender de hooks y casos de uso.
Los casos de uso pueden depender de contratos y servicios.
La lógica de dominio no debe depender de componentes de UI.

---

## Reglas de naming

El naming debe ser consistente, explícito y semántico.

### Componentes

Usar `PascalCase`.

Ejemplos:

* `ProjectCard.tsx`
* `ProjectForm.tsx`
* `ProjectsPageContainer.tsx`

### Hooks

Usar prefijo `use`.

Ejemplos:

* `useProjectForm.ts`
* `useProjectsFilters.ts`

### Servicios

Nombrar según el dominio y responsabilidad.

Ejemplos:

* `project.service.ts`
* `auth.repository.ts`

### Constantes

Usar nombres semánticos y en mayúsculas cuando aplique.

Ejemplos:

* `PROJECT_STATUS_OPTIONS`
* `DEFAULT_PAGE_SIZE`

### Tipos y contratos

Nombrar por concepto de dominio, no por implementación técnica.

Ejemplos:

* `Project`
* `CreateProjectInput`
* `ProjectStatus`

---

## Reglas de pages y App Router

Las páginas deben actuar como puntos de entrada y composición, no como centros de negocio.

### Una `page.tsx`

Debe:

* coordinar la carga inicial
* componer layout y containers
* delegar lógica

No debe:

* tener cientos de líneas
* definir reglas de negocio
* contener transformaciones complejas
* mezclar demasiada lógica de UI y datos

### Server vs Client Components

Usar Server Components por defecto.
Usar Client Components solo cuando exista una necesidad real de interacción, estado local o APIs del cliente.

No marcar pantallas completas con `'use client'` sin una razón clara.

---

## Reglas de estado

Antes de crear estado global, validar si realmente debe ser global.

### Estado local

Usar para:

* visibilidad de modales
* tabs
* inputs
* interacción puntual de pantalla

### Estado compartido por feature

Usar cuando varios componentes del mismo dominio lo necesitan.

### Estado global

Reservar para:

* sesión
* tema
* configuración transversal
* información realmente compartida en múltiples áreas

No promover estado a global por comodidad.

---

## Reglas de utilidades

### Utilidades compartidas

Deben ir en `shared/utils` solo si:

* son puras
* son genéricas
* no dependen de un dominio
* tienen valor transversal

### Utilidades de feature

Deben quedarse dentro del feature si representan una necesidad del dominio.

No mover algo a `shared` solo porque “podría reutilizarse algún día”.

---

## Reglas de testing

La arquitectura debe facilitar pruebas.

Reglas:

* la lógica de negocio debe poder probarse sin renderizar componentes
* los mappers y reglas deben probarse como funciones puras
* los componentes presentacionales deben ser fáciles de testear por props
* los casos de uso deben poder probarse aislando infraestructura

Mientras más lógica esté acoplada al componente, más difícil será probarla y mantenerla.

---

## Reglas para evitar deuda técnica

No se permite:

* duplicar lógica por prisa si puede abstraerse con claridad
* crear helpers genéricos ambiguos como `common.ts`, `helpers.ts`, `misc.ts`
* usar carpetas `utils` o `services` globales sin criterio
* mezclar nombres de negocio con detalles técnicos sin consistencia
* mover archivos a `shared` antes de demostrar reutilización real
* crear componentes gigantes con demasiadas props y demasiadas responsabilidades

---

## Criterios para refactor

Se debe refactorizar cuando ocurra cualquiera de estas señales:

* un archivo crece demasiado y mezcla responsabilidades
* un hook tiene demasiados efectos y demasiadas dependencias
* un componente conoce demasiado del dominio
* hay duplicación de lógica en varios lugares
* una API externa está contaminando múltiples capas
* los cambios pequeños obligan a tocar demasiados archivos no relacionados
* un feature depende internamente de otro de forma frágil

---

## Regla final de diseño

Antes de crear o modificar cualquier módulo, responder mentalmente estas preguntas:

1. ¿Cuál es la única responsabilidad de este archivo?
2. ¿Esto pertenece al dominio, a la UI, a infraestructura o a una capa compartida?
3. ¿Estoy acoplando esta pieza a algo que podría cambiar pronto?
4. ¿Este módulo sería fácil de probar en aislamiento?
5. ¿Estoy reutilizando de verdad o solo centralizando por comodidad?
6. ¿Este cambio hace la arquitectura más clara o más confusa?
7. ¿Este archivo expresa intención de negocio o solo resuelve una urgencia técnica?

Si la respuesta no es clara, la implementación debe simplificarse antes de continuar.

---

## Mandato de arquitectura

Toda nueva implementación debe respetar estas reglas:

* separar UI, dominio e infraestructura
* organizar por feature
* mantener componentes pequeños y enfocados
* extraer lógica de negocio fuera de la vista
* usar contratos y tipos claros
* mantener APIs internas simples
* reducir acoplamiento entre módulos
* promover reutilización real, no artificial
* priorizar legibilidad y mantenibilidad sobre soluciones rápidas

La meta no es tener más archivos.
La meta es tener mejor separación de responsabilidades, menos fragilidad y una base sólida para crecer.


# Reglas de diseño

Sigue las reglas de /Antigravity/resources/fretboard_master/DESIGN.md