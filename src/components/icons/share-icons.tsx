import { SVGProps } from 'react';

export const FacebookShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <circle cx="30" cy="30" r="30" fill="#1877F2"/>
        <path d="M36.8 30h-5.2v16h-6.6V30h-4.4v-5.8h4.4v-4.3c0-4.4 2.7-6.8 6.6-6.8h5v5.8h-3.4c-2.1 0-2.5 1-2.5 2.5v2.8h5.9l-.9 5.8z" fill="white"/>
    </svg>
);

export const MessengerShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0099FF"/><stop offset="100%" stopColor="#A033FF"/></linearGradient></defs>
        <circle cx="30" cy="30" r="30" fill="url(#grad1)"/>
        <path d="M20.57,35.21l5.4-2.7,9.6-4.8,4.3-2.2-14-7.5-14,7.5,4.5,2.2,4-2.2Zm9.6-9.6-9.6,4.8,4.5,4.5,9.6-4.8-4.5-4.5Z" fill="white"/>
    </svg>
);

export const WhatsappShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <circle cx="30" cy="30" r="30" fill="#25D366"/>
        <path d="M40.3 33.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.7.1-1 .3-.3.4-1.1 1.3-1.3 1.6-.2.3-.5.3-.9.2-1.9-.7-3.6-1.7-5-3.3-1.1-.9-2-2-2.2-2.4-.2-.4 0-.6.2-1l.7-.8c.2-.2.4-.4.5-.6.2-.2.3-.4.1-.7l-2.8-6.7c-.4-.9-.8-1.2-1.2-1.2-.3 0-.7 0-.9 0s-.9.2-1.4.7c-.5.5-1.9 1.8-1.9 4.4 0 2.6 2 5.1 2.2 5.5.3.4 3.6 5.6 8.8 7.8 1.2.5 2.2.8 2.9 1 .9.3 1.8.2 2.5-.1.8-.4 2.4-2.5 2.8-3.3.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.8-.5z" fill="white"/>
    </svg>
);

export const LineShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <circle cx="30" cy="30" r="30" fill="#00B900"/>
        <path d="M42.5 17.5H17.5c-1.4 0-2.5 1.1-2.5 2.5v15c0 1.4 1.1 2.5 2.5 2.5H27v5.5l5.5-5.5h10c1.4 0 2.5-1.1 2.5-2.5v-15c0-1.4-1.1-2.5-2.5-2.5z" fill="white"/>
        <path d="M22.5 26h-3v-5h3v5zm-6 0h-3v-5h3v5zm13.5-3c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5zm-3 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5z" fill="#00B900"/>
    </svg>
);

export const InstagramShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <defs><radialGradient id="grad-insta" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs>
        <circle cx="30" cy="30" r="30" fill="url(#grad-insta)"/>
        <path d="M30 15c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="white" strokeWidth="2" />
        <circle cx="30" cy="30" r="6" fill="white"/>
        <circle cx="42" cy="18" r="2.5" fill="white"/>
    </svg>
);

export const CopyLinkIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <circle cx="30" cy="30" r="30" fill="#F0F0F0"/>
        <path d="M26.9,34.4h-4.3c-2.4,0-4.3-1.9-4.3-4.3v-4.3c0-2.4,1.9-4.3,4.3-4.3h4.3v4.3h-4.3v4.3h4.3V34.4z M33.1,21.6h4.3 c2.4,0,4.3,1.9,4.3,4.3v4.3c0,2.4-1.9,4.3-4.3,4.3h-4.3v-4.3h4.3v-4.3h-4.3V21.6z M26,30h8v-4h-8V30z" fill="#4A4A4A"/>
    </svg>
);

export const MoreShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 60 60" {...props}>
        <circle cx="30" cy="30" r="30" fill="#E9E9EB"/>
        <circle cx="18" cy="30" r="3" fill="#8E8E93"/>
        <circle cx="30" cy="30" r="3" fill="#8E8E93"/>
        <circle cx="42" cy="30" r="3" fill="#8E8E93"/>
    </svg>
);
