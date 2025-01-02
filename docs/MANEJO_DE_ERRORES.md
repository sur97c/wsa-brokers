# Sistema de Manejo de Errores

## Visión General

Sistema centralizado de manejo de errores para la aplicación WSA-Brokers implementado con TypeScript, Redux y Firebase. El sistema provee una estructura consistente para manejar errores, soporte para tipos fuertemente tipados, y un manejo centralizado a través de Redux.

## Estructura de Archivos

```
app/
├── models/
│   └── errors/
│       ├── base.error.ts       # Clases y tipos base de errores
│       └── auth.error.ts       # Errores específicos de autenticación
├── middleware/
│   └── redux/
│       └── error.middleware.ts # Middleware para manejo de errores en Redux
├── utils/
│   └── error-logger.ts        # Utilidad para logging de errores
└── redux/
    └── slices/
        └── auth.slice.ts      # Ejemplo de integración con Redux
```

## Componentes Principales

### Base Error (base.error.ts)

```typescript
export enum ErrorSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface ErrorMetadata {
  timestamp: Date
  severity: ErrorSeverity
  context?: Record<string, unknown>
}

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata: ErrorMetadata = {
      timestamp: new Date(),
      severity: ErrorSeverity.ERROR,
    }
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
```

### Error Logger (error-logger.ts)

```typescript
export class ErrorLogger {
  private static instance: ErrorLogger

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  public logError(error: unknown, context?: Record<string, unknown>): void {
    const normalizedError = this.normalizeError(error)
    console.error('Error logged:', {
      ...normalizedError,
      context,
      timestamp: new Date().toISOString(),
    })
  }

  public normalizeError(error: unknown): BaseError {
    if (error instanceof BaseError) {
      return error
    }

    if (error instanceof FirebaseError) {
      return new BaseError(error.message, error.code, {
        severity: ErrorSeverity.ERROR,
        context: { originalError: error },
      })
    }

    return new BaseError(
      error instanceof Error ? error.message : 'Unknown error',
      'UNKNOWN_ERROR',
      {
        severity: ErrorSeverity.ERROR,
        context: { originalError: error },
      }
    )
  }
}
```

### Redux Middleware (error.middleware.ts)

```typescript
export const errorMiddleware: Middleware = () => (next) => async (action) => {
  try {
    return await next(action)
  } catch (error) {
    const errorLogger = ErrorLogger.getInstance()
    const normalizedError = errorLogger.normalizeError(error)
    errorLogger.logError(error)

    return next({
      type: 'error/occurred',
      payload: normalizedError,
      error: true,
    })
  }
}
```

## Integración con Redux (auth.slice.ts)

```typescript
interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: BaseError | null
  sessionStatus: SessionStatus
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<BaseError>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload as BaseError
    })
  },
})
```

## Uso en Componentes

### Manejo Automático vía Redux

```typescript
const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // El error se maneja automáticamente por el middleware
    await dispatch(loginUser(credentials));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <p className="text-red-700">{error.message}</p>
          <p className="text-sm text-red-600">{error.code}</p>
        </div>
      )}
      {/* ... resto del formulario ... */}
    </form>
  );
};
```

## Características Principales

1. **Manejo Centralizado**

   - Un solo punto de manejo de errores a través del middleware de Redux
   - Normalización consistente de errores
   - Logging centralizado

2. **Tipado Fuerte**

   - Errores fuertemente tipados con TypeScript
   - Sin uso de `any`
   - Validación en tiempo de compilación

3. **Metadata Enriquecida**

   - Timestamps automáticos
   - Niveles de severidad
   - Contexto adicional
   - Stack traces preservados

4. **Integración con Firebase**

   - Manejo específico de FirebaseError
   - Conversión automática a BaseError
   - Preservación de códigos de error

5. **Extensibilidad**
   - Fácil adición de nuevos tipos de error
   - Sistema preparado para logging avanzado
   - Soporte para múltiples fuentes de error

## Mejores Prácticas

1. **Uso del Middleware**

   - No usar try/catch en componentes cuando sea posible
   - Dejar que el middleware maneje los errores
   - Usar el estado de Redux para mostrar errores

2. **Manejo de Errores**

   - Siempre usar BaseError o sus subclases
   - Incluir códigos de error significativos
   - Agregar contexto relevante en metadata

3. **Logging**
   - Usar ErrorLogger para logging manual cuando sea necesario
   - Incluir contexto relevante al loggear
   - No exponer información sensible en logs

## Extensiones Futuras

1. Integración con sistema de bitácora
2. Dashboard de monitoreo de errores
3. Sistema de alertas
4. Análisis de tendencias de errores
