import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";
import { ROUTES } from "../../../shared/constants/routes";
import { getHistoryStats } from "../../history/services/history.service";

const defaultStats = {
  totalPractice: 0,
  averageScore: 0,
  scoreTimeline: [],
  scoresByTechnology: [],
};

function DashboardPage() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    getHistoryStats().then(setStats).catch(() => setStats(defaultStats));
  }, []);

  const latest = stats.scoreTimeline.at(-1);
  const strongestSkill = [...stats.scoresByTechnology].sort(
    (left, right) => Number(right.averageScore || 0) - Number(left.averageScore || 0),
  )[0];

  const metrics = [
    { label: "Interviews", value: String(stats.totalPractice) },
    { label: "Average score", value: `${Math.round(Number(stats.averageScore || 0) * 10)}%` },
    { label: "Strongest skill", value: strongestSkill?.technology || "Chưa có" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm text-slate-400">AI Interview System</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight">
          {latest ? `Buổi gần nhất: ${latest.position} - ${latest.technology}` : "Bắt đầu buổi phỏng vấn đầu tiên."}
        </h2>
        <Link to={ROUTES.interviewSetup}>
          <Button className="mt-6" variant="secondary">
            Start interview
          </Button>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{item.value}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default DashboardPage;
