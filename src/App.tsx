import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/pages/Login';
import Unauthorized from './components/pages/Unauthorized';
import AdminLayout from './components/Administrator/AdminLayout';
import TeamLeaderLayout from './components/TeamLeader/TeamLeaderLayout'
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/administrator' element={<PrivateRoute element={<AdminLayout/>} role='ADMINISTRATOR' />} />
          <Route path='/team_leader' element={<PrivateRoute element={<TeamLeaderLayout/>} role='TEAM_LEADER' />} />
          <Route path='/member' element={<PrivateRoute element={<Layout/>} role='MEMBER' />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
