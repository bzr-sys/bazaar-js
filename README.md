# The RethinkID JavaScript SDK

An SDK for working with RethinkID.

## Using locally

Build the `dist` folder.

```bash
npm run build

# or

npm run watch
```

Install your locally built package.

```bash
npm install <../path/to/rethinkid-js-sdk>
```

**Note: this package doesn't work currently if installed locally (as opposed to installed via NPM) because of a Vite `query-string` package polyfill issue.**

## Using via NPM

Install with NPM:

```bash
npm install @rethinkid/rethinkid-js-sdk
```

Import the package:

```js
import { RethinkID } from "@rethinkid/rethinkid-js-sdk";

const rid = new RethinkID({
  /* config... */
});
```

## CDN files

jsDelivr `@rethinkid/rethinkid-js-sdk` CDN files:

`https://cdn.jsdelivr.net/npm/@rethinkid/rethinkid-js-sdk/`
