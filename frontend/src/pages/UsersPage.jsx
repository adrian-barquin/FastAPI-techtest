import { useEffect, useState } from "react";
import { getAllUsers, deleteUsers } from "../api/users";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";


export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [vehicleFilter, setVehicleFilter] = useState("all");
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    async function loadUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleConfirmDelete() {
        try {
            await deleteUsers(selectedUsers);
            setShowConfirm(false);
            setDeleteMode(false);
            setSelectedUsers([]);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    function handleCancelDelete() {
        setShowConfirm(false);
        setDeleteMode(false);
        setSelectedUsers([]);
    }

    useEffect(() => { loadUsers(); }, []);

    return (
        <>
            <UserForm users={users} onUserCreated={loadUsers} />

            <div className="card">
                <div className="list-header">
                    <h2 className="card-title">Listado</h2>


                    <button
                        className="danger"
                        disabled={deleteMode && selectedUsers.length === 0}
                        onClick={() => {
                            if (!deleteMode) {
                                setDeleteMode(true);
                            } else {
                                setShowConfirm(true);
                            }
                        }}
                    >
                        Eliminar
                    </button>
                </div>

                <UserList
                    users={users}
                    vehicleFilter={vehicleFilter}
                    setVehicleFilter={setVehicleFilter}
                    deleteMode={deleteMode}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                />

                {showConfirm && (
                    <ConfirmDeleteModal
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}
            </div>
        </>
    );
}