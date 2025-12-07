import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import WorkoutPlans from './pages/WorkoutPlans';
import HealthProfile from './pages/HealthProfile';
import Nutrition from './pages/Nutrition';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workout-plans" element={<WorkoutPlans />} />
              <Route path="/health-profile" element={<HealthProfile />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/panel" element={<AdminPanel />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;