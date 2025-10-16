import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Plus, Minus, Sparkles, Lightbulb } from 'lucide-react';
// Simple fallback for masterclassImages since assets module doesn't exist
const masterclassImages = {
  module1: '/default-module1.jpg',
  module2: '/default-module2.jpg',
  module3: '/default-module3.jpg',
  module4: '/default-module4.jpg',
  module5: '/default-module5.jpg'
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-insight to-brand-primary">
        {children}
    </span>
);

type ContentSection = {
    type: 'subheading' | 'paragraph' | 'list' | 'tip';
    text?: React.ReactNode;
    items?: React.ReactNode[];
}

const masterclassContent: {
    title: string;
    // FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
    icon: React.ReactNode;
    image: string;
    sections: ContentSection[];
}[] = [
    {
        title: "Module 1: Foundations & The Middleman Model",
        icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
        image: masterclassImages.module1,
        sections: [
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>You Are the Middleman</Highlight></> },
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'paragraph', text: <>The world runs on middlemen. Uber connects drivers and riders. An influencer marketing agency operates on this exact same proven model. You simply connect supply (influencers with attention) and demand (brands who need attention) and take a cut for making the deal happen. You are <Highlight>brokering attention</Highlight>, which is the most valuable currency in the digital age.</> },
            { type: 'subheading', text: 'Why This is a Massive Opportunity Right Now' },
            { type: 'list', items: [
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <>Ad Costs are Skyrocketing: Traditional ads on platforms like Facebook and TikTok are becoming more expensive and less effective. Brands are desperate for alternatives that offer <Highlight>real ROI</Highlight>.</>,
                'Saturation in Other Models: Business models like SMMA are incredibly saturated. Brands are tired of hearing the same pitch from thousands of agencies. Influencer marketing is a fresh, proven channel.',
                'The Trust Factor: A recommendation from a trusted creator is far more powerful than a traditional ad.',
                'A Massive, Untapped Gap: Most brands and influencers don&apos;t know how to connect and collaborate effectively. This is the gap where you provide immense value.'
            ]},
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>Discipline Over Motivation</Highlight></> },
            { type: 'paragraph', text: '90% of agency owners quit within 30 days, not because the model is flawed, but because they lack discipline. Motivation is fleeting; it gets you started. Discipline is what keeps you going.'},
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'tip', text: <>Treat your outreach like a pipeline, not a lottery. <Highlight>Consistency is the key</Highlight> to building a sustainable business. Sending 20-30 well-researched emails every single day is non-negotiable in the beginning.</> }
        ]
    },
    {
        title: "Module 2: Agency Setup & Strategy",
        icon: <BookOpen className="w-6 h-6 text-brand-primary" />,
        image: masterclassImages.module2,
        sections: [
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>Choose Your Niche</Highlight></> },
            { type: 'paragraph', text: 'Do not try to be everything to everyone. It makes your outreach generic and positions you as an amateur. Pick an industry where you can recognize good content and good products, like Fitness & Supplements, Beauty & Skincare, or Tech & Gadgets.' },
            { type: 'tip', text: 'Rule of Thumb: If you already see influencers creating content in a niche, there is money flowing. Working in a space you enjoy will make the process 10x faster.' },
            { type: 'subheading', text: 'Step 2: Define Your Service (Start Simple)' },
            { type: 'list', items: [
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <><Highlight>One-Time Collaborations (Recommended)</Highlight>: A brand pays for a specific, small campaign with 1-3 influencers. This is a low-risk way for brands to test your agency.</>,
                'Influencer Seeding: Brands send free products to a larger number of micro-influencers. You manage the logistics and charge a fixed fee.'
            ]},
            { type: 'subheading', text: 'Step 3: Professional Setup (The Bare Minimum)' },
             { type: 'list', items: [
                'Get a Domain: Buy a domain for your agency (e.g., youragency.com). It costs about $10/year.',
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <>Set Up a <Highlight>Professional Email</Highlight>: Use Google Workspace or Outlook to create an email like `your.name@youragency.com`. This instantly builds trust.</>,
                'Create a Lead Tracking System: A simple Google Sheet or Notion board is all you need to start. Track every brand, contact, and outreach status.'
            ]}
        ]
    },
    {
        title: "Module 3: Client Acquisition (Brands)",
        icon: <BookOpen className="w-6 h-6 text-brand-primary" />,
        image: masterclassImages.module3,
        sections: [
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>Find Brands Already Spending Money</Highlight></> },
            { type: 'paragraph', text: 'Don&apos;t waste time trying to convince brands that influencer marketing works. Go straight to the ones who are already investing. Your job is to show them a better way.' },
            { type: 'subheading', text: 'Your Lead Sourcing Toolkit' },
            { type: 'list', items: [
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <><Highlight>YouTube Sponsor Scraping</Highlight>: The fastest way to find warm leads. Search for creators in your niche and look for videos with &quot;paid promotion&quot; or #ad. Every brand mentioned is a proven spender.</>,
                'Social Media Sleuthing: Search Instagram & TikTok for hashtags like #ad and #sponsored. See who is tagging brands and who their competitors are.',
                'Paid Tools (For Scaling): Tools like Apollo.io allow you to build highly targeted lead lists with specific filters like industry, location, and company size.'
            ]},
            { type: 'tip', text: 'Your daily non-negotiable habit should be adding 20-30 new, well-researched brands to your lead sheet. Find the right contact person on LinkedIn (e.g., Marketing Manager), not a generic &quot;info@&quot; email.' }
        ]
    },
    {
        title: "Module 4: Talent Management (Influencers)",
        icon: <BookOpen className="w-6 h-6 text-brand-primary" />,
        image: masterclassImages.module4,
        sections: [
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>&quot;Brands First, Then Influencers&quot;</Highlight> Strategy</> },
            { type: 'paragraph', text: 'One of the biggest mistakes beginners make is building a roster of influencers before they have a client. You might spend hours finding fitness athletes, only for a brand to tell you they want yoga instructors.' },
            { type: 'list', items: [
                'Get the Brief First: Secure interest from a brand and understand their goals, target audience, and budget.',
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <><Highlight>Source on Demand</Highlight>: With the brand&apos;s requirements, you can find the perfect influencers for that specific campaign.</>,
                'Present a Shortlist: Curate a list of 3-5 ideal creators to present to the brand. This shows you&apos;ve done your homework.'
            ]},
            { type: 'subheading', text: 'How to Not Get Bypassed' },
            { type: 'tip', text: 'Your value is in the management and process, not just the introduction. Position yourself as the driver of the campaign. The brand pays you for a streamlined, professional system that saves them time and delivers results.' }
        ]
    },
    {
        title: "Module 5: The Deal Flow & Scaling",
        icon: <BookOpen className="w-6 h-6 text-brand-primary" />,
        image: masterclassImages.module5,
        sections: [
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'subheading', text: <><Highlight>The Art of Negotiation</Highlight></> },
            { type: 'paragraph', text: 'This is where you make your money. You are negotiating with two sides at once to find a win-win-win. The brand gets value, the influencer is compensated fairly, and your agency keeps a healthy margin (typically 15-30%).' },
            // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
            { type: 'tip', text: <><Highlight>Negotiate on outcomes, not tasks.</Highlight> Instead of saying &quot;one TikTok video,&quot; say &quot;We&apos;ll get your product in front of 250,000 highly targeted viewers in your key demographic.&quot;</> },
            { type: 'subheading', text: 'Execution and Scaling'},
            { type: 'list', items: [
                'Streamline with Templates: Create templates for your proposals, contracts, and outreach emails to work faster.',
                'Manage the Process: Coordinate everything from product shipping to content review. Be the single point of contact.',
                'Report on Results: Provide the brand with a simple report showing key metrics. This proves your value and opens the door for retainer deals.',
                // FIX: Explicitly passed 'children' prop to resolve TypeScript error.
                <>Hire Help: Your first hire should be a <Highlight>Virtual Assistant (VA)</Highlight> to manage lead generation, freeing you up to close deals.</>
            ]}
        ]
    }
];

const ModuleContent: React.FC<{ sections: ContentSection[], image: string }> = ({ sections, image }) => (
    <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
            {sections.map((section, index) => {
                if (section.type === 'subheading') {
                    return (
                        <div key={index} className="pt-2">
                            <div className="h-px bg-gradient-to-r from-brand-insight to-brand-primary mb-4 mt-2 opacity-60"></div>
                            <h3 className="text-lg font-bold text-brand-text-primary">{section.text}</h3>
                        </div>
                    );
                }
                if (section.type === 'paragraph') {
                    return <p key={index} className="text-brand-text-secondary leading-relaxed">{section.text}</p>;
                }
                if (section.type === 'list' && section.items) {
                    return (
                        <ul key={index} className="space-y-2 list-disc list-inside text-brand-text-secondary">
                            {section.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }
                if (section.type === 'tip') {
                    return (
                        <div key={index} className="bg-brand-bg/50 border-l-4 border-brand-primary p-4 my-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                                <p className="text-brand-text-primary italic"><span className="font-bold">Pro-Tip:</span> {section.text}</p>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
        <div className="md:col-span-1">
            <Image src={image} alt="Masterclass Module Visual" width={500} height={500} className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square" />
        </div>
    </div>
);

const Academy: React.FC = () => {
    const [openModule, setOpenModule] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    return (
        <div className="space-y-8 animate-page-enter">
            <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto text-brand-primary mb-4" />
                <h1 className="text-4xl font-bold font-display text-brand-text-primary">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-insight via-brand-primary to-brand-insight">InfluencerOS Masterclass</span>
                </h1>
                <p className="text-lg text-brand-text-secondary mt-2 max-w-3xl mx-auto">
                    Your complete, free guide to building a successful influencer marketing agency. All knowledge, no fluff.
                </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-4">
                {masterclassContent.map((module, index) => (
                    <div key={index} className="futuristic-border bg-brand-surface rounded-xl transition-all duration-300">
                        <button
                            onClick={() => handleToggle(index)}
                            className="w-full flex justify-between items-center text-left p-6"
                            aria-expanded={openModule === index}
                            aria-controls={`module-content-${index}`}
                        >
                            <div className="flex items-center gap-4">
                                {module.icon}
                                <span className="text-xl font-bold text-brand-text-primary">{module.title}</span>
                            </div>
                            {openModule === index ? <Minus className="w-6 h-6 text-brand-text-secondary" /> : <Plus className="w-6 h-6 text-brand-text-secondary" />}
                        </button>
                        <div
                            id={`module-content-${index}`}
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openModule === index ? 'max-h-[3000px]' : 'max-h-0'}`}
                        >
                           <ModuleContent sections={module.sections} image={module.image} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Academy;
