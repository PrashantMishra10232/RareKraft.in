import { CircleUserRound, Loader2, LogOutIcon, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { Product_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { persistor } from '@/redux/store';
import { logout } from '@/redux/authSlice';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import { setProduct } from '@/redux/productSlice';
import getAllProducts from '@/hooks/getAllProducts';
import ProductCard from './ProductCard';
import { setLoading } from '@/redux/authSlice';

function ProductPage() {
  getAllProducts();

  const { user, loading } = useSelector(store => store.auth);
  const { allProducts } = useSelector(store => store.product);
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    images: []
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
        dispatch(setProduct(res.data.data))
        console.log("product data:", res.data.data);
        toast.success(res.data.message)

        setInput({
          name: "",
          description: "",
          price: "",
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

  return (
    <div>
      <div id="navbar" className='flex justify-between sm:px-18 px-4 py-2'>
        <div id="logo">
          <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png" alt="logo" className='w-[140px] h-[140px] border' />
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
          <Label className="my-2 text-gray-800">Price</Label>
          <Input
            type="Number"
            name="price"
            value={input.price}
            placeholder="In INR"
            onChange={changeEvevntHandler}
            className='border border-black rounded-none'
          />

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
        <h1 className='text-3xl font-bold py-3'>All Products</h1>
        <div className='flex flex-wrap flex-row gap-5 border-2 border-black rounded-[8px]'>
          {
            allProducts?.map((product) => (
              <ProductCard product={product} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ProductPage