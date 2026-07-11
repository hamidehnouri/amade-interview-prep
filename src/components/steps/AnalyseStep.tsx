import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Eyebrow from "@/components/ui/Eyebrow";
import StepHeader from "@/components/ui/StepHeader";

export default function AnalyseStep({ jd, onChange }: { jd: string; onChange: (v: string) => void }) {
  return (
    <>
      <StepHeader n={1} title="Job description analyser" subtitle="Paste a job description — we extract the role's focus areas and generate a matching question set." />
      <Card>
        <Eyebrow>Paste a job description</Eyebrow>
        <Textarea value={jd} onChange={onChange} rows={12} placeholder="Paste the role's job description…" />
      </Card>
    </>
  );
}
