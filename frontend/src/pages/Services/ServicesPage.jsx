import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ServiceModal from "./ServiceModal";
import { Trash2, Edit } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services");
      setServices(data.data ?? data ?? []);
    } catch (err) {
      console.error("Error cargando servicios", err);
      setError(
        err.response?.status === 401 ? "Sesion expirada" : "Error al cargar los servicios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("No se pudo eliminar el servicio: " + (err.message || err));
    }
  };

  const openCreateModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando servicios...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Catálogo de Servicios</h2>
        <button onClick={openCreateModal}>+ Nuevo Servicio</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.base_price}</td>
                <td>{service.description}</td>
                <td>
                  <div>
                    <button onClick={() => openEditModal(service)} title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && <div>No hay servicios</div>}
      </div>

      {isModalOpen && (
        <ServiceModal
          serviceData={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchServices();
          }}
        />
      )}
    </div>
  );
}