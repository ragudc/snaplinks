# Skill: i18n — Idioma Predeterminado y Soporte Multilingüe

## Principio fundamental
**Todo el contenido visible de la aplicación debe estar en inglés por defecto.**
El español es el segundo idioma opcional — nunca el predeterminado.

## Idiomas soportados
| Código | Idioma | Estado |
|--------|--------|--------|
| `en`   | English | ✅ Default — SIEMPRE completo |
| `es`   | Español | ✅ Opcional — debe estar completo |

## Reglas de contenido

### ✅ Correcto — todo el contenido usa el sistema de traducciones
```tsx
// En cualquier componente con texto visible al usuario:
const { t } = useTranslation()
return <h1>{t.landing.hero.title}</h1>
// Resultado en EN: "Shorten your links in seconds"
// Resultado en ES: "Acorta tus links en segundos"
```

### ❌ Incorrecto — texto hardcodeado en inglés
```tsx
return <h1>Shorten your links in seconds</h1>
// Esto rompe el soporte de idioma
```

### Excepción permitida — solo para strings técnicos
Los siguientes elementos PUEDEN estar hardcodeados (no son texto visible de UI):
- `aria-label` de íconos decorativos
- Nombres de atributos HTML (`placeholder` DEBE usar traducciones)
- Valores de `type`, `name`, `id` en formularios

## Cómo agregar nuevo texto al sistema

### Paso 1: Agregar la string en inglés (en.ts)
```ts
export const en = {
  // ...
  dashboard: {
    // ...
    newSection: {
      title: "Your new title in English",
      description: "Description in English",
    }
  }
}
```

### Paso 2: Agregar la traducción en español (es.ts)
```ts
export const es: Translations = {
  // ...
  dashboard: {
    // ...
    newSection: {
      title: "Tu nuevo título en español",
      description: "Descripción en español",
    }
  }
}
```

### Paso 3: Usar en el componente
```tsx
const { t } = useTranslation()
return <h2>{t.dashboard.newSection.title}</h2>
```

## Estructura de archivos i18n
```
src/lib/i18n/
├── en.ts          ← Inglés (default) — fuente de verdad de tipos
├── es.ts          ← Español — debe implementar TODOS los keys de en.ts
├── context.tsx    ← LanguageContext + LanguageProvider
└── index.ts       ← useTranslation hook + tipo Language
```

## LanguageToggle — Comportamiento
- El toggle muestra el OTRO idioma disponible (si estás en EN, muestra "ES")
- La preferencia se guarda en localStorage con key `snaplinks-lang`
- En SSR el idioma default es siempre "en" (evitar hydration mismatch)
- La app detecta la preferencia al montar (useEffect)

## Criterio de completitud
Antes de cada commit, verificar:
- [ ] ¿Hay algún texto visible al usuario hardcodeado (no en t.xxx)?
- [ ] ¿La traducción al español está completa para el nuevo contenido?
- [ ] ¿El TypeScript compila sin errores (las keys de ES coinciden con EN)?
