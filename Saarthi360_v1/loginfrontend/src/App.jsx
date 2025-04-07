

import { Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import AdminLogin from './AdminLogin';
import Dashboard from "./Dashboard/Dashboard"; // Import the component
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes></>
  )
}

export default App
