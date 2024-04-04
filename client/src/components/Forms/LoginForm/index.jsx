import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../Button';
import { IoCloseCircleOutline, IoCloseCircle } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { toggleModal } from '../../../redux/modalSlice';
import { addCurrUser } from '../../../redux/currUserSlice';
import { notifyFailed, notifySuccess } from '../../../helpers/toaster';
import { loginFormSchema } from '../../../helpers/zodSchema';

const LoginForm = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(loginFormSchema) });
  const submitForm = (data) => {
    fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.data) {
          dispatch(addCurrUser(data.data));
          notifySuccess(data.message);
          dispatch(toggleModal(''));
        } else {
          notifyFailed(data.message);
        }
      })
      .catch((error) => console.log(error.message));
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
      <h2 className='text-2xl font-bold text-center'>Login</h2>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit(submitForm)}
      >
        <div className='flex flex-col gap-2 my-2'>
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
          text='Login'
        />
      </form>
      <ul className='list-disc px-6 text-gray-700'>
        {errors.email ? <li className="text-sm">{errors.email.message}</li> : ''}
        {errors.password ? <li className="text-sm">{errors.password.message}</li> : ''}
      </ul>
    </div>
  )
};

export default LoginForm;