import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", form);
      setToast({ message: "Registration successful!", type: "success" });
      setTimeout(()=>nav("/login"),1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(()=>setToast(null),2000);
    }
  };

  return (
    <div className="centered">
      {loading && <Loader />}
      {toast && <Toast message={toast.message} type={toast.type} />}
      <form className="form-container" onSubmit={submit}>
        <h2>Register</h2>
        <input type="text" placeholder="Username" onChange={e => setForm({...form,username:e.target.value})} required />
        <input type="email" placeholder="Email" onChange={e => setForm({...form,email:e.target.value})} required />
        <div className="password-toggle">
          <input type={show ? "text" : "password"} placeholder="Password" onChange={e => setForm({...form,password:e.target.value})} required />
          <span onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</span>
        </div>
        <button type="submit">Register</button>
        <div className="form-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
