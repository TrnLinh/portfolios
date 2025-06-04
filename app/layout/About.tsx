import { PageTransition } from "../layout/PageTransition";
import AnimatedBlob from "../component/AnimatedBlob";
import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi";

export function About() {
  return (
    <PageTransition>
      <section className='flex flex-col items-center justify-center min-h-lvh px-4 overflow-x-hidden '>
        <div className='p-4 rounded-sm ring-2 ring-neutral-100 h-[calc(100vh-6rem)] mt-14 grid grid-rows-12 grid-cols-1 relative test-bg'>
          <div className='absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 overflow test-bg'>
            <AnimatedBlob className='size-56 ' />
          </div>
          <div className='text-[clamp(1.25rem,0.879rem+1.524vw,2.25rem)] font-medium row-start-9 z-10'>
            A student who has goals and dreams to achieve, with a journey to
            finish, lessons to learn, and a drive to bring technology closer to
            everyone. Based in Hanoi, Vietnam.{" "}
          </div>
          <div className='flex flex-col items-start text-base font-medium z-10'>
            <span>Software Engineer</span>
            <span>FE Developer </span>
            <span>UI & UX Design</span>
          </div>
          <div className='row-start-12 z-10 mt-2'>
            <div className='group flex flex-row items-center justify-center gap-2 w-fit'>
              <span>Scroll down</span>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='20'
                  viewBox='0 0 12 20'
                  fill='none'
                >
                  <rect
                    x='0.5'
                    y='0.5'
                    width='10.4286'
                    height='19'
                    rx='5.21429'
                    className='stroke-neutral-1000'
                  />
                  <circle
                    cx='5.6001'
                    cy='5.19995'
                    r='2'
                    className='fill-neutral-1000 transition-transform duration-300 group-hover:translate-y-[9.60005px]'
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className='min-h-lvh px-4 overflow-x-hidden '>
        <div className='gap-3 flex flex-col mt-12 border-b-1 border-neutral-200 py-3'>
          <h1 className='font-body text-4xl font-medium leading-[100%]'>
            Feature Works.
          </h1>
          <Link
            to='/'
            className='flex flex-row items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors duration-300 hover:underline hover:underline-offset-2'
          >
            <span>More work</span>
            <HiArrowRight />
          </Link>
        </div>
        <div>
          {worksList.map((work) => (
            <div key={work.title} className='mt-6'>
              <Link
                to={work.link}
                className='flex flex-col items-start gap-4 mb-6'
              >
                <div className='h-56 w-full rounded-sm ring-2 ring-neutral-100 object-bottom  overflow-hidden relative'>
                  <img
                    src={work.image}
                    alt=''
                    className='bottom-1/2 translate-y-1/2  absolute'
                  />
                </div>
                <div>
                  <div className='flex flex-row items-center gap-1'>
                    <p className='font-semibold'>{work.title}</p>
                    <span>-</span>
                    <span className='text-neutral-700 font-medium'>
                      {work.projectType}
                    </span>
                  </div>
                  <p className='text-sm text-neutral-500'>{work.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

const worksList = [
  {
    title: "Work 1",
    projectType: "Public Project",
    image: "images/krunkercss.png",
    description: "A CSS library that is used to style the Krunker.io game.",
    link: "/work1",
  },
  {
    title: "Work 2",
    projectType: "School Project",
    image: "/images/work2.png",
    description: "A forum, e-commerce website for video games. ",
    link: "/work2",
  },
  {
    title: "Work 3",
    projectType: "Private Project",
    image: "/images/work3.png",
    description: "Description of work 3",
    link: "/work3",
  },
];
