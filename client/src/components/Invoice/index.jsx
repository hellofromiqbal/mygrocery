import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../../redux/modalSlice';
import { IoCloseCircleOutline, IoCloseCircle } from "react-icons/io5";
import { editInvoice, selectCurrUser, setInvoices } from '../../redux/currUserSlice';
import { currencyFormatter } from '../../../helpers/currencyFormatter';
import { notifyFailed, notifySuccess } from '../../helpers/toaster';
import Button from '../Button';

const Invoice = () => {
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const currUser = useSelector(selectCurrUser);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const countTotal = (items, includeDeliveryFee) => {
    const deliveryFee = 10000;
    let totalExpenditure = 0;
  
    items.forEach((item) => {
      const { price, amount, discRules } = item;
      let discountedPrice = price;
  
      if (discRules && discRules.length > 0) {
        for (let i = 0; i < discRules.length; i++) {
          const rule = discRules[i];
          if (amount >= rule.minQty) {
            discountedPrice -= (price * rule.discPerc) / 100;
            break;
          }
        }
      }
  
      totalExpenditure += discountedPrice * amount;
    });
  
    if (includeDeliveryFee) {
      totalExpenditure += deliveryFee;
    }
  
    return totalExpenditure;
  };

  const handleChangeInvoicePaymentStatus = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/invoices`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ invoiceId: id, paymentStatus: selectedPaymentStatus })
      });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.message);
      } else {
        const result = await res.json();
        notifySuccess(result.message);
        dispatch(editInvoice({ invoiceId: id, paymentStatus: selectedPaymentStatus }));
        setSelectedPaymentStatus("");
      }
    } catch (error) {
      notifyFailed(error.message);
    }
  };

  const calculateDiscountedPrice = (item) => {
    const { price, amount, discRules } = item;
    console.log(discRules);
    let discountedPrice = price;
    if (discRules && discRules.length > 0) {
      for (let i = 0; i < discRules.length; i++) {
        const rule = discRules[i];
        if (amount >= rule.minQty) {
          discountedPrice -= (price * rule.discPerc) / 100;
          break;
        }
      }
    }
    return discountedPrice * amount;
  };
  

  useEffect(() => {
    fetch(`${apiUrl}/api/invoices/${currUser?._id}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setInvoices(data.data));
      });
  }, []);

  return (
    <div className='flex flex-col gap-2 relative'>
      <button
        className='absolute -top-2 -right-2'
        onClick={() => dispatch(toggleModal(''))}
      >
        <IoCloseCircleOutline size={25}/>
      </button>
      <h2 className='text-2xl font-bold text-center'>My Invoices</h2>
      <div className='flex flex-col gap-2 py-2 border-t max-h-[70vh] overflow-auto'>
        <ul className='flex flex-col gap-2'>
          {currUser?.invoices?.length < 1 ?
            <div className='flex justify-center items-center h-[100px]'>
              <h1 className='text-lg font-bold text-slate-300'>No invoice yet.</h1>
            </div>
            : ''
          }
          {currUser?.invoices?.map((invoice, index) => (
            <div key={index} className='border p-2'>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-bold border-b-2 border-yellow-400'>Invoice #{invoice?._id?.slice(0, 10)}</h3>
                {currUser?.role === 'admin' ?
                  <div className='flex gap-2'>
                    <select
                      className='border text-sm'
                      value={selectedPaymentStatus === "" ? invoice?.paymentStatus : selectedInvoice === invoice?._id ? selectedPaymentStatus : invoice?.paymentStatus}
                      onChange={(e) => {
                        setSelectedPaymentStatus(e.target.value);
                        setSelectedInvoice(invoice?._id);
                      }}
                    >
                      <option value="waiting_for_payment">waiting_for_payment</option>
                      <option value="delivering">delivering</option>
                      <option value="completed">completed</option>
                    </select>
                    {selectedPaymentStatus !== "" && selectedPaymentStatus !== invoice?.paymentStatus && selectedInvoice === invoice?._id ?
                      <button
                        className='px-2 bg-green-600 text-white text-sm font-medium rounded-sm'
                        onClick={() => handleChangeInvoicePaymentStatus(invoice?._id)}
                      >Save</button>
                      : ''
                    }
                  </div>
                  :
                  <p className={
                    invoice?.paymentStatus === 'waiting_for_payment' ? 'bg-red-400 font-medium text-white px-2'
                    : invoice?.paymentStatus === 'delivering' ? 'bg-slate-500 font-medium text-white px-2' : 'bg-yellow-400 font-medium text-black px-2'
                  }>{invoice?.paymentStatus}</p>
                }
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                  <p className='font-medium'>FROM</p>
                  <ul>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Seller:</p>
                      <p className='text-sm font-medium'>MyGrocery</p>
                    </li>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Bank account number:</p>
                      <p className='text-sm font-medium'>123-XXX-XXX</p>
                    </li>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Admin contact:</p>
                      <p className='text-sm font-medium'>+123-XXX-XXX</p>
                    </li>
                    {invoice?.paymentStatus === 'waiting_for_payment' ?
                      <div>
                        <small className='text-red-500'>* This item will be delivered after payment and payment confirmation to the admin.</small>
                      </div>
                      : ''
                    }
                  </ul>
                </div>
                <div className='flex flex-col'>
                  <p className='font-medium'>FOR</p>
                  <ul>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Buyer:</p>
                      <p className='text-sm font-medium'>{invoice?.user?.fullname}</p>
                    </li>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Date of purchase:</p>
                      <p className='text-sm font-medium'>{invoice?.createdAt?.toString().split('T')[0]}</p>
                    </li>
                    <li className='flex justify-between items-center'>
                      <p className='text-sm text-gray-700'>Delivery address:</p>
                      <p className='text-sm font-medium'>{invoice?.selectedAddress}</p>
                    </li>
                  </ul>
                </div>
                <div className='flex flex-col'>
                  <p className='font-medium'>ITEM INFO</p>
                  <ul>
                    {invoice?.items?.map((item) => (
                      <li key={item?._id} className='flex flex-col'>
                        <div className='flex justify-between items-center'>
                          <div className='flex gap-2'>
                            <p className='text-sm text-gray-700'>{item?.productName}</p>
                            <p className='text-sm text-gray-700'>x {item?.amount}</p>
                          </div>
                          <p className='text-sm'>{currencyFormatter.format(calculateDiscountedPrice(item))}</p>

                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='font-medium'>TOTAL PRICE</p>
                  <p className='font-medium'>{currencyFormatter.format(countTotal(invoice?.items, false))}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='text-sm'>Delivery fee</p>
                  <p className='text-sm'>{currencyFormatter.format(10000)}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='font-medium'>TOTAL EXPENDITURE</p>
                  <p className='font-medium'>{currencyFormatter.format(countTotal(invoice?.items, true))}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='font-medium'>TOTAL BILL</p>
                  <p className='font-bold text-lg'>{currencyFormatter.format(countTotal(invoice?.items, true))}</p>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div className='flex justify-end items-center pt-2'>
        <Button
          padding='px-2 py-1'
          fontSize='text-base'
          textColor='text-white'
          fontWeight='font-medium'
          bgColor={'bg-green-600'}
          border='border'
          borderColor='border-transparent'
          borderRadius='rounded-md'
          text='Okay'
          clickEvent={() => dispatch(toggleModal(''))}
        />
      </div>
    </div>
  )
};

export default Invoice;