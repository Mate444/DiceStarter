import React from 'react';
import './loadingScreen';
import loading from '../../../img/loading.gif';
import './loadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className='LoadingScreenAll'>
      <img className='LoadingScreenGif' src={loading}/>
    </div>
  );
};

export default LoadingScreen;
