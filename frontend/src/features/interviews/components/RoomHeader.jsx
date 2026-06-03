function RoomHeader({ onEnd, session }) {
  return (
    <header className="room-header">
      <div>
        <h1>{session.title}</h1>
      </div>

      <div className="room-header-actions">
        <span className="room-level-badge">{session.level}</span>
        <span className="room-difficulty-badge">{session.difficulty}</span>
        <button className="room-end-button" onClick={onEnd} type="button">
          Kết thúc phỏng vấn
        </button>
      </div>
    </header>
  );
}

export default RoomHeader;
