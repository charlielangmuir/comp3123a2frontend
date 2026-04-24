import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState({
        department: "",
        position: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchEmployees = async () => {
    try {
      setLoading(true);
      let query = "";
      if (search.department || search.position) {
        const params = new URLSearchParams(search);
        query = `/emp/employees/search?${params.toString()}`;
      }
      const res = await axiosClient.get(query || "/emp/employees");
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees.");
      setLoading(false);
    }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSearchChange = (e) => {
        setSearch({
            ...search, [e.target.name]: e.target.value
        });
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchEmployees();
    }
    const handleDelete = async(id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axiosClient.delete(`/emp/employees/${id}`);
            setEmployees(employees.filter(emp => emp._id != id));
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert("Failed to delete employee.")
        }
    };

    if (loading) return <p className="page-container">Loading Employees...</p>
    if (error) return <p className="page-container">{error}</p>;

    return (
        <div className="page-container">
            <h1>Employees</h1>

            <form onSubmit={handleSearchSubmit} style ={{marginBottom:"1rem"}}>
                <input
                    className="input"
                    type="text"
                    name="department"
                    placeholder="Search by Department"
                    value={search.department}
                    onChange={handleSearchChange}
                />
                <input
                    className="input"
                    type="text"
                    name="position"
                    placeholder="Search by Position"
                    value={search.position}
                    onChange={handleSearchChange}
                />
                <button
                    type="submit"
                    className="button"
                    style={{backgroundColor: "blue", marginRight: "0.5rem"}}
                >Search</button>
                <button
                    type="button"
                    className="button"
                    style={{backgroundColor: "gray"}}
                    onClick={() => {
                        setSearch({department: "", position: ""})
                        fetchEmployees();
                    }}
                >Reset</button>
                


            </form>
            <button
                className="button"
                style={{backgroundColor: "green", marginBottom: "1rem"}}
                onClick ={() => {
                    navigate("/employees/add")
                }}
            >Add Employee</button>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.length === 0 ? (
                    <tr>
                    <td colSpan="5">No employees found.</td>
                    </tr>
                ) : (
                    employees.map((emp) => (
                    <tr key={emp.employee_id}>
                        <td>{emp.first_name} {emp.last_name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.department}</td>
                        <td>{emp.position}</td>
                        <td>
                        <button
                            className="button"
                            style={{ backgroundColor: "blue", marginRight: "0.25rem" }}
                            onClick={() => navigate(`/employees/${emp.employee_id}/edit`)}
                        >
                            Edit
                        </button>
                        <button
                            className="button"
                            style={{ backgroundColor: "red", marginRight: "0.25rem" }}
                            onClick={() => handleDelete(emp.employee_id)}
                        >
                            Delete
                        </button>
                        <button
                            className="button"
                            style={{ backgroundColor: "gray" }}
                            onClick={() => navigate(`/employees/${emp.employee_id}`)}
                        >
                            View
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>

        </div>
    );
  
}