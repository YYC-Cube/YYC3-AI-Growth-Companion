export default {
  rules: {
    'no-hardcoded-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: '禁止在代码中使用硬编码颜色值',
          category: 'Best Practices',
          recommended: true,
        },
        schema: [
          {
            type: 'object',
            properties: {
              allowedColors: {
                type: 'array',
                items: { type: 'string' },
              },
              // 允许字符串或正则字面量（规则内部统一按 test 使用）
              allowedPatterns: {
                type: 'array',
              },
              checkProperties: {
                type: 'boolean',
                default: true,
              },
              checkStrings: {
                type: 'boolean',
                default: true,
              },
              checkTemplateLiterals: {
                type: 'boolean',
                default: true,
              },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};
        const {
          allowedColors = [],
          allowedPatterns = [/^var\(--[\w-]+\)$/, /^transparent$/],
          checkProperties = true,
          checkStrings = true,
          checkTemplateLiterals = true,
        } = options;

        const hexColorPattern = /#([0-9a-fA-F]{3,6})\b/g;
        const rgbColorPattern = /rgba?\((\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*)\)/g;
        const hslColorPattern = /hsla?\((\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?(\s*,\s*[\d.]+)?\s*)\)/g;

        function isAllowedColor(color) {
          if (allowedColors.includes(color)) {
            return true;
          }

          for (const pattern of allowedPatterns) {
            if (pattern.test(color)) {
              return true;
            }
          }

          return false;
        }

        function checkForHardcodedColors(node, value) {
          if (!value || typeof value !== 'string') {
            return;
          }

          const hexMatches = value.match(hexColorPattern);
          const rgbMatches = value.match(rgbColorPattern);
          const hslMatches = value.match(hslColorPattern);

          const allMatches = [
            ...(hexMatches || []),
            ...(rgbMatches || []),
            ...(hslMatches || []),
          ];

          for (const match of allMatches) {
            if (!isAllowedColor(match)) {
              context.report({
                node,
                message: `禁止使用硬编码颜色值 "${match}"，请使用CSS变量（如 var(--color-blue)）代替`,
                fix: null,
              });
            }
          }
        }

        return {
          JSXAttribute(node) {
            if (!checkProperties) return;

            if (node.name.type === 'JSXIdentifier' &&
                (node.name.name === 'style' || node.name.name === 'className')) {
              if (node.value.type === 'Literal' || node.value.type === 'StringLiteral') {
                checkForHardcodedColors(node, node.value.value);
              } else if (node.value.type === 'JSXExpressionContainer') {
                if (node.value.expression.type === 'Literal' || node.value.expression.type === 'StringLiteral') {
                  checkForHardcodedColors(node, node.value.expression.value);
                } else if (node.value.expression.type === 'TemplateLiteral') {
                  if (checkTemplateLiterals) {
                    for (const element of node.value.expression.quasis) {
                      checkForHardcodedColors(node, element.value.cooked);
                    }
                  }
                }
              }
            }
          },

          Property(node) {
            if (!checkProperties) return;

            if (node.key.type === 'Identifier' &&
                (node.key.name === 'style' || node.key.name === 'className')) {
              if (node.value.type === 'Literal' || node.value.type === 'StringLiteral') {
                checkForHardcodedColors(node, node.value.value);
              } else if (node.value.type === 'TemplateLiteral') {
                if (checkTemplateLiterals) {
                  for (const element of node.value.quasis) {
                    checkForHardcodedColors(node, element.value.cooked);
                  }
                }
              }
            }
          },

          TemplateElement(node) {
            if (!checkTemplateLiterals) return;

            checkForHardcodedColors(node, node.value.cooked);
          },

          Literal(node) {
            if (!checkStrings) return;

            if (typeof node.value === 'string') {
              checkForHardcodedColors(node, node.value);
            }
          },
        };
      },
    },
  },
};
