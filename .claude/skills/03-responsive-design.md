# Skill: Responsive Design — Mobile First — SnapLinks

## Layout principal
- Mobile: stack vertical, sidebar colapsado
- md+: layout de dos paneles (sidebar fijo + contenido)
- Dashboard sidebar: oculto en mobile (drawer), visible en lg+

## Reglas críticas
- overflow-x: auto SOLO en contenedores específicos (tablas, listas largas)
- NUNCA overflow-x en body, html o layouts raíz
- Touch targets mínimo 44×44px en mobile
- Tablas de links: scroll horizontal en contenedor, no en el body
