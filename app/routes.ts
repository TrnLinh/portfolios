import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "layout/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("works", "routes/works.tsx"),
  ]),
  // Catch-all route for DevTools and other unmatched requests
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
