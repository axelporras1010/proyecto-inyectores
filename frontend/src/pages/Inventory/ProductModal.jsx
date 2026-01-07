import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";

export default function ProductModal({
  onClose,
  onSuccess,
  productData = null,
}) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    actual_stock: "",
    min_stock: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos si estamos en modo EDICIÓN
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        actual_stock: productData.actual_stock || "",
        min_stock: productData.min_stock || "",
      });
    }
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (productData) {
        // MODO EDICIÓN
        await api.put(`/products/${productData.id}`, formData);
      } else {
        // MODO CREACIÓN
        await api.post("/products", formData);
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
          <h3>{productData ? "🛠️ Editar Inyector" : "📦 Nuevo Inyector"}</h3>
          <button onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label>Nombre del Producto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej. Inyector Bosch 0445"
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

          <div>
            {/* Precio */}
            <div>
              <label>Precio ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            {/* Stock Mínimo */}
            <div>
              <label>Stock Mínimo</label>
              <input
                type="number"
                required
                value={formData.min_stock}
                onChange={(e) =>
                  setFormData({ ...formData, min_stock: e.target.value })
                }
              />
            </div>
          </div>

          {/* Stock Actual */}
          <div>
            <label>Stock Actual</label>
            <input
              type="number"
              required
              value={formData.actual_stock}
              onChange={(e) =>
                setFormData({ ...formData, actual_stock: e.target.value })
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
                : productData
                ? "Actualizar Cambios"
                : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
