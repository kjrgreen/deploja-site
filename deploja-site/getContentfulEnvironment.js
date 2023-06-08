const contentfulManagement = require("contentful-management");
//write this as a require:
//import { loadEnvConfig } from "@next/env";
const { loadEnvConfig } = require("@next/env");

module.exports = function () {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  });

  return contentfulClient
    .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
    .then((space) =>
      space.getEnvironment(process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT)
    );
};
