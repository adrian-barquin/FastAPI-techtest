const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function getAllCars() {
    const res = await fetch(`${API_BASE}/vehicles/cars`);
    if (!res.ok) throw new Error("Error al cargar coches");
    return res.json();
}

export async function createCar(car) {
    const res = await fetch(`${API_BASE}/vehicles/cars`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(car)
    });
    if (!res.ok) throw new Error("Error al crear coche");
    return res.json();
}

export async function updateCar(id, car) {
    const res = await fetch(`${API_BASE}/vehicles/cars/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(car)
    });
    if (!res.ok) throw new Error("Error al editar coche");
    return res.json();
}

export async function deleteCars(ids) {
    const res = await fetch(`${API_BASE}/vehicles/cars`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids })
    });
    if (!res.ok) throw new Error("Error al eliminar coches");
}

export async function getAllBikes() {
    const res = await fetch(`${API_BASE}/vehicles/bikes`);
    if (!res.ok) throw new Error("Error al cargar bicicletas");
    return res.json();
}

export async function createBike(bike) {
    const res = await fetch(`${API_BASE}/vehicles/bikes`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bike)
    });
    if (!res.ok) throw new Error("Error al crear bicicleta");
    return res.json();
}

export async function updateBike(id, bike) {
    const res = await fetch(`${API_BASE}/vehicles/bikes/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bike)
    });
    if (!res.ok) throw new Error("Error al editar bicicleta");
    return res.json();
}

export async function deleteBikes(ids) {
    const res = await fetch(`${API_BASE}/vehicles/bikes`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids })
    });
    if (!res.ok) throw new Error("Error al eliminar bicicletas");
}

export async function getAllTypes() {
    const res = await fetch(`${API_BASE}/vehicles/types`);
    if (!res.ok) throw new Error("Error al cargar tipos");
    return res.json();
}