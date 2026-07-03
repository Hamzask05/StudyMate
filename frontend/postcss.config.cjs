// Configuration PostCSS demandée par Mantine (voir doc mantine.dev/getting-started).
// PostCSS est un outil qui transforme le CSS à la compilation ; Mantine s'en
// sert pour ses variables de thème et ses points de rupture responsive.
// Fichier de config : on l'écrit une fois et on n'y revient jamais.
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
