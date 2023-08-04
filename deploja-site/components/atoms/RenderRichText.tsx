//Render rich text using contentful rich text renderer
import React from "react";
import {
  ICustomRichTextFields,
  ITypeset,
  ITypesetFields,
} from "@/@types/generated/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";

const sizes: { [key in ITypesetFields["fontSize"]]: string } = {
  xs: "text-xs",
  sm: "md:text-sm text-xs",
  base: "md:text-base text-sm",
  lg: "md:text-lg text-base",
  xl: "md:text-xl text-lg",
  "2xl": "md:text-2xl text-xl",
  "3xl": "md:text-3xl text-2xl",
  "4xl": "md:text-4xl text-3xl",
  "5xl": "md:text-5xl text-4xl",
  "6xl": "md:text-6xl text-5xl",
  "7xl": "md:text-7xl text-6xl",
  "8xl": "md:text-8xl text-7xl",
  "9xl": "md:text-9xl text-8xl",
};

const fonts: { [key in ITypesetFields["font"]]: string } = {
  notoSerif: "font-notoSerif",
  roboto: "font-roboto",
};

const fontWeights: { [key in ITypesetFields["fontWeight"]]: string } = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const colors: { [key in ITypesetFields["color"]]: string } = {
  white: "text-primary",
  baltic: "text-baltic",
  mint: "text-mint",
  wedgewood: "text-wedgewood",
};

function getClasses(fields: ITypesetFields | undefined) {
  if (!fields) return "";

  const classes = [];

  if (fields.font) {
    classes.push(fonts[fields.font]);
  }

  if (fields.fontWeight) {
    classes.push(fontWeights[fields.fontWeight]);
  }

  if (fields.fontSize) {
    classes.push(sizes[fields.fontSize]);
  }

  if (fields.color) {
    classes.push(colors[fields.color]);
  }

  return ` ${classes.join(" ")}`;
}
function RenderRichText({ RichText }: { RichText: ICustomRichTextFields }) {
  if (!RichText?.richText) return null;

  const options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1
          className={getClasses(
            RichText.h1Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2
          className={getClasses(
            RichText.h2Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3
          className={getClasses(
            RichText.h3Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: any) => (
        <h4
          className={getClasses(
            RichText.h4Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: any) => (
        <h5
          className={getClasses(
            RichText.h5Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: any) => (
        <h6
          className={getClasses(
            RichText.h6Typeset?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </h6>
      ),
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p
          className={getClasses(
            RichText.paragraph?.fields as ITypesetFields | undefined
          )}
        >
          {children}
        </p>
      ),
      //hyperlink
      ["hyperlink"]: (node: any, children: any) => (
        <a className={"text-[blue] underline"} href={node.data.uri}>
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any, children: any) => (
        <div className={"relative w-full h-64 [&>*]:object-contain"}>
          <Image
            alt={node.data.target.fields.description}
            src={`https:${node.data.target.fields.file.url}`}
            fill={true}
          />
        </div>
      ),
    },
  };
  return (
    <>
      {RichText.richText &&
        documentToReactComponents(RichText.richText, options)}
    </>
  );
}

export default RenderRichText;
