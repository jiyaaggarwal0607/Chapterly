
import { useState } from "react";
import Landing from "./pages/landing";
import Home from "./pages/Home";
import ReaderHome from "./pages/ReaderHome";
import ShoppingPage from "./pages/shoppingpage.jsx";
import TranslatorHub from "./pages/TranslatorHub";
import InsightsDashboard from "./pages/insightsDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
function App() {
  const [page, setPage] = useState("landing");

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
      onLogout={() => setPage("landing")}
    />
  );
}

  return (
    <Home
      onLogout={() => setPage("landing")}
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
