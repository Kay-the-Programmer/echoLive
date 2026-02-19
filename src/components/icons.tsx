
import { SVGProps } from "react";
import { cn } from "@/lib/utils";

export const BitcoinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.25 8.75h4.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-4.5" />
    <path d="M12.75 6.25v-1.5" />
    <path d="M12.75 17.75v-1.5" />
    <path d="M15.75 8.75h-3" />
    <path d="M11.25 14.75h4.5" />
    <path d="M8.25 8.75h-1.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h1.5" />
    <path d="M20.93 14c.28-1.03.43-2.1.43-3.2 0-5.18-3.95-9.4-8.86-9.4S3.64 5.62 3.64 10.8c0 1.1.15 2.17.43 3.2" />
  </svg>
);

export const BinanceIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M16.624 13.92l3.376-3.375L24 12l-3.376 3.375.001-3.455zM0 12l3.375-3.375 3.375 3.375L3.375 15.375 0 12zm7.38 6.625l3.375-3.375 3.375 3.375-3.375 3.375-3.375-3.375zm0-13.25L10.755 2.25l3.375 3.375-3.375 3.375-3.375-3.375zM12 14.737l-2.69-2.688 2.69-2.737 2.688 2.737-2.688 2.688z"/>
    </svg>
);


export const YellowCardIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M23.6 11.2c-.2-3.3-1.6-6.2-3.8-8.4-2.3-2.3-5.2-3.7-8.6-3.8h-.4C4.1 0 0 4.1 0 9.2v.4C0 15.9 4.1 20 9.2 20h.4c3.3-.1 6.3-1.5 8.5-3.8 2.3-2.3 3.7-5.2 3.8-8.5v-.5zM7.7 15.8h2.3l.5-2.5h-2.2l-.5 2.5zm1.5-3.8h2.2l.5-2.5h-2.2l-.5 2.5zm1.4-3.8h2.2l.5-2.5h-2.2L10.6 8.2z"/>
    </svg>
);

export const CryptoWalletIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"/>
        <path d="M4 6v12h16v-4"/>
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1-.9-2-2-2Z"/>
    </svg>
);

export const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#1877F2"
      {...props}
    >
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
);

export const YouTubeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#FF0000"
      {...props}
    >
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
    </svg>
);

export const FlagIcon = ({ code, className, ...props }: SVGProps<SVGSVGElement> & { code: string }) => (
    <img
      src={`https://flagsapi.com/${code}/flat/64.png`}
      alt={`${code} flag`}
      className={cn("h-5 w-5", className)}
      {...props}
    />
);

export const MultiFlagIcon = (props: SVGProps<SVGSVGElement>) => (
  <div className="flex items-center space-x-[-8px]">
    <FlagIcon code="GH" className="h-5 w-5 rounded-full object-cover border-2 border-background" />
    <FlagIcon code="US" className="h-5 w-5 rounded-full object-cover border-2 border-background" />
    <FlagIcon code="GB" className="h-5 w-5 rounded-full object-cover border-2 border-background" />
  </div>
);

export const TRCIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="12" fill="#14B8A6"/>
        <path d="M12.08 4.64001L17.68 7.76001L12.08 10.88L6.47998 7.76001L12.08 4.64001Z" fill="white"/>
        <path d="M12.08 12.04L17.68 8.92L17.68 15.16L12.08 18.28L6.47998 15.16L6.47998 8.92L12.08 12.04Z" fill="white" fillOpacity="0.7"/>
    </svg>
);

export const EpayIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="12" fill="#3B82F6"/>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">epay</text>
    </svg>
);

export const PayoneerIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="payoneerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8C00"/>
                <stop offset="100%" stopColor="#FF4500"/>
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#payoneerGradient)"/>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">PAYONEER</text>
    </svg>
);

export const OIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
    </svg>
);

export const EthereumIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.944 17.97L4.58 13.62l7.364 4.35z" fill="#3C3C3B"/>
        <path d="M11.944 17.97l7.365-4.35-7.365 4.35z" fill="#8C8C8B"/>
        <path d="M11.944 3.001l7.365 10.618-7.365-4.35z" fill="#3C3C3B"/>
        <path d="M11.944 3.001L4.58 13.619l7.364-4.35z" fill="#8C8C8B"/>
        <path d="M4.58 13.62l7.364 4.35v-9.336z" fill="#141414"/>
        <path d="M19.309 13.62l-7.365 4.35v-9.336z" fill="#393939"/>
    </svg>
);

export const MtnMobileMoneyIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#FFCC00"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#004A8F" fontSize="9" fontWeight="bold">MTN</text>
    </svg>
);

export const AirtelMobileMoneyIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#E50000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Airtel</text>
    </svg>
);

export const NowPaymentsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="currentColor"/>
        <path d="M6.5 17V7H11.7C13.2933 7 14.5867 7.46 15.58 8.38C16.5867 9.28667 17.09 10.4 17.09 11.72C17.09 12.5133 16.9033 13.22 16.53 13.84C16.1567 14.4467 15.64 14.92 14.98 15.26L18 17H16.2L13.44 14.54H10.1V17H6.5ZM10.1 12.98H11.41C12.1833 12.98 12.79 12.76 13.23 12.32C13.67 11.8667 13.89 11.3133 13.89 10.66C13.89 10.02 13.67 9.48667 13.23 9.06C12.79 8.62 12.1833 8.4 11.41 8.4H10.1V12.98Z" fill="white"/>
    </svg>
);
