
import { SVGProps } from 'react';

export const PKIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_303_3)">
      <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#FF1D53"/>
      <path d="M11.904 25V11.244H15.828V15.228H18.732C20.664 15.228 22.068 16.032 22.944 17.64C23.364 18.444 23.574 19.38 23.574 20.448C23.574 21.516 23.364 22.452 22.944 23.256C22.068 24.864 20.664 25.668 18.732 25.668H14.544V27.6H11.904V25ZM14.544 22.992H18.732C19.746 22.992 20.46 22.5 20.874 21.516C21.084 21.024 21.189 20.52 21.189 20.004C21.189 19.488 21.084 18.984 20.874 18.492C20.46 17.508 19.746 17.016 18.732 17.016H14.544V22.992Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_303_3">
        <rect width="36" height="36" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const GameIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="18" cy="18" r="18" fill="url(#paint0_linear_303_2)"/>
        <path d="M23 15.5C23 14.1193 21.8807 13 20.5 13C19.1193 13 18 14.1193 18 15.5V22H23V15.5Z" fill="#F4A22A"/>
        <path d="M15.0016 18.024L15 17.5C15 15.567 16.567 14 18.5 14H19C21.2091 14 23 15.7909 23 18V22H18.5C16.567 22 15 20.433 15 18.5L15.0016 18.024Z" fill="#F4A22A"/>
        <path d="M19.5 22V18C19.5 16.6193 18.3807 15.5 17 15.5C15.6193 15.5 14.5 16.6193 14.5 18V22H19.5Z" fill="#F2780C"/>
        <path d="M26 23C26 24.1046 22.5228 25 18 25C13.4772 25 10 24.1046 10 23C10 21.8954 13.4772 21 18 21C22.5228 21 26 21.8954 26 23Z" fill="#16A05D"/>
        <path d="M25.5 23C25.5 23.8284 22.2591 24.5 18 24.5C13.7409 24.5 10.5 23.8284 10.5 23C10.5 22.1716 13.7409 21.5 18 21.5C22.2591 21.5 25.5 22.1716 25.5 23Z" fill="#32BE76"/>
        <defs>
        <linearGradient id="paint0_linear_303_2" x1="18" y1="0" x2="18" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F9D423"/>
        <stop offset="1" stopColor="#F89228"/>
        </linearGradient>
        </defs>
    </svg>
);
