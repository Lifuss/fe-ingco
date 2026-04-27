import { type Config } from 'prettier';

const config: Config = {
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',

  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
