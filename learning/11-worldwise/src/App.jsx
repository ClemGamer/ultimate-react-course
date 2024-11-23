import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import ProtecedRoute from "./pages/ProtecedRoute";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Homepage from "./pages/Homepage";
// import PageNotFound from "./pages/PageNotFound";
// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";
// no lazy
// dist/index.html                   0.45 kB │ gzip:   0.29 kB
// dist/assets/index-db86d12d.css   30.49 kB │ gzip:   5.06 kB
// dist/assets/index-298b9350.js   508.89 kB │ gzip: 148.71 kB

const Homepage = lazy(() => import("./pages/Homepage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
// with lazy
// dist/index.html                           0.45 kB │ gzip:   0.29 kB
// dist/assets/Logo-515b84ce.css             0.03 kB │ gzip:   0.05 kB
// dist/assets/Login-f39ef3ff.css            0.35 kB │ gzip:   0.22 kB
// dist/assets/Product-cf1be470.css          0.47 kB │ gzip:   0.27 kB
// dist/assets/PageNav-d3c5d403.css          0.51 kB │ gzip:   0.28 kB
// dist/assets/Homepage-380f4eeb.css         0.51 kB │ gzip:   0.30 kB
// dist/assets/AppLayout-c52a8417.css        1.91 kB │ gzip:   0.70 kB
// dist/assets/index-2dfbab61.css           26.81 kB │ gzip:   4.40 kB
// dist/assets/Product.module-02d70b80.js    0.06 kB │ gzip:   0.07 kB
// dist/assets/PageNotFound-43948b97.js      0.15 kB │ gzip:   0.15 kB
// dist/assets/Logo-8b089d7c.js              0.21 kB │ gzip:   0.19 kB
// dist/assets/PageNav-923be746.js           0.49 kB │ gzip:   0.27 kB
// dist/assets/Pricing-8def12a4.js           0.65 kB │ gzip:   0.41 kB
// dist/assets/Homepage-0d7d7a8a.js          0.67 kB │ gzip:   0.41 kB
// dist/assets/Product-4d94c254.js           0.86 kB │ gzip:   0.49 kB
// dist/assets/Login-fbc9814a.js             0.94 kB │ gzip:   0.49 kB
// dist/assets/AppLayout-4a4df390.js       156.87 kB │ gzip:  46.20 kB
// dist/assets/index-2bb11bcb.js           350.36 kB │ gzip: 102.00 kB

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtecedRoute>
                    <AppLayout />
                  </ProtecedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
