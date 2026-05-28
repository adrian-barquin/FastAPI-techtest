import { useState } from "react";
import UsersPage from "./pages/UsersPage";
import VehiclesPage from "./pages/VehiclesPage";

export default function App() {
    const [tab, setTab] = useState("users");

    return (
        <div>
            <h1>Gestión Usuarios</h1>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <button
                    onClick={() => setTab("users")}
                    style={{
                        padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem",
                        background: tab === "users" ? "#A855F7" : "#1A1A3E",
                        color: tab === "users" ? "#fff" : "#9B9BCC"
                    }}>
                    Usuarios
                </button>
                <button
                    onClick={() => setTab("vehicles")}
                    style={{
                        padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem",
                        background: tab === "vehicles" ? "#A855F7" : "#1A1A3E",
                        color: tab === "vehicles" ? "#fff" : "#9B9BCC"
                    }}>
                    Vehículos
                </button>
            </div>
            {tab === "users" ? <UsersPage /> : <VehiclesPage />}
        </div>
    );
}