import React, { useState, useEffect } from 'react';
import { get } from '../../../../utils/httpRequest';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import BannerCarousel from '../../components/Header/Banner/BannerCarousel';
import SectionMale from './SectionMale/SectionMale';
import SectionFemale from './SectionFemale/SectionFemale';
import SectionNew from './SectionNew/SectionNew';
import SectionHot from './SectionHot/SectionHot';
import './index.css';
import '../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../../../css general/css/skinc164.css';
import '../../../../css general/css/font-awesome.min5e1f.css';
import '../../../../css general/tp/T0194/css/style1bce.css';
import '../../../../css general/tp/T0194/css/responsive1bce.css';
import '../../../../css general/tp/T0194/css/style_fashion1bce.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../css general/tp/T0194/css/base1bce.css';
import '../../../../css general/tp/T0194/css/stores/430171bce.css';
import '../../../../css general/tp/T0194/css/jqui1bce.css';
import '../../../../css general/tp/T0194/css/style1bce.css';
import '../../../../css general/tp/T0194/css/style_fashion1bce.css';
import '../../../../css general/tp/T0194/css/responsive1bce.css';
import '../../../../css general/tp/T0194/css/stores/430171bce.css';
// import '../client/layout/Header/Banner/banner.css';

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await get('danhmuc');
      const bannersData = await get('banner');
      setCategories(categoriesData || []);
      setBanners(bannersData || []);
      await fetchProducts();
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    const response = await get('mathang/filter?pageSize=12');
   if(!response?.content) return;
   const sortBygiamgia = [...response.content].sort((a,b) =>{
    return (b.giamgia || 0) - (a.giamgia || 0);
   })
   const sortByngaythem = [...response.content].sort((a,b) => {
    return new Date(b.ngaythem) - new Date(a.ngaythem); 
   })

   const hotProduct = new Set(sortBygiamgia.slice(0,5).map(p => p.id))
   const newProducts = new Set(sortByngaythem.slice(0, 5).map(p => p.id));
   const  productsWithFlags = response.content.map(product => ({
    ...product,
    isHot : hotProduct.has(product.id),
    isNew : newProducts.has(product.id)
   }))
   setProducts(productsWithFlags);
  };

  const getProductGroups = () => {
    const hotProducts = products.filter(product => product.isHot);
    const newProducts = products.filter(product => product.isNew);
    const maleProducts = products.filter(product => product.gender === 'male');
    const femaleProducts = products.filter(product => product.gender === 'female');
    return { hotProducts, newProducts, maleProducts, femaleProducts };
  };

  const { hotProducts, newProducts, maleProducts, femaleProducts } = getProductGroups();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header categories={categories} />
      <BannerCarousel banners={banners} />
      
      <main className="container-homepage mx-auto px-4 py-8">
        <SectionHot products={hotProducts} />
        <SectionNew products={newProducts} />
        <SectionMale products={maleProducts} />
        <SectionFemale products={femaleProducts} />
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
