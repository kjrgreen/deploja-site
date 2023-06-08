"use client";

import React, { cloneElement, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export const EmblaCarousel = ({
  children,
  outerClassName,
  innerClassName,
}: {
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
}) => {
  const [viewportRef, embla] = useEmblaCarousel();
  const modifiedChildren = React.Children.map(children, (child) =>
    cloneElement(child as React.ReactElement<any>, {
      className:
        child && (child as React.ReactElement<any>).props?.className
          ? `${
              (child as React.ReactElement<any>).props.className as string
            }  flex-grow-0 flex-shrink-0 basis-full`
          : " flex-grow-0 flex-shrink-0 basis-full",
    })
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <div
      className={` ${outerClassName ?? ""} overflow-hidden min-w-0 relative`}
      ref={viewportRef}
    >
      <div className={` ${innerClassName ?? ""} flex`}>{modifiedChildren}</div>
      <img
        src={"/long-arrow-left.svg"}
        className={`w-32 h-32 ml-24 absolute left-0 top-1/2 transform -translate-y-1/4 ${
          prevBtnEnabled ? "opacity-100" : "opacity-30"
        } transition-opacity duration-300`}
        onClick={scrollPrev}
      />
      <img
        src={"/long-arrow-right.svg"}
        className={`w-32 h-32 mr-24 absolute right-0 top-1/2 transform -translate-y-1/4 ${
          nextBtnEnabled ? "opacity-100" : "opacity-30"
        } transition-opacity duration-300`}
        onClick={scrollNext}
      />
    </div>
  );
};
