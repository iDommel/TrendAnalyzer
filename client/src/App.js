import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [data, setData] = useState();
  const [testData, setTestData] = useState();

  const getData = async () => {
    const myHeaders = new Headers({
      Accept: "application/json",
    });

    const rawData = await fetch("http://localhost:5000/askreddit/bestof", {
      headers: myHeaders,
      method: "GET",
    });
    if (rawData.ok && rawData.status === 200) {
      console.log(rawData);
      setData(rawData.message);
    }
  };

  const getTestData = async () => {
    const myHeaders = new Headers({
      "Access-Control-Allow-Origin": "*",
    });

    const rawData = await fetch("http://localhost:5000/test", {
      headers: myHeaders,
      method: "GET",
    });
    if (rawData.ok && rawData.status === 200) {
      console.log(rawData);
      setTestData(rawData);
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
      <button onClick={getTestData}>Get test Data</button>
      <p>{JSON.stringify(testData)}</p>
    </div>
  );
}

export default App;
