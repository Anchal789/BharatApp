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
import { Helmet } from "react-helmet";
import AdminPage from "./Pages/AdminPage/AdminPage";

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
      <Helmet>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4197896435460491"
          crossorigin="anonymous"
        ></script>
      </Helmet>
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
               <Route path="/home/admin/:option" element={<AdminPage/>} />
            </Routes>
          </main>
        </div>
      )}
    </ErrorBoundry>
  );
}

export default App;
