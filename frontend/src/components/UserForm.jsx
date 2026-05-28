import "./UserForm.css";
import { useState } from "react";
import { createUser } from "../api/users";


export default function UserForm({ users, onUserCreated }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        active: false
    });

    const [errors, setErrors] = useState({});
    const [hints, setHints] = useState({});

    function cleanName(value) {
        let cleaned = value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "");
        cleaned = cleaned.replace(/\s+/g, " ");
        return cleaned;
    }

    function validateName(value) {
        const trimmed = value.trim();
        const parts = trimmed.split(" ").filter(Boolean);
        if (parts.length < 2) return "Introduce nombre y apellido separados por un espacio.";
        return "";
    }

    function validatePhone(value) {
        if (value.length > 0 && value.length !== 9) return "El teléfono debe tener exactamente 9 dígitos.";
        return "";
    }

    function generateEmail(fullName) {
        const parts = fullName.trim().toLowerCase().split(" ").filter(Boolean);
        if (parts.length < 2) return "";
        const name = parts[0];
        const surname = parts[1];
        const base = `${name}.${surname}`;
        const existing = users.map((u) => u.email).filter((e) => e.startsWith(base));
        const nextNumber = existing.length === 0 ? 1 : existing.length + 1;
        const suffix = String(nextNumber).padStart(2, "0");
        return `${base}${suffix}@ejemplo.com`;
    }

    function handleChange(event) {
        const { name, value } = event.target;

        if (name === "name") {
            const cleaned = cleanName(value);
            const error = validateName(cleaned);
            setErrors((prev) => ({ ...prev, name: error }));
            setForm((prev) => ({
                ...prev,
                name: cleaned,
                email: generateEmail(cleaned)
            }));
            return;
        }

        if (name === "phone") {
            const onlyDigits = value.replace(/\D/g, "").slice(0, 9);
            const error = validatePhone(onlyDigits);
            setErrors((prev) => ({ ...prev, phone: error }));
            setForm((prev) => ({ ...prev, phone: onlyDigits }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleFocus(field) {
        if (field === "name") {
            setHints((prev) => ({ ...prev, name: "Introduce nombre y apellido. Solo letras, sin caracteres especiales." }));
        }
        if (field === "phone") {
            setHints((prev) => ({ ...prev, phone: "El teléfono debe tener exactamente 9 dígitos." }));
        }
    }

    function handleBlur(field) {
        setHints((prev) => ({ ...prev, [field]: "" }));
        if (field === "name") {
            const error = validateName(form.name);
            setErrors((prev) => ({ ...prev, name: error }));
        }
        if (field === "phone") {
            const error = validatePhone(form.phone);
            setErrors((prev) => ({ ...prev, phone: error }));
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const nameError = validateName(form.name);
        const phoneError = validatePhone(form.phone);
        const ageNumber = Number(form.age);

        if (nameError || phoneError) {
            setErrors({ name: nameError, phone: phoneError });
            return;
        }

        if (ageNumber < 16 || ageNumber > 100) {
            alert("La edad debe estar entre 16 y 100 años");
            return;
        }

        try {
            await createUser({
                ...form,
                name: form.name.trim().replace(/\s+/g, " "),
                age: form.age ? Number(form.age) : null,
            });
            setForm({ name: "", email: "", phone: "", age: "", active: false });
            setErrors({});
            onUserCreated();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="card">
            <h2 className="card-title">Crear usuario</h2>
            <div className="user-form">
                <form onSubmit={handleSubmit}>
                    <div className="field-wrapper">
                        <input
                            name="name"
                            placeholder="Nombre"
                            value={form.name}
                            onChange={handleChange}
                            onFocus={() => handleFocus("name")}
                            onBlur={() => handleBlur("name")}
                            className={errors.name ? "input-error" : ""}
                            required
                        />
                        {hints.name && !errors.name && <span className="field-hint">{hints.name}</span>}
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="field-wrapper">
                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            readOnly
                        />
                    </div>

                    <div className="field-wrapper">
                        <input
                            name="phone"
                            placeholder="Teléfono"
                            value={form.phone}
                            onChange={handleChange}
                            onFocus={() => handleFocus("phone")}
                            onBlur={() => handleBlur("phone")}
                            className={errors.phone ? "input-error" : ""}
                            maxLength={9}
                        />
                        {hints.phone && !errors.phone && <span className="field-hint">{hints.phone}</span>}
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    <div className="field-wrapper field-wrapper--small">
                        <input
                            name="age"
                            type="number"
                            placeholder="Edad"
                            value={form.age}
                            min={16}
                            max={100}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                        />
                        ¿Posee vehículo?
                    </label>

                    <button type="submit">Crear</button>
                </form>
            </div>
        </div>
    );
}