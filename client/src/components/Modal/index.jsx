import React from 'react';
import RegisterForm from '../Forms/RegisterForm';
import LoginForm from '../Forms/LoginForm';
import Cart from '../Cart';
import Invoice from '../Invoice';
import { useSelector } from 'react-redux';
import { selectModal } from '../../redux/modalSlice';
import Profile from '../Profile';

const Modal = ({ modalType }) => {
  const modalConfig = useSelector(selectModal);
  const modalContent = {
    register: <RegisterForm/>,
    login: <LoginForm/>,
    cart: <Cart/>,
    invoice: <Invoice/>,
    profile: <Profile/>,
  };

  return (
    <div className='fixed z-20 top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black bg-opacity-50'>
      <div className={`${modalConfig.modalWidth} px-5 py-4 bg-white rounded-md flex flex-col`}>
        {modalContent[modalType]}
      </div>
    </div>
  )
}

export default Modal