import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Navbar";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import ErrorBoundry from "./Pages/ErrorBoundry";
import { useEffect } from "react";
import DeliveryManPost from "./components/DeliveryManPost/DeliveryManPost";

function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    window.addEventListener('beforeunload', navigate("/"));

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', navigate("/"));
    };
  },[])
  return (
    <ErrorBoundry>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route exact path="/user/:username" element={<DeliveryManPost />} />
          </Routes>
        </main>
          <footer>
            All right reserver @AnchalDeshmukh
          </footer>
      </div>
    </ErrorBoundry>
  );
}

export default App;
