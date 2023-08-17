import Home from "@/app/[...slug]/page";
import { generateMetadata as meta } from "@/app/[...slug]/page";

export async function generateMetadata() {
  return meta({ params: { slug: [] }, searchParams: "" }, {} as any);
}

export const revalidate = 60;

const index = ({ params }: { params: any }) =>
  Home({
    params: {
      ...params,
      slug: [],
    },
  });
export default index;
