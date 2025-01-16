import config from "../config";
import AdminPages from "../Pages/admin/AdminPages/AdminPage";
import BannerManagement from "../Pages/admin/AdminPages/Banner/BannerManagement";
import FromAddCategory from "../Pages/admin/AdminPages/Category/FormAddCategory";
import FormUpdateCategory from "../Pages/admin/AdminPages/Category/FormUpdateCategoy";
import CategoryManagement from "../Pages/admin/AdminPages/Category/ManagementCategory";
import FormAddProduct from "../Pages/admin/AdminPages/Products/FormAddProduct";
import FormUpdateProduct from "../Pages/admin/AdminPages/Products/FormUpdateProduct";
import ProductManagement from "../Pages/admin/AdminPages/Products/ManagementProducts";
import UserManagement from "../Pages/admin/AdminPages/User/UserManagement";
import LoginPage from "../Pages/auth/LoginPage";
import Homepage from "../Pages/UserPages/Homepage";

const publicRoutes = [
    { path : config.routes.login, component : LoginPage },
    { path : config.routes.register },
    { path : config.routes.admin, component : AdminPages },
    { path : config.routes.product, component : ProductManagement },
    { path : config.routes.home },
    {path: config.routes.category,component:CategoryManagement},
    {path: config.routes.banner, component: BannerManagement},
    {path: config.routes.addProduct,component:FormAddProduct},
    {path:config.routes.updateproducts,component:FormUpdateProduct},
    {path:config.routes.addCategory,component:FromAddCategory},
    {path:config.routes.updateCategory,component:FormUpdateCategory},
    {path : config.routes.usermanager,component:UserManagement},
    {path:config.routes.homepage,component:Homepage}
    
] 

export { publicRoutes };