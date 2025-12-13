import { CircleUserRound, Delete, Expand, Loader2, LogOutIcon, Search, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { Product_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { persistor} from '@/redux/store';
import { logout, setLoading } from '@/redux/authSlice';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import useGetAllProducts from '@/hooks/useGetAllProducts';
import ProductCardAdmin from './ProductCardAdmin';
import { setAllProducts } from '@/redux/productSlice';

function ProductPage() {
  useGetAllProducts();

  const { user, loading } = useSelector(store => store.auth);
  const { allProducts } = useSelector(store => store.product);
  const [expanded, setExpanded] = useState(false);

  const [tableState, setTableState] = useState("Products")
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const [sizeInput, setSizeInput] = useState({
    size: "",
    quantity: ""
  })
  const [error, setError] = useState("")

  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    sizes: []
  })

  const [preview, setPreview] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.post(`${USER_API_ENDPOINT}/logout`, {}, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
        await persistor.purge();
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      console.error("Error Response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  }

  const addSize = async (e) => {
    e.preventDefault();
    if (
      !sizeInput.size || sizeInput.quantity === "" || input.sizes.find((s) => s.size == sizeInput.size)
    ) {
      setError("Size already added or invalid input.")
      return;
    }
    setInput((prev) => ({
      ...prev, sizes: [...prev.sizes, { ...sizeInput, quantity: Number(sizeInput.quantity) }]
    }));
    setSizeInput({ size: "", quantity: "" });
    setError("");
  }

  const removeSize = (e, sizeToRemove) => {
    e.preventDefault();
    setInput((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.size !== sizeToRemove),
    }));
  };

  const fileHandler = async (e) => {
    let images = Array.from(e.target.files)
    const maxSizeMB = 2;

    images.forEach(img => {
      if (img.size > maxSizeMB * 1024 * 1024) {
        alert(`${img.name} exceeds ${maxSizeMB}MB`)
      }
    })

    if (images.length > 5) {
      alert("You can only upload up to 5 images.")
    }
    images = images.slice(0, 5)

    setInput({ ...input, "images": images })

    const previews = images.map((image) => ({
      name: image.name,
      url: URL.createObjectURL(image)
    }))

    setPreview(previews)
  }

  useEffect(() => {
    return () => {
      preview.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [preview])

  const changeEvevntHandler = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const productHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("name", input.name)
    formData.append("description", input.description)
    formData.append("price", input.price)
    formData.append("category", input.category)
    formData.append("sizes", JSON.stringify(input.sizes))
    input.images.forEach(file => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post(`${Product_API_ENDPOINT}/new`, formData,
        {
          headers: {
            "Content-Type": "multipart/formData"
          },
          withCredentials: true
        }
      )
      if (res.data.success) {
        dispatch(setAllProducts([...allProducts, res.data.data]));
        toast.success(res.data.message)

        setInput({
          name: "",
          description: "",
          price: "",
          category: "",
          sizes: [],
          images: []
        });

        setPreview([]);
      }
    } catch (error) {
      console.error("Axios error:", error)
      const errorMessage = error.response?.data?.message || "Something went wrong";
      console.log("error message:", errorMessage);

      toast.error(errorMessage)
    } finally {
      dispatch(setLoading(false));
    }
  }

  // Sync filteredProducts with allProducts whenever allProducts changes
  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.delete(`${Product_API_ENDPOINT}/admin/delete/${productId}`, {
        withCredentials: true
      });

      if (res.data.success) {
        // Remove the deleted product from Redux state
        const updatedProducts = allProducts.filter(product => product._id !== productId);
        dispatch(setAllProducts(updatedProducts));
        toast.success(res.data.message || 'Product deleted successfully');
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (query)=>{
    if(!query){
      setFilteredProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }

  return (
    <div>
      <div id="navbar" className='flex justify-between sm:px-18 px-4 py-2'>
        <div id="logo">
          <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png" alt="logo" className='w-[140px] h-[140px]' />
        </div>

        {!user ?
          (<div>
            <Link to="/signup"><User className='cursor-pointer' /></Link>
          </div>) :
          (<div className='flex justify-center items-center gap-3'>
            <h1 className='font-bold text-xl'>Admin</h1>
            <Popover>
              <PopoverTrigger>
                <CircleUserRound className='cursor-pointer' />
              </PopoverTrigger>
              <PopoverContent>
                <div className='flex gap-4 space-y-2'>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src={user?.avatar} alt='@shadcn' />
                  </Avatar>
                  <div>
                    <h4 className='font-medium'>{user.name}</h4>
                    <p className='text-sm text-muted-foreground'>{user.email}</p>
                  </div>
                </div>
                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                  <LogOutIcon />
                  <Button variant='link' onClick={logoutHandler} className='cursor-pointer'>Logout</Button>
                </div>
              </PopoverContent>
            </Popover>

          </div>)
        }
      </div>

      <div className='sm:px-18 px-4 py-2'>
        <h1 className='text-3xl font-bold py-3'>Manage Products</h1>
        <form action="submit" onSubmit={productHandler} className='border-2 border-black rounded-[8px] p-4'>
          <h2 className='text-2xl font-semibold text-gray-700 my-3'>Add Products</h2>
          <Label className="my-2 text-gray-800">Product Name</Label>
          <Input
            type="text"
            name="name"
            value={input.name}
            placeholder="Product Name"
            onChange={changeEvevntHandler}
            className='border border-black rounded-none'
          />

          <Label className="my-2 text-gray-800">Description</Label>
          <Input
            type="text"
            name="description"
            value={input.description}
            placeholder="Add product description here."
            onChange={changeEvevntHandler}
            className='border border-black rounded-none'
          />

          <div className='sm:flex justify-between items-center'>

            <div id="price" className='w-[48%]'>
              <Label className="my-2 text-gray-800">Price</Label>
              <Input
                type="Number"
                name="price"
                min="0"
                value={input.price}
                placeholder="In INR"
                onChange={changeEvevntHandler}
                className='border border-black rounded-none'
              />
            </div>

            <div id="category" className='w-[48%]'>
              <Label className="my-2 text-gray-800">Category</Label>
              <select
                name="category" id='category'
                value={input.category}
                className='border border-black px-2 py-1 h-9 w-full'
                onChange={changeEvevntHandler}
              >
                <option value=""> Select Category </option>
                <option value="Men"> Men </option>
                <option value="Women"> Women </option>
                <option value="Kids"> Kids </option>
              </select>
            </div>

          </div>


          <Label className="my-2 text-gray-800">Sizes</Label>
          <select
            name="size" id='size'
            value={sizeInput.size}
            className='border border-black px-2 py-1'
            onChange={(e) => setSizeInput({ ...sizeInput, [e.target.name]: e.target.value })}
          >
            <option value=""> Select Size </option>
            <option value="S"> S </option>
            <option value="M"> M </option>
            <option value="L"> L </option>
            <option value="XL"> XL </option>
            <option value="XXL"> XXL </option>
          </select>

          <div className='flex sm:flex-row flex-col sm:justify-between sm:items-end gap-2'>
            <div>
              <Label className="my-2 text-gray-800">Quantity</Label>
              <input
                type='Number'
                id="quantity"
                name="quantity"
                min="0"
                value={sizeInput.quantity}
                placeholder='Add Quantity here'
                onChange={(e) => setSizeInput({ ...sizeInput, [e.target.name]: e.target.value })}
                className='border border-black rounded-none h-9 px-2'
              />
            </div>

            <Button
              className="w-33"
              onClick={addSize}
            >Add Size</Button>
          </div>

          {input.sizes.length > 0 && (
            <div className='border-2 border-black my-4'>
              <ul>
                <li className='flex justify-around border-b-1'>
                  <h2 className='font-semibold text-lg'>Size</h2>
                  <h2 className='font-semibold text-lg'>Quantity</h2>
                </li>
                {input.sizes.map((sz) => (
                  <li key={sz.size} className='flex justify-around items-center w-full py-1'>

                    <div className='w-1/2 text-center'>{sz.size}</div>
                    <div className='w-1/2 flex justify-between items-center px-2'>
                      <span className='text-left'>{sz.quantity}</span>
                      <Button onClick={(e) => removeSize(e, sz.size)} className="ml-2 shrink-0"><Trash2 /></Button>
                    </div>

                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <div style={{ color: "red" }}>{error}</div>}

          <Label className="my-2 text-gray-800">Image</Label>
          <Input
            type="file"
            name="images"
            accept="image/*"
            multiple
            // value={input.images}
            onChange={fileHandler}
            className='border border-black rounded-none'
          />


          <div id="previews" className='flex flex-wrap justify-center my-4 gap-2'>
            {preview.map(img => (
              <img
                key={img.name}
                src={img.url}
                alt={img.name}
                className='w-24 h-24 object-cover border-2 border-black'
              />
            ))}
          </div>
          {
            loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Publishing</Button> : <Button className='w-full font-semibold cursor-pointer'>Publish</Button>

          }
        </form>

      </div>

      <div id="productsData" className='h-[500px] sm:px-18 px-4 py-2'>

        <div className='flex justify-between items-center'>

          <div className='relative inline-flex p-1 rounded-lg mb-2'>
            <button
              onClick={() => setTableState("Products")}
              className={`px-4 py-2 font-bold text-2xl relative z-10 transition-colors duration-300 cursor-pointer ${tableState === "Products" ? "text-black" : "text-gray-500"}`}>
              All Products
            </button>
            <span className='relative z-10 font-bold text-2xl py-2'>/</span>
            <button
              onClick={() => setTableState("Orders")}
              className={`px-4 py-2 font-bold text-2xl relative z-10 transition-colors duration-300 cursor-pointer ${tableState === "Orders" ? "text-black" : "text-gray-500"}`}>
              All Orders
            </button>
            <div
              className={`absolute top-0 left-0 h-full w-1/2 rounded-lg bg-gray-300/30 backdrop-blur-sm transition-all duration-300 ${tableState === "Products" ? "translate-x-0" : "translate-x-full"}`}
            ></div>
          </div>

          <div id="search"
            className={`flex items-center border ${expanded ? "border-black" : "border-transparent"}
          rounded-full px-3 transition-all duration-300 w-${expanded ? "[250px]" : "48px"}
          bg-white overflow-hidden
          `}
          >
            <input
              type="text"
              placeholder="Search.. Products | Orders"
              onChange={(e) => handleSearch(e.target.value)}
              className={`
          flex-grow
          outline-none
          text-black
          text-sm
          transition-all duration-300
          ${expanded ? "opacity-100 ml-2" : "opacity-0 w-0"}
          bg-transparent
        `}
            />
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-1 transition-all duration-300 border-2 border-gray-500 rounded-full
              ${expanded ? "bg-black/0 border-transparent" : "bg-black border-gray-500"}
              `}>
              <Search
                size={25}
                className={expanded ? "text-black" : "text-gray-500"}
              />
            </button>
          </div>
        </div>



        {tableState === "Products" &&
          (<div className='grid sm:grid-cols-3 md:grid-cols-5 grid-cols-2 gap-2 border-2 p-2 border-black rounded-[8px]'>
            {
              filteredProducts?.map((product,i) => (
                <ProductCardAdmin key={product._id || i} product={product} onDelete={handleDeleteProduct} />
              ))
            }
          </div>)
        }

      </div>
    </div>
  )
}

export default ProductPage