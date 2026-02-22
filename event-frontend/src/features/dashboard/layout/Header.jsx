export default function Header({ setOpen }) {
  return (
    <header className="header">

      <button
        className="menu-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      <h3>Dashboard</h3>

      <div className="user">
        Admin
      </div>

    </header>
  );
}
