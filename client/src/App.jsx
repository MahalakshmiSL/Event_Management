import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Gallery, Contact, Premium } from "./pages/OtherPages";
import useAuthStore from "./store/authStore";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: "#2c2416", color: "#fff", fontSize: "13px" },
        success: { iconTheme: { primary: "#b5651d", secondary: "#fff" } },
      }}
    />
    <Routes>
      {/* Auth pages */}
      <Route path="/login"    element={<><Navbar /><Login /></>}    />
      <Route path="/register" element={<><Navbar /><Register /></>} />

      {/* Admin — has its own sidebar, no Layout wrapper */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Public pages */}
      <Route path="/"           element={<Layout><Home /></Layout>}        />
      <Route path="/events"     element={<Layout><Events /></Layout>}      />
      <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
      <Route path="/gallery"    element={<Layout><Gallery /></Layout>}     />
      <Route path="/contact"    element={<Layout><Contact /></Layout>}     />
      <Route path="/premium"    element={<Layout><Premium /></Layout>}     />
      <Route path="/about"      element={<Layout><Home /></Layout>}        />
      <Route path="/blog"       element={<Layout><Home /></Layout>}        />

      {/* 404 */}
      <Route path="*" element={
        <Layout>
          <div className="min-h-screen flex items-center justify-center text-center pt-24">
            <div>
              <h1 className="font-serif text-8xl font-bold text-primary mb-4">404</h1>
              <p className="text-gray-400 mb-6">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  </BrowserRouter>
);

export default App;