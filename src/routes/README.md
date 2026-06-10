# Routes

This app is a Vite + React single-page app using TanStack Router on the client.
Each `.tsx` file in this directory represents a route, with `__root.tsx` as the
root layout that renders child routes through `<Outlet />`.

The static `src/routeTree.gen.ts` file currently wires the existing routes. If
you add or rename routes, update that file or reintroduce a router generator.
