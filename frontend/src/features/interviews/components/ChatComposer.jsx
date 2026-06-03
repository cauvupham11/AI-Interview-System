import sendIcon from "../../../assets/icons/send.svg";
import trashIcon from "../../../assets/icons/trash.svg";

function ChatComposer({ disabled = false, onChange, onSubmit, value }) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <form className="chat-composer" onSubmit={onSubmit}>
      <textarea
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nhập câu trả lời của bạn tại đây..."
        value={value}
      />
      <div className="composer-footer">
        <span>
          <strong>Mẹo:</strong> Hãy trả lời theo cấu trúc Khái niệm → Ví dụ → Ưu/Nhược điểm để
          đạt điểm cao nhất.
        </span>
        <div className="composer-actions">
          <small>{value.length}/2000 từ</small>
          <button
            aria-label="Xóa câu trả lời"
            className="composer-trash"
            disabled={disabled}
            onClick={handleClear}
            type="button"
          >
            <img src={trashIcon} alt="" aria-hidden="true" />
          </button>
          <button aria-label="Gửi câu trả lời" className="composer-send" disabled={disabled} type="submit">
            <img src={sendIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChatComposer;
