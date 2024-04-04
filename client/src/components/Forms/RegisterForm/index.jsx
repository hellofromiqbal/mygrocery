import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../Button';
import { IoCloseCircleOutline, IoCloseCircle } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { toggleModal } from '../../../redux/modalSlice';
import { registerFormSchema } from '../../../helpers/zodSchema';
import { notifyFailed, notifySuccess } from '../../../helpers/toaster';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(registerFormSchema) });
  const submitForm = (data) => {
    fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        fullname: data.fullname,
        email: data.email,
        password: data.password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        notifySuccess(data.message);
        dispatch(toggleModal(''));
      })
      .catch((error) => {
        notifyFailed(error.message);
      });
    reset();
  };
  
  return (
    <div className='flex flex-col gap-2 relative'>
      <button
        className='absolute -top-2 -right-2'
        onClick={() => dispatch(toggleModal(''))}
      >
        <IoCloseCircleOutline size={25}/>
      </button>
      <h2 className='text-2xl font-bold text-center'>Register</h2>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit(submitForm)}
      >
        <div className='flex flex-col gap-2 my-2'>
          <input
            className='border px-2 py-1 rounded-sm'
            type="text"
            placeholder='Fullname'
            {...register('fullname')}
          />
          <input
            className='border px-2 py-1 rounded-sm'
            type="email"
            placeholder='Email'
            {...register('email')}
          />
          <input
            className='border px-2 py-1 rounded-sm'
            type="password"
            placeholder='Password'
            {...register('password')}
          />
          <input
            className='border px-2 py-1 rounded-sm'
            type="password"
            placeholder='Confirm password'
            {...register('confirmPassword')}
          />
        </div>
        <Button
          padding='px-0 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor='bg-green-600'
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-full'
          text='Register'
        />
      </form>
      <ul className='list-disc px-6 text-gray-700'>
        {errors.fullname ? <li className="text-sm">{errors.fullname.message}</li> : ''}
        {errors.email ? <li className="text-sm">{errors.email.message}</li> : ''}
        {errors.password ? <li className="text-sm">{errors.password.message}</li> : ''}
        {errors.confirmPassword ? <li className="text-sm">{errors.confirmPassword.message}</li> : ''}
      </ul>
    </div>
  )
};

export default RegisterForm;