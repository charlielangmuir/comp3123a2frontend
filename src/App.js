import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>

        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>}/>
        <Route path="/employees/add" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>}/>
        <Route path="/employees/:eid" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>}/>
        <Route path="/employees/:eid/edit" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>}/>

      </Routes>
    </Router>
  );
}

export default App;
