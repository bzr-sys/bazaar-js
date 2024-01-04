# The RethinkID JavaScript SDK

A JavaScript SDK client for building SPAs (Single Page Apps) with RethinkID.

## Using via NPM

Install with NPM:

```bash
npm i @rethinkid/rethinkid-js-sdk
```

Import the package:

```js
import { RethinkID } from "@rethinkid/rethinkid-js-sdk";

const rid = new RethinkID({
  /* config... */
});
```

## Load from a CDN

```html
<script src="https://unpkg.com/@rethinkid/rethinkid-js-sdk"></script>
```

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
