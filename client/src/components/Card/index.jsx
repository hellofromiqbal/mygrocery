import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormatter } from '../../../helpers/currencyFormatter';
import { BsBagPlus, BsBagPlusFill } from "react-icons/bs";
import { PiFireFill, PiCrownSimpleFill } from "react-icons/pi";
import { RiEdit2Fill } from "react-icons/ri";
import Button from '../Button';
import { useSelector, useDispatch } from 'react-redux';
import { addCartItemToCurrUser, removeCartItemFromCurrUser, selectCurrUser } from '../../redux/currUserSlice';
import { notifyFailed, notifySuccess } from '../../helpers/toaster';
import { toggleModal } from '../../redux/modalSlice';

const Card = ({ productId, name, description, price, image_url, tags }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUser = useSelector(selectCurrUser);
  const apiUrl = import.meta.env.VITE_API_URL;
  const alreadyInCart = currUser?.cart?.find((cartItem) => cartItem?.product?._id === productId);
  const handleAddToCart = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/cart-items`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId: currUser._id, productId })
      });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        dispatch(addCartItemToCurrUser(result.data));
        notifySuccess(result.message);
      }
    } catch (error) {
      notifyFailed(error.message);
    }
  };

  const handleDeleteFromCart = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/cart-items`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId: currUser._id, productId })
      });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        dispatch(removeCartItemFromCurrUser(productId));
        notifySuccess(result.message);
      }
    } catch (error) {
      notifyFailed(error.message);
    }
  };

  return (
    <div className='flex flex-col w-full md:w-[300px] shadow-md hover:shadow-xl transition-all duration-300'>
      <div
        className='min-h-[300px] bg-slate-300 relative bg-center bg-cover cursor-pointer'
        style={{ backgroundImage: `url(${apiUrl}/images/${image_url?.split('\\')[2]})` }}
      >
        <div className='absolute left-1 top-1 z-[5] flex gap-2'>
          {tags?.map((tag,index) => (
            <div key={index} className='bg-yellow-400 border-black text-black p-2 rounded-full'>
              {tag.name === 'signature' ?
                <PiCrownSimpleFill size={18}/>
                :
                <PiFireFill size={18}/>
              }
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col px-3 py-2'>
        <div className='flex flex-col'>
          <h2 className='text-lg font-bold'>{name}</h2>
          <p className='text-sm'>{description}</p>
          <p className='text-sm font-medium mt-2'>{currencyFormatter.format(price)}</p>
        </div>
        <div className='flex justify-end'>
          {currUser?.role === 'user' || currUser?.role === undefined ?
            <Button
              padding=''
              bgColor=''
              textColor='text-black'
              border=''
              borderRadius=''
              clickEvent={!currUser ? () => dispatch(toggleModal({ modalType: 'login', modalWidth: 'w-2/3 lg:w-1/3' })) : alreadyInCart ? handleDeleteFromCart : handleAddToCart}
              text={alreadyInCart ? <BsBagPlusFill size={21}/> : <BsBagPlus size={21}/>}
            />
            :
            <Button
              padding=''
              bgColor=''
              textColor='text-black'
              border=''
              borderRadius=''
              clickEvent={() => navigate(`/edit-product/${productId}`)}
              text={<RiEdit2Fill size={21}/>}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default Card