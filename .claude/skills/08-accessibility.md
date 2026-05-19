# Skill: Accessibility — SnapLinks

## Reglas base
- Todo elemento interactivo debe tener `aria-label` descriptivo si no tiene texto visible
- Imágenes decorativas: `alt=""`; imágenes de contenido: alt descriptivo
- Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande
- Orden de foco lógico — no usar `tabIndex > 0`

## Componentes críticos de SnapLinks
- **Input de URL**: `aria-label="URL a acortar"` + `aria-describedby` para errores
- **Botones de copiar**: `aria-label="Copiar link corto"` + feedback con `aria-live`
- **Tabla de links**: usar `<caption>`, `scope="col"` en headers
- **Gráficas (Recharts)**: añadir `role="img"` + `aria-label` descriptivo

## Feedback de acciones
```tsx
// Al copiar un link
<span aria-live="polite" className="sr-only">
  {copied ? "Link copiado al portapapeles" : ""}
</span>
```

## Focus management
- Al abrir un Dialog: el foco va al primer elemento interactivo dentro
- Al cerrar: el foco regresa al trigger que lo abrió
- shadcn/ui maneja esto automáticamente con Radix UI
