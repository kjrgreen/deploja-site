"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { string } from "yup";
import { IContactFormFields } from "@/@types/generated/contentful"; // for everything

//	Name/Lastname
// 	Email
// 	Subject as a dropdown: Work for us, I need consultants, Other
// 	Phone number
// 	Message
const schema = yup.object().shape(
  {
    name: yup.string().required("nameError"),
    subject: yup.string().required("subjectError"),
    message: yup.string().required("messageError"),
    //Provide us either email or phone
    email: string().when("phone", {
      is: (phone: string) => !phone || phone.length === 0,
      then: (schema) => schema.email("emailError").required("emailError"),
      otherwise: (schema) => schema.notRequired(),
    }),
    phone: string().when("email", {
      is: (email: string) => !email || email.length === 0,
      then: (schema) => schema.required("phoneError"),
      otherwise: (schema) => schema.notRequired(),
    }),
  },
  ["email", "phone"] as any //This is valid, but typescript doesn't like it. I'm starting to grow weary of the poorly documented yup library
);

const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export default function ContactFormClientside({
  contactForm,
}: {
  contactForm: IContactFormFields;
}) {
  console.log(contactForm, "contactForm");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (data: any) => {
    setSubmitStatus("submitting");
    //send data to netlify
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...data }),
    })
      .then(() => setSubmitStatus("success"))
      .catch((error) => setSubmitStatus("error"));
  };
  const [submitStatus, setSubmitStatus] = useState<
    "success" | "error" | "submitting" | "idle"
  >("idle");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      name="contact"
      method="POST"
      data-netlify="true"
      className="card bg-wedgewood w-full p-6 pt-4"
    >
      <input type="hidden" name="form-name" value="contact" />
      {/*A daisyUI input and error tooltip*/}
      <div>
        <label className="label">
          <span className="label-text text-[white]">{contactForm.name}</span>
        </label>
        <input
          type="text"
          //no placeholder, do not use placeholder for labels, use labels for labels only
          className="input input-bordered"
          {...register("name")}
        />
        <p className="text-xs text-error mt-2">
          {errors.name?.message === "nameError" && contactForm.nameError}
        </p>
      </div>
      <div className="mt-2">
        <label className="label">
          <span className="label-text text-[white]">{contactForm.email}</span>
        </label>
        <input
          type="text"
          //no placeholder, do not use placeholder for labels, use labels for labels only
          className="input input-bordered"
          {...register("email")}
        />
        <p className="text-xs text-error mt-2">
          {errors.email?.message === "emailError" && contactForm.emailError}
        </p>
      </div>
      <div className="mt-2">
        <label className="label">
          <span className="label-text text-[white]">{contactForm.subject}</span>
        </label>
        <select className="select select-bordered" {...register("subject")}>
          <option value="workForUs">{contactForm.workForUs}</option>
          <option value="iNeedConsultants">
            {contactForm.needConsultants}
          </option>
          <option value="other">{contactForm.other}</option>
        </select>
        <p className="text-xs text-error mt-2">
          {errors.subject?.message === "subjectError" &&
            contactForm.subjectError}
        </p>
      </div>
      <div className="mt-2">
        <label className="label">
          <span className="label-text text-[white]">{contactForm.phone}</span>
        </label>
        <input
          type="text"
          //no placeholder, do not use placeholder for labels, use labels for labels only
          className="input input-bordered"
          {...register("phone")}
        />
        <p className="text-xs text-error mt-2">
          {errors.phone?.message === "phoneError" && contactForm.phoneError}
        </p>
      </div>
      <div className="mt-2">
        <label className="label">
          <span className="label-text text-[white]">{contactForm.message}</span>
        </label>
        <textarea
          //no placeholder, do not use placeholder for labels, use labels for labels only
          className="textarea textarea-bordered"
          {...register("message")}
        />
        <p className="text-xs text-error mt-1">
          {errors.message?.message === "messageError" &&
            contactForm.messageError}
        </p>
      </div>
      <div className="mt-2">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={submitStatus === "submitting"}
        >
          {submitStatus === "submitting" ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            contactForm.sendButton
          )}
        </button>
        {submitStatus === "success" && (
          <p className="text-xs text-green-500">{contactForm.successMessage}</p>
        )}
        {submitStatus === "error" && (
          <p className="text-xs text-error mt-2">{contactForm.errorMessage}</p>
        )}
      </div>
    </form>
  );
}
