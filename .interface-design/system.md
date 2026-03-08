# System - my-app

## Direction & Feel

Clínica/profesional - paleta de colores inspirada en ambientes médicos con tonos celestes suaves y blancos. Interfaz limpia y accesible.

## Depth Strategy

**Borders-only** -sin sombras dramáticas- usando bordes sutiles para definición. hierarchy mediante background color shifts.

## Spacing Base Unit

4px base (Tailwind default)

## Color Palette (Tailwind v4)

```css
@theme {
  --color-brand-50: rgb(232, 247, 250);   /* highlight activo */
  --color-brand-100: rgb(233, 247, 248);  /* hover states */
  --color-surface-base: rgb(255, 255, 255);
  --color-surface-elevated: rgb(253, 253, 253);
  --color-surface-card: rgb(254, 254, 254);
  --color-surface-muted: rgb(251, 251, 251);
  --color-border-subtle: rgb(249, 249, 249);
  --color-border-default: rgb(242, 242, 242);
  --color-border-emphasis: rgb(233, 233, 233);
}
```

## Key Patterns

### Sidebar/Navbar
- Width: w-64
- Background: bg-surface-base
- Border: border-r border-border-default
- Nav items: flex items-center gap-3 px-3 py-2.5 rounded-lg
- Active state: bg-brand-50 text-brand-700
- Hover state: bg-surface-muted
- Icon size: w-5 h-5

### Component States
- Default: text-gray-600
- Hover: hover:bg-surface-muted hover:text-gray-900
- Active: bg-brand-50 text-brand-700 (con icon accent)
