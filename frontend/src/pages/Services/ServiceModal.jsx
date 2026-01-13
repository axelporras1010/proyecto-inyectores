import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";

export default function ServiceModal({
  onClose,
  onSuccess,
  serviceData = null,
}) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos si estamos en modo EDICIÓN
  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        base_price: serviceData.price || "",
      });
    }
  }, [serviceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (serviceData) {
        // MODO EDICIÓN
        await api.put(`/services/${serviceData.id}`, formData);
      } else {
        // MODO CREACIÓN
        await api.post("/services", formData);
      }
      onSuccess(); // Refresca la tabla y cierra el modal
    } catch (err) {
      if (err.response?.status === 422) {
        // Capturar validaciones de Laravel
        setErrors(err.response.data.errors);
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
        {/* Cabecera dinámica */}
        <div>
          <h3>{serviceData ? "🛠️ Editar Servicio" : "📦 Nuevo Servicio"}</h3>
          <button onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label>Nombre del Servicio</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Limpieza de inyectores"
            />
            {errors.name && <p>{errors.name[0]}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label>Descripción (Opcional)</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detalles adicionales..."
            />
          </div>

          
            {/* Precio */}
            <div>
              <label>Precio ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, base_price: e.target.value })
                }
              />
            </div>
           
          {/* Botones de acción */}
          <div>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}>
              {saving
                ? "Procesando..."
                : serviceData
                ? "Actualizar Cambios"
                : "Guardar Servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
