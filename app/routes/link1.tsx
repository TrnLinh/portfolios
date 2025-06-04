import type { Route } from "./+types/link1";
import { Link1 } from "../welcome/link1";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Link 1" },
    { name: "description", content: "Welcome to Link 1!" },
  ];
}
export default function Link1Route() {
  return <Link1 />;
}
