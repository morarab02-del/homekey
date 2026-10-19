import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Home from "@/pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import Saved from "@/pages/Saved";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="homes/:id" element={<PropertyDetail />} />
            <Route path="saved" element={<Saved />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
