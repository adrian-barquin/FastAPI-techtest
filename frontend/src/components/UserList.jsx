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
    const [pageSizeOpen, setPageSizeOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const filterRef = useRef(null);
    const pageSizeRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (filterRef.current && !filterRef.current.contains(e.target)) setOpen(false);
            if (pageSizeRef.current && !pageSizeRef.current.contains(e.target)) setPageSizeOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const noResults = filteredUsers.length === 0;

    return (
        <div className="user-list">
            <div className="user-list-toolbar">
                <span className="user-list-count">{filteredUsers.length} registro{filteredUsers.length !== 1 ? "s" : ""}</span>
                <div className="filter-wrapper" ref={pageSizeRef}>
                    <button type="button" className="filter-toggle" onClick={() => setPageSizeOpen(p => !p)}>
                        Mostrar {pageSize} ▾
                    </button>
                    {pageSizeOpen && (
                        <div className="filter-dropdown">
                            {[10, 20, 50, 100].map(n => (
                                <label key={n}>
                                    <input
                                        type="radio"
                                        name="page-size"
                                        checked={pageSize === n}
                                        onChange={() => { setPageSize(n); setPageSizeOpen(false); }}
                                    />
                                    {n}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="user-list-scroll">
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
                                            <label className={noResults ? "filter-disabled" : ""}>
                                                <input type="radio" name="vehicle-filter" checked={vehicleFilter === "all"} onChange={() => setVehicleFilter("all")} />
                                                Todos
                                            </label>
                                            <label className={noResults ? "filter-disabled" : ""}>
                                                <input type="radio" name="vehicle-filter" checked={vehicleFilter === "yes"} onChange={() => setVehicleFilter("yes")} />
                                                Sí
                                            </label>
                                            <label className={noResults ? "filter-disabled" : ""}>
                                                <input type="radio" name="vehicle-filter" checked={vehicleFilter === "no"} onChange={() => setVehicleFilter("no")} />
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
        </div>
    );
}