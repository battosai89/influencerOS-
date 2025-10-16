// data/mockData.ts
import { Influencer, Brand, Contract, Campaign, Task, Transaction, Event, ContentPiece, Invoice, ContractTemplate } from '../types';

export const influencers: Influencer[] = [
  { id: '1', name: 'Elena Rodriguez', avatarUrl: 'https://i.pravatar.cc/150?u=elena', platform: 'Instagram', followers: 2300000, status: 'active', engagementRate: 5.8, notes: 'Great at fashion content. Prefers long-term partnerships.', instagram: '#', tiktok: '#', youtube: '#', niche: 'Fashion', rating: 5, location: 'New York, USA', availability: 'available', audience: { gender: { male: 20, female: 75, other: 5 }, topLocations: [{ name: 'USA', percentage: 60 }, { name: 'Brazil', percentage: 15 }] }, communicationLog: [
    { id: 'cl1', date: '2024-07-20', type: 'Email', summary: 'Confirmed content draft submission date for Aura Glow campaign.' },
    { id: 'cl2', date: '2024-07-15', type: 'Call', summary: 'Discussed creative concepts for the upcoming holiday promo. Elena is excited about the gift guide idea.' },
    { id: 'cl3', date: '2024-07-10', type: 'Meeting', summary: 'Quarterly check-in. Reviewed performance and discussed Q4 opportunities.' },
  ]},
  { id: '2', name: 'Ben Carter', avatarUrl: 'https://i.pravatar.cc/150?u=ben', platform: 'YouTube', followers: 1800000, status: 'active', engagementRate: 7.2, notes: 'Tech reviews. Very professional and detail-oriented.', youtube: '#', niche: 'Tech', rating: 5, location: 'San Francisco, USA', availability: 'booked', audience: { gender: { male: 85, female: 10, other: 5 }, topLocations: [{ name: 'USA', percentage: 50 }, { name: 'Germany', percentage: 20 }] }, communicationLog: [
    { id: 'cl4', date: '2024-07-22', type: 'Email', summary: 'Sent over the final contract for the GadgetFlow smartwatch launch. Awaiting signature.' },
  ]},
  { id: '3', name: 'Sophie Chen', avatarUrl: 'https://i.pravatar.cc/150?u=sophie', platform: 'TikTok', followers: 5400000, status: 'active', engagementRate: 12.5, notes: 'Amazing at viral dance challenges. High engagement rate.', tiktok: '#', niche: 'Entertainment', rating: 4, location: 'Los Angeles, USA', availability: 'available', audience: { gender: { male: 40, female: 55, other: 5 }, topLocations: [{ name: 'USA', percentage: 70 }, { name: 'UK', percentage: 10 }] }, communicationLog: [] },
  { id: '4', name: 'Liam Goldberg', avatarUrl: 'https://i.pravatar.cc/150?u=liam', platform: 'Instagram', followers: 850000, status: 'inactive', engagementRate: 3.1, notes: 'On a temporary break. Expected back in Q3.', instagram: '#', niche: 'Travel', rating: 3, location: 'London, UK', availability: 'on-hold', audience: { gender: { male: 50, female: 45, other: 5 }, topLocations: [{ name: 'UK', percentage: 40 }, { name: 'Australia', percentage: 25 }] }, communicationLog: [] },
  { id: '5', name: 'Aisha Khan', avatarUrl: 'https://i.pravatar.cc/150?u=aisha', platform: 'YouTube', followers: 3200000, status: 'active', engagementRate: 6.5, notes: 'Lifestyle and travel vlogger. Great for brand trips.', youtube: '#', niche: 'Travel', rating: 5, location: 'Dubai, UAE', availability: 'available', audience: { gender: { male: 30, female: 65, other: 5 }, topLocations: [{ name: 'India', percentage: 30 }, { name: 'UAE', percentage: 30 }] }, communicationLog: [] },
  { id: '6', name: 'Noah Ito', avatarUrl: 'https://i.pravatar.cc/150?u=noah', platform: 'TikTok', followers: 800000, status: 'lead', engagementRate: 9.8, notes: 'Up-and-coming comedy creator. Potential for a new campaign.', tiktok: '#', niche: 'Comedy', rating: 4, location: 'Tokyo, Japan', availability: 'available', audience: { gender: { male: 60, female: 35, other: 5 }, topLocations: [{ name: 'Japan', percentage: 50 }, { name: 'USA', percentage: 20 }] }, communicationLog: [] },
  { id: '7', name: 'Ava Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=ava', platform: 'Instagram', followers: 1200000, status: 'contacted', engagementRate: 4.9, niche: 'Beauty', rating: 4, location: 'Paris, France', availability: 'available', audience: { gender: { male: 10, female: 85, other: 5 }, topLocations: [{ name: 'France', percentage: 40 }, { name: 'USA', percentage: 20 }] }, communicationLog: [] },
  { id: '8', name: 'Leo Martinez', avatarUrl: 'https://i.pravatar.cc/150?u=leo', platform: 'YouTube', followers: 950000, status: 'negotiating', engagementRate: 5.1, niche: 'Fitness', rating: 5, location: 'Miami, USA', availability: 'on-hold', audience: { gender: { male: 70, female: 25, other: 5 }, topLocations: [{ name: 'USA', percentage: 65 }, { name: 'Canada', percentage: 15 }] }, communicationLog: [] },
  { id: '9', name: 'Mia Garcia', avatarUrl: 'https://i.pravatar.cc/150?u=mia', platform: 'TikTok', followers: 3100000, status: 'signed', engagementRate: 11.2, niche: 'Food', rating: 4, location: 'Mexico City, Mexico', availability: 'booked', audience: { gender: { male: 25, female: 70, other: 5 }, topLocations: [{ name: 'Mexico', percentage: 55 }, { name: 'USA', percentage: 30 }] }, communicationLog: [] },
];

export const brands: Brand[] = [
  { id: 'b1', name: 'Aura Beauty', logoUrl: 'https://i.pravatar.cc/150?u=aurabeauty', industry: 'Cosmetics', website: 'https://aurabeauty.com', notes: 'Focus on clean and sustainable products.', satisfaction: 95, portalAccess: true, portalUserEmail: 'client@aura.com', portalPassword: 'password123' },
  { id: 'b2', name: 'GadgetFlow', logoUrl: 'https://i.pravatar.cc/150?u=gadgetflow', industry: 'Technology', website: 'https://gadgetflow.com', notes: 'Launching a new smartwatch soon.', satisfaction: 88, portalAccess: false },
  { id: 'b3', name: 'Wanderlust Apparel', logoUrl: 'https://i.pravatar.cc/150?u=wanderlust', industry: 'Fashion', website: 'https://wanderlust.com', notes: 'Interested in a summer collection campaign.', satisfaction: 92, portalAccess: false },
  { id: 'b4', name: 'FitLife Snacks', logoUrl: 'https://i.pravatar.cc/150?u=fitlife', industry: 'Health & Wellness', website: 'https://fitlifesnacks.com', satisfaction: 78, portalAccess: false },
];

export const contractTemplates: ContractTemplate[] = [
  {
    id: 'temp1',
    name: 'One-Time Collaboration',
    description: 'A standard agreement for a single campaign or a set of deliverables with one influencer, inspired by industry best practices.',
    clauses: [
      {
        title: 'Purpose and Intent',
        content: 'The purpose of this Agreement is to set forth the terms under which the Influencer will create and publish promotional content in connection with the Brand\'s product(s) or service(s) as a one-time collaboration.'
      },
      {
        title: 'Scope of Services',
        content: `2.1 Deliverables. The Influencer shall deliver the following:\n- Content Type(s): [e.g. 1× Instagram Reel + 1× Story]\n- Mandatory Elements: [e.g. Tag @BrandHandle, use #CampaignHashtag]\n\n2.2 Timeline. Influencer agrees to post final content on or before [Insert Deadline]. Delays must be communicated in writing at least [e.g. 7] days in advance.\n\n2.3 Approval Process. Drafts shall be submitted [e.g. 3 days] prior to publication. Brand may request up to [e.g. 2] rounds of revisions.`
      },
      {
        title: 'Compensation and Payment Terms',
        content: `3.1 Fee. Brand shall pay Influencer [Insert Amount in USD].\n\n3.2 Payment Schedule. 50% payable upon signing; 50% payable within [e.g. 7] days after confirmation of publication.\n\n3.3 Method of Payment. Bank transfer.\n\n3.4 Taxes. Influencer shall be solely responsible for reporting and paying any applicable taxes.`
      },
      {
        title: 'Rights and Usage',
        content: `4.1 License. Influencer grants Brand a limited, non-exclusive, royalty-free, worldwide license to use, reproduce, and distribute the content for marketing purposes during [e.g. 6 months].\n\n4.2 Restrictions. Brand shall not edit content in a way that misrepresents Influencer's endorsement or transfer rights to third parties without written consent.\n\n4.3 Ownership. Copyright of the content remains with the Influencer, subject to the license granted herein.`
      },
      {
        title: 'Standards of Conduct',
        content: 'Influencer shall avoid defamatory, obscene, or illegal statements and maintain professional conduct in all interactions relating to this Agreement.'
      },
      {
        title: 'Confidentiality',
        content: 'Any proprietary, strategic, or sensitive information disclosed during the collaboration shall remain confidential for a period of 12 months after termination of this Agreement.'
      },
      {
        title: 'Representations and Warranties',
        content: 'Influencer represents that all content will be original and not infringe upon third-party rights. Brand represents that it has the rights to market the product/service promoted.'
      },
      {
        title: 'Indemnification',
        content: 'Each Party agrees to indemnify, defend, and hold harmless the other Party from claims, damages, or expenses arising out of its own breach of this Agreement.'
      },
      {
        title: 'Governing Law and Jurisdiction',
        content: 'This Agreement shall be governed by the laws of [Insert Jurisdiction].'
      }
    ]
  },
  {
    id: 'temp2',
    name: 'Influencer Seeding Agreement',
    description: 'A simple agreement for sending free products to influencers in exchange for potential content (no guaranteed posts).',
    clauses: [
      { 
        title: 'Purpose and Intent', 
        content: 'This Agreement outlines the terms for providing complimentary products ("Gifts") from the Brand to the Influencer for consideration. The intent is to introduce the Influencer to the Brand\'s products with the hope, but not the obligation, of organic social media coverage.' 
      },
      { 
        title: 'Products Provided (The Gift)', 
        content: 'The Brand will provide the Influencer with the following products at no cost:\n- [List of Products]\n- Total Estimated Value: [Insert Value]\n\nThe Influencer acknowledges that this is a gift and does not constitute payment for services.' 
      },
      { 
        title: 'Shipping & Logistics', 
        content: 'The Brand will be responsible for all costs associated with shipping the products to the address provided by the Influencer. The Influencer is responsible for any applicable customs or import duties.' 
      },
      { 
        title: 'Content Creation (Voluntary)', 
        content: 'The Influencer is under no obligation to create or publish any content featuring the products. Should the Influencer choose to create content, they agree to:\n- Adhere to FTC guidelines by clearly disclosing the gifted nature of the products (e.g., using #gifted, #ad, or "Thanks [Brand] for the gift!").\n- Tag the Brand\'s official social media handle: @[Insert Brand Handle]\n- Use the campaign hashtag if provided: #[Insert Hashtag]' 
      },
      { 
        title: 'Usage Rights for Voluntary Content', 
        content: 'In the event the Influencer publishes content featuring the Brand\'s products, the Influencer grants the Brand a non-exclusive, royalty-free, perpetual, worldwide license to share, repost, and republish the content on the Brand\'s own social media channels, website, and email newsletters, with full credit to the Influencer.' 
      },
      { 
        title: 'No Obligation & No Payment', 
        content: 'This Agreement does not establish an employer/employee relationship. The Brand confirms there is no expectation of guaranteed content publication, and the Influencer confirms there is no expectation of monetary compensation.' 
      }
    ]
  },
  {
    id: 'temp3',
    name: 'Full Campaign Retainer',
    description: 'A comprehensive agreement for ongoing campaign management with a brand, covering multiple influencers and deliverables over a set period.',
    clauses: [
      { 
        title: 'Scope of Services', 
        content: 'The Agency agrees to provide comprehensive influencer marketing campaign management services ("Services") to the Client. These Services include, but are not limited to:\n- Strategy Development & Consultation\n- Influencer Identification, Vetting, and Sourcing\n- Negotiation and Contracting with Influencers\n- Campaign Briefing and Content Guideline Creation\n- Content Coordination and Approval Management\n- Performance Tracking and Monthly Reporting' 
      },
      { 
        title: 'Retainer Period & Termination', 
        content: 'This Agreement is effective from [Start Date] and shall continue on a month-to-month basis. This Agreement may be terminated by either party with [e.g., 30] days written notice. Upon termination, the Client is responsible for payment for any services rendered up to the effective termination date.' 
      },
      { 
        title: 'Compensation & Payment Terms', 
        content: '3.1 Retainer Fee: The Client agrees to pay the Agency a monthly retainer fee of [Insert Amount in USD] for the Services.\n\n3.2 Influencer & Ad Budget: This retainer fee is exclusive of the budget for influencer payments, content production costs, and paid media amplification ("Campaign Budget"). The Campaign Budget will be determined and approved in writing by the Client on a per-campaign basis.\n\n3.3 Invoicing: The retainer fee will be invoiced on the first day of each month and is payable within [e.g., 15] days (Net 15).' 
      },
      { 
        title: 'Approval Process', 
        content: 'All influencer selections, campaign concepts, and draft content must be approved in writing by the Client before proceeding. The Agency will provide a reasonable timeline for feedback, and delays in approvals may impact campaign deadlines.' 
      },
      { 
        title: 'Reporting', 
        content: 'The Agency will provide the Client with a detailed performance report on or before the [e.g., 5th] of each month, outlining key metrics from the previous month\'s activities, including reach, engagement, conversions, and ROI.' 
      },
      { 
        title: 'Confidentiality', 
        content: 'Both parties agree to keep all non-public information related to the other\'s business, including strategies, finances, and proprietary processes, strictly confidential during and after the term of this Agreement.' 
      },
      { 
        title: 'Intellectual Property', 
        content: 'The Client will own the rights to the final deliverables created by influencers under campaigns managed by the Agency, subject to the specific usage rights negotiated in individual influencer agreements. The Agency retains ownership of its proprietary processes, strategies, and templates.' 
      },
      { 
        title: 'Indemnification', 
        content: 'Each Party agrees to indemnify and hold harmless the other from any claims or damages arising from its own breach of this Agreement or negligence.' 
      }
    ]
  }
];


export const contracts: Contract[] = [
  {
    id: 'c1',
    title: 'Aura Beauty Summer Campaign',
    influencerId: '1',
    brandId: 'b1',
    status: 'Signed',
    dateSigned: new Date('2024-05-15'),
    endDate: '2024-08-15',
    value: 25000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '• 3 Instagram Reels showcasing the "Summer Glow" product line.\n• 5 Instagram Stories with swipe-up links to the product page.\n• 1 dedicated YouTube video (10-15 mins) reviewing the products.' },
      { title: 'Compensation & Payment Terms', content: 'Net 30 upon completion of all deliverables and submission of final invoice.' },
      { title: 'Usage Rights', content: 'Brand is granted rights to use the content on their social media channels for 6 months.' },
    ]
  },
  {
    id: 'c2',
    title: 'GadgetFlow Smartwatch Launch',
    influencerId: '2',
    brandId: 'b2',
    status: 'Signed',
    dateSigned: new Date('2024-06-01'),
    endDate: '2024-09-01',
    value: 40000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '• 1 unboxing and first impressions YouTube video.\n• 1 full in-depth review YouTube video after 2 weeks of use.\n• 3 short-form videos (TikTok/YT Shorts) highlighting key features.' },
      { title: 'Compensation & Payment Terms', content: '50% upfront, 50% upon completion of the final video.' }
    ]
  },
  {
    id: 'c3',
    title: 'Wanderlust Collab',
    influencerId: '5',
    brandId: 'b3',
    status: 'Pending',
    endDate: '2024-12-31',
    value: 15000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '• 4 Instagram posts featuring the "Adventure" collection.\n• 1 travel vlog on YouTube featuring the apparel organically.' },
      { title: 'Compensation & Payment Terms', content: 'Net 30 upon invoice.' }
    ]
  },
  {
    id: 'c4',
    title: 'Aura Beauty Holiday Promo',
    influencerId: '1',
    brandId: 'b1',
    status: 'Draft',
    endDate: '2025-01-15',
    value: 30000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '• 1 Holiday Gift Guide YouTube video.\n• 5-part Instagram Story series for Black Friday.' },
      { title: 'Compensation & Payment Terms', content: 'Net 30.' }
    ]
  },
  {
    id: 'c5',
    title: 'Past Collab',
    influencerId: '4',
    brandId: 'b2',
    status: 'Expired',
    dateSigned: new Date('2023-01-01'),
    endDate: '2023-12-31',
    value: 10000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '1 Instagram post.' }
    ]
  },
  {
    id: 'c6',
    title: 'FitLife January Push',
    influencerId: '3',
    brandId: 'b4',
    status: 'Signed',
    dateSigned: new Date(),
    endDate: '2024-08-25',
    value: 50000,
    templateId: 'temp1',
    clauses: [
      { title: 'Scope of Work / Deliverables', content: '• 10 TikTok videos for the "New Year, New Me" campaign.\n• Instagram Story takeover for one weekend.' },
      { title: 'Compensation & Payment Terms', content: 'Weekly payments over the campaign period.' }
    ]
  }
];

export const campaigns: Campaign[] = [
    { id: 'camp1', name: 'Aura Glow Launch', brandId: 'b1', influencerIds: ['1', '5'], startDate: '2024-06-01', endDate: '2024-07-31', roi: 275, budget: 20000, category: 'Product Launch', status: 'Live',
      milestones: [{name: 'Launch Day', date: '2024-06-15'}, {name: 'Final Report', date: '2024-08-05'}],
      content: [
          { id: 'con1', url: 'https://instagram.com/p/1', platform: 'Instagram', performance: { views: 1200000, likes: 85000, comments: 2500 }},
          { id: 'con2', url: 'https://youtube.com/watch/1', platform: 'YouTube', performance: { views: 850000, likes: 45000, comments: 3200 }},
      ]},
    { id: 'camp2', name: 'TechForward Smartwatch', brandId: 'b2', influencerIds: ['2'], startDate: '2024-07-15', endDate: '2024-08-15', roi: 150, budget: 30000, category: 'Product Launch', status: 'Content Creation',
      milestones: [{name: 'Unboxing Posts Live', date: '2024-07-25'}, {name: 'Review Videos Live', date: '2024-08-10'}],
       content: [
          { id: 'con3', url: 'https://youtube.com/watch/2', platform: 'YouTube', performance: { views: 1500000, likes: 98000, comments: 7500 }},
      ]},
    { id: 'camp3', name: 'Summer Style Edit', brandId: 'b3', influencerIds: ['1','3','5'], startDate: '2023-08-01', endDate: '2023-08-31', roi: 350, budget: 25000, category: 'Seasonal Promo', status: 'Completed',
      milestones: [{name: 'Campaign Kick-off', date: '2023-08-01'}],
      content: [
        { id: 'con4', url: 'https://tiktok.com/v/1', platform: 'TikTok', performance: { views: 8000000, likes: 1200000, comments: 15000 }},
    ] },
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const tasks: Task[] = [
  { id: 't1', title: 'Draft contract for Noah Ito', dueDate: formatDate(new Date(new Date().setDate(today.getDate() + 3))), status: 'pending', relatedContractId: 'c4' },
  { id: 't2', title: 'Follow up with Wanderlust Apparel', dueDate: formatDate(new Date(new Date().setDate(today.getDate() - 2))), status: 'pending', relatedContractId: 'c3' },
  { id: 't3', title: 'Review campaign content for Aura Glow', dueDate: formatDate(new Date(new Date().setDate(today.getDate() - 5))), status: 'completed', relatedCampaignId: 'camp1' },
  { id: 't4', title: 'Send invoice for GadgetFlow launch', dueDate: formatDate(new Date(new Date().setDate(today.getDate() - 10))), status: 'completed' },
  { id: 't5', title: 'Onboard Sophie Chen', dueDate: formatDate(new Date(new Date().setDate(today.getDate() + 1))), status: 'pending' },
  { id: 't6', title: 'Plan Q4 content for TechForward', dueDate: formatDate(new Date(new Date().setDate(today.getDate() + 10))), status: 'pending', relatedCampaignId: 'camp2' },
  { id: 't7', title: 'Research competitor content', dueDate: formatDate(new Date(new Date().setDate(today.getDate() + 8))), status: 'pending', parentId: 't6'},
  { id: 't8', title: 'Draft initial content pillars', dueDate: formatDate(new Date(new Date().setDate(today.getDate() + 9))), status: 'completed', parentId: 't6'},
];

export const transactions: Transaction[] = [
    { id: 'tr1', date: '2023-07-15', description: 'Payment from Aura Beauty', type: 'income', category: 'Campaign Payment', amount: 15000, status: 'Completed', brandId: 'b1', campaignId: 'camp1' },
    { id: 'tr2', date: '2023-07-12', description: 'Software Subscription', type: 'expense', category: 'Overheads', amount: 250, status: 'Completed' },
    { id: 'tr3', date: '2023-07-10', description: 'Payment from GadgetFlow', type: 'income', category: 'Campaign Payment', amount: 20000, status: 'Completed', brandId: 'b2', campaignId: 'camp2' },
    { id: 'tr4', date: '2023-07-05', description: 'Studio Rental', type: 'expense', category: 'Production Costs', amount: 1200, status: 'Completed', campaignId: 'camp1' },
    { id: 'tr5', date: '2023-08-01', description: 'Payment from Wanderlust', type: 'income', category: 'Campaign Payment', amount: 18000, status: 'Pending', brandId: 'b3', campaignId: 'camp3' },
    { id: 'tr6', date: '2023-06-15', description: 'Payment from Aura Beauty', type: 'income', category: 'Campaign Payment', amount: 15000, status: 'Completed', brandId: 'b1', campaignId: 'camp1' },
    { id: 'tr7', date: '2023-05-15', description: 'Payment from Aura Beauty', type: 'income', category: 'Campaign Payment', amount: 15000, status: 'Completed', brandId: 'b1' }, // old campaign, no ID
    { id: 'tr8', date: '2023-07-01', description: 'Invoice #123 (FitLife)', type: 'income', category: 'Campaign Payment', amount: 5000, status: 'Overdue', brandId: 'b4' },
    { id: 'tr9', date: '2023-07-20', description: 'Payout to E. Rodriguez', type: 'expense', category: 'Influencer Payouts', amount: 5000, status: 'Completed', influencerId: '1', campaignId: 'camp1' },
    { id: 'tr10', date: '2023-07-25', description: 'Payout to B. Carter', type: 'expense', category: 'Influencer Payouts', amount: 7500, status: 'Completed', influencerId: '2', campaignId: 'camp2' },
    { id: 'tr11', date: '2023-08-02', description: 'Payout to S. Chen', type: 'expense', category: 'Influencer Payouts', amount: 10000, status: 'Pending', influencerId: '3', campaignId: 'camp3' },
    { id: 'tr12', date: '2023-07-01', description: 'LinkedIn Ads', type: 'expense', category: 'Marketing & Sales', amount: 800, status: 'Completed' },
];

export const events: Event[] = [
    { id: 'e1', title: 'Meeting with Aura Beauty', start: new Date(new Date().setDate(new Date().getDate() + 2)), end: new Date(new Date().setDate(new Date().getDate() + 2)), type: 'Meeting', brandId: 'b1' },
    { id: 'e2', title: 'TechForward Launch Day', start: new Date(new Date().setDate(new Date().getDate() + 5)), end: new Date(new Date().setDate(new Date().getDate() + 5)), type: 'Campaign Milestone', campaignId: 'camp2' },
    { id: 'e3', title: 'Contract Deadline: Wanderlust', start: new Date(new Date().setDate(new Date().getDate() + 7)), end: new Date(new Date().setDate(new Date().getDate() + 7)), type: 'Deadline', brandId: 'b3' },
    { id: 'e4', title: 'Photoshoot with Elena', start: new Date(new Date().setDate(new Date().getDate() - 3)), end: new Date(new Date().setDate(new Date().getDate() - 3)), type: 'Appointment', campaignId: 'camp1' },
];

export const contentPieces: ContentPiece[] = [
    { 
        id: 'cp1', 
        title: 'IG Reel - Aura Glow Serum', 
        campaignId: 'camp1', 
        influencerId: '1', 
        status: 'Client Review', 
        dueDate: '2024-07-25',
        submissionDate: '2024-07-24',
        thumbnailUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800',
        contentUrl: '#',
        platform: 'Instagram',
        version: 2,
        comments: [
            { id: 'com1', authorName: 'Alex (You)', authorAvatarUrl: '', authorRole: 'Agency', text: 'Looks great! Sending to client for final approval.', timestamp: '2024-07-24T10:00:00Z' }
        ],
    },
    { 
        id: 'cp2', 
        title: 'Smartwatch Unboxing Video', 
        campaignId: 'camp2', 
        influencerId: '2', 
        status: 'Revisions Requested', 
        dueDate: '2024-07-28',
        submissionDate: '2024-07-26',
        thumbnailUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800',
        contentUrl: '#',
        platform: 'YouTube',
        version: 1,
        comments: [
            { id: 'com2', authorName: 'GadgetFlow Client', authorAvatarUrl: 'https://i.pravatar.cc/150?u=gadgetflow', authorRole: 'Client', text: 'Can we get a clearer shot of the packaging at the beginning?', timestamp: '2024-07-27T14:30:00Z' },
            { id: 'com3', authorName: 'Alex (You)', authorAvatarUrl: '', authorRole: 'Agency', text: '@Ben Carter - Client requested a revision. Please see above.', timestamp: '2024-07-27T14:35:00Z' },
        ],
    },
    { 
        id: 'cp3', 
        title: 'Summer Style TikTok', 
        campaignId: 'camp3', 
        influencerId: '3', 
        status: 'Agency Review', 
        dueDate: '2024-08-05',
        submissionDate: '2024-08-01',
        thumbnailUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800',
        contentUrl: '#',
        platform: 'TikTok',
        version: 1,
        comments: [
             { id: 'com4', authorName: 'Sophie Chen', authorAvatarUrl: 'https://i.pravatar.cc/150?u=sophie', authorRole: 'Influencer', text: 'Here is the first draft! Let me know what you think.', timestamp: '2024-08-01T18:00:00Z' },
        ],
    },
    { 
        id: 'cp4', 
        title: 'IG Story Set', 
        campaignId: 'camp1', 
        influencerId: '5', 
        status: 'Approved', 
        dueDate: '2024-07-26',
        submissionDate: '2024-07-22',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=800',
        contentUrl: '#',
        platform: 'Instagram',
        version: 1,
        comments: [
            { id: 'com5', authorName: 'Aura Beauty Client', authorAvatarUrl: 'https://i.pravatar.cc/150?u=aurabeauty', authorRole: 'Client', text: 'Perfect! Approved for posting.', timestamp: '2024-07-23T09:00:00Z' }
        ],
    },
    { 
        id: 'cp5', 
        title: 'TechForward Unboxing Reel', 
        campaignId: 'camp2', 
        influencerId: '2', 
        status: 'Submitted', 
        dueDate: '2024-08-10',
        submissionDate: '2024-08-08',
        thumbnailUrl: 'https://images.unsplash.com/photo-1604342412435-2517b8d1413a?q=80&w=800',
        contentUrl: '#',
        platform: 'Instagram',
        version: 1,
        comments: [],
    },
];

export const invoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-001', brandId: 'b1', amount: 15000, issueDate: '2023-07-01', dueDate: '2023-07-31', status: 'Paid' },
  { id: 'inv2', invoiceNumber: 'INV-002', brandId: 'b2', amount: 20000, issueDate: '2023-06-25', dueDate: '2023-07-25', status: 'Paid' },
  { id: 'inv3', invoiceNumber: 'INV-003', brandId: 'b3', amount: 18000, issueDate: '2023-07-15', dueDate: '2023-08-14', status: 'Pending' },
  { id: 'inv4', invoiceNumber: 'INV-004', brandId: 'b4', amount: 5000, issueDate: '2023-06-01', dueDate: '2023-07-01', status: 'Overdue' },
  { id: 'inv5', invoiceNumber: 'INV-005', brandId: 'b1', amount: 12000, issueDate: '2023-08-01', dueDate: '2023-08-31', status: 'Pending' },
];
