import { Outlet } from "react-router";
import { Nav } from "../component/Nav";

export default function MainLayout() {
  return (
    <>
      <section>
        <Nav />
        <Outlet />
      </section>
    </>
  );
}
