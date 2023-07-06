import Header from "./components/Header";
import { Route, Routes } from 'react-router-dom'
import Error from "./pages/Error";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Footer from "./components/Footer";
import ProductCardDetails from "./pages/ProductCardDetails";
import Search from './pages/Search'
import Account from './pages/auth/Account'
import ChangePassword from './pages/auth/ChangePassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import ForgotPasswordToken from './pages/auth/ForgotPasswordToken'
import Cart from './pages/Cart.jsx'
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from './pages/admin/AdminProducts';
import CreateProducts from "./pages/admin/CreateProducts";
import UpdateProduct from "./pages/admin/UpdateProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOrders from "./pages/admin/AdminOrders";
import UpdateOrder from "./pages/admin/UpdateOrder";
import AllUsers from "./pages/admin/AllUsers";
import UpdateUser from "./pages/admin/UpdateUser";
import AllReviews from "./pages/admin/AllReviews";
import CheckOut from "./pages/CheckOut";
import MyOrders from "./pages/MyOrders";
import Order from "./components/Order";

function App() {
    return (
        <div>
            <div>
                <Header/>
            </div>

            <div className="bg-neutral-100">
                <Routes>
                    <Route path="*" element={<Error/>} /> 
                    <Route path='/' element={<Home/>} />
                    <Route path='/products' element={<Products/>} />
                    <Route path='/about' element={<About/>} />
                    <Route path='/contact' element={<Contact/>} />
                    
                    <Route path='/search' element={<Search/>} />
                    <Route path='/login' element={<Login/>} />
                    <Route path='/signup' element={<SignUp/>} />
                    <Route path="/product/:productId" element={<ProductCardDetails/>} />

                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}/>
                    <Route path="/password/change" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>}/>
                    <Route path="/password/forgot" element = {<ForgotPassword/>} />
                    <Route path="/password/forgot/:token" element = {<ForgotPasswordToken/>}/>

                    <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute> } />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute> } />

                    {/* Admin Products */}
                    <Route path="/admin/products" element={<ProtectedRoute><AdminProducts/></ProtectedRoute> } />
                    <Route path="/admin/product/create" element={<ProtectedRoute><CreateProducts/></ProtectedRoute> } />
                    <Route path="/admin/product/:id" element={<ProtectedRoute><UpdateProduct/></ProtectedRoute> } />

                    {/* Admin Orders */}
                    <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders/></ProtectedRoute> } />
                    <Route path="/admin/order/:id" element={<ProtectedRoute><UpdateOrder/></ProtectedRoute> } />

                    {/* Admin - User updation */}
                    <Route path="/admin/users" element={<ProtectedRoute><AllUsers/></ProtectedRoute> } />
                    <Route path="/admin/user/:id" element={<ProtectedRoute><UpdateUser/></ProtectedRoute> } />

                    {/* Admin - Reviews */}
                    <Route path="/admin/reviews" element={<ProtectedRoute><AllReviews/></ProtectedRoute> } />

                    <Route path="/order/shipping" element={<ProtectedRoute><CheckOut/></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
                    <Route path="/order/:orderId" element={<ProtectedRoute><Order/></ProtectedRoute>} />
                    
                </Routes>
            </div>

            <div>
                <Footer/>
            </div>
        </div>
    );
}

export default App;