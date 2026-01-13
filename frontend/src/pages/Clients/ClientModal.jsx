import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";

export default function ClientModal({
    onClose,
    onSuccess,
    clientData = null,
}) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        cedula: "",
    });
    
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (clientData) {
            setFormData({
                name: clientData.name || "",
                phone: clientData.phone || "",
                cedula: clientData.cedula || "",
            });
        }
    }, [clientData] );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            if(clientData) {
                await api.put(`/clients/${clientData.id}`, formData);
            } else {
                await api.post("/clients", formData);
            }
            onSuccess();
        } catch (err) {
            if(err.response?.status === 422) {
                setErrors(err.response.data.errros);
            } else {
                alert(err.response?.data?.message || "Error al procesar la solicitud");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div>
                {/* Cabecera dinamica */}
                <div>
                    <h3>{clientData ? "📝 Editar Cliente" : "👤 Nuevo Cliente"}</h3>
                    <button onClick={onClose}>
                        <span>&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* NOMBRE */}
                    <div>
                        <label>Nombre del Cliente</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => 
                                setFormData({...formData, name: e.target.value})
                            }
                            placeholder="Ej. Carlos Ramirez"
                        />
                        {errors.name && <p>{errors.name[0]}</p>}
                    </div>

                    <div>
                        {/* Telefono */}
                        <div>
                            <label>Telefono</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phone}
                                onChange={(e) => 
                                    setFormData({ ...formData, phone: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    <div>
                        {/* Cedula */}
                        <div>
                            <label>Cedula</label>
                            <input 
                                type="text" 
                                required
                                value={formData.cedula}
                                onChange={(e) => 
                                    setFormData({ ...formData, cedula: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    {/* Botones de accion */}
                    <div>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Procesando..."
                                : clientData
                                ? "Actualizar Cambios"
                                : "Guardar Cliente"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
