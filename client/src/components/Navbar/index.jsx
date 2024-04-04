import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { BsReceipt, BsBag, BsFilePlusFill  } from "react-icons/bs";
import { FaRegCircleUser, FaCircleUser } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/modalSlice';
import { addCurrUser, removeCurrUser, selectCurrUser } from '../../redux/currUserSlice';
import { notifySuccess } from '../../helpers/toaster';
import { Link } from 'react-router-dom';
import { addCurrProducts } from '../../redux/currProductsSlice';
import { addCurrCategories, selectCurrCategories } from '../../redux/currCategoriesSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const currUser = useSelector(selectCurrUser);
  const currCategories = useSelector(selectCurrCategories);
  const [searchCriteria, setSearchCriteria] = useState({
    q: '',
    cat: '',
  });
  const handleLogout = () => {
    fetch(`${apiUrl}/auth/logout`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        notifySuccess(data.message);
        dispatch(removeCurrUser());
      })
      .catch((error) => console.log(error.message));
  };

  const handleSearch = ({ inputSearch, category }) => {
    setSearchCriteria((prev) => ({
      ...prev,
      q: inputSearch !== undefined ? inputSearch : prev.q,
      cat: category !== undefined ? category : prev.cat,
    }));
  };

  const handleFocus = () => {
    const menuSection = document.getElementById('menuSection');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetch(`${apiUrl}/auth/me`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        dispatch(addCurrUser(data.data));
      })
      .catch((error) => console.log(error.message));
  }, []);

  useEffect(() => {
    let url = `${apiUrl}/api/products`;
    
    const queryParams = [];
    if (searchCriteria.q !== '') {
      queryParams.push(`q=${searchCriteria.q}`);
    }

    if (searchCriteria.cat !== '') {
      queryParams.push(`cat=${searchCriteria.cat}`);
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
  
    fetch(url)
      .then((res) => res.json())
      .then((data) => dispatch(addCurrProducts(data.data)))
      .catch((error) => console.log(error.message));
  }, [searchCriteria.q, searchCriteria.cat]);

  useEffect(() => {
    fetch(`${apiUrl}/api/categories`)
      .then((res) => res.json())
      .then((data) => dispatch(addCurrCategories((data.data))))
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <nav className='fixed z-10 bg-white w-full max-w-[1440px] flex justify-between items-center h-14 px-4 md:px-8 border-b-[1px] shadow-sm'>
      <Link
        className='text-2xl font-medium text-green-600'
        to={"/"}
      >MyGrocery</Link>
      <div className='hidden md:flex items-center gap-4'>
        <div className='flex gap-2'>
          <input
            type="search"
            className='rounded-sm border w-[250px] px-2 py-1'
            placeholder='Search...'
            onChange={(e) => handleSearch({ inputSearch: e.target.value })}
            onFocus={handleFocus}
          />
          <select
            className='border w-max px-2 py-1 text-sm capitalize'
            onChange={(e) => handleSearch({ category: e.target.value })}
            onClick={handleFocus}
          >
            <option value="" className='text-xs lg:text-sm'>All</option>
            {currCategories?.map((category) => (
              <option
                key={category?._id}
                value={category?._id}
                className='text-xs lg:text-sm'
              >{category?.name}</option>
            ))}
          </select>
        </div>
        {currUser ?
          <button
            className='flex relative'
            onClick={() => dispatch(toggleModal({ modalType: 'invoice', modalWidth: 'md:w-11/12 lg:w-2/3' }))}
          >
            {currUser && currUser.invoices.length > 0 ?
              <div className='absolute -top-2 -right-2 rounded-full bg-red-500 w-5 h-5 flex justify-center items-center'>
                <small className='text-white text-xs font-extrabold'>{currUser.invoices.length}</small>
              </div>
              : ''
            }
              {currUser?.role === 'user' ?
                <BsReceipt size={21}/>
                :
                <FaReceipt size={21}/>
              }
          </button>
          : ''
        }
        {currUser?.role === 'user' ?
          <button
            className='flex relative'
            onClick={() => dispatch(toggleModal({ modalType: 'cart', modalWidth: 'md:w-11/12 lg:w-2/3' }))}
          >
            {currUser && currUser.cart.length > 0 ?
              <div className='absolute -top-2 -right-2 rounded-full bg-red-500 w-5 h-5 flex justify-center items-center'>
                <small className='text-white text-xs font-extrabold'>{currUser.cart.length}</small>
              </div>
              : ''
            }
              <BsBag size={21}/>
          </button>
          : ''
        }
        {currUser ?
          currUser?.role === 'user' ?
            <button
              className='flex relative'
              onClick={() => dispatch(toggleModal({ modalType: 'profile', modalWidth: 'md:w-4/5 lg:w-1/2' }))}
            >
              <FaRegCircleUser size={21}/>
            </button>
            :
            <>
              <button
                className='flex relative'
                onClick={() => navigate("/add-product")}
              >
                <BsFilePlusFill size={21}/>
              </button>
              <button
                className='flex relative'
                onClick={() => dispatch(toggleModal({ modalType: 'profile', modalWidth: 'md:w-4/5 lg:w-1/2' }))}
              >
                <FaCircleUser size={21}/>
              </button>
            </>
          : ''
        }
        <ul className='flex gap-3 ps-4 border-s'>
          {!currUser ?
            <li>
              <Button
                padding='px-3 py-1'
                fontSize='text-sm'
                textColor='text-white'
                fontWeight='font-medium'
                bgColor='bg-green-600'
                border='border'
                borderColor='border-transparent'
                borderRadius='rounded-md'
                text='Register'
                clickEvent={() => dispatch(toggleModal({ modalType: 'register', modalWidth: 'w-2/3 lg:w-1/3' }))}
              />
            </li>
            : ''
          }
          <li>
            <Button
              padding='px-3 py-1'
              fontSize='text-sm'
              fontWeight='font-medium'
              border='border'
              borderRadius='rounded-md'
              textColor={currUser ? 'text-white' : 'text-green-600'}
              bgColor={currUser ? 'bg-red-500' : 'bg-transparent'}
              borderColor={currUser ? 'border-transparent' : 'border-green-600'}
              text={currUser ? 'Logout' : 'Login'}
              clickEvent={currUser ? handleLogout : () => dispatch(toggleModal({ modalType: 'login', modalWidth: 'w-2/3 lg:w-1/3' }))}
            />
          </li>
        </ul>
      </div>
      <ul className='flex md:hidden gap-2'>
        {!currUser ?
          <li>
            <Button
              padding='px-3 py-1'
              fontSize='text-sm'
              textColor='text-white'
              fontWeight='font-medium'
              bgColor='bg-green-600'
              border='border'
              borderColor='border-transparent'
              borderRadius='rounded-md'
              text='Register'
              clickEvent={() => dispatch(toggleModal({ modalType: 'register', modalWidth: 'w-11/12 md:w-2/3 lg:w-1/3' }))}
            />
          </li>
          : ''
        }
        <li>
          <Button
            padding='px-3 py-1'
            fontSize='text-sm'
            fontWeight='font-medium'
            border='border'
            borderRadius='rounded-md'
            textColor={currUser ? 'text-white' : 'text-green-600'}
            bgColor={currUser ? 'bg-red-500' : 'bg-transparent'}
            borderColor={currUser ? 'border-transparent' : 'border-green-600'}
            text={currUser ? 'Logout' : 'Login'}
            clickEvent={currUser ? handleLogout : () => dispatch(toggleModal({ modalType: 'login', modalWidth: 'w-11/12 md:w-2/3 lg:w-1/3' }))}
          />
        </li>
      </ul>
    </nav>
  )
};

export default Navbar;