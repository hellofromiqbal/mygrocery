import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifyFailed, notifySuccess } from '../../../helpers/toaster';
import Button from '../../Button';
import { addNewProduct } from '../../../redux/currProductsSlice';
import { selectCurrCategories } from '../../../redux/currCategoriesSlice';
import { addNewProductFormSchema } from '../../../helpers/zodSchema';

const AddProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const currCategories = useSelector(selectCurrCategories);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(addNewProductFormSchema) });

  const [state, setState] = useState({
    category: '',
    image: null,
    discRules: []
  });

  const imageChooserRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setState((prev) => ({ ...prev, image: file }));
  };

  const handleRuleChange = (index, key, value) => {
    const updatedDiscRules = [...state.discRules];
    updatedDiscRules[index] = { ...updatedDiscRules[index], [key]: value };
    setState((prevState) => ({
      ...prevState,
      discRules: updatedDiscRules
    }));
  };
  
  const addRule = (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      discRules: [...prevState.discRules, { minQty: '', discPerc: '' }]
    }));
  };

  const deleteRule = (index) => {
    const updatedDiscRules = state.discRules.filter((_, i) => i !== index);
    setState((prevState) => ({
      ...prevState,
      discRules: updatedDiscRules
    }));
  };

  const submitForm = async (data) => {
    try {
      const hasEmptyRules = state.discRules.some(rule => !rule.minQty || !rule.discPerc);
      if (hasEmptyRules) {
        notifyFailed('Please fill in all discount rule fields.');
        return;
      }

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if(state.category) {
        formData.append('category', state.category);
      } else {
        notifyFailed('Category must be chosen.');
        return;
      }

      if(state.image) {
        formData.append('image', state.image);
      } else {
        notifyFailed('Image must be chosen.');
        return;
      }

      formData.append('discRules', JSON.stringify(state.discRules));

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        body: formData
      });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        console.log(result.data);
        dispatch(addNewProduct(result.data));
        notifySuccess(result.message);
        navigate("/");
      }
    } catch (error) {
      notifyFailed(error.message);
    }
    reset();
  };

  const handleAddDiscountRule = (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      discRules: [...prevState.discRules, { minQty: '', discPerc: '' }]
    }));
  };
  
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-2xl font-bold text-center'>New Product</h2>
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
              {state.image ?
                <img 
                  src={URL.createObjectURL(state.image)}
                  alt="selected-image"
                  className='max-h-full h-full w-full object-cover object-center'
                />
                :
                <p className='text-gray-500'>Select Image</p>
              }
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
              {...register('name')}
            />
            <input
              className='border px-2 py-1 rounded-sm'
              type="text"
              placeholder='Description'
              {...register('description')}
            />
            <input
              className='border px-2 py-1 rounded-sm'
              type="number"
              placeholder='Price'
              {...register('price')}
            />
            <select
              className='border px-2 py-1 rounded-sm text-base capitalize'
              value={state.category || ''}
              onChange={(e) => {
                setState((prev) => ({ ...prev, category: e.target.value }));
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
            <div>
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
              {state.discRules.length > 0 &&
                <table>
                <thead>
                  <tr className='text-left'>
                    <th>Min Qty</th>
                    <th>Discount</th>
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
                          onChange={(e) => handleRuleChange(index, 'minQty', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={rule.discPerc}
                          onChange={(e) => handleRuleChange(index, 'discPerc', e.target.value)}
                        />
                      </td>
                      <td>
                        <button type="button" onClick={() => deleteRule(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              }
            </div>
          </div>
        </div>
        <Button
          padding='px-0 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor={errors.name || errors.description || errors.price || !state.image || !state.category || state.discRules.some(rule => !rule.minQty || !rule.discPerc) ? 'bg-gray-400' : 'bg-green-600'}
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-full'
          text='Add Product'
          disabled={errors.name || errors.description || errors.price || !state.image || !state.category || state.discRules.some(rule => !rule.minQty || !rule.discPerc)}
        />
      </form>
    </div>
  )
};

export default AddProductForm;
