import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/modalSlice';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { addNewAddress, selectCurrUser, setAddresses } from '../../redux/currUserSlice';
import { notifyFailed, notifySuccess } from '../../helpers/toaster';
import Button from '../Button';

const Profile = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const currUser = useSelector(selectCurrUser);
  console.log(currUser);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/addresses/${currUser?._id}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => dispatch(setAddresses(data.data)));
  }, []);

  const submitForm = async (data) => {
    console.log(data);
    try {
      const res = await fetch(`${apiUrl}/api/addresses`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId: currUser?._id, fullAddress: data.fullAddress })
      });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        notifySuccess(result.message);
        dispatch(addNewAddress(result.data));
        setShowNewAddressForm((prev) => !prev);
        reset();
      }
    } catch (error) {
      notifyFailed(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-2 relative'>
      <button
        className='absolute -top-2 -right-2'
        onClick={() => dispatch(toggleModal(''))}
      >
        <IoCloseCircleOutline size={25}/>
      </button>
      <h2 className='text-2xl font-bold text-center'>My Profile</h2>
      <div className='flex flex-col gap-2 py-2 border-t max-h-[70vh] overflow-auto'>
        <ul>
          <li className='flex justify-between items-center'>
            <p className='text-sm font-medium'>Fullname:</p>
            <p className='text-sm text-gray-700'>{currUser?.fullname}</p>
          </li>
          <li className='flex justify-between items-center'>
            <p className='text-sm font-medium'>Email:</p>
            <p className='text-sm text-gray-700'>{currUser?.email}</p>
          </li>
          {currUser?.role === 'user' ?
            <li className='flex flex-col'>
              <p className='text-sm font-medium'>Address:</p>
              <ol className='list-decimal list-inside'>
                {currUser?.addresses.map((item) => (
                  <li key={item?._id} className='text-sm text-gray-700'>{item.fullAddress}</li>
                ))}
                <div>
                  {!showNewAddressForm ?
                    <button
                      className='text-sm bg-green-500 text-white font-medium px-2 rounded-md'
                      onClick={() => setShowNewAddressForm((prev) => !prev)}
                    >Add new</button>
                    : ''
                  }
                  {showNewAddressForm ?
                    <form onSubmit={handleSubmit(submitForm)}>
                      <textarea
                        className='w-full h-[100px] p-2 text-sm resize-none border rounded-sm'
                        {...register('fullAddress')}
                      />
                      <div className='flex justify-end gap-2'>
                        <button
                          className='text-sm bg-red-400 text-white font-medium px-2 rounded-md'
                          onClick={() => setShowNewAddressForm((prev) => !prev)}
                        >
                          Cancel
                        </button>
                        <button
                          className='text-sm bg-green-500 text-white font-medium px-2 rounded-md'
                        >
                          Save
                        </button>
                      </div>
                    </form>
                    : ''
                  }
                </div>
              </ol>
            </li>
            : ''
          }
        </ul>
      </div>
      <div className='flex justify-end items-center pt-2 border-t'>
        <Button
          padding='px-2 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor={showNewAddressForm ? 'bg-gray-300' : 'bg-green-600'}
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-md'
          disabled={showNewAddressForm}
          text='Okay'
          clickEvent={() => dispatch(toggleModal(''))}
        />
      </div>
    </div>
  )
};

export default Profile;