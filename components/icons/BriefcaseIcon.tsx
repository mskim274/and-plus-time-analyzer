
import React from 'react';

const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.075c0 1.313-.964 2.45-2.25 2.65-1.286.2-2.62.2-3.925 0-1.306-.2-2.64-.2-3.925 0-1.306.2-2.64.2-3.925 0-1.286-.2-2.62-.2-3.925 0-1.306.2-2.64.2-3.925 0-1.286.2-2.62.2-3.925 0-1.306.2-2.64.2-3.925 0C7.364 2.595 8.328 1.5 9.643 1.5h4.714c1.314 0 2.278 1.095 2.278 2.35v.225c0 .26.02.515.055.765.205 1.48.42 3.3.42 5.175 0 .225-.015.44-.045.65M20.25 6.5h-16.5"
    />
  </svg>
);

export default BriefcaseIcon;
