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

## Using via NPM

This repo contains a GitHub Action which triggers when a release is created. The action builds the SDK and publishes to GitHub Packages.

GitHub Packages is added as an NPM registry in `.npmrc`.

To install from GitHub first you must [authenticate](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

Then you can install with NPM as usual.

```bash
npm install @mostlytyped/rethinkid-js-sdk
```

Import the package as usual.

```js
import RethinkID from "@mostlytyped/rethinkid-js-sdk";

const rid = new RethinkID({
  /* config... */
});
```

## Using via CDN

The GitHub Action also commits and pushes the built `dist` folder's contents to the public repo [rethinkid-js-sdk-dist](https://github.com/mostlytyped/rethinkid-js-sdk-dist). Files can be accessed their via CDN with [jsDelivr](https://www.jsdelivr.com/?docs=gh). e.g. `https://cdn.jsdelivr.net/gh/mostlytyped/rethinkid-js-sdk-dist/rethinkid-js-sdk.iife.js`

Using the bundled file:

```html
<script src="https://cdn.jsdelivr.net/gh/mostlytyped/rethinkid-js-sdk-dist/rethinkid-js-sdk.iife.js"></script>
<script>
  const rid = new RethinkID({
    /* config... */
  });
</script>
```
