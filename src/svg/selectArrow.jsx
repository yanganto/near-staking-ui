import React from 'react';

const SelectArrow = (props) => {
  return (
    <svg
      {...props}
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.49971 0H6.27971C8.48637 0 9.39304 1.56667 8.28637 3.48L7.39304 5.02L6.49971 6.56C5.39304 8.47333 3.58637 8.47333 2.47971 6.56L1.58637 5.02L0.693041 3.48C-0.393625 1.56667 0.506375 0 2.71971 0H4.49971Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SelectArrow;
