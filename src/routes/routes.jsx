import config from "../config";
import AdminPages from "../Features/admin/AdminPages/AdminPage";
import BannerManagement from "../Features/admin/AdminPages/Banner/BannerManagement";
import FromAddCategory from "../Features/admin/AdminPages/Category/FormAddCategory";
import FormUpdateCategory from "../Features/admin/AdminPages/Category/FormUpdateCategoy";
import CategoryManagement from "../Features/admin/AdminPages/Category/ManagementCategory";
import FormAddProduct from "../Features/admin/AdminPages/Products/FormAddProduct";
import FormUpdateProduct from "../Features/admin/AdminPages/Products/FormUpdateProduct";
import ProductManagement from "../Features/admin/AdminPages/Products/ManagementProducts";
import UserManagement from "../Features/admin/AdminPages/User/UserManagement";
import LoginPage from "../Features/auth/LoginPage";
import Homepage from "../Features/user/pages/UserPages/Homepage";

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