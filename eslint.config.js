import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import path from 'node:path';

const naming = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      filename: 'Nome do módulo incompatível com sua responsabilidade: use {{expected}}.',
      className: 'Classes próprias devem usar PascalCase.',
      functionName: 'Funções próprias devem usar camelCase.',
    },
  },
  create(context) {
    return {
      Program(node) {
        const filename = path.basename(context.filename);
        const classModule = node.body.some(
          (item) =>
            item.type === 'ClassDeclaration' || item.declaration?.type === 'ClassDeclaration',
        );
        const first = classModule ? filename[0].toUpperCase() : filename[0].toLowerCase();
        const expected = first + filename.slice(1);
        if (filename !== expected)
          context.report({ node, messageId: 'filename', data: { expected } });
      },
      ClassDeclaration(node) {
        if (node.id && !/^[A-Z][A-Za-z0-9]*$/.test(node.id.name))
          context.report({ node: node.id, messageId: 'className' });
      },
      FunctionDeclaration(node) {
        if (node.id && !/^[a-z][A-Za-z0-9]*$/.test(node.id.name))
          context.report({ node: node.id, messageId: 'functionName' });
      },
    };
  },
};

// Terceiros, acervo imutável e metadados gerados têm seus validadores próprios.
export default [
  {
    ignores: [
      'node_modules/**',
      'src/vendor/**',
      'docs/**',
      'assets/**',
      '.agents/**',
      '.venv/**',
      'dist/**',
      // Automações históricas são restauradas só no QA e conservam regras próprias.
      'scripts/test-*',
      'scripts/review-*',
      'scripts/verify-*',
      'scripts/capture-*',
      'scripts/audit-*',
      'scripts/analyze-*',
      'scripts/qa-*',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/js/**/*.js', 'scripts/**/*.js', 'tools/**/*.js', '*.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // O legado contém contratos extensos; remoções de parâmetros exigem revisão dos consumidores.
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
      'new-cap': ['error', { capIsNew: false }],
    },
  },
  {
    files: ['src/js/**/*.js'],
    plugins: { project: { rules: { naming } } },
    rules: { 'project/naming': 'error' },
  },
  prettier,
];
