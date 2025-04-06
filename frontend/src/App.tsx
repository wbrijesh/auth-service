import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Layout } from './components/Layout';
import { Applications } from './pages/applications/List';
import { CreateApplication } from './pages/applications/Create';
import { EditApplication } from './pages/applications/Edit';
import { ApplicationDetails } from './pages/applications/Details';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route path="app" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="applications">
                <Route index element={<Applications />} />
                <Route path="new" element={<CreateApplication />} />
                <Route path=":id" element={<ApplicationDetails />} />
                <Route path=":id/edit" element={<EditApplication />} />
              </Route>
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
