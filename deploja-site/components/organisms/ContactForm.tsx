import React from "react";
import ContactFormClientside from "@/components/molecules/ContactFormClientside";
import { IContactFormFields } from "@/@types/generated/contentful";
import { createClient } from "contentful";

//create contentful client
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
});

export default async function ContactForm() {
  //Fetch the first ContactForm contentful entry
  const contactForm = await client
    .getEntries({
      content_type: "contactForm",
      locale: process.env.NEXT_PUBLIC_LOCALE,
    })
    .then((response) => response.items[0].fields as IContactFormFields);

  return <ContactFormClientside contactForm={contactForm} />;
}
