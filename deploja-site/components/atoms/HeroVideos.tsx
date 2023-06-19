"use client";

import { IHeroFields } from "@/@types/generated/contentful";
import { useWindowSize } from "usehooks-ts";

export const HeroVideos = ({ fields }: { fields: IHeroFields }) => {
  const { width, height } = useWindowSize();
  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
  };

  if (width < 1) return null;

  if (width > defaultBreakpoints.lg) {
    return (
      <video
        className="hero-content text-center h-full md:h-screen w-screen object-cover p-0 max-w-full"
        autoPlay
        muted
        loop
        playsInline
        key={"desktop"}
      >
        <source
          src={fields.desktopVideo?.fields.file.url as string}
          type="video/mp4"
        />
      </video>
    );
  }

  if (width > defaultBreakpoints.md) {
    return (
      <video
        className="hero-content text-center h-full md:h-screen w-screen object-cover p-0 max-w-full"
        autoPlay
        muted
        loop
        playsInline
        key={"tablet"}
      >
        <source
          src={fields.tabletVideo?.fields.file.url as string}
          type="video/mp4"
        />
      </video>
    );
  }

  //return mobile instead

  return (
    <video
      className="hero-content text-center h-full md:h-screen w-screen object-cover p-0 max-w-full"
      autoPlay
      muted
      loop
      playsInline
      key={"mobile"}
    >
      <source
        src={fields.mobileVideo?.fields.file.url as string}
        type="video/mp4"
      />
    </video>
  );
};
