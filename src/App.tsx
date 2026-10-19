import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";

const AdminPage = lazy(() => import("./pages/Admin"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCD451]" />}>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* fallback */}
        <Route
          path="*"
          element={
            <div className="text-white p-10 text-center font-[Cairo]">
              الصفحة غير موجودة
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
