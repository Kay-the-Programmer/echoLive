
import { SVGProps } from 'react';

const SeatSquare = ({ isFilled = true, ...props }: SVGProps<SVGRectElement> & { isFilled?: boolean }) => (
  <rect fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" {...props} />
);

export const FourSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" {...props}>
    <SeatSquare x="2" y="2" width="17" height="17" rx="1.5" />
    <SeatSquare x="21" y="2" width="17" height="17" rx="1.5" />
    <SeatSquare x="2" y="21" width="17" height="17" rx="1.5" />
    <SeatSquare x="21" y="21" width="17" height="17" rx="1.5" />
  </svg>
);

export const SixSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 40 40" {...props}>
        <SeatSquare x="2" y="2" width="11.33" height="17" rx="1.5" />
        <SeatSquare x="14.33" y="2" width="11.33" height="17" rx="1.5" />
        <SeatSquare x="26.66" y="2" width="11.33" height="17" rx="1.5" />
        <SeatSquare x="2" y="21" width="11.33" height="17" rx="1.5" />
        <SeatSquare x="14.33" y="21" width="11.33" height="17" rx="1.5" />
        <SeatSquare x="26.66" y="21" width="11.33" height="17" rx="1.5" />
    </svg>
);

export const NineSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 40 40" {...props}>
        <SeatSquare x="2" y="2" width="11" height="11" rx="1.5" />
        <SeatSquare x="14.5" y="2" width="11" height="11" rx="1.5" />
        <SeatSquare x="27" y="2" width="11" height="11" rx="1.5" />
        <SeatSquare x="2" y="14.5" width="11" height="11" rx="1.5" />
        <SeatSquare x="14.5" y="14.5" width="11" height="11" rx="1.5" />
        <SeatSquare x="27" y="14.5" width="11" height="11" rx="1.5" />
        <SeatSquare x="2" y="27" width="11" height="11" rx="1.5" />
        <SeatSquare x="14.5" y="27" width="11" height="11" rx="1.5" />
        <SeatSquare x="27" y="27" width="11" height="11" rx="1.5" />
    </svg>
);

export const SixteenSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" {...props}>
    <SeatSquare x="3" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="3" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="12.75" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="22.5" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="32.25" width="7.75" height="7.75" rx="1" />
  </svg>
);

export const TwentyOneSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" {...props}>
    <SeatSquare x="3" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="3" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="12.75" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="22.5" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="32.25" width="7.75" height="7.75" rx="1" />
  </svg>
);

export const TwentySixSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 40" {...props}>
    <SeatSquare x="3" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="3" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="12.75" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="22.5" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="32.25" width="7.75" height="7.75" rx="1" />
  </svg>
);

export const ThirtyOneSeatsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 40 40" {...props}>
    <SeatSquare x="3" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="3" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="3" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="12.75" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="12.75" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="22.5" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="22.5" width="7.75" height="7.75" rx="1" />

    <SeatSquare x="3" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="12.75" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="22.5" y="32.25" width="7.75" height="7.75" rx="1" />
    <SeatSquare x="32.25" y="32.25" width="7.75" height="7.75" rx="1" />
  </svg>
);

    

    
