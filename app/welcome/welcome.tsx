export function Welcome() {
  return (
    <section className='flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
      <a
        href='/link1'
        className='mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200'
      >
        Link 1
      </a>
      <a
        href='/link2'
        className='mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200'
      >
        Link 2
      </a>
    </section>
  );
}
