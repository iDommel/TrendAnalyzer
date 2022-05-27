import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const App = () => {
  const [data, setData] = useState();

  const getData = async () => {
    const resp = await fetch("http://localhost:5000/askreddit/bestof", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });
    const data = await resp.json();
    if (resp.ok && resp.status === 200) {
      console.log(data);
      setData(data.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={getData}>Get Data</button>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default App;
