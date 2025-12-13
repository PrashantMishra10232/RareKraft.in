import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Product_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import axiosInstance from '@/utils/axiosInstance';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Package, FileText, Plus, Trash2, Save, Edit2 } from 'lucide-react';

function ProductEditPage() {
    const { loading } = useSelector(store => store.auth)
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productId = params.id;
    const [product, setProduct] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newSize, setNewSize] = useState({ size: 'S', quantity: 0 });
    const [saving, setSaving] = useState(false);
    const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    // Fetch the product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axiosInstance.get(`${Product_API_ENDPOINT}/details/${productId}`, { withCredentials: true })
                if (res.data.success) {
                    setProduct(res.data.data);
                    const sizesWithIds = res.data.data.sizes 
                        ? res.data.data.sizes.map((size, idx) => ({ ...size, _tempId: `${size.size}-${idx}-${Date.now()}` }))
                        : [];
                    setSizes(sizesWithIds);
                    toast.success("Product details loaded");
                }
            } catch (error) {
                console.error("Axios error:", error);
                const errorMessage = error.response?.data?.message || "Something went wrong"
                toast.error(errorMessage);
                navigate('/admin/productPage');
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchProductDetails();
    }, [productId, dispatch, navigate])

    // Calculate total stock
    const totalStock = sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);

    // Handle quantity change
    const handleQuantityChange = (index, value) => {
        const newSizes = [...sizes];
        const quantity = parseInt(value) || 0;
        if (quantity < 0) return;
        newSizes[index].quantity = quantity;
        setSizes(newSizes);
    };

    // Handle size change
    const handleSizeChange = (index, newSizeValue) => {
        const newSizes = [...sizes];
        newSizes[index].size = newSizeValue;
        setSizes(newSizes);
    };

    // Add new size
    const handleAddSize = () => {
        // Check if size already exists
        const sizeExists = sizes.some(s => s.size === newSize.size);
        if (sizeExists) {
            toast.error(`Size ${newSize.size} already exists`);
            return;
        }

        setSizes([...sizes, { ...newSize, _tempId: `${newSize.size}-${Date.now()}-${Math.random()}` }]);
        setNewSize({ size: 'S', quantity: 0 });
        toast.success(`Size ${newSize.size} added`);
    };

    // Remove size
    const handleRemoveSize = (index) => {
        const newSizes = sizes.filter((_, i) => i !== index);
        setSizes(newSizes);
        toast.success("Size removed");
    };

    // Save changes
    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Validate sizes
            const sizeValues = sizes.map(s => s.size);
            const hasDuplicates = new Set(sizeValues).size !== sizeValues.length;
            if (hasDuplicates) {
                toast.error("Duplicate sizes found. Please remove duplicates.");
                setSaving(false);
                return;
            }

            // Prepare update data (remove _tempId before sending)
            const updateData = {
                sizes: sizes.map(({ _tempId, ...size }) => size)
            };

            const res = await axiosInstance.put(
                `${Product_API_ENDPOINT}/admin/update/${productId}`,
                updateData,
                { withCredentials: true }
            );

            if (res.data.success) {
                setProduct(res.data.data);
                const sizesWithIds = res.data.data.sizes 
                    ? res.data.data.sizes.map((size, idx) => ({ ...size, _tempId: `${size.size}-${idx}-${Date.now()}` }))
                    : [];
                setSizes(sizesWithIds);
                setIsEditing(false);
                toast.success("Product stock updated successfully!");
            }
        } catch (error) {
            console.error("Update error:", error);
            const errorMessage = error.response?.data?.message || "Failed to update product";
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        if (product) {
            const sizesWithIds = product.sizes 
                ? product.sizes.map((size, idx) => ({ ...size, _tempId: `${size.size}-${idx}-${Date.now()}` }))
                : [];
            setSizes(sizesWithIds);
        }
        setIsEditing(false);
        toast.info("Changes cancelled");
    };

    if (loading || !product) {
        return (
            <div className="flex flex-col space-y-3 items-center h-screen my-25 p-8">
                <Skeleton className="h-[200px] w-full max-w-4xl rounded-xl bg-gray-300" />
                <div className="space-y-5 mt-6 w-full max-w-4xl">
                    <Skeleton className="h-6 w-3/4 bg-gray-300" />
                    <Skeleton className="h-6 w-1/2 bg-gray-300" />
                    <Skeleton className="h-6 w-1/2 bg-gray-300" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with back button */}
                <div className="mb-6">
                    <Button
                        onClick={() => navigate('/admin/productPage')}
                        variant="outline"
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Button>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Stock
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Image */}
                {product?.images?.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <img
                                    src={product.images[0]?.url}
                                    alt={product.name}
                                    className="w-full h-auto object-cover rounded-lg border"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-xl font-bold text-gray-700 mb-4">
                                    Rs. {product.price}
                                </p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-gray-600">Category:</span>
                                    <span className="text-sm font-medium text-gray-800">{product.category || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-gray-600" />
                                    <span className="text-lg font-semibold text-gray-800">
                                        Total Stock: {totalStock} units
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Description */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Description</h2>
                    </div>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {product.description || 'No description available.'}
                        </p>
                    </div>
                </div>

                {/* Stock Information by Size */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Stock by Size</h2>
                        </div>
                    </div>
                    
                    {sizes.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity in Stock</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        {isEditing && (
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizes.map((sizeItem, index) => (
                                        <tr 
                                            key={sizeItem._tempId || `size-${sizeItem.size}-${index}`} 
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                {isEditing ? (
                                                    <select
                                                        value={sizeItem.size}
                                                        onChange={(e) => handleSizeChange(index, e.target.value)}
                                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {availableSizes.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="font-medium text-gray-800">{sizeItem.size}</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {isEditing ? (
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={sizeItem.quantity || 0}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{sizeItem.quantity || 0} units</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {sizeItem.quantity > 0 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                            {isEditing && (
                                                <td className="py-3 px-4">
                                                    <Button
                                                        onClick={() => handleRemoveSize(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No size information available for this product.</p>
                        </div>
                    )}

                    {/* Add New Size Section */}
                    {isEditing && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Size</h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <Label htmlFor="new-size">Size</Label>
                                    <select
                                        id="new-size"
                                        value={newSize.size}
                                        onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {availableSizes
                                            .filter(size => !sizes.some(s => s.size === size))
                                            .map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="new-quantity">Quantity</Label>
                                    <Input
                                        id="new-quantity"
                                        type="number"
                                        min="0"
                                        value={newSize.quantity}
                                        onChange={(e) => setNewSize({ ...newSize, quantity: parseInt(e.target.value) || 0 })}
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddSize}
                                    className="flex items-center gap-2"
                                    disabled={availableSizes.filter(size => !sizes.some(s => s.size === size)).length === 0}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Size
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {sizes.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-700">Total Stock:</span>
                                <span className="text-2xl font-bold text-gray-800">{totalStock} units</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                {totalStock > 0 ? (
                                    <span className="text-green-600">Product is available</span>
                                ) : (
                                    <span className="text-red-600">Product is out of stock</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductEditPage
