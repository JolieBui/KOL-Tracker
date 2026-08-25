export default [
  {
    files: ["**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
        File: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        fetch: "readonly"
      }
    },
    rules: {
      "no-undef": "error"
    }
  }
];
