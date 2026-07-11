import PracticeInterview from "@/components/PracticeInterview";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const sp = await searchParams;
  return <PracticeInterview question={sp.q ?? ""} category={sp.category ?? ""} />;
}
