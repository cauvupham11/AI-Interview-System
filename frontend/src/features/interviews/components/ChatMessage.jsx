import botIcon from "../../../assets/icons/bot.svg";
import profileIcon from "../../../assets/icons/profile.svg";

function ChatMessage({ message }) {
  const isCandidate = message.role === "candidate";

  return (
    <article className={`chat-message ${isCandidate ? "chat-message-candidate" : "chat-message-ai"}`}>
      {!isCandidate ? (
        <span className="chat-avatar chat-avatar-ai">
          <img src={botIcon} alt="" aria-hidden="true" />
        </span>
      ) : null}

      <div>
        <div className="chat-bubble">{message.content}</div>
        <time className="chat-time">{message.time}</time>
      </div>

      {isCandidate ? (
        <span className="chat-avatar chat-avatar-user">
          <img src={profileIcon} alt="" aria-hidden="true" />
        </span>
      ) : null}
    </article>
  );
}

export default ChatMessage;
