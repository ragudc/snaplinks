# Skill: Git Conventions — SnapLinks

## Formato de commits (Conventional Commits)
```
<type>(<scope>): <descripción en imperativo>
```

## Tipos permitidos
| Tipo | Cuándo usarlo |
|------|---------------|
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Bug fix |
| `chore` | Configuración, dependencias, scripts |
| `refactor` | Refactor sin cambio de comportamiento |
| `style` | Cambios de estilo/CSS |
| `docs` | Documentación |
| `test` | Tests |

## Ejemplos
```
feat(links): add QR code generation to link detail page
fix(auth): redirect to login when session expires
chore: add prettier config and format all files
refactor(dashboard): extract LinkCard into separate component
```

## Scopes del proyecto
`links`, `auth`, `analytics`, `dashboard`, `api`, `middleware`, `ui`
