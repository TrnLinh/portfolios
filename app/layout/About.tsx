import { PageTransition } from "../layout/PageTransition";
import AnimatedBlob from "../component/AnimatedBlob";
import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { Carousel } from "../component/Carousel";
import { TypeWriter } from "../component/TypeWriter";
import { LoopingTypeWriter } from "../component/LoopingTypeWriter";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export function About() {
  const roles = ["software engineer", "student", "dreamer", "problem solver"];

  return (
    <PageTransition>
      <section className='flex flex-col justify-start w-full px-4 overflow-x-hidden relative mt-20'>
        <div className=''>
          <h1 className='text-3xl md:text-6xl font-bold text-gray-800 font-sans'>
            Hey, I'm Rin
          </h1>

          <h1 className='text-3xl md:text-6xl font-bold text-gray-800 font-sans'>
            I'm a{" "}
            <LoopingTypeWriter
              words={roles}
              typingSpeed={100}
              deletingSpeed={60}
              pauseDuration={2000}
              className='text-blue-600'
            />
          </h1>
        </div>
      </section>
      <section className='flex flex-col justify-center w-full min-h-lvh px-4 overflow-x-hidden relative'>
        <div className='mx-auto w-full h-auto'>
          <Carousel />
        </div>
      </section>
    </PageTransition>
  );
}
