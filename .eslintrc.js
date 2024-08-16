module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['react-app', 'plugin:react/jsx-runtime', 'airbnb', 'airbnb/hooks'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'import'],
    rules: {
        "max-len": 0,
        "object-curly-newline": ['error', { "multiline": true, "consistent": true }],
        "indent": ['error', 2],
        "react/jsx-indent": ['error', 2],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        "@typescript-eslint/no-unused-vars": 0,
        "prefer-destructuring": 0,
        "react-hooks/exhaustive-deps": 0,
        "react/no-array-index-key": 0,
        "semi": 0,
        "react/react-in-jsx-scope": 0,
        "react/jsx-filename-extension": 0,
        "arrow-body-style": 0,
        "react/function-component-definition": 0,
        "import/extensions": 0,
        "react/jsx-no-undef": "error",
        "react/require-default-props": 0,
        "react/jsx-no-bind": 0,
    },
    settings: {
        react: {
            version: 'detect', // Automatically includes the React version
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
            },
        }
    },
};
