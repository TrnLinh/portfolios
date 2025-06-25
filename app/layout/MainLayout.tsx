import { Outlet } from "react-router";
import { Nav } from "../component/Nav";

export default function MainLayout() {
  return (
    <>
      <section className='max-w-[1440px] mx-auto'>
        <Nav />
        <Outlet />
      </section>
    </>
  );
}
