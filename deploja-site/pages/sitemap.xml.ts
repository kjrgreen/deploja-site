//import { MetadataRoute } from "next";
import { IPage } from "@/@types/generated/contentful";
import { GetServerSideProps } from "next";

const batchedPromises = async (
  promises: (() => Promise<any>)[],
  batchSize: number,
  pause: number
) => {
  const results = [];
  for (let i = 0; i < promises?.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch?.map((p) => p()));
    results.push(...batchResults);
    await new Promise((resolve) => setTimeout(resolve, pause));
  }
  return results;
};

async function sitemap(): Promise<any /*MetadataRoute.Sitemap*/> {
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=page&locale=${process.env.NEXT_PUBLIC_LOCALE}`,
    {
      cache: "no-cache",
    }
  ).then((response) => response.json());

  const urlsToFetch = response.items?.map(
    (item: { sys: { id: string } }) =>
      `https://cdn.contentful.com/spaces/6vs1yal7rg3j/environments/master/entries?access_token=Rrem7fxfkJ7ecscZBI1rTNn9ExEC5BCTD0fOb_0uGQc&content_type=page&sys.id=${item.sys.id}&locale=${process.env.NEXT_PUBLIC_LOCALE}`
  );

  const promises = urlsToFetch?.map(
    (url: string) => () =>
      fetch(url, {
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((json) => ({
          url: (process.env.NEXT_PUBLIC_BASE_URL +
            (json.items[0] as IPage).fields.url) as string,
          lastModified: json.includes.Entry.reduce((a: any, b: any) =>
            (json.items[0] as IPage).sys.updatedAt > a.sys.updatedAt &&
            (json.items[0] as IPage).sys.updatedAt > b.sys.updatedAt
              ? (json.items[0] as IPage)
              : a.sys.updatedAt > b.sys.updatedAt
              ? a
              : b
          ).sys.updatedAt as Date,
        }))
  );
  return (await batchedPromises(promises, 5, 1000)).filter((p) => p);
}

const Sitemap: React.FC = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (res) {
    res.setHeader("Content-Type", "text/xml");
    res.write(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(await sitemap())
      .map(
        (page: { url: string; lastModified: Date }) =>
          `<url>
                <loc>${page.url}</loc>
                <lastmod>${page.lastModified}</lastmod>
                </url>`
      )
      .join("")}
    </urlset>`);
    res.end();
  }
  return {
    props: {},
  };
};

export default Sitemap;
