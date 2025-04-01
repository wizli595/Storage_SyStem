import HomeClient from "@/components/Home";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function HomePage() {
  // Simulate a loading delay
  await delay(1000);

  return <HomeClient />;
}
