import { useState, lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdoptedPetContext } from "../contexts/AdoptedPetContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      suspense: true,
    },
  },
});

const Details = lazy(() => import("./Details"));
const SearchParams = lazy(() => import("./SearchParams"));

function App() {
  const adoptedPetHook = useState(null);
  return (
    <AdoptedPetContext.Provider value={adoptedPetHook}>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="loading-pane">
              <h2 className="loader">🌀</h2>
            </div>
          }
        >
          <header>
            <Link to="/">Adopt Me!</Link>
          </header>
          <Routes>
            <Route path="/" element={<SearchParams />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </Suspense>
      </QueryClientProvider>
    </AdoptedPetContext.Provider>
  );
}

export default App;
