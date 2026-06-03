import Card from "../../../shared/components/ui/Card";
import { formatDate } from "../../../shared/utils/formatDate";

function InterviewCard({ interview }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{interview.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(interview.date)}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {interview.score}
        </span>
      </div>
    </Card>
  );
}

export default InterviewCard;
