import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Admin/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchOrders, fetchProducts, fetchUsers } from '../../redux/services/operations/adminApi';
import Loader from '../../components/Loader';
import { Doughnut } from 'react-chartjs-2';
import { Tooltip, Title, ArcElement, Legend, Chart as ChartJs } from 'chart.js';

ChartJs.register(Tooltip, Title, ArcElement, Legend);

function Dashboard() {
    const navigate = useNavigate();
    const {userDetails, isLoading} = useSelector((state) => state.user);
    const {allProducts, allUsers, allOrders, loading} = useSelector((state) => state.admin); 
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [doughnutData, setDoughnutData] = useState([]);

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

        dispatch(fetchProducts());
        dispatch(fetchUsers());
        dispatch(fetchOrders());
    }, [userDetails]);

    let inStock = 0;
    let outOfStock = 0;

    useEffect(() => {
    if (allProducts) {
        const stockCount = allProducts.reduce((count, product) => {
        if (product.stock > 0) {
            return {
            inStock: count.inStock + 1,
            outOfStock: count.outOfStock,
            };
        } else {
            return {
            inStock: count.inStock,
            outOfStock: count.outOfStock + 1,
            };
        }
        }, { inStock: 0, outOfStock: 0 });

        inStock = stockCount.inStock;
        outOfStock = stockCount.outOfStock;

        const data = [outOfStock, inStock];
        setDoughnutData(data);
    }
    }, [allProducts]);

    const data = {
        datasets: [{
            data: doughnutData,
            backgroundColor:[
                'red',
                'green'
            ]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'OutOfStock',
            'InStock',
        ]
    };
    
  return (
    <div>
        {
            loading && isLoading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
            <div className='flex min-h-[73vh] gap-5 min-[1080px]:flex-row flex-col'>
                <div>
                    <div className='min-[1080px]:block hidden h-full'>
                        <Sidebar/>
                    </div>
                </div>

                <div className='w-full '>
                    <div className='flex flex-col items-center justify-center py-5 max-w-[1200px]'>
                        <p className='text-4xl font-bold'>Dashboard</p>

                        <div className='flex my-10 gap-10 md:flex-row flex-col'>
                            <div className='w-[250px] h-[250px] bg-red-400 rounded-full shadow-lg shadow-black flex items-center justify-center flex-col gap-5'>
                                <p className='text-white font-semibold text-2xl'>Products</p>
                                <p className='text-white font-bold text-3xl'>{allProducts?.length}</p>
                            </div>
                            <div className='w-[250px] h-[250px] bg-blue-400 rounded-full shadow-lg shadow-black flex items-center justify-center flex-col gap-5'>
                                <p className='text-white font-semibold text-2xl'>Users</p>
                                <p className='text-white font-bold text-3xl'>{allUsers?.length}</p>
                            </div>
                            <div className='w-[250px] h-[250px] bg-green-400 rounded-full shadow-lg shadow-black flex items-center justify-center flex-col gap-5'>
                                <p className='text-white font-semibold text-2xl'>Orders</p>
                                <p className='text-white font-bold text-3xl'>{allOrders?.length}</p>
                            </div>
                        </div>

                        <div className='mt-10 w-full flex flex-col items-center justify-between'>
                            <p className='text-3xl font-bold tracking-wide'>Product Availability</p>
                            <div className='sm:w-[500px] sm:h-[500px] w-full h-full flex items-center justify-center mt-10'>
                                <Doughnut data={data} className={`${doughnutData ? 'visible' : 'hidden' }`}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
    
  )
}

export default Dashboard