import interviewIcon from "../../../assets/icons/interview.svg";

function FeedbackCard({ feedback }) {
  return (
    <section className="feedback-card">
      <div className="feedback-card-header">
        <div>
          <img src={interviewIcon} alt="" aria-hidden="true" />
          <span>AI Phân tích tức thì</span>
        </div>
        <strong>
          {feedback.score}/{feedback.maxScore}
        </strong>
      </div>

      <div className="feedback-body">
        <p className="feedback-summary">
          <span>Nhận xét:</span> {feedback.summary}
        </p>

        <div className="feedback-grid">
          <div className="feedback-box feedback-box-missing">
            <h3>THIẾU SÓT</h3>
            <p>{feedback.missing}</p>
          </div>
          <div className="feedback-box feedback-box-suggestion">
            <h3>GỢI Ý</h3>
            <p>{feedback.suggestion}</p>
          </div>
        </div>

        <p className="feedback-follow-up">
          <span>Follow-up:</span> {feedback.followUp}
        </p>
      </div>
    </section>
  );
}

export default FeedbackCard;
