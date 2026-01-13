import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ClientModal from "./ClientModal";
import {Trash2, Edit } from "lucide-react";

export default function ClientesPage(){
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(null);
    const [selectedClient, setSelectedClient ] = useState(null);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/clients");
            setClients(data.data);
        } catch (err) {
            console.error("Error cargando productos", err);
            setError(
                err.response?.status === 401
                ? "Sesion expirada"
                : "Error al cargar el inventario"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Estas seguro de eliminar este cliente?")) {
            try {
                await api.delete(`/clients/${id}`);
                setClients(clients.filter((c) => c.id !== id));
            } catch (err) {
                alert("No se pudo eliminar el producto" + err.message);
            }
        }
    };

    const openCreateModal = () => {
        setSelectedClient(null);
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    if (loading) return <div>Cargando inventario...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div>
                <h2>Catalogo de Clientes</h2>
                <button onClick={openCreateModal}>+ Nuevo Cliente</button>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Telefono</th>
                            <th>Cedula</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.name}</td>
                                <td>{client.phone}</td>
                                <td>{client.cedula}</td>
                                <td>
                                    <div>
                                        <button
                                            onClick={() => openEditModal(client)}
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && <div>No hay clientes </div>}
            </div>

            {isModalOpen && (
                <ClientModal
                    clientData={selectedClient}
                    onClose = {() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchClients();
                    }} 
                />
            )}
        </div>
    );
}