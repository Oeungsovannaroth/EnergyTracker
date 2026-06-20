import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import AdminLayout from "./admin/AdminLayout";

import ProtectedRoute from "./admin/ProtectedRoute";

import AdminLogin from "./admin/pages/Login";

import Dashboard from "./admin/pages/Dashboard";

import Users from "./admin/pages/Users";

import Products from "./admin/pages/Products";

import Orders from "./admin/pages/Orders";

import ResourceManager from "./admin/pages/ResourceManager";

import Home from "./pages/Home";

import Features from "./pages/Features";

import ArticlePage from "./pages/ArticlePage";

import Spotlight from "./pages/Spotlight";

import FossilFuel from "./pages/FossilFuel";

import RenewableEnergy from "./pages/RenewableEnergy";

import Regions from "./pages/Regions";

import CountryPage from "./pages/CountryPage";
import CategoryPage from "./pages/CategoryPage";

import Media from "./pages/Media";

import MediaFiltered from "./pages/MediaFiltered";
import MediaDetail from "./pages/MediaDetail";

import Blog from "./pages/Blog";

import BlogPost from "./pages/BlogPost";

import BlogFiltered from "./pages/BlogFiltered";

import Publications from "./pages/Publications";

import Contact from "./pages/Contact";

import About from "./pages/About";

import ProductDetail from "./pages/ProductDetail";

import Checkout from "./pages/Checkout";

import Receipt from "./pages/Receipt";

import Coal from "./pages/Coal";

import OilAndGas from "./pages/OilAndGas";

import Petroleum from "./pages/Petroleum";

import NaturalGas from "./pages/NaturalGas";

import Others from "./pages/Others";

import Solar from "./pages/Solar";

import Wind from "./pages/Wind";

import CleanEnergyFinancing from "./pages/CleanEnergyFinancing";

import FairJustTransition from "./pages/FairJustTransition";
import DynamicPage from "./pages/DynamicPage";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="orders" element={<Orders />} />

          <Route path="products" element={<Products />} />

          <Route path="users" element={<Users />} />

          <Route path="manage/:resourceKey" element={<ResourceManager />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/features" element={<Features />} />

          <Route path="/features/:slug" element={<ArticlePage />} />

          <Route path="/spotlight" element={<Spotlight />} />

          <Route path="/fossil-fuel" element={<FossilFuel />} />

          <Route path="/renewable-energy" element={<RenewableEnergy />} />

          <Route path="/regions" element={<Regions />} />

          <Route path="/regions/others" element={<Others />} />

          <Route path="/regions/:slug" element={<CountryPage />} />

          <Route path="/media" element={<Media />} />

          <Route
            path="/media/videos"
            element={<MediaFiltered type="video" title="Videos" />}
          />

          <Route
            path="/media/podcasts"
            element={<MediaFiltered type="podcast" title="Podcasts" />}
          />

          <Route path="/media/:id" element={<MediaDetail />} />

          <Route path="/blog" element={<Blog />} />

          <Route path="/blog/post/:slug" element={<BlogPost />} />

          <Route
            path="/blog/case-studies"
            element={
              <BlogFiltered categorySlug="case-studies" title="Case Studies" />
            }
          />

          <Route
            path="/blog/transition"
            element={
              <BlogFiltered
                categorySlug="transition"
                title="Energy Transition Inspiration"
              />
            }
          />

          <Route
            path="/blog/opinion"
            element={
              <BlogFiltered categorySlug="opinion" title="Opinion Pieces" />
            }
          />

          <Route path="/publications" element={<Publications />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/about" element={<About />} />

          <Route path="/shop/:id" element={<ProductDetail />} />

          <Route path="/shop/:id/checkout" element={<Checkout />} />

          <Route path="/shop/receipt/:invoiceNumber" element={<Receipt />} />

          <Route path="/fossil-fuel/coal" element={<Coal />} />

          <Route path="/fossil-fuel/oil-gas" element={<OilAndGas />} />

          <Route path="/fossil-fuel/petroleum" element={<Petroleum />} />

          <Route path="/fossil-fuel/natural-gas" element={<NaturalGas />} />

          <Route path="/renewable-energy/solar" element={<Solar />} />

          <Route path="/renewable-energy/wind" element={<Wind />} />

          <Route
            path="/renewable-energy/financing"
            element={<CleanEnergyFinancing />}
          />

          <Route
            path="/renewable-energy/transition"
            element={<FairJustTransition />}
          />

          <Route path="/category/:slug" element={<CategoryPage />} />

          <Route path="*" element={<DynamicPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
