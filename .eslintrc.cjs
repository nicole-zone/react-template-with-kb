const { mkdReactConfig } = require('@monkey-design/eslint-config-mkd-react');

const config = mkdReactConfig({ project: ['./tsconfig.json'] });

const jsTsCommonRules = {
  'no-use-before-define': 'off', // 先定义后使用，函数和类除外
  'import/order': 'off', // 导入依赖要有顺序
  'no-underscore-dangle': 'off', // 禁止下划线命名
  'no-bitwise': 'off', // 不使用位运算
  'import/no-extraneous-dependencies': 'off', // 依赖引入不区分 dep 和 devDep
  'consistent-return': 'off', // return 类型要一致
  'no-param-reassign': 'off', // 参数不要重新赋值
  'prefer-rest-params': 'off', // 不使用 arguments
  'prefer-destructuring': 'off', // 没啥必要
  'max-classes-per-file': 'off', // 一个文件只有一个类
  'no-return-assign': 'off', // 箭头函数返回值不能是赋值语句
  'no-restricted-syntax': 'off', // 数组迭代避免使用循环
  'no-restricted-globals': 'off',
  'no-multi-assign': 'off', // 不能多=赋值
  'default-case': 'off', // switch case 要有 default
  'no-console': 'off',
  'no-empty': 'off', // try catch {} 还要加注释，太二了
  '@typescript-eslint/prefer-readonly': 'off', // 不使用 readonly，没法约束模板，也没法约束成员函数
  'react-hooks/rules-of-hooks': 'off',
  'react-hooks/exhaustive-deps': 'off', // 检查 effect 的依赖
  'react/jsx-props-no-spreading': 'off',
  'react/no-array-index-key': 'off',
  'react/self-closing-comp': 'warn',
  'prefer-promise-reject-errors': 'off',
  'no-debugger': 'warn',
  'react/require-default-props': 'off',
  'jsx-a11y/alt-text': 'off',
  'arrow-body-style': 'off',
  'sonar/destructuring-assignment-syntax': 'off',
};

module.exports = {
  ...config,
  plugins: ['@yuanfudao/infra'],
  overrides: [
    ...config.overrides,
    {
      files: ['*.js', '*.jsx'],
      rules: { ...jsTsCommonRules },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        ...jsTsCommonRules,
        'react/jsx-boolean-value': ['off'],
        'sonar/no-redundant-optional': ['off'],
        'import/no-cycle': ['off'],
        '@typescript-eslint/explicit-member-accessibility': ['off'],
        '@typescript-eslint/prefer-nullish-coalescing':['off'],
        'react-hooks/exhaustive-deps': 'off', // 检查 effect 的依赖
        '@yuanfudao/infra/exhaustive-deps-except-useEffect': 'warn', // 检查 hooks 的依赖 useEffect除外
      },
    },
  ],
};
