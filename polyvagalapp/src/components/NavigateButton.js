import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavigateButton() {
   const navigate = useNavigate();

   const handleClick = () => {
      navigate('/calibrationpage'); // Replace '/about' with the path you want to navigate to
   };

   return (
      <button onClick={handleClick}>
         Callibrate your app to fit you
      </button>
   );
}

export default NavigateButton;
