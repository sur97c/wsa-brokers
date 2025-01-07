# Sistema de Traducciones WSA Brokers

## Estructura

```
app/translations/
├── types/              # Definiciones de tipos
│   ├── core/          # Tipos para traducciones base
│   ├── modules/       # Tipos para cada módulo
│   └── index.ts       # Configuración principal de tipos
├── es/                # Traducciones en español
│   ├── core/          # Traducciones base
│   ├── modules/       # Traducciones por módulo
│   └── index.ts       # Exportación ES
├── en/                # Traducciones en inglés
│   ├── core/          # Traducciones base
│   ├── modules/       # Traducciones por módulo
│   └── index.ts       # Exportación EN
└── hooks/             # Hooks de traducción
    └── useTranslations.ts
```

## Características Principales

- Sistema modular de traducciones
- Type-safe: Completamente tipado
- Soporte para interpolación de componentes React
- Manejo de traducciones no encontradas
- Separación clara entre traducciones core y módulos

## Uso

```typescript
function MyComponent() {
  const { t, translations } = useTranslations()

  return (
    <div>
      {/* Traducción simple */}
      <h1>{t(translations.core.common.loading)}</h1>

      {/* Traducción con interpolación */}
      <p>
        {t(translations.modules.home.welcome, {
          name: <strong>Usuario</strong>
        })}
      </p>
    </div>
  )
}
```

## Hook useTranslations

El hook `useTranslations` proporciona:

- Acceso type-safe a las traducciones
- Función `t()` para interpolación de valores
- Soporte para componentes React en las interpolaciones
- Manejo de traducciones no encontradas (retorna 'TRANSLATION_NOT_FOUND')

```typescript
const { t, translations } = useTranslations()

// Uso simple
t(translations.core.common.loading)

// Uso con interpolación
t(translations.modules.auth.welcome, { username: "John" })

// Uso con componentes React
t(translations.modules.errors.tryAgain, {
  link: <a href="/retry">click aquí</a>
})
```

## Agregar Nuevas Traducciones

1. Definir tipos en `/types/modules/`:

```typescript
// app/translations/types/modules/my-module.ts
export interface MyModuleTranslations {
  title: string
  description: string
  // ... más traducciones
}
```

2. Agregar traducciones en ES y EN:

```typescript
// app/translations/es/modules/my-module.ts
export const myModuleES: MyModuleTranslations = {
  title: 'Mi Título',
  description: 'Mi Descripción',
}

// app/translations/en/modules/my-module.ts
export const myModuleEN: MyModuleTranslations = {
  title: 'My Title',
  description: 'My Description',
}
```

3. Exportar en los index.ts correspondientes:

```typescript
// Actualizar en ambos app/translations/es/index.ts y en/index.ts
export const translations = {
  core: {
    /*...*/
  },
  modules: {
    // ... otros módulos
    myModule: myModuleES, // o myModuleEN para inglés
  },
}
```

## Notas Importantes

- No usar strings directos para las keys de traducción
- Siempre acceder mediante el objeto translations
- Mantener la estructura modular
- Las traducciones core son para textos comunes reutilizables
- Seguir la estructura de carpetas establecida
- Mantener la consistencia en el nombrado
- Agregar nuevos módulos de forma aislada
- Documentar casos especiales o complejos
- Asegurar que todas las traducciones existan en ambos idiomas

## Estructura de Módulos

### Core

- **common**: Textos comunes y reutilizables
- **errors**: Mensajes de error globales
- **validation**: Mensajes de validación

### Modules

- **header**: Traducciones del encabezado
- **navigation**: Menús y navegación
- **auth**: Autenticación y acceso
- **home**: Página principal
- **dashboard**: Panel de control
- Y otros módulos específicos de la aplicación

## Mejores Prácticas

1. **Modularidad**

   - Mantener módulos pequeños y enfocados
   - Agrupar traducciones relacionadas
   - Evitar duplicación de textos

2. **Tipado**

   - Mantener interfaces actualizadas
   - Usar tipos específicos
   - Aprovechar el autocompletado

3. **Mantenimiento**

   - Documentar cambios significativos
   - Mantener sincronizados ES y EN
   - Revisar y limpiar traducciones no usadas

4. **Interpolación**
   - Usar nombres descriptivos para las variables
   - Documentar variables esperadas
   - Mantener consistencia en el formato

```

Este archivo proporciona una referencia completa del sistema de traducciones y puede ser referenciado en futuros chats para mantener la consistencia en la implementación. ¿Quieres que ajuste o agregue algo más?
```
