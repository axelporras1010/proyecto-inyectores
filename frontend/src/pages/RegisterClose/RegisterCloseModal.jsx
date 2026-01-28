import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";

export default function RegisterCloseModal({ onClose, onSuccess, registerCloseData = null }) {
  const [formData, setFormData] = useState({
    date: "",
    COP_amount: "",
    USD_amount: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (registerCloseData) {
      setFormData({
        date: registerCloseData.date || "",
        COP_amount: registerCloseData.COP_amount ?? "",
        USD_amount: registerCloseData.USD_amount ?? "",
        description: registerCloseData.description || "",
      });
    }
  }, [registerCloseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      date: formData.date,
      COP_amount: Number(formData.COP_amount || 0),
      USD_amount: Number(formData.USD_amount || 0),
      description: formData.description || null,
    };

    try {
      if (registerCloseData?.id) {
        await api.put(`/registerClose/${registerCloseData.id}`, payload);
      } else {
        await api.post(`/registerClose`, payload);
      }
      onSuccess?.();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Error al procesar la solicitud");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{registerCloseData ? "✏️ Editar Cierre de caja" : "🧾 Nuevo Cierre de caja"}</h3>
          <button onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <label>Fecha</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={saving}
            />
            {errors.date && <p className="error">{errors.date[0]}</p>}
          </div>

          <div>
            <label>Valor COP</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.COP_amount}
              onChange={(e) => setFormData({ ...formData, COP_amount: e.target.value })}
              disabled={saving}
            />
            {errors.COP_amount && <p className="error">{errors.COP_amount[0]}</p>}
          </div>

          <div>
            <label>Valor USD</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.USD_amount}
              onChange={(e) => setFormData({ ...formData, USD_amount: e.target.value })}
              disabled={saving}
            />
            {errors.USD_amount && <p className="error">{errors.USD_amount[0]}</p>}
          </div>

          <div>
            <label>Descripción (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={saving}
            />
            {errors.description && <p className="error">{errors.description[0]}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" disabled={saving}>{saving ? "Procesando..." : registerCloseData ? "Actualizar" : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
