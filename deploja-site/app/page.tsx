import Image from "next/image";

import React from "react";
import { EmblaCarousel } from "@/components/molecules/EmblaCarousel";
import { ICustomRichTextFields } from "@/@types/generated/contentful";
import { createClient } from "contentful";
import RenderRichText from "@/components/atoms/RenderRichText";

export const revalidate = 20;

type RichText = {
  title: string;
  description: string;
  light: boolean;
  //Needs to actually be rich text
};

type Button = {
  button: string;
  buttonURL: string;
};

type RichTextWithButton = RichText & Button;

type HeroBlock = {
  type: "Hero";
  videoURL?: string;
  imageURL?: string;
  richText: RichTextWithButton;
};

type HeroWithFigureBlock = {
  type: "HeroWithFigure";
  videoURL?: string;
  imageURL?: string;
  reverse: boolean;
  richText: RichTextWithButton;
  figureImageURL: string;
};

type OfferingCard = {
  imageURL: string;
  title: string;
  URL: string;
};

type OfferingsBlock = {
  type: "Offerings";
  richText: RichText;
  cards: OfferingCard[];
};

type TextOfferingsBlock = {
  type: "TextOfferings";
  title: string;
  cards: RichText[];
  buttons: Button[];
};

type TestimonialsBlock = {
  type: "Testimonials";
  ariaLabel: string;
  testimonials: {
    imageURL: string;
    quote: string;
    name: string;
    title: string;
    title2?: string;
  }[];
};

//Footer:
// 	Rich text left
// 	Rich text right
// 	Buttons
// 	Social media links - its own content model which we can render differently in different places
// 	Simple text for copyright
type Footer = {
  richTextLeft: RichText;
  richTextRight: RichText;
  buttons: Button[];
  socialMediaLinks: {
    type: "instagram" | "facebook" | "linkedin" | "twitter";
    URL: string;
  };
  simpleText: string;
};

// Full screen entries
// 	Column with title
// 		Entries
// 			Title
// 			URL
// 	Rich text in card
// 	Card button text
// 	Card button URL
type FullScreenEntries = {
  columns: {
    title: string;
    buttons: Button[];
  }[];
  richText: RichText;
  cardButton: Button;
};

// Hero header
// 	Entries
// 		Title
// 		URL
//
// Header: (no sub menus)
// 	Entries
// 		Title
// 		URL

const headerStyling = "w-full z-10 top-0 p-2";
const gradientStyling = "bg-gradient-to-r from-wedgewood to-mint"; //TODO: refactor
const reverseGradientStylingTransparent =
  "bg-gradient-to-l from-wedgewood/20 to-mint/20";

//Fetch the first Custom Rich Text content available using the contentful client
//Note that we are using Next.js 13, so we do not use getStaticProps
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

const getFirstRichText = async () =>
  await client
    .getEntries({
      content_type: "customRichText",
    })
    .then((response) => {
      console.log("fetched customRichText");
      return response.items[0].fields;
    });

export default async function Home() {
  const content: (
    | HeroBlock
    | HeroWithFigureBlock
    | OfferingsBlock
    | TextOfferingsBlock
    | TestimonialsBlock
  )[] = [
    {
      type: "Hero",
      videoURL: "/mountain-desktop.mp4",
      richText: {
        light: false,
        title: "Välkommen till ett friare liv som konsult",
        description:
          "Vi är en digital partner att lita på med expertkonsulter inom IT, Tech & Management",
        button: "Get Started",
        buttonURL: "/",
      },
    },
    {
      type: "TextOfferings",
      title: "Vad vi erbjuder",
      cards: [
        {
          title: "Flexible working hours",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
        {
          title: "Electronics",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
        {
          title: "Home office setup",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
        {
          title: "Company car",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
        {
          title: "Healthcare",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
        {
          title: "Pension",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          light: false,
        },
      ],
      buttons: [
        {
          button: "Apply via LinkedIn",
          buttonURL: "/",
        },
        {
          button: "Contact us",
          buttonURL: "/",
        },
      ],
    },
    {
      type: "Testimonials",
      ariaLabel: "Testimonials",
      testimonials: [
        {
          imageURL: "/cat1.jpg",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          name: "John Doe",
          title: "CEO",
          title2: "Contoso",
        },
        {
          imageURL: "/cat2.jpg",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          name: "Jane Doe",
          title: "CTO",
          title2: "Imaginary Corp",
        },
        {
          imageURL: "/cat3.png",
          quote:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Sed vitae nisi eget nunc ultricies aliquam.",
          name: "Bob",
          title: "CFO",
          title2: "Acme",
        },
      ],
    },
    {
      type: "Offerings",
      richText: {
        light: false,
        title: "Hur vi kan hjälpa er?",
        description:
          "Deploja är en leverantör man vill arbeta med. Med lång erfarenhet av IT och Tech kan vi hjälpa er med allt från att hitta rätt konsulter till att ta fram en digital strategi.",
      },
      cards: [
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/200/200/300",
          title: "IT & Tech",
        },
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/201/200/300",
          title: "Management",
        },
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/202/200/300",
          title: "Digital strategi",
        },
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/203/200/300",
          title: "Automatisering",
        },
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/204/200/300",
          title: "IT-säkerhet",
        },
        {
          URL: "/",
          imageURL: "https://picsum.photos/id/206/200/300",
          title: "Projektledning",
        },
      ],
    },
  ];

  const customRichText = await getFirstRichText();

  return (
    <main className={"font-roboto text-primary bg-[white]"}>
      <div id={"header"} className={"absolute " + headerStyling}>
        <div
          className={
            "rounded-lg flex justify-between p-2 backdrop-blur-[2px] " +
            reverseGradientStylingTransparent
          }
        >
          <div className="navbar-start">
            <a className="btn btn-ghost normal-case text-xl">
              <img src="/Logo.svg" className="h-10" />
            </a>
          </div>
          <div className="navbar-center">
            <ul className="menu menu-horizontal px-1 font-bold">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <div className={"navbar-end"} />
        </div>
      </div>
      <div
        id={"headerFixed"}
        className={"pointer-events-none fixed " + headerStyling}
      >
        <div className={"rounded-lg flex justify-end p-2 bg-opacity-100"}>
          <div className={""}>
            <button className="btn btn-square btn-ghost pointer-events-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {content.map((item) => {
        switch (item.type) {
          case "Hero":
            return (
              <div className={"hero h-screen snap-start text-primary"}>
                <video
                  className="hero-content text-center h-screen w-screen object-cover p-0 max-w-full"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/mountain-desktop.mp4" type="video/mp4" />
                  {/*Needs to support image URL and probably more than one source type*/}
                </video>
                <div className="hero-content p-2">
                  <div className={"text-center card  backdrop-blur-[1px] p-4"}>
                    <div className="max-w-screen-lg">
                      <h1 className="text-5xl font-bold font-notoSerif font-bold font-extrabold">
                        {item.richText.title}
                      </h1>
                      <p className="py-6">{item.richText.description}</p>
                      <button className="btn btn-primary">
                        {item.richText.button}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          case "TextOfferings":
            return (
              <div
                className={
                  "auto snap-start bg-white text-baltic flex flex-col justify-center items-center md:gap-12 py-16 px-24"
                }
              >
                <h1
                  className={
                    "text-5xl font-bold font-notoSerif font-bold mr-auto pl-4"
                  }
                >
                  {item.title}
                </h1>
                <div className={"grid-cols-2 md:grid-cols-3 grid"}>
                  {item.cards.map((offering, id) => {
                    return (
                      <div key={id} className={"card p-4"}>
                        <h1 className={"text-2xl font-bold mb-2"}>
                          {offering.title}
                        </h1>
                        <p>{offering.description}</p>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {item.buttons.map((button, id) => {
                    return (
                      <a
                        //TODO: Replace all A tags with Link from next/link
                        key={id}
                        className={"btn btn-secondary m-2"}
                        href={button.buttonURL}
                      >
                        {button.button}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          case "Offerings":
            return (
              <div
                className={
                  "auto snap-start bg-[#fff] flex flex-col justify-center items-center md:gap-12 py-16 px-24"
                }
              >
                <div className={"text-center text-baltic"}>
                  <h1
                    className={
                      "text-5xl font-bold font-notoSerif font-bold mr-auto pl-4 mb-4"
                    }
                  >
                    {item.richText.title}
                  </h1>
                  <h2>{item.richText.description}</h2>
                </div>
                <div
                  className={
                    "grid-cols-2 md:grid-cols-3 grid gap-x-12 gap-y-10 w-full  text-primary"
                  }
                >
                  {item.cards.map((offering, id) => {
                    return (
                      <div
                        key={id}
                        className={
                          "card bg-neutral-200 w-full mr-auto ml-auto bg-wedgewood"
                        }
                      >
                        <img
                          src={offering.imageURL}
                          className={"w-full object-cover rounded-t-lg"}
                        ></img>
                        <div className={"p-4 pr-8"}>
                          <h1 className={"text-2xl font-bold mb-2"}>
                            {offering.title}
                          </h1>
                          <p
                            className={
                              "flex w-full items-center justify-between"
                            }
                          >
                            I18N read more{" "}
                            <img
                              src={"/long-arrow-right.svg"}
                              className={
                                "w-32 h-auto absolute right-0 bottom-0 transform translate-y-12"
                              }
                            />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div></div>
              </div>
            );
          case "Testimonials": {
            //A hero with, in order, a rounded image of a person and a quote, their name, and titles in slightly paler text.
            //The background is a gradient.
            return (
              <EmblaCarousel outerClassName={gradientStyling}>
                {item.testimonials.map((testimonial, id) => (
                  <div
                    key={id}
                    className={"text-center w-full py-12 px-64 flex-row"}
                  >
                    <img
                      src={testimonial.imageURL}
                      className={
                        "rounded-full w-48 h-48 mx-auto mb-4 object-cover object-center"
                      }
                    ></img>
                    <p
                      className={
                        "text-5xl font-bold font-notoSerif font-bold mr-auto pl-4 mb-8"
                      }
                    >
                      {testimonial.quote}
                    </p>
                    <p
                      className={
                        "text-2xl font-bold font-bold mr-auto pl-4 mb-2"
                      }
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className={
                        "text-l opacity-50 font-bold font-bold mr-auto pl-4 mb-1"
                      }
                    >
                      {testimonial.title}
                    </p>
                    <p
                      className={
                        "text-l opacity-50 font-bold font-bold mr-auto pl-4 mb-4"
                      }
                    >
                      {testimonial.title2}
                    </p>
                  </div>
                ))}
              </EmblaCarousel>
            );
          }
        }
      })}
    </main>
  );
}

//SVG with path that can be animated
/*<svg
            height="100px"
            width="100px"
            viewBox="0 0 272.385 335.168"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink={"http://www.w3.org/1999/xlink"}
          >
            <defs>
              <path
                id="logoPath"
                d="M 0,0 V 335.168 L 272.385,198.479 V 106.321 L 69.864,0 233.915,154.934 51.641,248.084 Z"
              ></path>
              <clipPath id="insideLogoPathOnly">
                <use xlinkHref={"#logoPath"} />
              </clipPath>
            </defs>
            <use
              xlinkHref={"#logoPath"}
              stroke-width="10"
              stroke="red"
              fill="none"
              clip-path="url(#insideLogoPathOnly)"
            />
          </svg>*/

//Animated clipped blurred region
/*
        <style>{`
          @keyframes fadeIn {
             0% { opacity: 0; }
             100% { opacity: 1; }
           }
        `}</style>
*/
/*<video
          className="hero-content text-center bg-red-700 h-screen w-screen object-cover p-0 max-w-full"
          style={{
            WebkitClipPath: "url(#my-clip-path)",
            clipPath: "url(#my-clip-path)",
            filter: "blur(10px) brightness(0.7)",
            animation: "fadeIn 1s ease-in-out",
          }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/mountain-desktop.mp4" type="video/mp4" />
        </video>*/

/*
          case "HeroWithFigure":
            return (
              <div className={"hero snap-start relative h-screen"}>
                <Image
                  className="hero-content text-center h-full w-screen object-cover p-0 max-w-full"
                  fill={true}
                  src={item.imageURL ?? ""}
                  alt={""}
                ></Image>
                <div
                  className={`p-24 hero-content ${
                    !item.reverse
                      ? "flex-col lg:flex-row"
                      : "flex-col-reverse lg:flex-row-reverse"
                  } gap-8`}
                >
                  <img
                    src={item.figureImageURL}
                    className={"max-w-sm rounded-lg shadow-2xl"}
                  ></img>
                  <div
                    className={
                      " bg-opacity-50 backdrop-blur-[1px] block p-4 rounded-lg"
                    }
                  >
                    <h1 className="text-5xl font-bold font-notoSerif font-bold">
                      {item.richText.title}
                    </h1>
                    <p className="py-6">{item.richText.description}</p>
                    <button className="btn btn-secondary">
                      {item.richText.button}
                    </button>
                  </div>
                </div>
              </div>
            );
 */
