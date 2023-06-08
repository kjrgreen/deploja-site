//Render rich text using contentful rich text renderer
import React from "react";
import {
  ICustomRichTextFields,
  ITypeset,
  ITypesetFields,
} from "@/@types/generated/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

const sizes: { [key in ITypesetFields["fontSize"]]: string } = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
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

  return classes.join(" ");
}
function RenderRichText({ RichText }: { RichText: ICustomRichTextFields }) {
  if (!RichText.richText) return null;

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
    },
  };

  return <>{documentToReactComponents(RichText.richText, options)}</>;
}

export default RenderRichText;
