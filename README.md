# The RethinkID JavaScript SDK

Using the bundled file:

```html
<script src="dist/rethinkid-js-sdk.iife.js"></script>
<script>
  const config = {
    appId: "2252e43d-a52f-4964-bf34-9c686726a515",
    signUpRedirectUri: "http://localhost:8080",
    logInRedirectUri: "http://localhost:8080/callback",
    onLogInComplete: () => {
      // do something
    },
  };

  const rid = new RethinkID(config);
</script>
```
