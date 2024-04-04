import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { notifyFailed, notifySuccess } from '../../../helpers/toaster';
import Button from '../../Button';
import { deleteProduct, editProduct } from '../../../redux/currProductsSlice';
import { selectCurrCategories } from '../../../redux/currCategoriesSlice';

const EditProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const currCategories = useSelector(selectCurrCategories);
  const { register, handleSubmit, reset } = useForm();

  const [state, setState] = useState({
    category: '',
    image: null,
    discRules: []
  });

  useEffect(() => {
    fetch(`${apiUrl}/api/products/?id=${id}`)
      .then((res) => res.json())
      .then((data) => { 
        setState(prevState => ({
          ...prevState,
          ...data.data[0],
          discRules: data.data[0]?.discRules || []
        }));
      })
      .catch((error) => console.log(error.message));
  }, []);

  const imageChooserRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setState((prev) => ({ ...prev, image: file }));
  };

  const handleDeleteDiscount = (index) => {
    const updatedDiscRules = state.discRules.filter((_, i) => i !== index);
    setState((prevState) => ({
      ...prevState,
      discRules: updatedDiscRules
    }));
  };

  const handleAddDiscountRule = (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      discRules: [...prevState.discRules, { minQty: '', discPerc: '' }]
    }));
  };

  const submitForm = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name || state.name);
      formData.append('description', data.description || state.description);
      formData.append('price', data.price || state.price);
      formData.append('category', data.category || state.category?._id);
      formData.append('image', data.image || state.image);
  
      if (state.discRules.length > 0) {
        state.discRules.forEach((rule, index) => {
          formData.append(`discRules[${index}][minQty]`, rule.minQty);
          formData.append(`discRules[${index}][discPerc]`, rule.discPerc);
        });
      } else {
        formData.append('discRules', []);
      }
  
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        dispatch(editProduct(result.data));
        console.log(result.data);
        notifySuccess(result.message);
        navigate("/");
      }
    } catch (error) {
      notifyFailed(error.message);
    }
    reset();
  };
  
  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        notifySuccess(result.message);
        dispatch(deleteProduct(id));
        navigate("/");
      }
    } catch (error) {
      notifyFailed(error.message);
    }
  };

  const handleDiscountChange = (index, key, value) => {
    const updatedDiscRules = [...state.discRules];
    updatedDiscRules[index] = { ...updatedDiscRules[index], [key]: value };
    setState((prevState) => ({
      ...prevState,
      discRules: updatedDiscRules
    }));
  };
  
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-2xl font-bold text-center'>Edit Product</h2>
      <form
        className='flex flex-col gap-4'
        encType='multipart/form-data'
        onSubmit={handleSubmit(submitForm)}
      >
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='basis-1/2'>
            <div
              className='min-h-[300px] relative bg-center bg-cover cursor-pointer border-2 border-dashed flex justify-center items-center'
              onClick={() => imageChooserRef.current.click()}
              style={{ overflow: 'hidden' }}
            >
              {state.image ? (
                <img
                  src={URL.createObjectURL(state.image)}
                  alt="selected-image"
                  className='max-h-full h-full w-full object-cover object-center'
                />
              ) : (
                state.image_url ? (
                  <img
                    src={`${apiUrl}/images/${state.image_url?.split('\\')[2]}`}
                    alt="selected-image"
                    className='max-h-full h-full w-full object-cover object-center'
                  />
                ) : (
                  <p className='text-gray-500'>Select Image</p>
                )
              )}
            </div>
            <input
              type="file"
              accept='image/*'
              onChange={handleImageChange}
              ref={imageChooserRef}
              className='hidden'
            />
          </div>
          <div className='basis-1/2 flex flex-col gap-2 my-2'>
            <input
              className='border px-2 py-1 rounded-sm'
              type="text"
              placeholder='Name'
              defaultValue={state?.name}
              {...register('name')}
            />
            <input
              className='border px-2 py-1 rounded-sm'
              type="text"
              placeholder='Description'
              defaultValue={state?.description}
              {...register('description')}
            />
            <input
              className='border px-2 py-1 rounded-sm'
              type="number"
              placeholder='Price'
              defaultValue={state?.price}
              {...register('price')}
            />
            <select
              className='border px-2 py-1 rounded-sm text-base capitalize'
              value={state.category?._id || ''}
              onChange={(e) => {
                setState((prev) => ({ ...prev, category: { _id: e.target.value } }));
              }}
            >
              <option value="" className='text-base capitalize'>-- Select Category --</option>
              {currCategories?.map((category) => (
                <option
                  key={category?._id}
                  value={category?._id}
                  className='text-base capitalize'
                >
                  {category?.name}
                </option>
              ))}
            </select>
            <div className='flex justify-between items-center'>
              <h3>Discount Rules</h3>
              <Button
                padding='px-3 py-1'
                fontSize='text-sm'
                textColor='text-white'
                fontWeight='font-medium'
                bgColor='bg-blue-600'
                border='border'
                borderColor='border-transparent'
                borderRadius='rounded-full'
                text='Add new'
                clickEvent={handleAddDiscountRule}
              />
            </div>
            {state.discRules.length > 0 && (
              <div>
                <table>
                  <thead>
                    <tr className='text-left'>
                      <th>Min Qty</th>
                      <th>Discount (%)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.discRules.map((rule, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            value={rule.minQty}
                            onChange={(e) => handleDiscountChange(index, 'minQty', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={rule.discPerc}
                            onChange={(e) => handleDiscountChange(index, 'discPerc', e.target.value)}
                          />
                        </td>
                        <td>
                          <button type="button" onClick={() => handleDeleteDiscount(index)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <Button
          type='submit'
          padding='px-0 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor='bg-green-600'
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-full'
          text='Save changes'
        />
      </form>
      <div className='flex flex-col mt-4 gap-2'>
        <p className='text-center text-sm md:text-base'>Danger zone</p>
        <Button
          padding='px-0 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor='bg-red-600'
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-full'
          text='Delete product'
          clickEvent={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default EditProductForm;
