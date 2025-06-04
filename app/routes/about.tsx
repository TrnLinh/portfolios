import type { Route } from "./+types/about";
import { About } from "../layout/About";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About" },
    { name: "description", content: "Welcome to About!" },
  ];
}
export default function Link1Route() {
  return (
    <>
      <About />
    </>
  );
}
