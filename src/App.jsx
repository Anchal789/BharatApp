import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Navbar";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import ErrorBoundry from "./Pages/ErrorBoundry";
import { useEffect, useState } from "react";
import DeliveryManPost from "./components/DeliveryManPost/DeliveryManPost";
import LoadingScreen from "./Pages/StartUpAnimation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("beforeunload", navigate("/"));
    return () => {
      window.removeEventListener("beforeunload", navigate("/"));
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timeout);
  }, []);
  return (
    <ErrorBoundry>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route
                exact
                path="/user/:username"
                element={<DeliveryManPost />}
              />
            </Routes>
          </main>
          <footer className="main-footer">
            Designed By{" "}
            <a href="https://www.linkedin.com/in/anchal-deshmukh-2315241a0/">
              AnchalDeshmukh
            </a>
          </footer>
        </div>
      )}
    </ErrorBoundry>
  );
}

export default App;
