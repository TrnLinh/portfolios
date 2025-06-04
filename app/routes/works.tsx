import type { Route } from "./+types/link1";
import { Works } from "../layout/Works";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Works" },
    { name: "description", content: "Welcome to Works!" },
  ];
}
export default function Link1Route() {
  return (
    <>
      <Works />
    </>
  );
}
