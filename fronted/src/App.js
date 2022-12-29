import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Graphs from "./graphs";
import "./App.css";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/graphsSentiments" element={<Graphs />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
