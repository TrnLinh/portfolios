import type { Route } from "./+types/home";
import { Home } from "../layout/Home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "" }];
}

export default function HomeRoute() {
  return <Home />;
}
