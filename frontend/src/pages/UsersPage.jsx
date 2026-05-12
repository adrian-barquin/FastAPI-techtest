import { useEffect, useState } from "react";
import { getAllUsers, deleteUsers } from "../api/users";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";


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

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <UserForm users={users} onUserCreated={loadUsers} />

      <div className="card">
        <h2 className="card-title">Listado</h2>

        <UserList
          users={users}
          vehicleFilter={vehicleFilter}
          setVehicleFilter={setVehicleFilter}
          deleteMode={deleteMode}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />

        {!deleteMode && (
          <button onClick={() => setDeleteMode(true)}>
            Eliminar
          </button>
        )}

        {deleteMode && (
          <>
            <button
              disabled={selectedUsers.length === 0}
              onClick={() => setShowConfirm(true)}
            >
              Eliminar seleccionados
            </button>

            <button
              className="secondary"
              onClick={() => {
                setDeleteMode(false);
                setSelectedUsers([]);
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              ¿Está seguro de que quiere eliminar?<br />
              <strong>Esta acción no se puede deshacer</strong>
            </p>

            <div className="modal-actions">
              <button className="danger" onClick={handleConfirmDelete}>
                Aceptar
              </button>
              <button className="secondary" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}