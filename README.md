[![NPM Version](https://img.shields.io/npm/v/bzr/bazaar.svg?style=flat)](https://www.npmjs.com/package/@bzr/bazaar)
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/bzr-sys/bazaar-js/blob/master/LICENSE)

# The Bazaar JavaScript SDK

A JavaScript SDK client for building SPAs (Single Page Apps) with Bazaar.

## Using via NPM

Install with NPM:

```bash
npm i @bzr/bazaar
```

Import the package:

```js
import { BazaarApp } from "@bzr/bazaar";

const bzr = new BazaarApp({
  /* config... */
});
```

## Load from a CDN

```html
<script src="https://unpkg.com/@bzr/bazaar"></script>
```

## Environments

The option `bazaarUri` will default to `https://cloud.bzr.dev` unless `NODE_ENV=development`. In a dev environment, it defaults to `http://localhost:3377`, the location of the [mock Bazaar server](https://www.npmjs.com/package/@bzr/bazaar-mock).

## Next.js Caveats

### Dynamic Imports

Next.js builds in a Node runtime by default. If components consuming the SDK are built for the server, it will result in build errors for missing browser-only items, like `localStorage`, `document`, `window`, and `location`. To resolve these errors dynamically import relevant components:

```tsx
const MyComponent = dynamic(() => import("@/app/MyComponent"), {
  ssr: false,
});
```

### Module Resolution Warnings

`bufferutil` and `utf-8-validate` cause module resolution warnings when building a Next.js app that uses the SDK. The warnings don't cause build errors but are very noisy and confusing. The warnings occur because `socket.io-client` is dependent on `engine.io-client`, which is dependent on `ws`, which has optional `bufferutil` and `utf-8-validate` peer dependencies. Something to do with the Next.js Webpack build triggers the warnings.

I attempted many other solutions, including adding a `browser` field to the SDK `package.json` file to ignore the offending packages and modifying `rollup.config.js` (ignoring the packages with the Rollup `commonjs` plugin, the `replace` plugin, and creating shims with the `plugin-alias` plugin.)

The warnings could resolved at the level of the app consuming the SDK with the following:

```js
// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      bufferutil: false,
      "utf-8-validate": false,
    };
    return config;
  },
};
```
