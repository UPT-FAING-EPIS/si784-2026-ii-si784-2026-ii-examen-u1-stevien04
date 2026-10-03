# Documentación del Sistema

## Diccionario de Datos

| Tabla | Campo | Tipo | Descripción |
|---|---|---|---|
| Babysitter | Id | Guid | Identificador único |
| Babysitter | Name | String | Nombre de la niñera |
| Babysitter | ExperienceYears | Int | Años de experiencia |
| Babysitter | HourlyRate | Decimal | Tarifa por hora |
| Booking | Id | Guid | Identificador único |
| Booking | BabysitterId | Guid | FK de la niñera |
| Booking | UserId | Guid | ID del usuario |
| Booking | Date | DateTime | Fecha de la reserva |

## Diagrama Entidad-Relación

```mermaid
erDiagram
    BABYSITTER {
        Guid Id PK
        string Name
        int ExperienceYears
        decimal HourlyRate
    }
    BOOKING {
        Guid Id PK
        Guid BabysitterId FK
        Guid UserId
        DateTime Date
    }
    BABYSITTER ||--o{ BOOKING : has
```

## Diagrama de Clases

```mermaid
classDiagram
    class Babysitter {
        +Guid Id
        +string Name
        +int ExperienceYears
        +decimal HourlyRate
    }
    class Booking {
        +Guid Id
        +Guid BabysitterId
        +Guid UserId
        +DateTime Date
    }
    Babysitter "1" -- "*" Booking : receives
```

## Diagrama de Componentes

```mermaid
flowchart TD
    UI[NannyApp.UI React] --> API[NannyApp.API .NET Core]
    API --> DB[(SQL Server / PostgreSQL)]
```

## Diagrama de Despliegue

```mermaid
flowchart TD
    Client[Navegador Web] -->|HTTPS| Backend[Servidor Cloud Docker NannyApp]
    Backend -->|TCP/IP| DB[(Base de Datos Cloud)]
```
