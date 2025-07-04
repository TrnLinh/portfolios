import { PageTransition } from "../layout/PageTransition";
import { useState, useRef, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const originalItems = [
    {
      id: 1,
      bgColor: "bg-amber-200",
      title: "Creative Design",
    },
    {
      id: 2,
      bgColor: "bg-red-200",
      title: "Web Development",
    },
    {
      id: 3,
      bgColor: "bg-violet-200",
      title: "User Experience",
    },
    {
      id: 4,
      bgColor: "bg-green-200",
      title: "Brand Identity",
    },
    {
      id: 5,
      bgColor: "bg-blue-200",
      title: "Digital Strategy",
    },
    {
      id: 6,
      bgColor: "bg-amber-200",
      title: "Consultation",
    },
  ];

  // Create infinite loop by duplicating items
  const items = [
    ...originalItems, // First set
    ...originalItems, // Second set
    ...originalItems, // Third set
  ];

  const cardWidth = 250 + 12; // card width (250px) + gap (12px from gap-3)
  const totalOriginalItems = originalItems.length;

  // Start at the middle set to allow backward navigation
  const initialIndex = totalOriginalItems;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, []);

  const handlePrev = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);

    // Reset to end when reaching the beginning
    setTimeout(() => {
      if (currentIndex - 1 < 0) {
        setCurrentIndex(totalOriginalItems * 2 - 1);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);

    // Reset to beginning when reaching the end
    setTimeout(() => {
      if (currentIndex + 1 >= totalOriginalItems * 2) {
        setCurrentIndex(totalOriginalItems);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  };

  const getActiveItemIndex = () => {
    return currentIndex % totalOriginalItems;
  };

  return (
    <>
      <div className='relative overflow-hidden'>
        <div
          className={`flex gap-3 ${
            isTransitioning ? "transition-transform duration-500 ease-out" : ""
          }`}
          style={{
            transform: `translateX(-${currentIndex * cardWidth}px)`,
          }}
        >
          {items.map((item, itemIndex) => {
            const originalItemIndex = itemIndex % totalOriginalItems;
            const isActive = originalItemIndex === getActiveItemIndex();

            return (
              <div
                key={`${item.id}-${itemIndex}`}
                className={`flex-shrink-0 w-[250px] h-[350px] ${
                  item.bgColor
                } rounded shadow-lg transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className='flex flex-row gap-2 mt-4'>
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className={`grid place-items-center rounded-full size-10 transition-all duration-100 ring-1 ring-neutral-200 hover:bg-neutral-100`}
        >
          <HiChevronLeft className='size-4 ' />
        </button>
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className={`grid place-items-center rounded-full size-10 transition-all duration-100 ring-1 ring-neutral-200 hover:bg-neutral-100`}
        >
          <HiChevronRight className='size-4 ' />
        </button>
      </div>
    </>
  );
}
