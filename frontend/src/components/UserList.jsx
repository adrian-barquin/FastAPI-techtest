import { useState, useRef, useEffect } from "react";
import "./UserList.css";


export default function UserList({
    users = [], 
    vehicleFilter = "all", 
    setVehicleFilter = () => {}, 
    deleteMode = false, 
    selectedUsers = [], 
    setSelectedUsers = () => {}
}){
    const [open, setOpen] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const filteredUsers = users.filter((user) => {
        if(vehicleFilter === "all") return true;
        if(vehicleFilter === "yes") return user.active === true;
        if(vehicleFilter === "no") return user.active === false;
        return true;
    });

    function toggleUser(id, checked) {
        if(checked) {
            setSelectedUsers((prev) => [...prev, id]);
        } else {
            setSelectedUsers((prev) => prev.filter((uid) => uid !== id));
        }
    }

    return (
        <>
            <div className="user-list">
                <table>
                    <thead>
                        <tr>
                            {deleteMode && <th></th>}
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Edad</th>
                            <th className="vehicle-header">
                                <div className="filter-wrapper" ref={filterRef}>
                                    <button type="button" className="filter-toggle" onClick={() => setOpen((prev) => !prev)}>
                                        ¿Posee vehículo? ▾
                                    </button>
                                    {open && (
                                        <div className="filter-dropdown">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="vehicle-filter"
                                                    checked={vehicleFilter === "all"}
                                                    onChange={() => setVehicleFilter("all")} />
                                                Todos
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="vehicle-filter"
                                                    checked={vehicleFilter === "yes"}
                                                    onChange={() => setVehicleFilter("yes")} />
                                                Sí
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="vehicle-filter"
                                                    checked={vehicleFilter === "no"}
                                                    onChange={() => setVehicleFilter("no")} />
                                                No
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={deleteMode ? 5 : 4} className="user-list-empty">
                                    No hay usuarios
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className={user.active ? "row-active" : "row-inactive"}>
                                    {deleteMode && (
                                        <td>
                                            <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={(e) => toggleUser(user.id, e.target.checked)} />
                                        </td>
                                    )}
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.age}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {user.active
                                            ? <span style={{ color: "#00FF88", fontSize: "1.1rem", fontWeight: "bold" }}>✔</span>
                                            : <span style={{ color: "#FF2D78", fontSize: "1.1rem", fontWeight: "bold" }}>✘</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div> 
        </>
    );
}