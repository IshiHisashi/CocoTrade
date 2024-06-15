module.exports = {
  root: true,
  env: { browser: true, es2020: true, es6: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "react-app",
    "airbnb",
    "airbnb/hooks",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "jsx-a11y"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],"jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"]
        }
      }
    ],
  },
  overrides: [
    {
      files: ["*.js", "*.jsx"], // Adjust the pattern to your needs
      rules: {
        "no-console": ["warn"], // warn at remaining console.log (default is error)
        "no-unused-vars": ["off"], // don't care about unused variables
        "import/extensions": ["off"], // use extentions for import from path
        "arrow-body-style": ["off"], // allow to use block statement for arrow functions
        "import/no-extraneous-dependencies": [
          "off",
          {
            devDependencies: false,
            optionalDependencies: false,
            peerDependencies: false,
          },
        ], // allow to import from dev/potional/peer dependencies in package.json
        "react/function-component-definition": [
          "warn",
          {
            namedComponents: "arrow-function",
            unnamedComponents: "function-expression",
          },
        ], // consistent function type
        "react/prop-types": "off", // don't care about the type of props
        // single quotations usage is turned off by Prettier.
        // trailing comma usage is set to be "es5" by Prettier.
      },
    },
  ],
};
