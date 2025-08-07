import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';
import * as authService from './services/authService';
import * as hootService from './services/hootService';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hoots, setHoots] = useState([]);

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();

      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const handleAddHoot = async (hootFormData) => {
  const newHoot = await hootService.create(hootFormData);
  setHoots([newHoot, ...hoots]);
  navigate('/hoots');
};

  return (
    <>
      <NavBar user={user} handleSignout={handleSignout} />
      <Routes>
        {user ? (
          // Protected Routes:
          <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route path="/hoots/:id" element={<HootDetails hoots={hoots} />} />
            <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
          </>
        ) : (
          // Public Route:
          <Route path="/" element={<Landing />} />
        )}
        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </>
  )
};

export default App;