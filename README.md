# The RethinkID JavaScript SDK

This repo contains a GitHub Action which triggers when a release is created. The action builds the SDK and publishes to GitHub Packages.

The GitHub Action also commits and pushes the built `dist` folder's contents to the public repo [rethinkid-js-sdk-dist](https://github.com/mostlytyped/rethinkid-js-sdk-dist). Files can be accessed their via CDN with [jsDelivr](https://www.jsdelivr.com/?docs=gh). e.g. `https://cdn.jsdelivr.net/gh/mostlytyped/rethinkid-js-sdk-dist/rethinkid-js-sdk.iife.js`

Using the bundled file:

```html
<script src="https://cdn.jsdelivr.net/gh/mostlytyped/rethinkid-js-sdk-dist/rethinkid-js-sdk.iife.js"></script>
<script>
  const config = {
    appId: "2252e43d-a52f-4964-bf34-9c686726a515",
    loginRedirectUri: "http://localhost:8080/callback",
  };

  const rid = new RethinkID(config);
</script>
```
