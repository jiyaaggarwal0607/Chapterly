import { useState } from "react";
import Landing from "./pages/landing";
import Home from "./pages/Home";
import ReaderHome from "./pages/ReaderHome";
import ShoppingPage from "./pages/ShoppingPage.jsx";
import TranslatorHub from "./pages/TranslatorHub";
import InsightsDashboard from "./pages/InsightsDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

function getStartPage() {
  if (!localStorage.getItem("token")) return "landing";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "company" ? "company" : "home";
  } catch {
    return "landing";
  }
}

function App() {
  const [currentPage, setPage] = useState(getStartPage);

  // No token = always show the landing / sign-in page
  const page = localStorage.getItem("token") ? currentPage : "landing";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPage("landing");
  }

  if (page === "landing") {
    return (
      <Landing
        onReaderEnter={() => setPage("home")}
        onCompanyEnter={() => setPage("company")}
      />
    );
  }

  if (page === "reader") {
    return <ReaderHome onBack={() => setPage("home")} />;
  }

  if (page === "shop") {
    return <ShoppingPage onBack={() => setPage("home")} />;
  }

  if (page === "translator") {
    return <TranslatorHub onBack={() => setPage("home")} />;
  }

  if (page === "insights") {
    return <InsightsDashboard onBack={() => setPage("home")} />;
  }

  if (page === "company") {
    return (
      <CompanyDashboard
        onBack={() => setPage("landing")}
        onLogout={logout}
      />
    );
  }

  return (
    <Home
      onLogout={logout}
      onOpenSection={(section) => {
        if (section === "manga") {
          setPage("reader");
        } else if (section === "shop") {
          setPage("shop");
        } else if (section === "translator") {
          setPage("translator");
        } else if (section === "insights") {
          setPage("insights");
        }
      }}
    />
  );
}

export default App;

