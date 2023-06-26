import { MetadataRoute } from "next";

const batchedPromises = async (
  promises: (() => Promise<any>)[],
  batchSize: number,
  pause: number
) => {
  const results = [];
  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((p) => p()));
    results.push(...batchResults);
    await new Promise((resolve) => setTimeout(resolve, pause));
  }
  return results;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=page`
  ).then((response) => response.json());

  const urlsToFetch = response.items.map(
    (item: { sys: { id: string } }) =>
      `https://cdn.contentful.com/spaces/6vs1yal7rg3j/environments/master/entries?access_token=Rrem7fxfkJ7ecscZBI1rTNn9ExEC5BCTD0fOb_0uGQc&content_type=page&sys.id=${item.sys.id}`
  );
  console.log(urlsToFetch);
  const promises = urlsToFetch.map(
    (url: string) => () =>
      fetch(url)
        .then((response) => response.json())
        .then((json) => ({
          url: json.items[0].fields.url as string,
          lastModified: json.includes.Entry.reduce((a: any, b: any) =>
            json.items[0].sys.updatedAt > a.sys.updatedAt &&
            json.items[0].sys.updatedAt > b.sys.updatedAt
              ? json.items[0]
              : a.sys.updatedAt > b.sys.updatedAt
              ? a
              : b
          ).sys.updatedAt as Date,
        }))
  );
  return await batchedPromises(promises, 5, 1000);
}
