import "./UserForm.css";
import { useState } from "react";
import { createUser } from "../api/users";


export default function UserForm({users, onUserCreated}){
    const [form, setForm] = useState({
        name:"",
        email:"",
        phone:"",
        age:"",
        active: false
    });

    function generateEmail(fullName) {
        const parts = fullName.trim().toLowerCase().split(" ");

        if(parts.length < 2) return "";

        const name = parts[0];
        const surname = parts[1]
        const base = `${name}.${surname}`;
        const existing = users.map((u) => u.email).filter((e) => e.startsWith(base));
        const nextNumber = existing.length === 0 ? 1 : existing.length + 1;
        const suffix = String(nextNumber).padStart(2, "0");
        return `${base}${suffix}@ejemplo.com`
    }

    function handleChange(event) {
        const { name,value } = event.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value};
            if(name === "name") {
                updated.email = generateEmail(value);
            }
            return updated;
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const ageNumber = Number(form.age);
        if(ageNumber < 16 || ageNumber > 100) {
            alert("La edad debe estar entre 16 y 100 años")
            return;
        }
    
        try {
        await createUser({
            ...form,
            age: form.age ? Number(form.age) : null,
        });
    
        setForm({ name: "", email: "", phone: "", age: "", active: false});
    
        onUserCreated(); // ← vuelve a cargar usuarios
        } catch (err) {
        console.error(err);
        }

        const emailRegex = /^[a-z]+\.[a-z]+\d{2}@ejemplo\.com$/;
        if(!emailRegex.test(form.email)) {
            alert("El email generado no es válido");
            return;
        }
    }
  
    return(
        <div className="card">        
            <h2 className="card-title">Crear usuario</h2>
            <div className="user-form">    
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        readOnly
                    />
                    <input
                        name="phone"
                        placeholder="Teléfono"
                        value={form.phone}
                        onChange={handleChange}
                    />
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
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={(e) => setForm((prev) => ({...prev, active: e.target.checked})) }
                        />
                        ¿Posee vehículo?
                    </label>

                    <button type="submit">Crear</button>
                </form>
            </div>
        </div>
    );
}