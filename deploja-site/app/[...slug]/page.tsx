import Image from "next/image";

import React from "react";
import { EmblaCarousel } from "@/components/molecules/EmblaCarousel";
import {
  IButton,
  IButtonFields,
  IContactFormFields,
  IContactUsBlockFields,
  ICustomRichTextFields,
  IHero,
  IHeroFields,
  IOfferingsFields,
  IPage,
  IPageFields,
  IRichTextBesidesImageFields,
  ITestimonialsFields,
  ITextOfferingsFields,
  ITopMenu,
  LOCALE_CODE,
} from "@/@types/generated/contentful";
import { createClient } from "contentful";
import RenderRichText from "@/components/atoms/RenderRichText";
import Link from "next/link";
import { json } from "stream/consumers";
import { HeroVideos } from "@/components/atoms/HeroVideos";
import ContactForm from "@/components/organisms/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});
export const revalidate = 60; //TODO: refactor
export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    searchParams: any;
    params: { slug: string[] };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await client
    .getEntries({
      content_type: "page",
      "fields.url": "/" + params.slug.join("/"),
      include: 10,
      locale: process.env.NEXT_PUBLIC_LOCALE,
    })
    .then((response) => {
      return (response.items[0] as IPage).fields as IPageFields;
    });

  //Refactor this into the next 13 equivalent
  //<Head>
  //         <title>{page.pageTitle} | Deploja</title>
  //         <meta name="description" content={page.seoDescription} />
  //         <meta name="keywords" content={page.seoKeywords.join(", ")} />
  //         {
  //           //Open Graph
  //         }
  //         <meta property="og:title" content={page.pageTitle} />
  //         <meta property="og:type" content="website" />
  //         <meta
  //           property="og:url"
  //           content={process.env.NEXT_PUBLIC_BASE_URL + page.url}
  //         />
  //         <meta property="og:image" content={page.seoImage.fields.file.url} />
  //         <meta property="og:description" content={page.seoDescription} />
  //         <meta property="og:locale" content={process.env.NEXT_PUBLIC_LOCALE} />
  //       </Head>
  return {
    title: page.pageTitle + " - Deploja",
    openGraph: {
      type: "website",
      url: process.env.NEXT_PUBLIC_BASE_URL + page.url,
      title: page.pageTitle + " - Deploja",
      description: page.seoDescription,
      images: [
        {
          url: page.seoImage.fields.file.url,
        },
      ],
      locale: process.env.NEXT_PUBLIC_LOCALE,
    },
    description: page.seoDescription,
    keywords: page.seoKeywords,
  };
}

const fooFields = {} as IHeroFields;
fooFields.centerText;

//Footer:
// 	Rich text left
// 	Rich text right
// 	Buttons
// 	Social media links - its own content model which we can render differently in different places
// 	Simple text for copyright

// Full screen entries
// 	Column with title
// 		Entries
// 			Title
// 			URL
// 	Rich text in card
// 	Card button text
// 	Card button URL
// Hero header
// 	Entries
// 		Title
// 		URL
//
// Header: (no sub menus)
// 	Entries
// 		Title
// 		URL

const headerStyling = "w-full z-10 top-0 p-2"; //TODO: refactor
const gradientStyling = "bg-gradient-to-r from-wedgewood to-mint"; //TODO: refactor
const reverseGradientStylingTransparent =
  "bg-gradient-to-l from-wedgewood/20 to-mint/20";

const blockPadding = "py-16 px-12 lg:px-24";

export default async function Home({ params }: { params: { slug: string[] } }) {
  //fetch topMenu
  const topMenu = await client
    .getEntries({
      content_type: "topMenu",
      locale: process.env.NEXT_PUBLIC_LOCALE,
    })
    .then((response) => {
      return (response.items[0] as ITopMenu).fields.entries ?? [];
    });

  //Fetch page based on slug
  const page = await client
    .getEntries({
      content_type: "page",
      "fields.url": "/" + params.slug.join("/"),
      include: 10,
      locale: process.env.NEXT_PUBLIC_LOCALE,
    })
    .then((response) => {
      return (response.items[0] as IPage).fields as IPageFields;
    });

  return (
    <main className={"font-roboto text-primary bg-[white]"}>
      <div id={"header"} className={"absolute " + headerStyling}>
        <div
          className={
            "rounded-lg flex justify-between p-2 backdrop-blur-[2px] " +
            (page.showPageTitle ? "" : reverseGradientStylingTransparent)
          }
        >
          <div className="navbar-start">
            <Link
              href={"/"}
              className="btn btn-ghost normal-case md:text-xl text-lg"
            >
              <img src="/Logo.svg" className="h-10" />
            </Link>
          </div>
          <div className="navbar-center hidden md:block">
            <ul className="menu menu-horizontal px-1 font-bold">
              {topMenu?.map((item, index) => {
                const fields = item.fields as IButtonFields;
                return (
                  <li key={index} className="menu-item">
                    <Link
                      className="menu-link hover:!text-[white]"
                      href={fields.url}
                    >
                      {fields.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"navbar-end"} />
        </div>
      </div>
      {page.showPageTitle && (
        <div
          className={
            "font-notoSerif w-full flex flex-col justify-center items-center bg-wedgewood pt-[84px] pb-4"
          }
        >
          <hr className={"w-full opacity-50"} />
          <div className={"flex flex-col justify-center items-center py-4"}>
            <div className={"flex flex-col justify-center items-center gap-2"}>
              <h1 className={"text-5xl text-center text-white"}>
                {page.pageTitle}
              </h1>
              <p className={"text-2xl text-center text-white"}>
                {page.pageSubtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {page.content?.map((item, index) => {
        switch (item.sys.contentType.sys.id) {
          case "customRichText": {
            const fields = item.fields! as ICustomRichTextFields;
            const background = {
              white: "bg-[white]",
              dark: "bg-baltic",
              green: "bg-wedgewood",
              gradient: gradientStyling,
            }[fields.background ?? "white"];
            return (
              <div
                className={`${blockPadding} flex flex-col gap-2 ${background}`}
              >
                <RenderRichText RichText={fields} />
              </div>
            );
          }
          case "hero": {
            const fields = item.fields as IHeroFields;
            return (
              <div
                className={
                  "hero min-h-screen md:h-screen h-auto snap-start text-primary"
                }
                id={`hero-${index}`}
              >
                <HeroVideos fields={fields} />

                <div className="hero-content p-2 max-h-none">
                  <div
                    className={
                      "text-center card  backdrop-blur-[1px] p-4 pt-14"
                    }
                  >
                    <div className="max-w-screen-lg">
                      {fields.centerText && (
                        <div className={"py-6 flex flex-col gap-6"}>
                          <RenderRichText RichText={fields.centerText.fields} />
                        </div>
                      )}
                      <div className={"flex flex-row justify-center gap-2"}>
                        {fields.buttons?.map((button, index) => (
                          <Link
                            className="btn btn-primary"
                            key={button.sys.id}
                            href={button.fields.url}
                          >
                            {button.fields.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          case "textOfferings": {
            const fields = item.fields as ITextOfferingsFields;
            if (!fields.offerings || fields.offerings.length == 0) return null;
            return (
              <div
                className={`auto snap-start bg-white text-baltic flex flex-col justify-center items-center md:gap-12 ${blockPadding}`}
                id={`textOfferings-${index}`}
              >
                <h2
                  className={
                    "ml-auto md:text-5xl text-4xl font-bold font-notoSerif font-bold mr-auto pl-4"
                  }
                >
                  {fields.title}
                </h2>
                <div className={"grid-cols-1 lg:grid-cols-3 grid"}>
                  {fields.offerings?.map((offering, id) => {
                    return (
                      <div key={id} className={"card p-4 text-center"}>
                        {<RenderRichText RichText={offering.fields} />}
                      </div>
                    );
                  })}
                </div>
                <div>
                  {fields.buttons?.map((button, id) => {
                    return (
                      <Link
                        key={id}
                        className={"btn btn-secondary m-2 text-[white]"}
                        href={button.fields.url}
                      >
                        {button.fields.text}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }
          case "offerings": {
            const fields = item.fields as IOfferingsFields;
            return (
              <div
                className={`auto snap-start bg-[#fff] flex flex-col justify-center items-center gap-12 ${blockPadding}`}
              >
                <div className={"text-center text-baltic"}>
                  <h1
                    className={
                      "md:text-5xl text-4xl font-bold font-notoSerif font-bold mr-auto pl-4 mb-4"
                    }
                  >
                    {fields.title}
                  </h1>
                  <h2>{fields.subtitle}</h2>
                </div>
                <div
                  className={
                    "sm:mx-auto sm:w-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid gap-x-12 lg:gap-x-18 xl:gap-x-24 gap-y-10 w-full text-primary"
                  }
                >
                  {fields.offerings?.map((offering, id) => {
                    return (
                      <Link key={id} href={offering.fields.url}>
                        <div
                          className={
                            "card bg-neutral-200 w-full mr-auto ml-auto bg-wedgewood max-w-[250px]"
                          }
                        >
                          <img
                            src={offering.fields.image?.fields.file.url}
                            className={
                              "w-full object-cover rounded-t-lg max-h-72"
                            }
                          ></img>
                          <div className={"p-4 pr-8"}>
                            <h1
                              className={"md:text-2xl text-xl font-bold mb-2"}
                            >
                              {offering.fields.title}
                            </h1>
                            <p
                              className={
                                "flex w-full items-center justify-between"
                              }
                            >
                              {fields.readMoreLabel}
                              <img
                                src={"/long-arrow-right.svg"}
                                className={
                                  "h-auto absolute right-0 bottom-0 transform md:translate-y-11 md:w-32 hidden md:block scale-50 translate-x-[-72px]"
                                }
                              />
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div></div>
              </div>
            );
          }
          case "testimonials": {
            //A hero with, in order, a rounded image of a person and a quote, their name, and titles in slightly paler text.
            //The background is a gradient.
            const fields = item.fields as ITestimonialsFields;
            if (!fields.testimonials || fields.testimonials.length == 0)
              return null;
            return (
              <EmblaCarousel outerClassName={gradientStyling}>
                {fields.testimonials?.map((testimonial, id) => (
                  <div
                    key={id}
                    className={
                      "text-center w-full py-12 lg:px-64 sm:px-32 px-4 flex-row"
                    }
                  >
                    <img
                      src={testimonial.fields.portrait?.fields.file.url}
                      className={
                        "rounded-full w-48 h-auto mx-auto mb-4 object-cover object-center"
                      }
                    ></img>
                    <p
                      className={
                        "md:text-5xl sm:text-4xl text-2xl font-bold font-notoSerif font-bold mr-auto pl-4 mb-8"
                      }
                    >
                      {testimonial.fields.quote}
                    </p>
                    <p
                      className={
                        "md:text-2xl sm:text-xl text-base font-bold font-bold mr-auto pl-4 mb-2"
                      }
                    >
                      {testimonial.fields.name}
                    </p>
                    <p
                      className={
                        "text-sm sm:text-lg opacity-50 font-bold font-bold mr-auto pl-4 mb-1"
                      }
                    >
                      {testimonial.fields.role}
                    </p>
                    <p
                      className={
                        "text-sm sm:text-lg opacity-50 font-bold font-bold mr-auto pl-4 mb-4"
                      }
                    >
                      {testimonial.fields.company}
                    </p>
                  </div>
                ))}
              </EmblaCarousel>
            );
          }
          case "ContactUsBlock": {
            const fields = item.fields as IContactUsBlockFields;
            return (
              <div
                className={`flex flex-col justify-center items-center gap-4 ${blockPadding}`}
              >
                <div
                  className={
                    "flex flex-row justify-center items-center gap-4 w-full text-center flex-wrap sm:flex-nowrap"
                  }
                >
                  <div
                    className={
                      "text-lg w-full card bg-wedgewood p-4 flex items-center"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      className={
                        "w-full h-full max-w-[32px] lg:max-w-[48px] px-[auto] mb-2"
                      }
                    />
                    <h1 className={"text-2xl font-bold"}>Call Us</h1>
                    {fields.ourPhoneNumbers?.map((phoneNumber, id) => (
                      <a
                        key={id}
                        href={`tel:${phoneNumber.replace(/[\s-]/g, "")}`}
                      >
                        {phoneNumber}
                      </a>
                    ))}
                  </div>
                  <div
                    className={"w-full card bg-wedgewood p-4 flex items-center"}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className={
                        "w-full h-full max-w-[32px] lg:max-w-[48px] px-[auto] mb-2"
                      }
                    />
                    <h1 className={"text-2xl font-bold"}>Email Us</h1>
                    {fields.ourEmails?.map((email, id) => (
                      <a key={id} href={`mailto:${email}`}>
                        {email}
                      </a>
                    ))}
                  </div>
                </div>

                {
                  /* @ts-expect-error Server Component */
                  <ContactForm />
                }
              </div>
            );
          }
          case "richTextBesidesImage": {
            const fields = item.fields as IRichTextBesidesImageFields;
            return (
              <div
                className={`flex flex-wrap sm:flex-nowrap 
                    ${fields.richTextOnRight ? "flex-row" : "flex-row-reverse"}
                     gap-4 ${blockPadding}`}
              >
                <div
                  className={
                    "basis-full h-64 sm:h-[unset] sm:flex-1 min-h-[400px]"
                  }
                >
                  <div
                    className={"h-full w-full relative [&>*]:object-contain"}
                  >
                    <Image
                      src={`https:${fields.image?.fields.file.url}`}
                      alt={fields.image?.fields.description ?? ""}
                      fill={true}
                    />
                  </div>
                </div>
                <div
                  className={
                    "basis-full sm:flex-1 flex justify-center items-center"
                  }
                >
                  <div>
                    <RenderRichText RichText={fields.richText.fields} />
                  </div>
                </div>
              </div>
            );
          }
          default:
            ((x: never) => {
              throw new Error(`${x} was unhandled!`);
            })(item.sys.contentType.sys); //This is a type guard that ensures that all cases are handled.
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
                    <h1 className="md:text-5xl text-4xl font-bold font-notoSerif font-bold">
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
