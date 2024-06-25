import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Layout from '../../components/Layouts/Layout';
export default function CategoryProduct() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const { slug } = useParams();
    const productsPerPage = 12; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchProducts();
    }, [pageNumber]);

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const fetchProducts = async () => {
        axios.get(`/api/product/${slug}`).then(response => {
            if (response.data.status === 200) {
                setProducts(response.data.product_data.product);
                setCategory(response.data.product_data.category);
                setLoading(false);
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
            } else if (response.data.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                navigate('/');
            }
        })
    }

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

    return (
        <Layout>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="text-3xl font-semibold">กำลังโหลด...</span>
                </div>
            ) : (
                <div>

                    <div className="flex justify-between">

                        <div>
                            <h1 className="text-2xl font-semibold">ประเภทสินค้า {category.name}</h1>
                        </div>

                        <div className="relative">
                            <input type="text" placeholder={`ค้นหาสินค้า ${category.name}`}
                                className="w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <FaSearch className="absolute top-2 left-0" />
                        </div>

                    </div>

                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 my-4 border p-4 rounded-lg">
                            {displayedProducts.length > 0 ? (
                                displayedProducts
                                    .filter(product => {
                                        // ใช้คำค้นหาในชื่อสินค้า
                                        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((product, index) => (
                                        <div key={index}>
                                            <Link to={`/product/detail/${product.slug}`}>
                                                <div className="relative overflow-hidden rounded-lg w-[12rem] h-[18rem] group">
                                                    <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="flex flex-col items-center text-white text-xl">
                                                            รายละเอียด
                                                            <CgDetailsMore size={28} />
                                                        </div>
                                                    </div>
                                                    {product.image ? (
                                                        <img className="rounded-lg w-full h-full object-cover" src={`http://itrbru.thddns.net:6440/images/product/${product.image}`} alt={product.name} />
                                                    ) : (
                                                        <img className="rounded-lg w-full h-full object-cover" src="http://itrbru.thddns.net:6440/images/product/No_image.png" alt="No Image" />
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-2 text-center">
                                                <p className="text-[1.2rem] font-semibold text-clip overflow-hidden">{product.name}</p>
                                                <p className="text-sm text-clip overflow-hidden text-black/40 font-semibold">{product.category.name}</p>
                                                <span className="font-bold">฿ {product.price}</span>
                                            </div>
                                        </div>

                                    ))
                            ) : (
                                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                    <span className="text-3xl font-semibold">ไม่มีสินค้า</span>
                                </div>
                            )}

                        </div>
                        {/* ส่วนของ Pagination */}
                        <ReactPaginate
                            previousLabel={
                                <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                                    <IoMdArrowDropleft size={20} />
                                </span>
                            }
                            nextLabel={
                                <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                                    <IoMdArrowDropright size={20} />
                                </span>
                            }
                            pageCount={pageCount}
                            breakLabel={
                                <span className="mr-4">
                                    ...
                                </span>
                            }
                            onPageChange={handlePageClick}
                            containerClassName="flex justify-center items-center gap-2 mt-2"
                            pageClassName="block border- border-solid border-black bg-black w-10 h-10 flex items-center justify-center rounded-full text-white"
                            activeClassName="bg-black/40"
                        />
                    </div>
                </div>
            )}

        </Layout>
    );
}