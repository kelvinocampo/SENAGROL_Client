import { AppProviders } from "./components/layout/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";
import "./index.css";

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
