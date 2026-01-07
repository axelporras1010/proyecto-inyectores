import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ProductModal from "./ProductModal";
import { Trash2, Edit } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADOS PARA EL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.data);
    } catch (err) {
      console.error("Error cargando productos", err);
      setError(
        err.response?.status === 401
          ? "Sesión expirada"
          : "Error al cargar inventario"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert("No se pudo eliminar el producto" + err.message);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando inventario...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Inventario de Productos</h2>
        <button onClick={openCreateModal}>+ Nuevo Producto</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock Actual</th>
              <th>Stock Mín.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.actual_stock}</td>
                <td>{product.min_stock}</td>
                <td>
                  {product.actual_stock <= product.min_stock ? (
                    <span>Bajo Stock</span>
                  ) : (
                    <span>Disponible</span>
                  )}
                </td>
                <td>
                  <div>
                    <button
                      onClick={() => openEditModal(product)}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
        {products.length === 0 && <div>No hay productos en el inventario.</div>}
      </div>

      {isModalOpen && (
        <ProductModal
          productData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
