import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => nav("/dashboard"), 1000);
    } catch {
      setToast({ message: "Invalid email or password", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="centered">
      {loading && <Loader />}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <form className="form-container" onSubmit={submit}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" onChange={e => setForm({...form,email:e.target.value})} required />
        <div className="password-toggle">
          <input type={show ? "text" : "password"} placeholder="Password" onChange={e => setForm({...form,password:e.target.value})} required />
          <span onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</span>
        </div>
        <button type="submit">Login</button>
        <div className="form-link">
          New user? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
