import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import NewNotebook from "./NewNotebook";
import Canvas from "./Canvas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<NewNotebook />} />
        <Route path="/canvas/:id" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}
