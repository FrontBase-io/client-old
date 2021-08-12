import React, { useEffect } from "react";
import "./App.css";
import io, { serverUrl } from "./Utils/Interactor";

function App() {
  // Vars
  // Lifecycle
  useEffect(() => {
    console.log(`Connecting to ${serverUrl}`);
    io.emit("hello");
  }, []);
  // UI
  return <>Test</>;
}

export default App;
