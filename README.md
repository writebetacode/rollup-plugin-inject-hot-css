# rollup-plugin-inject-hot-css

A simple CSS Hot Module Replacement code injector for [Rollup](https://rollupjs.org) when used with [Nollup](https://github.com/PepsRyuu/nollup).  This should allow you to use any CSS loader and still have access to Hot css when developing.

## Installation

`npm install -D rollup-plugin-inject-hot-css`

## Usage with _rollup-plugin-styles_

```js
// rollup.config.js
import styles from "rollup-plugin-styles";
import injectHotCSS from "rollup-plugin-inject-hot-css";

const isProduction = process.env.NODE_ENV === "production";

export default {
  ...,
  plugins: [{
    styles({
      mode: "extract",
      minimize: true,
      sourceMap: isProduction ? true : "inline",
    }),
    !isProduction && injectHotCSS()
  }]
};

```

## Options

### `extensions`

Type: `Array[...String]`

Defines the extensions of the files this plugin will inject the css hot module replacement code into.

Default: `[ ".css", ".scss", ".sass", ".less", ".styl" ]`

## Hot Module Replacement

This plugin expects there to be a _link_ tag inside the index.html file in order
to replace the CSS appropriately.

`<link rel="stylesheet" type="text/css" href="/styles.css">`

When file changes are made, the link tag is replaced by appending a timestamp to the end of the href. This forces the browser to download the file again without needing to refresh the page.

## Notes

* If you are looking for an all in one css loader that also incorporates the css hot module replacement logic, I would suggest looking into the [rollup-plugin-hot-css](https://github.com/PepsRyuu/rollup-plugin-hot-css) plugin.
