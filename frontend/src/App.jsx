import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginRegister from "./Components/Login & Sign Up/LoginRegister";
import Header from "./Components/Landing Page/Header";
import About from "./Components/Landing Page/About";
import Class from "./Components/Landing Page/Class";
import Trainer from "./Components/Landing Page/Trainer";
import Price from "./Components/Landing Page/Price";
import Client from "./Components/Landing Page/Client";
import Footer from "./Components/Landing Page/Footer";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import ClientDashboard from "./Components/Dashboard/ClientDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminExerciseList from "./Components/Exercises/AdminExerciseList";
import ExerciseForm from "./Components/Exercises/ExerciseForm";
import ClientExerciseList from "./Components/Exercises/ClientExerciseList";
import ExerciseDetail from "./Components/Exercises/ExerciseDetail";
import AdminProductList from "./Components/Product/AdminProductList ";
import ProductForm from "./Components/Product/ProductForm";
import ClientProductList from "./Components/Product/ClientProductList ";
import ProductDetail from "./Components/Product/ProductDetail";
import AppProvider from "./Context/AppContext";
import "remixicon/fonts/remixicon.css";

const NotFoundPage = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-2xl text-red-600 font-semibold">
      404 - Page Not Found
    </div>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <About />
              <Class />
              <Trainer />
              <Price />
              <Client />
              <Footer />
            </>
          }
        />

        {/* Login/Register Route */}
        <Route path="/login-register" element={<LoginRegister />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exercises"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminExerciseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exercises/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <ExerciseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exercises/edit/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <ExerciseForm />
            </ProtectedRoute>
          }
        />

        {/* Admin Product Routes */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductForm />
            </ProtectedRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/exercises"
          element={
            <ProtectedRoute requiredRole="client">
              <ClientExerciseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/exercises/:id"
          element={
            <ProtectedRoute requiredRole="client">
              <ExerciseDetail />
            </ProtectedRoute>
          }
        />

        {/* Client Product Routes */}
        <Route
          path="/client/products"
          element={
            <ProtectedRoute requiredRole="client">
              <ClientProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/products/:id"
          element={
            <ProtectedRoute requiredRole="client">
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route for Unmatched Paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProvider>
  );
}