export function Link1() {
  return (
    <section className='flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
      <h1 className='font-bold text-5xl text-red-400'>Link 1</h1>
      <a
        href='/link2'
        className='mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200'
      >
        Link 2
      </a>
      <a href='/'>Home</a>
    </section>
  );
}
