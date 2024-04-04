import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Main from './pages/Main'
import Modal from './components/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { selectModal } from './redux/modalSlice'
import AddProductPage from './pages/AddProduct'
import EditProductPage from './pages/EditProduct'
import NavbarMobile from './components/NavbarMobile'


const App = () => {
  const modal = useSelector(selectModal)
  
  return (
    <div className='relative mb-20 md:mb-0'>
      {modal.showModal === true ? <Modal modalType={modal.modalType}/> : ''}
      <Navbar />
      <div className='pt-14'>
        <Routes>
          <Route path="/" exact element={<Main />} />
          <Route path="/add-product" exact element={<AddProductPage />} />
          <Route path="/edit-product/:id" exact element={<EditProductPage />} />
        </Routes>
      </div>
      <div className='md:hidden'>
        <NavbarMobile/>
      </div>
    </div>
  )
}

export default App