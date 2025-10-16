// This file now only contains custom icons not available in the Lucide library,
// such as specific brand logos or unique application icons.

export const CampaignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25c.218-.09.448-.163.684-.219l1.125-.218a2.25 2.25 0 012.006 1.41l.163.702M10.125 2.25a2.25 2.25 0 00-2.25 2.25v.219m2.25-2.438a2.25 2.25 0 012.25 2.25M15 11.25l1.5-1.5-1.5-1.5M16.5 9.75h-6" />
    </svg>
);

export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a2 2 0 0 0-2 2v10a4 4 0 1 1-4-4h2a2 2 0 1 0 0-4H8a6 6 0 1 0 6 6V4a2 2 0 0 0-2-2zM16 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
    </svg>
);

export const YouTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.2 8.1c-.2-1.5-1.5-2.8-3-3C16.2 4.5 12 4.5 12 4.5s-4.2 0-6.2.6c-1.5.2-2.8 1.5-3 3C2.2 10.2 2.2 12 2.2 12s0 1.8.6 3.9c.2 1.5 1.5 2.8 3 3C7.8 19.5 12 19.5 12 19.5s4.2 0 6.2-.6c1.5-.2 2.8-1.5 3-3 .6-2.1.6-3.9.6-3.9s0-1.8-.6-3.9zM9.8 14.8V9.2l4.8 2.8-4.8 2.8z"/>
    </svg>
);
