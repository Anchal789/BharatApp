import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [getState, setState] = useState([]);
  const apiFunc = async () => {
    const api = fetch("https://jsonplaceholder.typicode.com/posts");
    const result = await api;
    const data = await result.json();
    setState(data);
  };
  useEffect(() => {
    apiFunc();
  }, []);
  return (
    <div>
      <p>Home</p>
      <Link to={"/login"}>Login</Link>
      <br />
      <Link to={"/register"}>Register</Link>
      <table>
        <tbody>
          {
            getState.map((obj)=>(
                <tr>
                    <td>{obj.id}</td>
                    <td>{obj.body}</td>
                    <td>{obj.title}</td>
                </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Home;
