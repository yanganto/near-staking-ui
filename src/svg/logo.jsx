import React from 'react';

const Logo = ({ firstColor, secondColor }) => {
  return (
    <svg
      width="49"
      height="49"
      viewBox="0 0 49 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.9682 26.3524C48.7784 30.0732 47.7426 33.7014 45.9399 36.9612C45.4493 37.9982 44.3934 38.7156 43.17 38.7156H8.58292C6.89155 38.7156 5.52042 37.3445 5.52042 35.6531C5.52042 33.9617 6.89155 32.5906 8.58292 32.5906H41.2809C42.2016 30.5269 42.7356 28.3065 42.8512 26.0404C42.9943 23.2333 42.4916 20.4308 41.3817 17.8484C40.2717 15.2661 38.5842 12.9728 36.4489 11.1451C34.3135 9.3173 31.7874 8.00375 29.0647 7.30551C26.3421 6.60726 23.4955 6.54292 20.7441 7.11744C17.9927 7.69196 15.4098 8.89003 13.1941 10.6195C10.9783 12.3489 9.1889 14.5636 7.96343 17.0931C7.15184 18.7683 6.60193 20.5521 6.32776 22.3823H26.8819C28.5733 22.3823 29.9444 23.7534 29.9444 25.4448C29.9444 27.1361 28.5733 28.5073 26.8819 28.5073H3.0625C1.37113 28.5073 0 27.1361 0 25.4448C0 25.3778 0.00214763 25.3114 0.00637775 25.2455L0.000406218 25.2456C-0.0211724 21.498 0.817277 17.7953 2.45124 14.4226C4.0852 11.0499 6.47113 8.097 9.42542 5.7911C12.3797 3.4852 15.8236 1.88778 19.4922 1.12175C23.1607 0.355727 26.9561 0.441513 30.5863 1.37251C34.2165 2.30351 37.5847 4.0549 40.4318 6.49193C43.2789 8.92895 45.529 11.9867 47.0089 15.4297C48.4888 18.8728 49.1591 22.6096 48.9682 26.3524ZM20.9065 42.2706C19.2152 42.2706 17.844 43.6417 17.844 45.3331C17.844 47.0245 19.2152 48.3956 20.9065 48.3956H27.6322C29.3236 48.3956 30.6947 47.0245 30.6947 45.3331C30.6947 43.6417 29.3236 42.2706 27.6322 42.2706H20.9065Z"
        fill="url(#paint0_linear_664_993)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_664_993"
          x1="-7.69338"
          y1="24.5"
          x2="49.0001"
          y2="48.3955"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={firstColor} />
          <stop offset="1" stopColor={secondColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
