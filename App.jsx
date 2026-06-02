import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Reservation from './pages/Reservation';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import MyOrders from './pages/dashboard/MyOrders';
import MyReservations from './pages/dashboard/MyReservations';
import Profile from './pages/dashboard/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReservations from './pages/admin/AdminReservations';
import AdminTables from './pages/admin/AdminTables';
import AdminEvents from './pages/admin/AdminEvents';
import AdminCustomers from './pages/admin/AdminCustomers';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
      </Route>

      <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      <Route path="dashboard" element={<ProtectedRoute roles={['customer']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout admin /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="tables" element={<AdminTables />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>
    </Routes>
  );
}
