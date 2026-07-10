import MockInterview from "@/components/MockInterview";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const sp = await searchParams;
  return <MockInterview question={sp.q ?? ""} category={sp.category ?? ""} />;
}
