import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/pages/Login';
import Unauthorized from './components/pages/Unauthorized';
import AdminLayout from './components/Administrator/AdminLayout';
import TeamLeaderLayout from './components/TeamLeader/TeamLeaderLayout'
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/pages/Dashboard';
import Users from './components/pages/Users';
import Projects from './components/pages/Projects';
import Tasks from './components/pages/Tasks';
import ProjectPage from './components/pages/ProjectPage';
import TaskPage from './components/pages/TaskPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/administrator' element={<PrivateRoute element={<AdminLayout/>} role='ADMINISTRATOR' />} >
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path='users' element={<Users/>} />
            <Route path='projects' element={<Projects/>} />
            <Route path='tasks' element={<Tasks/>} />
          </Route>
          <Route path='/teamleader' element={<PrivateRoute element={<TeamLeaderLayout/>} role='TEAMLEADER' />} >
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path="projects">
              <Route index element={<Projects />} /> {/* "index" for the default child route */}
              <Route path=":projectId" element={<ProjectPage />} /> {/* Corrected nested route */}
            </Route>
            <Route path="tasks">
              <Route index element={<Tasks />} /> {/* "index" for the default child route */}
              <Route path=":taskId" element={<TaskPage />} /> {/* Corrected nested route */}
            </Route>
          </Route>
          <Route path='/member' element={<PrivateRoute element={<Layout/>} role='MEMBER' />} >
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path='projects' element={<Projects/>} />
            <Route path='tasks' element={<Tasks/>} />
          </Route>
          <Route path='/unauthorized' element={<Unauthorized />} />
          {/* <Route path='*' element={<Navigate to='/login' />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
