
import { SVGProps } from "react";

export const AgentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="12" fill="#7c3aed" />
        <g fill="white" transform="translate(4, 4) scale(0.66)">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </g>
    </svg>
);

export const AddHostIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="12" fill="#22C55E"/>
        <path d="M12 7v10M7 12h10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

export const InviteAgentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="12" fill="#3B82F6"/>
        <g stroke="white" strokeWidth="2" fill="none" transform="translate(3,3) scale(0.75)">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="m22 6-10 7L2 6" />
        </g>
    </svg>
);

export const CoinsTradingIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="12" fill="#F9A825"/>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" transform="scale(0.7) translate(4.5, 3.5)" fill="white"/>
    </svg>
);

export const AgentRewardIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="4" fill="#FB923C"/>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 2 2h14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.6) translate(8, 6)"/>
    </svg>
);

export const AgentRankingIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#14B8A6" />
        <g transform="translate(4, 4) scale(0.66)" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20V16"/>
        </g>
    </svg>
);

export const DiamondAgentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#60A5FA"/>
        <g stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, 4) scale(0.8)">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </g>
    </svg>
);

export const AgentActivitiesIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#EF4444"/>
        <g transform="translate(3, 3) scale(0.75)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
             <path d="M20 12v10H4V12"/>
             <path d="M20 7H4v5h16V7z"/>
             <path d="M12 22V7"/>
             <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
             <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </g>
    </svg>
);
