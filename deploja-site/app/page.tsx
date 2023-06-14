import Home from "@/app/[...slug]";

const index = ({ params }: { params: any }) =>
  Home({ params: { ...params, slug: ["/"] } });
export default index;
