import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EditEmployee() {
  const { eid } = useParams();
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

  useEffect(() => {
    axiosClient.get(`/emp/employees/${eid}`)
      .then(res => {
        const data = res.data;
        const formattedDate = data.date_of_joining
          ? data.date_of_joining.substring(0, 10)
          : "";

        setEmployee({ ...data, date_of_joining: formattedDate });
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch employee.");
      });
  }, [eid]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, profilePic: e.target.files[0] });
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

      await axiosClient.put(`/emp/employees/${eid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/employees");
    } catch (err) {
      console.error(err);
      setError("Failed to edit employee.");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Employee</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name"
               value={employee.first_name} onChange={handleChange} required />

        <input type="text" name="last_name" placeholder="Last Name"
               value={employee.last_name} onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email"
               value={employee.email} onChange={handleChange} required />

        <input type="text" name="position" placeholder="Position"
               value={employee.position} onChange={handleChange} required />

        <input type="number" name="salary" placeholder="Salary"
               value={employee.salary} onChange={handleChange} required />

        <input type="date" name="date_of_joining"
               value={employee.date_of_joining}
               onChange={handleChange} required />

        <input type="text" name="department" placeholder="Department"
               value={employee.department} onChange={handleChange} required />

        <input type="file" name="profilePic" onChange={handleFileChange} />

        <button className="button" style={{ backgroundColor: "orange" }}>
          Update Employee
        </button>
      </form>
    </div>
  );
}
