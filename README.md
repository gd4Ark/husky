# husky

> Modern native Hg hooks made easy, Based on [husky](https://github.com/typicode/husky)

Husky improves your commits and more 🐶 *woof!*

# Install

```
npm install husky --save-dev
```

# Usage

Edit `package.json > prepare` script and run it once:

```sh
npm set-script prepare "husky install"
npm run prepare
```

Add a hook:

```sh
npx husky add pre-commit "npm test"
hg add .husky/pre-commit
```

Make a commit:

```sh
hg commit -m "Keep calm and commit"
# `npm test` will run
```

# Documentation

https://typicode.github.io/husky
