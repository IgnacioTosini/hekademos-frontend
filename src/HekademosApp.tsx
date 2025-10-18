import { ToastContainer } from "react-toastify";
import { AppRouter } from "./routes/AppRouter";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import "react-toastify/dist/ReactToastify.css";

function HekademosApp() {
  return (
    <>
      <Header />
      <AppRouter />
      <Footer />
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  )
}

export default HekademosApp
