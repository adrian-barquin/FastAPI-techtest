const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function getAllUsers(){
    const response = await fetch(`${API_BASE}/users/`);
    if(!response.ok){
        throw new Error("Error al cargar usuarios")
    }
    return response.json();
}

export async function createUser(user) {
    const response = await fetch(`${API_BASE}/users/`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });
    if(!response.ok){
        throw new Error("Error al crear usuario")
    }
    return response.json();
}

export async function deleteUsers(ids) {
    const response = await fetch("http://localhost:8000/users", {
        method: "DELETE", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ ids })
    });
    if(!response.ok){
        throw new Error("Error eliminando usuarios")
    }
}