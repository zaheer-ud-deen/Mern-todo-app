import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import axios from "axios";

export default function Dashboard() {
  const [todos,setTodos] = useState([]);
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(false);
  const [toast,setToast] = useState(null);
  const token = localStorage.getItem("token");

  const load = async()=>{
    try{
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/todo",{ headers:{authorization:token} });
      setTodos(res.data);
    }catch(err){
      setToast({message:"Error loading todos", type:"error"});
    }finally{
      setLoading(false);
      setTimeout(()=>setToast(null),2000);
    }
  };

  const add = async()=>{
    if(!text) return;
    try{
      setLoading(true);
      await axios.post("http://localhost:5000/api/todo",{text},{ headers:{authorization:token} });
      setText("");
      load();
    }catch{
      setToast({message:"Error adding todo", type:"error"});
    }finally{
      setLoading(false);
      setTimeout(()=>setToast(null),2000);
    }
  };

  const del = async id=>{
    try{
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/todo/${id}`,{ headers:{authorization:token} });
      load();
    }catch{
      setToast({message:"Error deleting todo", type:"error"});
    }finally{
      setLoading(false);
      setTimeout(()=>setToast(null),2000);
    }
  };

  useEffect(()=>{load()},[]);

  return (
    <div>
      <Header/>
      {loading && <Loader/>}
      {toast && <Toast message={toast.message} type={toast.type} />}
      <main className="dashboard-main">
        <div style={{maxWidth:"600px", margin:"auto", background:"#111827", padding:"20px", borderRadius:"12px"}}>
          <h2 style={{marginBottom:"15px", fontSize:"22px"}}>My Todos</h2>
          <div style={{display:"flex", gap:"10px", marginBottom:"15px"}}>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="New todo..." style={{flex:1, padding:"10px", borderRadius:"6px", border:"1px solid #ccc"}} />
            <button onClick={add} style={{padding:"10px 15px", background:"#4f46e5", color:"#fff", borderRadius:"6px", border:"none"}}>Add</button>
          </div>
          {todos.map(t=>(
            <div key={t._id} className="todo-card">{t.text}<button onClick={()=>del(t._id)}>Delete</button></div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
