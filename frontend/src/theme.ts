// ============================================================================
// theme.ts — LE THÈME de l'application (identité visuelle SaaS, mode SOMBRE).
// Direction issue du skill ui-ux-pro-max, style "Modern Dark" :
//   - fond near-black (jamais du noir pur), surfaces superposées, accents lumineux
//   - couleur de marque : violet (#7C3AED) — ressort superbement sur fond sombre
//   - typographie : Inter (la police premium des grandes apps)
// ============================================================================

import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Violet de marque (10 nuances). Sur fond sombre on utilise une teinte un peu
// plus claire (voir primaryShade.dark) pour un meilleur contraste.
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

// Vert "réussite" pour les accents positifs.
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

// Échelle "dark" sur mesure : un slate near-black raffiné (plus premium que le
// gris-bleu par défaut de Mantine). Repères Mantine en mode sombre :
//   dark[7] = fond de page (body) ; dark[6] = surfaces/cartes ;
//   dark[4] = bordures ; dark[2] = texte atténué ; dark[0] = texte principal.
const dark: MantineColorsTuple = [
  '#e8eaf0', // 0  texte principal (près du blanc, jamais #fff pur)
  '#c4c8d4', // 1
  '#9aa0b0', // 2  texte atténué (dimmed)
  '#6b7180', // 3
  '#3a3f4c', // 4  bordures
  '#282c36', // 5  bordures/inputs plus marqués
  '#191c24', // 6  surfaces / cartes (légèrement + clair que le fond)
  '#111318', // 7  fond de page
  '#0b0d11', // 8  sections en creux
  '#07080b', // 9  le plus profond
];

export const theme = createTheme({
  primaryColor: 'brand',
  // Teinte principale : shade 6 en clair, un peu plus claire (5) en sombre
  primaryShade: { light: 6, dark: 5 },
  autoContrast: true, // texte lisible auto sur les fonds colorés
  colors: { brand, success, dark },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
});
