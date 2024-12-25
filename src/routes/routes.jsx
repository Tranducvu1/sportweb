import config from "../config";
import AdminPages from "../Pages/admin/AdminPages/AdminPage";
import ProductManagement from "../Pages/admin/AdminPages/Products/ManagementProducts";
import LoginPage from "../Pages/auth/LoginPage";

const publicRoutes = [
    { path : config.routes.login, component : LoginPage },
    { path : config.routes.register },
    { path : config.routes.admin, component : AdminPages },
    { path : config.routes.product, component : ProductManagement },
    { path : config.routes.home }
] 

export { publicRoutes };