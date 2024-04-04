import React from 'react';
import AllMenuSection from './AllMenuSection/AllMenuSection';
import JumboSection from './JumboSection/JumboSection';
import { useSelector } from 'react-redux';
import { selectCurrUser } from '../../redux/currUserSlice';

const MainPage = () => {
  const currUser = useSelector(selectCurrUser);
  return (
    <div>
      {currUser?.role === 'user' || currUser?.role === undefined ?
        <>
          <JumboSection/>
          <AllMenuSection/>
        </>
        :
        <AllMenuSection/>
      }
    </div>
  )
};

export default MainPage;