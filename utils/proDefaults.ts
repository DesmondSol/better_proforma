
import { JobTemplate } from '../types';

export const JOB_TEMPLATES: JobTemplate[] = [
    // --- Web & Software Development ---
    {
        id: 'web-dev-basic',
        name: 'Basic Website Package',
        description: '5-page static website with contact form',
        category: 'Web & Software Development',
        items: [
            { id: 'wd-1', type: 'service', name: 'UI/UX Design', description: 'Wireframing and High Fidelity Design', unitPrice: 15000, unitType: 'project' },
            { id: 'wd-2', type: 'service', name: 'Frontend Development', description: 'React/Tailwind Implementation', unitPrice: 25000, unitType: 'project' },
            { id: 'wd-3', type: 'service', name: 'Domain & Hosting Setup', description: '1 Year Basic Hosting', unitPrice: 5000, unitType: 'year' },
        ]
    },
    {
        id: 'web-dev-ecommerce',
        name: 'E-commerce Standard',
        description: 'Online store with payment integration and inventory',
        category: 'Web & Software Development',
        items: [
            { id: 'wd-e1', type: 'service', name: 'E-commerce Setup', description: 'Shopify/WooCommerce Configuration', unitPrice: 40000, unitType: 'project' },
            { id: 'wd-e2', type: 'service', name: 'Payment Gateway Integration', description: 'Chapa/Telebirr Integration', unitPrice: 10000, unitType: 'integration' },
            { id: 'wd-e3', type: 'service', name: 'Product Upload', description: 'Upload of first 50 items', unitPrice: 5000, unitType: 'batch' },
        ]
    },
    {
        id: 'web-dev-maintenance',
        name: 'Monthly Maintenance (Web)',
        description: 'Ongoing support and updates',
        category: 'Web & Software Development',
        items: [
            { id: 'wd-m1', type: 'service', name: 'Server Monitoring', description: 'Uptime and performance checks', unitPrice: 3000, unitType: 'month' },
            { id: 'wd-m2', type: 'service', name: 'Content Updates', description: 'Up to 5 hours of content changes', unitPrice: 5000, unitType: 'month' },
            { id: 'wd-m3', type: 'service', name: 'Security Patching', description: 'Plugin and core updates', unitPrice: 2000, unitType: 'month' },
        ]
    },

    // --- Construction & Renovation ---
    {
        id: 'const-paint-std',
        name: 'Room Painting (Standard)',
        description: 'Painting for a 4x4m room',
        category: 'Construction & Renovation',
        items: [
            { id: 'cp-1', type: 'product', name: 'Wall Paint (White)', description: 'High quality latex paint', unitPrice: 1200, unitType: 'gallon' },
            { id: 'cp-2', type: 'service', name: 'Labor', description: 'Preparation and application', unitPrice: 800, unitType: 'day' },
            { id: 'cp-3', type: 'product', name: 'Supplies', description: 'Brushes, tape, covers', unitPrice: 1500, unitType: 'set' },
        ]
    },
    {
        id: 'const-tile-bath',
        name: 'Bathroom Tiling',
        description: 'Tiling for standard 2x2m bathroom',
        category: 'Construction & Renovation',
        items: [
            { id: 'ct-1', type: 'product', name: 'Ceramic Tiles', description: 'Non-slip floor tiles (per m2)', unitPrice: 850, unitType: 'm2' },
            { id: 'ct-2', type: 'product', name: 'Grout & Adhesive', description: 'Waterproof grout', unitPrice: 3000, unitType: 'set' },
            { id: 'ct-3', type: 'service', name: 'Tiling Labor', description: 'Installation and finishing', unitPrice: 5000, unitType: 'job' },
        ]
    },
    {
        id: 'const-plumbing-fix',
        name: 'Kitchen Sink Install',
        description: 'Installation of new sink and faucet',
        category: 'Construction & Renovation',
        items: [
            { id: 'cpl-1', type: 'product', name: 'Stainless Steel Sink', description: 'Double bowl', unitPrice: 6500, unitType: 'item' },
            { id: 'cpl-2', type: 'product', name: 'Mixer Faucet', description: 'Chrome finish', unitPrice: 3500, unitType: 'item' },
            { id: 'cpl-3', type: 'service', name: 'Plumbing Labor', description: 'Installation and testing', unitPrice: 2000, unitType: 'job' },
        ]
    },

    // --- Graphic Design & Printing ---
    {
        id: 'gd-branding',
        name: 'Full Branding Kit',
        description: 'Logo, Business Card, and Letterhead',
        category: 'Graphic Design & Printing',
        items: [
            { id: 'gd-1', type: 'service', name: 'Logo Design', description: '3 Concepts + Revisions', unitPrice: 10000, unitType: 'project' },
            { id: 'gd-2', type: 'service', name: 'Brand Guidelines', description: 'Typography, Color Palette usage', unitPrice: 5000, unitType: 'project' },
            { id: 'gd-3', type: 'service', name: 'Stationery Design', description: 'Business card, Letterhead, Envelope', unitPrice: 3000, unitType: 'set' },
        ]
    },
    {
        id: 'gd-print-flyer',
        name: 'Flyer Printing (1000pcs)',
        description: 'A5 Flyers, Glossy Paper',
        category: 'Graphic Design & Printing',
        items: [
            { id: 'gd-p1', type: 'service', name: 'Flyer Design', description: 'Single sided design', unitPrice: 1500, unitType: 'design' },
            { id: 'gd-p2', type: 'product', name: 'Printing (A5 Glossy)', description: '1000 copies, 150gsm', unitPrice: 6, unitType: 'copy' },
        ]
    },

    // --- Event Planning ---
    {
        id: 'event-wedding-photo',
        name: 'Wedding Photography',
        description: 'Full day coverage',
        category: 'Event Planning',
        items: [
            { id: 'ep-1', type: 'service', name: 'Photography', description: '10 hours coverage', unitPrice: 20000, unitType: 'day' },
            { id: 'ep-2', type: 'service', name: 'Editing', description: 'Photo retouching', unitPrice: 5000, unitType: 'project' },
            { id: 'ep-3', type: 'product', name: 'Photo Album', description: 'Premium leather bound album', unitPrice: 8000, unitType: 'item' },
        ]
    },
    {
        id: 'event-conf-basic',
        name: 'Corporate Conference Setup',
        description: 'AV and seating for 50 people',
        category: 'Event Planning',
        items: [
            { id: 'ec-1', type: 'service', name: 'Hall Decoration', description: 'Basic corporate branding', unitPrice: 10000, unitType: 'event' },
            { id: 'ec-2', type: 'service', name: 'AV Rental', description: 'Projector, Screen, 2 Mics', unitPrice: 8000, unitType: 'day' },
            { id: 'ec-3', type: 'service', name: 'Coordination', description: 'On-site coordinator', unitPrice: 3000, unitType: 'day' },
        ]
    },

    // --- Catering ---
    {
        id: 'cat-lunch-buffet',
        name: 'Standard Lunch Buffet',
        description: 'Per person rate for 50+ guests',
        category: 'Catering',
        items: [
            { id: 'cat-1', type: 'product', name: 'Buffet Menu A', description: '3 dishes, salad, injera/rice (per head)', unitPrice: 450, unitType: 'person' },
            { id: 'cat-2', type: 'product', name: 'Soft Drinks', description: 'Assorted sodas and water', unitPrice: 50, unitType: 'person' },
            { id: 'cat-3', type: 'service', name: 'Service Staff', description: '3 servers for 4 hours', unitPrice: 1500, unitType: 'staff' },
        ]
    },
    {
        id: 'cat-coffee-break',
        name: 'Morning Coffee Break',
        description: 'Coffee, Tea, and Snacks',
        category: 'Catering',
        items: [
            { id: 'cat-c1', type: 'product', name: 'Hot Beverages', description: 'Coffee and Tea station', unitPrice: 100, unitType: 'person' },
            { id: 'cat-c2', type: 'product', name: 'Snacks', description: 'Pastries and cookies', unitPrice: 150, unitType: 'person' },
        ]
    },

    // --- Auto Repair ---
    {
        id: 'auto-service-basic',
        name: 'Periodic Service (5000km)',
        description: 'Oil change and basic checks',
        category: 'Auto Repair',
        items: [
            { id: 'ar-1', type: 'product', name: 'Engine Oil (4L)', description: 'Synthetic 5W-40', unitPrice: 3500, unitType: 'can' },
            { id: 'ar-2', type: 'product', name: 'Oil Filter', description: 'OEM Filter', unitPrice: 800, unitType: 'item' },
            { id: 'ar-3', type: 'service', name: 'Labor Charge', description: 'Oil change and inspection', unitPrice: 1000, unitType: 'service' },
        ]
    },
    {
        id: 'auto-brake-pad',
        name: 'Brake Pad Replacement',
        description: 'Front axle brake pads',
        category: 'Auto Repair',
        items: [
            { id: 'ar-b1', type: 'product', name: 'Brake Pads (Front)', description: 'Ceramic pads set', unitPrice: 4500, unitType: 'set' },
            { id: 'ar-b2', type: 'service', name: 'Installation', description: 'Labor charge', unitPrice: 800, unitType: 'service' },
        ]
    },

    // --- Consulting ---
    {
        id: 'cons-business-plan',
        name: 'Business Plan Service',
        description: 'Comprehensive plan for bank loan',
        category: 'Consulting',
        items: [
            { id: 'cn-1', type: 'service', name: 'Market Research', description: 'Competitor and market analysis', unitPrice: 15000, unitType: 'project' },
            { id: 'cn-2', type: 'service', name: 'Financial Projections', description: '5-year forecast', unitPrice: 10000, unitType: 'project' },
            { id: 'cn-3', type: 'service', name: 'Document Writing', description: 'Full business plan text', unitPrice: 10000, unitType: 'project' },
        ]
    },

    // --- Cleaning Services ---
    {
        id: 'clean-deep-home',
        name: 'Deep Home Cleaning',
        description: 'For 2 bedroom apartment',
        category: 'Cleaning Services',
        items: [
            { id: 'cl-1', type: 'service', name: 'Deep Cleaning', description: 'Floors, windows, bathrooms', unitPrice: 3000, unitType: 'job' },
            { id: 'cl-2', type: 'product', name: 'Cleaning Supplies', description: 'Detergents and disposables', unitPrice: 500, unitType: 'fee' },
        ]
    },
    {
        id: 'clean-sofa',
        name: 'Sofa Shampooing',
        description: '5-seater sofa set',
        category: 'Cleaning Services',
        items: [
            { id: 'cl-s1', type: 'service', name: 'Shampooing Service', description: 'Machine wash and dry', unitPrice: 400, unitType: 'seat' },
        ]
    }
];

export const getTemplatesForJobType = (jobTypeInput?: string | string[]) => {
    // Return all if no input or "General"
    if (!jobTypeInput || jobTypeInput === 'General' || (Array.isArray(jobTypeInput) && jobTypeInput.length === 0)) {
        return JOB_TEMPLATES;
    }

    const selectedTypes = Array.isArray(jobTypeInput) ? jobTypeInput : [jobTypeInput];
    
    // If "General" is in the selected types, return all
    if (selectedTypes.includes('General')) {
        return JOB_TEMPLATES;
    }

    return JOB_TEMPLATES.filter(t => selectedTypes.includes(t.category));
}
