import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Eyebrow from "@/components/ui/Eyebrow";

export default function AnalyseStep({ jd, onChange }: { jd: string; onChange: (v: string) => void }) {
  return (
    <Card>
      <Eyebrow>Paste a job description</Eyebrow>
      <Textarea value={jd} onChange={onChange} rows={12} placeholder="Paste the role's job description…" />
    </Card>
  );
}
