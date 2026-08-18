import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import customRules from './.eslintrc.custom-rules.js';

/**
 * YYC³ TypeScript ESLint 配置文件
 * 基于 ESLint v9+ Flat Config 格式
 */
export default [
  // 忽略文件配置
  {
    ignores: [
      'node_modules',
      'dist',
      '.next',
      'docs',
      'backend',
      'coverage',
      '*.log',
      '*.lock',
      '*.json',
      '*.md',
      '*.yml',
      '*.yaml',
      '*.sh',
      '*.js', // 忽略普通 JavaScript 文件，只检查 TypeScript
    ],
  },

  // 全局规则配置
  {
    files: ['**/*.{ts,tsx}'],
    settings: {
      // 识别 tsconfig 路径别名（@/* 等），否则 import/no-unresolved 全量误报
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // flat config 的 globals 必须展开真实的全局名集合（legacy 布尔写法无效）
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: ts.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      '@typescript-eslint': ts.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'no-hardcoded-colors': customRules,
    },

    rules: {
      // 基础 JavaScript 规则
      ...js.configs.recommended.rules,

      // TypeScript 规则
      ...ts.configs.strict.rules,
      ...ts.configs.stylistic.rules,

      // 类型安全规则
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // React 规则
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // 导入规则
      'import/no-unresolved': 'error',
      'import/no-cycle': ['error', { maxDepth: 10 }],
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: { order: 'asc' },
        },
      ],

      // 其他规则
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 版本
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/react-in-jsx-scope': 'off', // 现代 React 不需要导入 React
      'react/prop-types': 'off', // 使用 TypeScript 类型而不是 PropTypes

      // 自定义规则 - 禁止硬编码颜色
      'no-hardcoded-colors/no-hardcoded-colors': [
        'error',
        {
          allowedColors: [],
          allowedPatterns: [/^var\(--[\w-]+\)$/, /^transparent$/],
          checkProperties: true,
          checkStrings: true,
          checkTemplateLiterals: true,
        },
      ],
    },
  },
];
