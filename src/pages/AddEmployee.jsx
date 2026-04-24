import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
    profilePic: null
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    Object.keys(employee).forEach(key => {
      if (key === "profilePic") {
        if (employee.profilePic instanceof File) {
          formData.append("profilePic", employee.profilePic);
        }
      } else {
        formData.append(key, employee[key]);
      }
    });

    await axiosClient.post("/emp/employees", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/employees");
  } catch (err) {
    console.error(err);
    setError("Failed to add employee.");
  }
};

  const handleFileChange = (e) => {
    setEmployee({ ...employee, profilePic: e.target.files[0] });
  };

  return (
    <div className="form-container">
      <h2>Add Employee</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={employee.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={employee.last_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} required />
        <input type="text" name="position" placeholder="Position" value={employee.position} onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary" value={employee.salary} onChange={handleChange} required />
        <input type="date" name="date_of_joining" placeholder="Date of Joining" value={employee.date_of_joining} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={employee.department} onChange={handleChange} required />
        <input type="file" name="profilePic" onChange={handleFileChange} />
        <button className="button" style={{ backgroundColor: "green" }}>Add Employee</button>
      </form>
    </div>
  );
}