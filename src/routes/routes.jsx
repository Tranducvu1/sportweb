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
import SearchResults from "../Features/user/pages/SearchResult/SearchResults";
import Cart from "../Features/user/pages/Cart/Cart";
import Checkout from "../Features/user/pages/Checkout/Checkout";
import NotFound from "../Features/user/pages/NotFound/NotFound";
import ProductDetaild from "../Features/user/pages/ProductDetaild/ProductDetaild";
import Homepage from "../Features/user/pages/UserPages/Homepage";
import ListProduct from "../Features/user/pages/ListProductbyCategory/ListProduct";
import OrderManagement from "../Features/admin/AdminPages/Order/OrderManagement";

const publicRoutes = [
    { path : config.routes.login, component : LoginPage },
    { path : config.routes.register },
    { path : config.routes.admin, component : AdminPages },
    {path: config.routes.productdetailt,component:ProductDetaild},
    {path:config.routes.cart,component:Cart},
    {path:config.routes.checkout,component:Checkout},
    {path:config.routes.notfound,component:NotFound},
    {path:config.routes.homepage,component:Homepage},
    {path:config.routes.search,component:SearchResults},
    {path:config.routes.list,component:ListProduct},
    { path : config.routes.product, component : ProductManagement },
    {path: config.routes.category,component:CategoryManagement},
    {path: config.routes.banner, component: BannerManagement},
    {path: config.routes.addProduct,component:FormAddProduct},
    {path:config.routes.updateproducts,component:FormUpdateProduct},
    {path:config.routes.addCategory,component:FromAddCategory},
    {path:config.routes.updateCategory,component:FormUpdateCategory},
    {path : config.routes.usermanager,component:UserManagement},
    {path:config.routes.order,component:OrderManagement},

    
] 

export { publicRoutes };