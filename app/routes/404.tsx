import { useLocation } from "react-router";

export default function NotFound() {
  const location = useLocation();

  // Handle DevTools and well-known requests silently
  if (
    location.pathname.includes("/.well-known/") ||
    location.pathname.includes("/devtools") ||
    location.pathname.includes(".json")
  ) {
    return new Response(null, { status: 404 });
  }

  // For actual user-facing 404s, you can customize this
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-4xl font-bold mb-4'>404</h1>
      <p className='text-lg text-gray-600 mb-8'>Page not found</p>
      <a
        href='/'
        className='px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors'
      >
        Go Home
      </a>
    </div>
  );
}
