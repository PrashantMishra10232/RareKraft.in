import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import ProfileSidebar from './ProfileSidebar';
import { Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axiosInstance from '@/utils/axiosInstance';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { setLoading, setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


function ProfileDetailPage() {
    const { user, loading } = useSelector(store => store.auth);
    const [edit, setEdit] = useState(false)
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        name: "",
        email: "",
        phoneNo: "",
        gender: "",
        dateOfBirth: "",
        alternatePhoneNo: ""
    })

    useEffect(() => {
        if (user) {
            setInput({
                name: user?.name || "",
                email: user?.email || "",
                phoneNo: user?.phoneNo || "",
                gender: user?.gender || "",
                dateOfBirth: user?.dateOfBirth || "",
                alternatePhoneNo: user?.alternatePhoneNo || ""
            })
        }
    }, [user])

    const updateHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        const formData = new FormData();
        formData.append("name", input.name)
        formData.append("email", input.email)
        formData.append("phoneNo", input.phoneNo)
        formData.append("gender", input.gender)
        formData.append("dateOfBirth", input.dateOfBirth)
        formData.append("alternatePhoneNo", input.alternatePhoneNo)

        try {
            const res = await axiosInstance.patch(`${USER_API_ENDPOINT}/me/update`, formData, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setUser(res.data.data))
                console.log("updated user data:", res.data.data);

                localStorage.setItem("loggedInUser", JSON.stringify(res.data.data))
                
                toast.success(res.data.message)
                setEdit(false);
            }
        } catch (error) {
            console.log("Axios Error:", error);
            console.log("Error Response Data:", error.response?.data);
            const errorMessage = error.response?.data?.message || "Something went wrong! Please try again.";

            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex md:mx-34'>
                <ProfileSidebar />
                <div className='md:px-25 px-4 sm:my-19 py-3 w-full sm:border-t-1'>
                    {!edit ? (<div className="bg-white text-gray-800">
                        <div className="max-w-6xl mx-auto pt-6">

                            <div className="flex-1 px-6 py-6">
                                <h1 className="text-xl font-bold mb-6"><Link to="/profilePage" className='text-gray-500'>Profile</Link>/Profile Details</h1>

                                <div className="border px-6 py-8">
                                    <div className="grid grid-cols-2 gap-y-4 text-sm mb-6">
                                        <div className="font-medium">Full Name</div>
                                        <div>{user.name}</div>

                                        <div className="font-medium">Mobile Number</div>
                                        <div>{user?.phoneNo || "- not added - "}</div>

                                        <div className="font-medium">Email ID</div>
                                        <div className='truncate'>{user.email}</div>

                                        <div className="font-medium">Date of Birth</div>
                                        <div>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-IN",{
                                            year: "numeric",
                                            month: "long",
                                            day:"numeric"
                                        }) :  "- not added - "}</div>

                                        <div className="font-medium">Gender</div>
                                        <div>{user?.gender || "- not added - "}</div>

                                        <div className="font-medium">Alternate Mobile</div>
                                        <div>{user?.alternatePhoneNo || "- not added - "}</div>
                                    </div>

                                    <div className="pt-4">
                                        <Button className="w-full bg-yellow-500 text-white py-2 font-semibold rounded cursor-pointer" onClick={() => setEdit(true)}>
                                            EDIT
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>) :

                        (<div className="w-full max-w-xl mx-auto p-4 sm:p-6">
                            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                            <form className="grid gap-4" onSubmit={updateHandler}>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        placeholder="Enter name"
                                        id="name"
                                        name="name"
                                        value={input.name}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter email"
                                        id="email"
                                        name="email"
                                        value={input.email}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Date of Birth</label>
                                    <Input
                                        type="Date"
                                        placeholder="DD/MM/YY"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={input.dateOfBirth}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        id="phoneNo"
                                        name="phoneNo"
                                        value={input.phoneNo}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Gender</label>
                                    <div
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        <Button
                                            variant={input.gender === "male" ? "default" : "outline"}

                                            onClick={(e) => {
                                                e.preventDefault();
                                                setInput({ ...input, gender: "male" })
                                            }}
                                            className={input.gender === "male" ? "border-2 border-yellow-600 text-yellow-600" : ""}
                                        >
                                            {input.gender === "male" && <span className="mr-1">✓</span>} Male
                                        </Button>
                                        <Button
                                            variant={input.gender === "female" ? "default" : "outline"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setInput({ ...input, gender: "female" })
                                            }}
                                            className={input.gender === "female" ? "border-2 border-yellow-600 text-yellow-600" : ""}
                                        >
                                            {input.gender === "female" && <span className="mr-1">✓</span>} Female
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium">Alternate Phone</label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter an alternate phone number"
                                        id="alternatePhoneNo"
                                        name="alternatePhoneNo"
                                        value={input.alternatePhoneNo}
                                        onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Button variant="outline" className="border-amber-600 h-12 font-bold text-lg cursor-pointer" onClick={(e) => {
                                        e.preventDefault(),
                                            setEdit(false)
                                    }}>
                                        Cancel
                                    </Button>
                                    {
                                        loading ? (<Button className="bg-yellow-600 h-12 font-bold text-lg cursor-pointer"><Loader2 className='animate-spin' /></Button>) : (<Button className="bg-yellow-600 h-12 font-bold text-lg cursor-pointer">
                                            Save
                                        </Button>)
                                    }
                                </div>
                            </form>
                        </div>)
                    }


                </div>

            </div>
            <Footer />
        </div>
    );
}

export default ProfileDetailPage