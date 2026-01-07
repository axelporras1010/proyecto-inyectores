import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  Wrench,
  FileText,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Limpia estado y localStorage
    navigate("/login", { replace: true }); // replace: true evita que el usuario pueda volver atrás
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { name: "Inventario", path: "/products", icon: <Package size={20} /> },
    { name: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    { name: "Facturación", path: "/invoices", icon: <FileText size={20} /> },
  ];

  return (
    <div>
      {/* SIDEBAR LATERAL */}
      <aside>
        <div>
          <h1>
            INJECT<span>PRO</span>
          </h1>
        </div>

        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* PERFIL DE USUARIO Y LOGOUT */}
        <div>
          <div>
            <div>
              <UserCircle size={20} />
            </div>
            <div>
              <span>{user?.name}</span>
              <span>{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div>
        {/* HEADER SUPERIOR */}
        <header>
          <div>
            <div></div>
            <span>Sistema Activo</span>
          </div>

          <div>
            <div>
              <p>Rol Actual</p>
              <p>Administrador</p>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO VARIABLE */}
        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
