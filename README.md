# CSV Commerce

A tiny REST API which uses csv as database

## How to run

> Recommended node version 16+

1. Run `pnpm install`
2. Run `pnpm seed` to generate a dummy CSV database

If you want to run in dev mode run `pnpm dev` and take note of generated API Key for authenticating on protected routes such as `/users`.

If you want to run in production mode run `pnpm build` and then run `pnpm start`. As in development take note of the API Key.

The auth layer is less than secure and it is used to showcase how to implement a basic auth with api keys. You should use other packages to implement a secure auth system or rely on external vendors.
