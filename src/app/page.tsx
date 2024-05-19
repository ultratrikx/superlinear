import LandingPage from "@/components/Landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VENDO Vendor Dashboard",
  description: "VENDO Dashboard",
  // openGraph: {
  //   images: ['https://ibb.co/XbL4rtK']
  // }
};

export default function Home() {
  return (
    <main className="px-2 sm:px-8 md:px-24 py-12">
      <LandingPage />
    </main>
  );
}
