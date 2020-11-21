import { useState, useEffect } from "react";
import "./App.css";

const tableHeaders = ["name", "email", "phone", "dob"];

function App() {
  const [employees, setEmployees] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState(1);

  useEffect(() => {
    fetch("https://randomuser.me/api/?nat=us&results=10").then(async (res) => {
      if (!res.ok) throw new Error("failed to get employees");
      const { results } = await res.json();
      setEmployees(() =>
        results.map(({ name, picture, email, phone, dob }) => ({
          picture,
          name,
          email,
          phone,
          dob
        }))
      );
    });
  }, []);

  const nameRegex = new RegExp(nameFilter, "i");

  return (
    <div className="container">
      <div className="header">EMPLOYEE DIRECTORY</div>
      <div className="subHeader">
        Click a column name to sort or type a name to narrow your results
      </div>
      <input
        placeholder="Search a name"
        type="text"
        className="textBox"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Picture</th>
            {tableHeaders.map((name, i) => (
              <th
                key={i}
                onClick={() => {
                  if (sortField === name) {
                    setSortDirection(-sortDirection);
                  } else {
                    setSortField(name);
                    setSortDirection(1);
                  }
                }}
              >
                {name}
                {sortField === name
                  ? sortDirection === 1
                    ? " \u02C4"
                    : " \u02C5"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees
            .filter(({ name }) => nameRegex.test(name.first + " " + name.last))
            .sort((a, b) => {
              if (sortField === "name") {
                if (a.name.first > b.name.first) return sortDirection;
                else if (a.name.first < b.name.first) return -sortDirection;
                else if (a.name.last > b.name.last) return sortDirection;
                else if (a.name.last < b.name.last) return -sortDirection;
              } else if (a[sortField] > b[sortField]) return sortDirection;
              else if (a[sortField] < b[sortField]) return -sortDirection;
              return 0;
            })
            .map(({ picture, name, email, phone, dob }, i) => (
              <tr key={i}>
                <td>
                  <img src={picture.thumbnail} />
                </td>
                <td>{name.first + " " + name.last}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>{dob.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
