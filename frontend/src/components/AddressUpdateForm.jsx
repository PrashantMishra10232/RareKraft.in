import useGetAllAddress from '@/hooks/useGetAllAddress'
import React, { useEffect, useRef, useState } from 'react'
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { Separator } from './ui/separator';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { Loader2, Plus } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setAddress, setLoading } from '@/redux/authSlice';

function AddressUpdateForm() {
  useGetAllAddress();
  const { address, loading } = useSelector(store => store.auth)
  const dispatch = useDispatch();
  const closeRef = useRef();

  const [input, setInput] = useState({
    name: "",
    address: "",
    city: "",
    pinCode: "",
    country: "",
    typeOfAddress: "",
    state: "",
    phoneNo: ""
  })

  const newAddressHandler = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }


  useEffect(() => {
    const fetchPincode = async () => {
      if (input.pinCode.length === 6) {
        try {
          const res = await axios.get(`https://api.postalpincode.in/pincode/${input.pinCode}`)
          const postData = res.data[0];

          if (postData.Status === "Success") {
            const details = postData.PostOffice[0]
            setInput({
              ...input,
              state: details.State,
              city: details.District,
              country: details.Country
            })
          }
        } catch (error) {
          console.error("Invalid Pincode or API error", error);
        }
      }
    }
    fetchPincode()
  }, [input.pinCode])

  const emptyAddress = {
    name: "",
    address: "",
    city: "",
    pinCode: "",
    country: "",
    typeOfAddress: "",
    state: "",
    phoneNo: "",
    isDefault: false
  };

  const resetInput = () => setInput(emptyAddress);


  const updateAddressHandler = async (e, addressId) => {
    e.preventDefault();
    dispatch(setLoading(true))
    try {
      const res = await axiosInstance.patch(`${USER_API_ENDPOINT}/updateAddress/${addressId}`, input)
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAddress(res.data.data.shippingAddresses))
        console.log("updated address:", res.data.data);
        console.log("updated address 2:", res.data.data.shippingAddresses);
        closeRef?.current?.click();
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
    finally {
      dispatch(setLoading(false))
    }
  }

  const saveNewAddressHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.post(`${USER_API_ENDPOINT}/addAddress`, input)
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAddress(res.data.data.shippingAddresses))
        closeRef?.current?.click();
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
    finally {
      dispatch(setLoading(false))
    }
  }

  const removeAddressHandler = async (addressId) => {
    dispatch(setLoading(true))
    try {
      const res = await axiosInstance.delete(`${USER_API_ENDPOINT}/removeAddress/${addressId}`)
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAddress(res.data.data.shippingAddresses))
        closeRef?.current?.click();
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
    finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex md:mx-34'>
        <ProfileSidebar />
        <div className='md:px-25 px-4 sm:my-19 py-3  w-full sm:border-t-1'>
          <div className='flex flex-row gap-2 justify-between items-center mb-4'>
            <h1 className='font-bold sm:text-xl text-lg'><span className='text-gray-500'><Link to="/profilePage">Profile</Link></span>/Saved Addresses</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={resetInput} variant="outline" className="text-blue-400 font-bold border-blue-400 cursor-pointer md:block hidden">+ ADD NEW ADDRESS</Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button onClick={resetInput} variant="outline" className="text-blue-400 font-bold border-blue-400 cursor-pointer md:hidden block"><Plus /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ADD NEW ADDRESS</DialogTitle>
                </DialogHeader>
                <div>
                  <form action="submit" onSubmit={(e) => saveNewAddressHandler(e)}>
                    <div id="personals">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={input.name}
                        onChange={newAddressHandler}
                        placeholder="Name*"
                        className="my-2"
                      />

                      <Label htmlFor="phoneNo">Phone</Label>
                      <Input
                        id="phoneNo"
                        name="phoneNo"
                        value={input.phoneNo}
                        placeholder="Phone*"
                        onChange={newAddressHandler}
                        className="my-2"
                      />
                    </div>

                    <div id="address" className='mt-5 border-y-2 py-3'>
                      <div className='flex justify-between'>
                        <div>
                          <Label htmlFor="pinCode">Pincode</Label>
                          <Input
                            id="pinCode"
                            name="pinCode"
                            value={input.pinCode}
                            placeholder="Pincode*"
                            onChange={newAddressHandler}
                            className="my-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={input.state}
                            placeholder="State*"
                            readOnly
                            className="my-2 text-gray-600"
                          />
                        </div>

                      </div>

                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={input.address}
                        placeholder="Address* (House, Building, Street, Area)"
                        onChange={newAddressHandler}
                        className="my-2"
                      />

                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={input.country}
                        placeholder="Country*"
                        readOnly
                        className="my-2 text-gray-600"
                      />

                      <Label htmlFor="city">City / District</Label>
                      <Input
                        id="city"
                        name="city"
                        value={input.city}
                        placeholder="City / District*"
                        readOnly
                        className="my-2 text-gray-600"
                      />

                    </div>

                    <div>
                      <h1>Type Of Address*</h1>
                      <div className='flex items-center gap-4 mt-3'>
                        <div className='flex gap-2 justify-center items-center'>
                          <Label htmlFor="Home">Home</Label>
                          <input
                            type="radio"
                            id="Home"
                            name='typeOfAddress'
                            value="Home"
                            checked={input.typeOfAddress === "Home"}
                            onChange={newAddressHandler}
                            className="w-4 h-4"
                          />
                        </div>

                        <div className='flex items-center gap-2 p-2'>
                          <Label htmlFor="Home">Office</Label>
                          <input
                            type="radio"
                            id="Office"
                            name='typeOfAddress'
                            value="Office"
                            checked={input.typeOfAddress === "Office"}
                            onChange={newAddressHandler}
                            className="w-4 h-4"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 my-3">
                        <Checkbox
                          id="isDefault"
                          checked={input.isDefault}
                          onCheckedChange={(checked) => {
                            setInput({ ...input, isDefault: checked })
                          }}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Make this your default address
                        </label>
                      </div>
                    </div>

                    <div className='w-full flex'>
                      <div className="w-1/2">
                        <DialogClose asChild >
                          <Button ref={closeRef} variant="outline" className="border border-amber-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg">CANCEL</Button>
                        </DialogClose>
                      </div>
                      <div className="w-1/2">
                        {
                          loading ? (<Button className="bg-yellow-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg"><Loader2 className='animate-spin' /></Button>) : (<Button className="bg-yellow-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg">SAVE</Button>)
                        }
                      </div>
                    </div>

                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>


          <div>

            {address?.length > 0 && [...address]
              .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)).map((addrs) => (
                <div key={addrs._id || addrs.pinCode}>
                  {addrs.isDefault && <h1 className='font-bold'>Default Address</h1>}
                  <div className='mb-4 shadow-lg hover:shadow-xl cursor-pointer p-3'>

                    <div id="address" className='text-gray-700 border-b-1 py-2'>
                      <div className='flex justify-between'>
                        <p className='font-bold'>{addrs.name}</p>
                        <span className='rounded-full p-1 bg-gray-200 text-xs'>{addrs.typeOfAddress}</span>
                      </div>
                      <p>{addrs.address}</p>
                      <p>{addrs.city} - {addrs.pinCode}</p>
                      <p>{addrs.country}</p>
                    </div>



                    <div className='flex'>

                      <Dialog>
                        <DialogTrigger className="w-1/2" onClick={() => setInput(addrs)}>
                          <div className='w-full text-center'>
                            <h1 className='font-bold text-blue-400 cursor-pointer'>EDIT</h1>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>EDIT ADDRESS</DialogTitle>
                          </DialogHeader>
                          <div>
                            <form action="submit" onSubmit={(e) => updateAddressHandler(e, addrs._id)}>
                              <div id="personals">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={input.name || ""}
                                  placeholder="Name*"
                                  onChange={newAddressHandler}
                                  className="my-2"
                                />

                                <Label htmlFor="phoneNo">Phone</Label>
                                <Input
                                  id="phoneNo"
                                  name="phoneNo"
                                  value={input.phoneNo || ""}
                                  placeholder="Phone*"
                                  onChange={newAddressHandler}
                                  className="my-2"
                                />
                              </div>

                              <div id="address" className='mt-5 border-y-2 py-3'>
                                <div className='flex justify-between'>
                                  <div>
                                    <Label htmlFor="pinCode">Pincode</Label>
                                    <Input
                                      id="pinCode"
                                      name="pinCode"
                                      value={input.pinCode || ""}
                                      placeholder="Pincode*"
                                      onChange={newAddressHandler}
                                      className="my-2"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                      id="state"
                                      name="state"
                                      value={input.state || ""}
                                      placeholder="State*"
                                      readOnly
                                      className="my-2 text-gray-600"
                                    />
                                  </div>

                                </div>

                                <Label htmlFor="address">Address</Label>
                                <Input
                                  id="address"
                                  name="address"
                                  value={input.address || ""}
                                  placeholder="Address* (House, Building, Street, Area)"
                                  onChange={newAddressHandler}
                                  className="my-2"
                                />

                                <Label htmlFor="country">Country</Label>
                                <Input
                                  id="country"
                                  name="country"
                                  value={input.country || ""}
                                  placeholder="Country*"
                                  readOnly
                                  className="my-2 text-gray-600"
                                />

                                <Label htmlFor="city">City / District</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={input.city || ""}
                                  placeholder="City / District*"
                                  readOnly
                                  className="my-2 text-gray-600"
                                />

                              </div>

                              <div>
                                <h1>Type Of Address*</h1>
                                <div className='flex items-center gap-4 mt-3'>
                                  <div className='flex gap-2 justify-center items-center'>
                                    <Label htmlFor="Home">Home</Label>
                                    <input
                                      type="radio"
                                      id="Home"
                                      name='typeOfAddress'
                                      value="Home"
                                      checked={input.typeOfAddress === "Home"}
                                      onChange={newAddressHandler}
                                      className="w-4 h-4"
                                    />
                                  </div>

                                  <div className='flex items-center gap-2 p-2'>
                                    <Label htmlFor="Home">Office</Label>
                                    <input
                                      type="radio"
                                      id="Office"
                                      name='typeOfAddress'
                                      value="Office"
                                      checked={input.typeOfAddress === "Office"}
                                      onChange={newAddressHandler}
                                      className="w-4 h-4"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 my-3">
                                  <Checkbox
                                    id="isDefault"
                                    checked={input.isDefault}
                                    onCheckedChange={(checked) => {
                                      setInput({ ...input, isDefault: checked })
                                    }}
                                  />
                                  <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Make this your default address
                                  </label>
                                </div>
                              </div>

                              <div className='w-full flex'>
                                <div className="w-1/2">
                                  <DialogClose asChild>
                                    <Button ref={closeRef} variant="outline" className="border border-amber-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg">CANCEL</Button>
                                  </DialogClose>
                                </div>
                                <div className="w-1/2">
                                  {
                                    loading ? (<Button className="bg-yellow-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg"><Loader2 className='animate-spin' /></Button>) : (<Button className="bg-yellow-600 w-full rounded-none h-12 cursor-pointer font-bold text-lg">SAVE</Button>)
                                  }
                                </div>
                              </div>

                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Separator orientation='vertical' className="!h-7" />

                      <Dialog>
                        <DialogTrigger className="w-1/2">
                          <div className='w-full text-center cursor-pointer'>
                            <h1 className='font-bold text-blue-400'>REMOVE</h1>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Confirmation</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this address?</DialogDescription>
                          </DialogHeader>
                          <div>
                            <Separator />
                            <div className='flex pt-2'>
                              <DialogClose className="w-1/2" asChild>
                                <button ref={closeRef} className='w-full text-center text-xl font-semiBold cursor-pointer bg-transparent border-none p-0'>CANCEL</button>
                              </DialogClose>

                              <Separator orientation="vertical" className="!h-7" />
                              <button 
                                onClick={() => removeAddressHandler(addrs._id)} 
                                className='w-1/2 text-center text-xl font-bold text-yellow-500 cursor-pointer bg-transparent border-none p-0 hover:opacity-80'
                              >
                                DELETE
                              </button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </div>
                </div>

              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AddressUpdateForm