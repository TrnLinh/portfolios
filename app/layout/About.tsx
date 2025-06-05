import { PageTransition } from "../layout/PageTransition";
import AnimatedBlob from "../component/AnimatedBlob";
import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

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
          <h1 className='font-body text-[clamp(2.25rem,1.971rem+1.143vw,3rem)] font-medium leading-[100%]'>
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
            <div key={work.title} className='mt-6 mb-8'>
              <Link to={work.link} className='flex flex-col items-start gap-4 '>
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
      <section className='min-h-lvh px-4 overflow-x-hidden py-16'>
        <div className='flex flex-col gap-6'>
          <div>
            <h1 className='text-[clamp(2.25rem,1.971rem+1.143vw,3rem)] font-body font-medium '>
              Techniques & Skill.
            </h1>
          </div>
          <div>
            {Object.entries(skillTree).map(([category, skills], index) => (
              <div
                key={category}
                className={`grid grid-cols-[25%_75%] gap-6 mb-8 ${
                  index !== Object.entries(skillTree).length - 1
                    ? "border-b border-neutral-200 pb-8"
                    : ""
                }`}
              >
                <h2 className='text-sm text-neutral-500 leading font-medium'>
                  {category}
                </h2>
                <div className='ml-6 border-l-[1px] border-neutral-200 pl-4 flex flex-col gap-2'>
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className='text-neutral-900 font-body font-medium leading-6'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='px-4 overflow-x-hidden py-8'>
        <div>
          <div>
            <h1 className='text-[clamp(2.25rem,1.6rem+2.667vw,4rem)] font-medium'>
              Say Hi.
            </h1>
            <p className='font-normal text-sm leading-[120%] tracking-[0.6px] text-neutral-900 '>
              Hey, my chat box is always open if you want to discuss about
              anything... literally anything.
            </p>
          </div>
          <div className='flex flex-col gap-4 mt-4'>
            <h2 className='text-[clamp(1.5rem,0.943rem+2.286vw,3rem)] font-body font-medium'>
              rintrnn@gmail.com
            </h2>
            <p className='text-sm font-medium text-neutral-500'>
              Or you can fine me at:
            </p>
            <div className='grid place-items-center  gap-2'>
              <Link
                className='ring-1 rounded-sm ring-neutral-200 w-full flex flex-row gap-2 items-center justify-center p-3'
                to=''
              >
                <FaInstagram /> <span>Instagram</span>
              </Link>
              <span className='block'>-</span>
              <Link
                className='ring-1 rounded-sm ring-neutral-200 w-full flex flex-row gap-2 items-center justify-center p-3'
                to=''
              >
                <FaLinkedin /> <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

const worksList = [
  {
    title: "KrunkerCSS",
    projectType: "Public Project",
    image: "images/krunkercss.png",
    description: "A CSS library that is used to style the Krunker.io game.",
    link: "/work1",
  },
  {
    title: "Muck",
    projectType: "School Project",
    image: "/images/work2.png",
    description: "A forum, e-commerce website for video games. ",
    link: "/work2",
  },
  {
    title: "SenMe",
    projectType: "Private Project",
    image: "/images/work3.png",
    description: "Description of work 3",
    link: "/work3",
  },
];

const skillTree = {
  Language: ["JavaScript", "TypeScript", "Python", "Java", "HTML5", "CSS3"],
  Frameworks: ["React", "Springboot", "NodeJs", "JavaFx"],
  Library: ["TailwindCSS", "Bootstrap", "ShadcnUI"],
  Skill: [
    "UI/UX Design",
    "Web Development",
    "Software Engineering",
    "Wireframing",
    "Prototyping",
  ],
  Tools: ["Figma", "Git", "VSCode", "Postman", "Docker"],
};
