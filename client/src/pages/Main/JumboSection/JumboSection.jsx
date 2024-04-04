import React from 'react';
import jumboImage from '../../../assets/images/jumbotron.jpg';

const JumboSection = () => {
  return (
    <section className='h-[500px] flex justify-center items-center relative'>
      <img
        src={jumboImage}
        alt="jumbo-image"
        className='absolute w-full h-full -z-10'
      />
      <div className='flex flex-col'>
        <h1 className='text-green-600 font-bold text-8xl'>MyGrocery</h1>
        <p className='text-lg font-medium ps-2'>Your tummy's best friend.</p>
      </div>
    </section>
  )
};

export default JumboSection;