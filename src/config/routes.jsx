const routes = {
    login: '/login',
    register: '/register',
    admin: '/admin',
    //home page user
    homepage: '/sport.com',
    //product detaild
    productdetailt :'/sport.com/product/:tenmathang',
    //product detaild list by category
    productdetaillist :'/sport.com/category/:tenmathang',
    //list product by category
    list : '/sport.com/category/:tendanhmuc',
    //cart
    cart: '/sport.com/cart',
    //checkout
    checkout: '/sport.com/checkout',
    ///not found
    notfound : '/sport.com/notfound',
    //search product
    search: '/sport.com/search',

    //order
    order: '/admin/order',
    
   //category routes
    category: '/admin/category',
    //category add
    addCategory: '/admin/category/add',
    //category update
    updateCategory:'/admin/category/update/:id',
    //banner routes
    banner: '/admin/banner',
    //product reoutes
    product: '/admin/product',
    addProduct: '/admin/products/add',
    updateproducts: '/admin/products/update/:productId',
    //manager user
    usermanager : '/admin/usermanager',

  };
  
  export default routes;
  