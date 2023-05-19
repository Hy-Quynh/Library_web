import { ToastContainer } from "react-toastify";
import "./App.css";
import MainRouter from "./routers";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <div>
        <MainRouter />
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
}

export default App;
