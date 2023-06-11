// components/CustomDialog.tsx
import React, { MouseEvent, useEffect } from 'react';

interface CustomDialogProps {
  show: boolean;
  title: string;
  message: string;
  onButtonClick: (buttonIndex: number) => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ show, title, message, onButtonClick }) => {  
  if (!show) {
    return null;
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    onButtonClick(index);
  };

  
  return (
    <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-opacity-5 flex justify-center items-center">
      <div className="bg-white p-5 rounded-md w-1/2 ">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="buttons">
          <button onClick={(e) => handleClick(e, 1)}>Button 1</button>
          <button onClick={(e) => handleClick(e, 2)}>Button 2</button>
          <button onClick={(e) => handleClick(e, 3)}>Button 3</button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
