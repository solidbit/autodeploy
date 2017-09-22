module.exports = {
  extends: ["react-app", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [1, { trailingComma: "all", singleQuote: true }]
  }
};
