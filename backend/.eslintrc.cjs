module.exports = {
  root: true,
  env: { browser: true, es2020: true, es6: true, node: true },
  extends: ["airbnb-base", "prettier"], //, "eslint:recommended"
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: {},
  plugins: [],
  rules: {},
  overrides: [
    {
      files: ["*.js", "*.jsx"], // Adjust the pattern to your needs
      rules: {
        "no-console": ["off"], // don't detect remaining console.log
        "no-unused-vars": ["off"], // don't care about unused variables
        "import/extensions": ["off"], // use extentions for import from path
        "arrow-body-style": ["off"], // allow to use block statement for arrow functions
        "no-plusplus": ["off"], // allow to use ++ operator
        "no-underscore-dangle": ["off"], // allow to use dangling underscores in identifiers like "_id"
        // single quotations usage is turned off by Prettier.
        // trailing comma usage is set to be "es5" by Prettier.
      },
    },
  ],
};
