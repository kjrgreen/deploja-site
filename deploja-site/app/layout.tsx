import "./globals.css";

import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AnimatePresence } from "framer-motion";
import { createClient } from "contentful";
import {
  IButtonFields,
  IColumnOfButtonsFields,
  ICustomRichText,
  ICustomRichTextFields,
  IFooter,
  IFooterFields,
  INavigationMenu,
  INavigationMenuFields,
} from "@/@types/generated/contentful";
import Link from "next/link";
import React from "react";
import RenderRichText from "@/components/atoms/RenderRichText";
import Navigation from "@/components/atoms/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const inter = Inter({ subsets: ["latin"] });

const gradientStyling = "bg-gradient-to-r from-wedgewood to-mint"; //TODO: refactor

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //Fetch footer from contentful
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  });

  const footer = (await (
    await client
      .getEntries({
        content_type: "footer",
        include: 2,
        locale: process.env.NEXT_PUBLIC_LOCALE,
      })
      .then((res) => res.items[0] as IFooter)
  ).fields) as IFooterFields;

  const navigationMenu = (await (
    await client
      .getEntries({
        content_type: "navigationMenu",
        include: 2,
        locale: process.env.NEXT_PUBLIC_LOCALE,
      })
      .then((res) => res.items[0] as INavigationMenu)
  ).fields) as INavigationMenuFields;

  return (
    <html lang="en" data-theme="deploja" /*className={"snap-y snap-always"}*/>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@200..900&display=optional"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@200..900&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <NextTopLoader color={"#30c09d"} />
        {children}
        <Navigation navigationMenu={navigationMenu} />
        <footer className="footer p-12 lg:p-24 bg-baltic text-base-content pb-0 lg:pb-0">
          <div className="flex md:flex-row justify-between md:gap-32 lg:gap-52 flex-col gap-8 mt-8 md:mt-0">
            <div
              //grow to fill space
              className="flex flex-col gap-2 flex-shrink"
            >
              <RenderRichText
                RichText={footer.richTextLeft?.fields as ICustomRichTextFields}
              />
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 md:max-w-[25%]">
              <RenderRichText
                RichText={footer.richTextRight?.fields as ICustomRichTextFields}
              />
            </div>
          </div>
        </footer>
        <footer className="footer p-12 lg:px-24 lg:py-18 bg-baltic text-base-content sm:grid-flow-col">
          {footer.links?.map((link) => {
            const fields = link.fields as IColumnOfButtonsFields;
            return (
              <div key={link.sys.id}>
                {<span className="footer-title">{fields.title}</span>}
                {(footer.links?.length ?? 0) > 1 ? (
                  fields.buttons?.map((link) => {
                    const fields = link.fields as IButtonFields;
                    return (
                      <Link
                        className="link link-hover"
                        href={fields.url}
                        key={link.sys.id}
                      >
                        {fields.text}
                      </Link>
                    );
                  })
                ) : (
                  <div className={"flex flex-row gap-8"}>
                    {fields.buttons?.map((link) => {
                      const fields = link.fields as IButtonFields;
                      return (
                        <Link
                          className="link link-hover"
                          href={fields.url}
                          key={link.sys.id}
                        >
                          {fields.text}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </footer>
        <div className={"h-[2px] px-12 lg:px-24 bg-baltic"}>
          <div className={"h-full w-full " + gradientStyling} />
        </div>
        <footer className="footer px-12 lg:px-24 py-4 bg-baltic text-primary">
          <div className="items-center grid-flow-col">
            <p>
              {footer.copyrightText}
              <br />
              Certain elements adapted from{" "}
              <a href={"https://thenounproject.com/joeleen/"}>
                Joeleen Moy
              </a>{" "}
              under{" "}
              <a href={"https://creativecommons.org/licenses/by/3.0/"}>
                CC BY 3.0
              </a>
            </p>
          </div>
          <div className="md:place-self-center md:justify-self-end">
            <div className="grid grid-flow-col gap-4">
              <a href={"https://www.facebook.com/DeplojaSverige/"}>
                {
                  //FA icon
                  <FontAwesomeIcon
                    icon={faFacebook}
                    height={24}
                    width={24}
                    title={"Facebook"}
                  />
                }
              </a>
              <a
                href={
                  "https://www.linkedin.com/company/deploja/?viewAsMember=true"
                }
              >
                {
                  //FA icon
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    height={24}
                    width={24}
                    title={"LinkedIn"}
                  />
                }
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
