import { useEffect, useState, useRef } from "react";
import { getAllCars, getAllBikes, createCar, createBike, getAllTypes, deleteCars, deleteBikes, updateCar, updateBike } from "../api/vehicles";
import { getAllUsers } from "../api/users";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const inputStyle = { padding: "10px 12px", fontSize: "0.95rem", border: "1px solid #2A2A5A", borderRadius: 6, background: "#13132B", color: "#F0F0FF", height: 42, width: "100%" };
const inputErrorStyle = { ...inputStyle, borderColor: "#FF2D78", boxShadow: "0 0 0 2px rgba(255,45,120,0.2)" };
const selectStyle = { ...inputStyle, flex: 1, minWidth: 140 };
const tdStyle = { padding: "10px 12px", borderBottom: "1px solid #2A2A5A", color: "#F0F0FF" };
const thStyle = { background: "#1A1A3E", color: "#9B9BCC", padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #2A2A5A", whiteSpace: "nowrap" };
const editInputStyle = { padding: "4px 8px", fontSize: "0.88rem", border: "1px solid #A855F7", borderRadius: 4, background: "#1A1A3E", color: "#F0F0FF", width: "100%" };
const editInputErrorStyle = { ...editInputStyle, borderColor: "#FF2D78" };
const saveBtn = { padding: "4px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "#A855F7", color: "#fff" };
const cancelBtn = { padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: "0.82rem", background: "#1A1A3E", color: "#9B9BCC" };

function FieldHint({ hint, error }) {
    if (error) return <span style={{ fontSize: "0.78rem", color: "#FF2D78", paddingLeft: 2 }}>{error}</span>;
    if (hint) return <span style={{ fontSize: "0.78rem", color: "#9B9BCC", paddingLeft: 2 }}>{hint}</span>;
    return null;
}

function Check({ val }) {
    return val
        ? <span style={{ color: "#00FF88", fontWeight: "bold" }}>✔</span>
        : <span style={{ color: "#FF2D78", fontWeight: "bold" }}>✘</span>;
}

function PaginationBar({ items, pageSize, setPageSize, currentPage, setCurrentPage }) {
    const [sizeOpen, setSizeOpen] = useState(false);
    const sizeRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (sizeRef.current && !sizeRef.current.contains(e.target)) setSizeOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const totalPages = Math.max(1, Math.ceil(items / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, items);
    const rangeLabel = items === 0 ? "0" : `${startIndex + 1}-${endIndex}`;

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 4px 4px", width: "100%" }}>
            <span style={{ fontSize: "0.85rem", color: "#9B9BCC" }}>{items} registro{items !== 1 ? "s" : ""}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ background: "#1A1A3E", border: "1px solid #2A2A5A", color: "#F0F0FF", width: 32, height: 32, borderRadius: 6, fontSize: "1.2rem", cursor: "pointer", opacity: safePage === 1 ? 0.3 : 1 }}
                    disabled={safePage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
                <span style={{ fontSize: "0.88rem", color: "#9B9BCC", whiteSpace: "nowrap" }}>{rangeLabel} · Página {safePage} de {totalPages}</span>
                <button style={{ background: "#1A1A3E", border: "1px solid #2A2A5A", color: "#F0F0FF", width: 32, height: 32, borderRadius: 6, fontSize: "1.2rem", cursor: "pointer", opacity: safePage === totalPages ? 0.3 : 1 }}
                    disabled={safePage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
            </div>
            <div ref={sizeRef} style={{ position: "relative" }}>
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#00D4FF", fontWeight: 600, fontSize: "inherit", fontFamily: "inherit" }}
                    onClick={() => setSizeOpen(p => !p)}>
                    Mostrar {pageSize} ▾
                </button>
                {sizeOpen && (
                    <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 10, background: "#13132B", border: "1px solid #2A2A5A", borderRadius: 8, padding: "10px 12px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", flexDirection: "column", gap: 6, fontSize: "0.9rem" }}>
                        {[10, 20, 50, 100].map(n => (
                            <label key={n} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#F0F0FF" }}>
                                <input type="radio" name={`page-size-${items}`} checked={pageSize === n} onChange={() => { setPageSize(n); setSizeOpen(false); setCurrentPage(1); }} style={{ accentColor: "#A855F7" }} />
                                {n}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VehiclesPage() {
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [types, setTypes] = useState([]);
    const [vehicleType, setVehicleType] = useState("car");

    const [form, setForm] = useState({ user_id: "", color: "", active: true, plate: "", capacity: "", electrical: false, basket: false, type_id: "" });
    const [errors, setErrors] = useState({});
    const [hints, setHints] = useState({});
    const [submitError, setSubmitError] = useState("");

    const [carDeleteMode, setCarDeleteMode] = useState(false);
    const [selectedCars, setSelectedCars] = useState([]);
    const [showConfirmCars, setShowConfirmCars] = useState(false);
    const [carPage, setCarPage] = useState(1);
    const [carPageSize, setCarPageSize] = useState(10);

    const [bikeDeleteMode, setBikeDeleteMode] = useState(false);
    const [selectedBikes, setSelectedBikes] = useState([]);
    const [showConfirmBikes, setShowConfirmBikes] = useState(false);
    const [bikePage, setBikePage] = useState(1);
    const [bikePageSize, setBikePageSize] = useState(10);

    const [editingCar, setEditingCar] = useState(null);
    const [editCarErrors, setEditCarErrors] = useState({});
    const [editingBike, setEditingBike] = useState(null);

    async function loadAll() {
        try {
            const [u, c, b, t] = await Promise.all([getAllUsers(), getAllCars(), getAllBikes(), getAllTypes()]);
            setUsers(u); setCars(c); setBikes(b); setTypes(t);
        } catch (err) { console.error(err); }
    }

    useEffect(() => { loadAll(); }, []);
    useEffect(() => { setCarPage(1); }, [carPageSize]);
    useEffect(() => { setBikePage(1); }, [bikePageSize]);

    const carTotalPages = Math.max(1, Math.ceil(cars.length / carPageSize));
    const carSafePage = Math.min(carPage, carTotalPages);
    const pageCars = cars.slice((carSafePage - 1) * carPageSize, carSafePage * carPageSize);

    const bikeTotalPages = Math.max(1, Math.ceil(bikes.length / bikePageSize));
    const bikeSafePage = Math.min(bikePage, bikeTotalPages);
    const pageBikes = bikes.slice((bikeSafePage - 1) * bikePageSize, bikeSafePage * bikePageSize);

    function normalizePlate(value) { return value.replace(/\s/g, "").toUpperCase(); }

    function validatePlate(value) {
        const normalized = value.replace(/\s/g, "").toUpperCase();
        const regex = /^\d{4}[A-ZÑ]{3}$/;
        if (!normalized) return "La matrícula es obligatoria.";
        if (!regex.test(normalized)) return "Formato: 4 números y 3 letras (ej: 1234ABC).";
        return "";
    }

    function validateCapacity(value, required = false) {
        if (!value) return required ? "La capacidad es obligatoria si el vehículo es eléctrico." : "";
        const n = Number(value);
        if (n < 20 || n > 300) return "La capacidad debe estar entre 20 y 300 kWh.";
        return "";
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        if (name === "electrical" && !checked) {
            setForm(prev => ({ ...prev, electrical: false, capacity: "" }));
            setErrors(prev => ({ ...prev, capacity: "" }));
            return;
        }
        if (name === "plate") setErrors(prev => ({ ...prev, plate: validatePlate(value) }));
        if (name === "capacity") setErrors(prev => ({ ...prev, capacity: validateCapacity(value) }));
        setForm(prev => ({ ...prev, [name]: newValue }));
    }

    function handleFocus(field) {
        const map = { plate: "Formato: 1234ABC (sin espacio, sin importar mayúsculas)", capacity: "Capacidad entre 20 y 300 kWh.", color: "Color del vehículo (opcional)." };
        if (map[field]) setHints(prev => ({ ...prev, [field]: map[field] }));
    }

    function handleBlur(field) {
        setHints(prev => ({ ...prev, [field]: "" }));
        if (field === "plate") setErrors(prev => ({ ...prev, plate: validatePlate(form.plate) }));
        if (field === "capacity") setErrors(prev => ({ ...prev, capacity: validateCapacity(form.capacity) }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");
        if (!form.user_id) { setSubmitError("Selecciona un usuario."); return; }
        if (vehicleType === "car") {
            const plateError = validatePlate(form.plate);
            const capacityError = form.electrical ? validateCapacity(form.capacity, true) : "";
            if (plateError) { setErrors(prev => ({ ...prev, plate: plateError })); return; }
            if (capacityError) { setErrors(prev => ({ ...prev, capacity: capacityError })); return; }
            try {
                await createCar({ user_id: Number(form.user_id), color: form.color || null, active: form.active, plate: normalizePlate(form.plate), capacity: form.capacity ? Number(form.capacity) : null, electrical: form.electrical });
            } catch (err) { setSubmitError(err.message); return; }
        } else {
            try {
                await createBike({ user_id: Number(form.user_id), color: form.color || null, active: form.active, basket: form.basket, type_id: form.type_id ? Number(form.type_id) : null });
            } catch (err) { setSubmitError(err.message); return; }
        }
        setForm({ user_id: "", color: "", active: true, plate: "", capacity: "", electrical: false, basket: false, type_id: "" });
        setErrors({});
        loadAll();
    }

    async function handleSaveCar() {
        const plateError = validatePlate(editingCar.plate);
        const capacityError = editingCar.electrical ? validateCapacity(editingCar.capacity, true) : "";
        if (plateError || capacityError) { setEditCarErrors({ plate: plateError, capacity: capacityError }); return; }
        try {
            await updateCar(editingCar.id, { color: editingCar.color || null, active: editingCar.active, plate: normalizePlate(editingCar.plate), capacity: editingCar.capacity ? Number(editingCar.capacity) : null, electrical: editingCar.electrical });
            setEditingCar(null); setEditCarErrors({}); loadAll();
        } catch (err) { console.error(err); }
    }

    async function handleSaveBike() {
        try {
            await updateBike(editingBike.id, { color: editingBike.color || null, active: editingBike.active, basket: editingBike.basket, type_id: editingBike.type_id ? Number(editingBike.type_id) : null });
            setEditingBike(null); loadAll();
        } catch (err) { console.error(err); }
    }

    async function handleConfirmDeleteCars() {
        try { await deleteCars(selectedCars); setShowConfirmCars(false); setCarDeleteMode(false); setSelectedCars([]); loadAll(); }
        catch (err) { console.error(err); }
    }

    async function handleConfirmDeleteBikes() {
        try { await deleteBikes(selectedBikes); setShowConfirmBikes(false); setBikeDeleteMode(false); setSelectedBikes([]); loadAll(); }
        catch (err) { console.error(err); }
    }

    function handleCancelDeleteCars() { setShowConfirmCars(false); setCarDeleteMode(false); setSelectedCars([]); }
    function handleCancelDeleteBikes() { setShowConfirmBikes(false); setBikeDeleteMode(false); setSelectedBikes([]); }
    function toggleCar(id, checked) { setSelectedCars(prev => checked ? [...prev, id] : prev.filter(x => x !== id)); }
    function toggleBike(id, checked) { setSelectedBikes(prev => checked ? [...prev, id] : prev.filter(x => x !== id)); }
    const getUserName = (id) => users.find(u => u.id === id)?.name ?? id;

    return (
        <>
            {/* Formulario añadir */}
            <div className="card">
                <h2 className="card-title">Añadir vehículo</h2>
                <div className="user-form">
                    <form onSubmit={handleSubmit}>
                        <label className="checkbox" style={{ gap: 16 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#F0F0FF" }}>
                                <input type="radio" name="vtype" checked={vehicleType === "car"} onChange={() => setVehicleType("car")} style={{ accentColor: "#A855F7" }} />
                                Coche
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#F0F0FF" }}>
                                <input type="radio" name="vtype" checked={vehicleType === "bike"} onChange={() => setVehicleType("bike")} style={{ accentColor: "#A855F7" }} />
                                Bicicleta
                            </label>
                        </label>
                        <div className="field-wrapper">
                            <select name="user_id" value={form.user_id} onChange={handleChange} required style={{ ...selectStyle, color: form.user_id ? "#F0F0FF" : "#9B9BCC" }}>
                                <option value="">Usuario</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div className="field-wrapper">
                            <input name="color" placeholder="Color" value={form.color} onChange={handleChange} onFocus={() => handleFocus("color")} onBlur={() => handleBlur("color")} style={inputStyle} />
                            <FieldHint hint={hints.color} error={errors.color} />
                        </div>
                        <label className="checkbox">
                            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                            Activo
                        </label>
                        {vehicleType === "car" && (<>
                            <div className="field-wrapper" style={{ flex: "0 0 130px" }}>
                                <input name="plate" placeholder="Matrícula" value={form.plate} onChange={handleChange} onFocus={() => handleFocus("plate")} onBlur={() => handleBlur("plate")} style={errors.plate ? inputErrorStyle : inputStyle} />
                                <FieldHint hint={hints.plate} error={errors.plate} />
                            </div>
                            <label className="checkbox">
                                <input type="checkbox" name="electrical" checked={form.electrical} onChange={handleChange} />
                                Eléctrico
                            </label>
                            <div className="field-wrapper" style={{ flex: "0 0 160px" }}>
                                <input name="capacity" type="number" placeholder="Capacidad (kWh)" min={20} max={300} value={form.capacity} onChange={handleChange} onFocus={() => handleFocus("capacity")} onBlur={() => handleBlur("capacity")} disabled={!form.electrical}
                                    style={{ ...inputStyle, opacity: form.electrical ? 1 : 0.35, cursor: form.electrical ? "text" : "not-allowed" }} />
                                <FieldHint hint={hints.capacity} error={errors.capacity} />
                            </div>
                        </>)}
                        {vehicleType === "bike" && (<>
                            <label className="checkbox">
                                <input type="checkbox" name="basket" checked={form.basket} onChange={handleChange} />
                                Cesta
                            </label>
                            <div className="field-wrapper">
                                <select name="type_id" value={form.type_id} onChange={handleChange} style={{ ...selectStyle, color: form.type_id ? "#F0F0FF" : "#9B9BCC" }}>
                                    <option value="">Tipo de bici</option>
                                    {types.map(t => <option key={t.id} value={t.id}>{t.description}</option>)}
                                </select>
                            </div>
                        </>)}
                        {submitError && <span style={{ flex: "0 0 100%", color: "#FF2D78", fontSize: "0.85rem" }}>{submitError}</span>}
                        <button type="submit">Añadir</button>
                    </form>
                </div>
            </div>

            {/* Tabla coches */}
            <div className="card">
                <div className="list-header">
                    <h2 className="card-title">Coches ({cars.length})</h2>
                    <div style={{ display: "flex", gap: 8 }}>
                        {carDeleteMode && <button className="secondary" onClick={handleCancelDeleteCars}>Cancelar</button>}
                        <button className="danger" disabled={carDeleteMode && selectedCars.length === 0}
                            onClick={() => { if (!carDeleteMode) setCarDeleteMode(true); else setShowConfirmCars(true); }}>
                            Eliminar
                        </button>
                    </div>
                </div>
                <div className="user-list-scroll">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {carDeleteMode && <th style={thStyle}><input type="checkbox" checked={cars.length > 0 && cars.every(c => selectedCars.includes(c.id))} onChange={(e) => setSelectedCars(e.target.checked ? cars.map(c => c.id) : [])} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /></th>}
                                {["Usuario", "Matrícula", "Color", "Capacidad (kWh)", "Eléctrico", "Activo", ""].map(h => <th key={h} style={thStyle}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {cars.length === 0 ? (
                                <tr><td colSpan={carDeleteMode ? 8 : 7} style={{ color: "#9B9BCC", textAlign: "center", padding: 20 }}>No hay coches</td></tr>
                            ) : pageCars.map(c => {
                                const isEditing = editingCar?.id === c.id;
                                return (
                                    <tr key={c.id}>
                                        {carDeleteMode && <td style={tdStyle}><input type="checkbox" checked={selectedCars.includes(c.id)} onChange={(e) => toggleCar(c.id, e.target.checked)} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /></td>}
                                        <td style={tdStyle}>{getUserName(c.user_id)}</td>
                                        <td style={tdStyle}>
                                            {isEditing ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                    <input style={editCarErrors.plate ? editInputErrorStyle : editInputStyle} value={editingCar.plate} onChange={e => { setEditingCar(prev => ({ ...prev, plate: e.target.value })); setEditCarErrors(prev => ({ ...prev, plate: validatePlate(e.target.value) })); }} />
                                                    {editCarErrors.plate && <span style={{ fontSize: "0.72rem", color: "#FF2D78" }}>{editCarErrors.plate}</span>}
                                                </div>
                                            ) : c.plate}
                                        </td>
                                        <td style={tdStyle}>
                                            {isEditing ? <input style={editInputStyle} value={editingCar.color ?? ""} onChange={e => setEditingCar(prev => ({ ...prev, color: e.target.value }))} /> : (c.color ?? "—")}
                                        </td>
                                        <td style={tdStyle}>
                                            {isEditing ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                    <input style={{ ...editInputStyle, opacity: editingCar.electrical ? 1 : 0.35 }} type="number" min={20} max={300} value={editingCar.capacity ?? ""} disabled={!editingCar.electrical}
                                                        onChange={e => { setEditingCar(prev => ({ ...prev, capacity: e.target.value })); setEditCarErrors(prev => ({ ...prev, capacity: validateCapacity(e.target.value, editingCar.electrical) })); }} />
                                                    {editCarErrors.capacity && <span style={{ fontSize: "0.72rem", color: "#FF2D78" }}>{editCarErrors.capacity}</span>}
                                                </div>
                                            ) : (c.capacity ?? "—")}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            {isEditing ? <input type="checkbox" checked={editingCar.electrical} onChange={e => setEditingCar(prev => ({ ...prev, electrical: e.target.checked, capacity: e.target.checked ? prev.capacity : "" }))} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /> : <Check val={c.electrical} />}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            {isEditing ? <input type="checkbox" checked={editingCar.active} onChange={e => setEditingCar(prev => ({ ...prev, active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /> : <Check val={c.active} />}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "right" }}>
                                            {isEditing ? (
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                                    <button style={saveBtn} onClick={handleSaveCar}>Guardar</button>
                                                    <button style={cancelBtn} onClick={() => { setEditingCar(null); setEditCarErrors({}); }}>Cancelar</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: "#A855F7", fontSize: "0.8rem", cursor: "pointer" }} onClick={() => setEditingCar({ ...c })}>✎ Editar</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <PaginationBar items={cars.length} pageSize={carPageSize} setPageSize={setCarPageSize} currentPage={carSafePage} setCurrentPage={setCarPage} />
                {showConfirmCars && <ConfirmDeleteModal onConfirm={handleConfirmDeleteCars} onCancel={handleCancelDeleteCars} />}
            </div>

            {/* Tabla bicis */}
            <div className="card">
                <div className="list-header">
                    <h2 className="card-title">Bicicletas ({bikes.length})</h2>
                    <div style={{ display: "flex", gap: 8 }}>
                        {bikeDeleteMode && <button className="secondary" onClick={handleCancelDeleteBikes}>Cancelar</button>}
                        <button className="danger" disabled={bikeDeleteMode && selectedBikes.length === 0}
                            onClick={() => { if (!bikeDeleteMode) setBikeDeleteMode(true); else setShowConfirmBikes(true); }}>
                            Eliminar
                        </button>
                    </div>
                </div>
                <div className="user-list-scroll">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {bikeDeleteMode && <th style={thStyle}><input type="checkbox" checked={bikes.length > 0 && bikes.every(b => selectedBikes.includes(b.id))} onChange={(e) => setSelectedBikes(e.target.checked ? bikes.map(b => b.id) : [])} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /></th>}
                                {["Usuario", "Color", "Cesta", "Tipo", "Activo", ""].map(h => <th key={h} style={thStyle}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {bikes.length === 0 ? (
                                <tr><td colSpan={bikeDeleteMode ? 7 : 6} style={{ color: "#9B9BCC", textAlign: "center", padding: 20 }}>No hay bicicletas</td></tr>
                            ) : pageBikes.map(b => {
                                const isEditing = editingBike?.id === b.id;
                                return (
                                    <tr key={b.id}>
                                        {bikeDeleteMode && <td style={tdStyle}><input type="checkbox" checked={selectedBikes.includes(b.id)} onChange={(e) => toggleBike(b.id, e.target.checked)} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /></td>}
                                        <td style={tdStyle}>{getUserName(b.user_id)}</td>
                                        <td style={tdStyle}>
                                            {isEditing ? <input style={editInputStyle} value={editingBike.color ?? ""} onChange={e => setEditingBike(prev => ({ ...prev, color: e.target.value }))} /> : (b.color ?? "—")}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            {isEditing ? <input type="checkbox" checked={editingBike.basket} onChange={e => setEditingBike(prev => ({ ...prev, basket: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /> : <Check val={b.basket} />}
                                        </td>
                                        <td style={tdStyle}>
                                            {isEditing ? (
                                                <select value={editingBike.type_id ?? ""} onChange={e => setEditingBike(prev => ({ ...prev, type_id: e.target.value || null }))} style={{ ...editInputStyle, height: 30 }}>
                                                    <option value="">Sin tipo</option>
                                                    {types.map(t => <option key={t.id} value={t.id}>{t.description}</option>)}
                                                </select>
                                            ) : (types.find(t => t.id === b.type_id)?.description ?? "—")}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            {isEditing ? <input type="checkbox" checked={editingBike.active} onChange={e => setEditingBike(prev => ({ ...prev, active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "#A855F7" }} /> : <Check val={b.active} />}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "right" }}>
                                            {isEditing ? (
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                                    <button style={saveBtn} onClick={handleSaveBike}>Guardar</button>
                                                    <button style={cancelBtn} onClick={() => setEditingBike(null)}>Cancelar</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: "#A855F7", fontSize: "0.8rem", cursor: "pointer" }} onClick={() => setEditingBike({ ...b })}>✎ Editar</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <PaginationBar items={bikes.length} pageSize={bikePageSize} setPageSize={setBikePageSize} currentPage={bikeSafePage} setCurrentPage={setBikePage} />
                {showConfirmBikes && <ConfirmDeleteModal onConfirm={handleConfirmDeleteBikes} onCancel={handleCancelDeleteBikes} />}
            </div>
        </>
    );
}
