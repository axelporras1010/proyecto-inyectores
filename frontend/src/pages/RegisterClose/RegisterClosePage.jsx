import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import RegisterCloseModal from "./RegisterCloseModal";
import { Trash2, Edit } from "lucide-react";

export default function RegisterClosePage() {
  const [registerCloses, setRegisterCloses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegisterClose, setSelectedRegisterClose] = useState(null);

  const fetchRegisterCloses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/registerClose");
      setRegisterCloses(data.data ?? data ?? []);
    } catch (err) {
      console.error("Error cargando cierres de caja", err);
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar cierres de caja");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRegisterCloses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cierre de caja?")) return;
    try {
      await api.delete(`/registerClose/${id}`);
      setRegisterCloses((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("No se pudo eliminar: " + (err.message || err));
    }
  };

  const openCreateModal = () => {
    setSelectedRegisterClose(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rc) => {
    setSelectedRegisterClose(rc);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando cierres de caja...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Listado de Cierres de caja</h2>
        <button onClick={openCreateModal}>+ Nuevo Cierre</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>COP</th>
              <th>USD</th>
              <th>Total</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registerCloses.map((rc) => (
              <tr key={rc.id}>
                <td>{rc.date}</td>
                <td>{rc.COP_amount}</td>
                <td>{rc.USD_amount}</td>
                <td>{rc.final_amount}</td>
                <td>{rc.description}</td>
                <td>
                  <div>
                    <button onClick={() => openEditModal(rc)} title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(rc.id)} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registerCloses.length === 0 && <div>No hay cierres de caja.</div>}
      </div>

      {isModalOpen && (
        <RegisterCloseModal
          registerCloseData={selectedRegisterClose}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchRegisterCloses();
          }}
        />
      )}
    </div>
  );
}
