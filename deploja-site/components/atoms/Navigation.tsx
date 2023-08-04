"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/atoms/Modal";
import {
  IButtonFields,
  IColumnOfButtonsFields,
  ICustomRichTextFields,
  INavigationMenuFields,
} from "@/@types/generated/contentful";
import Link from "next/link";
import RenderRichText from "@/components/atoms/RenderRichText";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";

const headerStyling = "w-full z-10 top-0 p-2"; //TODO: refactor
function Navigation({
  navigationMenu,
}: {
  navigationMenu: INavigationMenuFields;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [y, setY] = useState(window?.scrollY ?? 0);

  //When next router changes, close the drawer and save the scroll position

  useEffect(() => {
    setIsOpen(false);
    setY(window.scrollY);
  }, [pathname, searchParams]);

  const handleNavigation = useCallback(
    (e: any) => {
      const window = e.currentTarget;
      setY(window.scrollY);
    },
    [y]
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <>
      <div
        id={"headerFixed"}
        className={"text-[white] pointer-events-none fixed " + headerStyling}
      >
        <div className={`rounded-lg flex justify-end p-2 bg-opacity-100`}>
          <div className={""}>
            <button
              className={`btn btn-square btn-ghost pointer-events-auto bg-baltic bg-opacity-0 hover:bg-baltic ${
                y > 300 ? " bg-opacity-30" : ""
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
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

      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div
          className={
            "flex sm:flex-row justify-between gap-8 sm:gap-12 md:gap-18 lg:gap-52"
          }
        >
          {navigationMenu.cardRichText && (
            <div
              className={
                "card bg-baltic p-4 md:p-8 justify-center sm:flex-shrink-0 flex-shrink hidden sm:flex"
              }
            >
              <RenderRichText
                RichText={
                  navigationMenu.cardRichText?.fields as ICustomRichTextFields
                }
              />
              <Link
                href={(navigationMenu.cardButton?.fields as IButtonFields).url}
                className={"btn btn-primary mt-4"}
              >
                {(navigationMenu.cardButton?.fields as IButtonFields).text}
              </Link>
            </div>
          )}
          <div
            className={
              "flex flex-col sm:flex-row justify-between gap-4 sm:gap-8"
            }
          >
            {
              //This, but with a map from the contentful footer
              //           <div>
              //             <span className="md:text-lg text-base">Services</span>
              //             <a className="link link-hover">Branding</a>
              //             <a className="link link-hover">Design</a>
              //             <a className="link link-hover">Marketing</a>
              //             <a className="link link-hover">Advertisement</a>
              //           </div>
              navigationMenu.columns?.map((column) => {
                const fields = column.fields as IColumnOfButtonsFields;
                return (
                  <div key={column.sys.id} className={"flex flex-col"}>
                    <span className="md:text-4xl text-3xl mb-2">
                      {fields.title}
                    </span>
                    {fields.buttons?.map((link) => {
                      const fields = link.fields as IButtonFields;
                      return (
                        <Link
                          className="link link-hover mb-1"
                          href={fields.url}
                          key={link.sys.id}
                        >
                          {fields.text}
                        </Link>
                      );
                    })}
                  </div>
                );
              })
            }
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Navigation;
