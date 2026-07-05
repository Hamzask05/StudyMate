// ============================================================================
// theme.ts — LE THÈME de l'application (identité visuelle SaaS).
// Direction issue du skill ui-ux-pro-max pour un produit d'étude/productivité :
//   - couleur de marque : "study purple" (#7C3AED)
//   - typographie : Plus Jakarta Sans (SaaS, clean, professionnel)
// Un seul endroit à modifier pour changer l'apparence de toute l'app.
// ============================================================================

import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Échelle de violet (10 nuances, de la plus claire à la plus foncée).
// L'index 6 (#7c3aed) est la teinte principale utilisée par défaut.
const brand: MantineColorsTuple = [
  '#f5f3ff',
  '#ede9fe',
  '#ddd6fe',
  '#c4b5fd',
  '#a78bfa',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
];

// Vert "réponse correcte" pour les accents de réussite / CTA secondaires.
const success: MantineColorsTuple = [
  '#ecfdf5',
  '#d1fae5',
  '#a7f3d0',
  '#6ee7b7',
  '#34d399',
  '#10b981',
  '#059669',
  '#047857',
  '#065f46',
  '#064e3b',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 6,
  colors: { brand, success },
  fontFamily:
    '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
});
