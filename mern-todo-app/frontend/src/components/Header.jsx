import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <header>
      <h1>Swati Todo's</h1>
      <nav>
        <Link to="/dashboard">My Dashboard</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
