import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EmployeeDetails() {
  const { eid } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient.get(`/emp/employees/${eid}`)
      .then(res => setEmployee(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to fetch employee details.");
      });
  }, [eid]);
  if (error) return <p className="error">{error}</p>;
  if (!employee) return <p>Loading...</p>;
  console.log(employee);
  return (
    <div className="details-container">
      <h2>{employee.first_name} {employee.last_name}</h2>
      {employee.profilePic && ( 
      <img className="pfp" src={`http://localhost:5000${new String(employee.profilePic).replace(/^\/app/, '')}`} alt="Profile" width={50} />
      )}
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Salary:</strong> ${employee.salary}</p>
      <p><strong>Date of Joining:</strong> {new Date(employee.date_of_joining).toLocaleDateString()}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <div className="button-box">
        <button className="button" style={{ backgroundColor: "gray", width: "65px" }} onClick={() => navigate("/employees")}>Back</button>
        <button className="button" style={{ backgroundColor: "orange", width: "65px" }} onClick={() => navigate(`/employees/${eid}/edit`)}>Edit</button>
      </div>
      
    </div>
  );
}