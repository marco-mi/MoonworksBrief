export type QuestionType = 
  | 'intro'
  | 'multi-select-tags'
  | 'visual-grid'
  | 'multi-select'
  | 'single-select'
  | 'dimensions'
  | 'logistics'
  | 'dropdown'
  | 'text-input'
  | 'date-input'
  | 'secondary-functions'
  | 'file-upload'
  | 'file-or-links';

export interface Question {
  id: string;
  section: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  subtitle?: string;
  options?: string[];
  gridOptions?: { label: string; gradient: string }[];
  inputs?: { label: string; placeholder: string }[];
  placeholder?: string;
  multiline?: boolean;
  description?: string;
  accept?: string;
  multiple?: boolean;
  linkPlaceholder?: string;
}

const primaryFunctionOptions = [
  'Photo Moment',
  'Product Launch',
  'VIP Lounge',
  'Live Demo',
  'Pop-up Retail',
  'Queue Management',
  'Art Installation',
];

export const questions: Question[] = [
  // Section: Intro
  {
    id: 'brief-intro',
    section: 'Welcome',
    title: 'Before You Start',
    type: 'intro',
    required: false,
    description:
      'This brief builder is a structured way to capture your needs so we can deliver the best solution. It also helps you fully express what you want. Estimated time: 5 to 10 minutes.',
  },

  // Section: Project Basics
  {
    id: 'client-name',
    section: 'Project Basics',
    title: 'Name of client, brand, or institution',
    type: 'text-input',
    required: true,
    placeholder: 'Enter the name you are representing...',
  },
  {
    id: 'project-location',
    section: 'Project Basics',
    title: 'Project or installation location',
    type: 'text-input',
    required: false,
    placeholder: 'Enter a place, venue, or address...',
  },
  {
    id: 'event-date-context',
    section: 'Project Basics',
    title: 'Is this tied to a specific event or special date?',
    type: 'single-select',
    required: false,
    options: [
      'Christmas',
      'Lunar New Year',
      "Mother's Day",
      "Valentine's Day",
      'Fashion Week',
      'Product Launch',
      'Anniversary',
      'Other',
      'None',
    ],
  },
  {
    id: 'existing-brief-pdf',
    section: 'Project Basics',
    title: 'Upload an existing brief (PDF)',
    type: 'file-upload',
    required: false,
    accept: 'application/pdf',
  },
  {
    id: 'inspiration-assets',
    section: 'Project Basics',
    title: 'Inspiration images or links',
    type: 'file-or-links',
    required: false,
    accept: 'image/*',
    multiple: true,
    linkPlaceholder: 'Paste links (one per line)',
  },

  // Section A: Aesthetic
  {
    id: 'concept-keywords',
    section: 'Aesthetic',
    title: 'Concept Keywords',
    type: 'multi-select-tags',
    required: false,
    options: [
      'Luxury',
      'Minimalist',
      'Maximalist',
      'Raw Materials',
      'Playful',
      'Colorful',
      'Interactive',
      'Tech-forward',
      'Sustainable',
      'Biophilic',
      'Kinetic',
      'Other',
    ],
  },
  {
    id: 'finishes-textures',
    section: 'Aesthetic',
    title: 'Finishes & Textures',
    type: 'visual-grid',
    required: false,
    gridOptions: [
      // Solid Colors (10)
      { label: 'White', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)' },
      { label: 'Black', gradient: 'linear-gradient(135deg, #000000 0%, #000000 100%)' },
      { label: 'Grey', gradient: 'linear-gradient(135deg, #808080 0%, #808080 100%)' },
      { label: 'Red', gradient: 'linear-gradient(135deg, #FF0000 0%, #FF0000 100%)' },
      { label: 'Blue', gradient: 'linear-gradient(135deg, #0000FF 0%, #0000FF 100%)' },
      { label: 'Green', gradient: 'linear-gradient(135deg, #008000 0%, #008000 100%)' },
      { label: 'Yellow', gradient: 'linear-gradient(135deg, #FFFF00 0%, #FFFF00 100%)' },
      { label: 'Orange', gradient: 'linear-gradient(135deg, #FFA500 0%, #FFA500 100%)' },
      { label: 'Purple', gradient: 'linear-gradient(135deg, #800080 0%, #800080 100%)' },
      { label: 'Pink', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFC0CB 100%)' },
      // Gradients (6)
      { label: 'Rainbow', gradient: 'linear-gradient(135deg, #FF0000 0%, #FF7F00 16%, #FFFF00 33%, #00FF00 50%, #0000FF 66%, #4B0082 83%, #9400D3 100%)' },
      { label: 'Pastel Gradient', gradient: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 50%, #DDA0DD 100%)' },
      { label: 'Sunset', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)' },
      { label: 'Ocean', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      // Wood (6)
      { label: 'Light Wood', gradient: 'linear-gradient(135deg, #DEB887 0%, #F5DEB3 100%)' },
      { label: 'Medium Tone Wood', gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' },
      { label: 'Dark Wood', gradient: 'linear-gradient(135deg, #654321 0%, #3E2723 100%)' },
      { label: 'Burned Wood', gradient: 'linear-gradient(135deg, #2F1B14 0%, #1A0E0A 100%)' },
      { label: 'Oak Wood', gradient: 'linear-gradient(135deg, #D2B48C 0%, #C19A6B 100%)' },
      // Marble
      { label: 'Marble', gradient: 'linear-gradient(135deg, #E8E8E8 0%, #B0B0B0 50%, #E8E8E8 100%)' },
      // Metal (4)
      { label: 'Gold', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
      { label: 'Silver', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)' },
      { label: 'Brushed Steel', gradient: 'linear-gradient(135deg, #708090 0%, #2F4F4F 100%)' },
      { label: 'Mirror', gradient: 'linear-gradient(135deg, #E8E8E8 0%, #D3D3D3 50%, #E8E8E8 100%)' },
    ],
  },
  {
    id: 'core-concept',
    section: 'Aesthetic',
    title: 'Is there a core concept or narrative idea?',
    type: 'text-input',
    required: false,
    placeholder: 'Describe your core concept or narrative...',
    multiline: true,
  },
  
  // Section B: Functional
  {
    id: 'required-assets',
    section: 'Functional',
    title: 'Required Assets',
    type: 'multi-select',
    required: false,
    options: [
      'Chairs',
      'Desks',
      'Lighting',
      'Pedestals',
      'Fencing',
      'Storage',
      'Other',
    ],
  },
  {
    id: 'primary-function',
    section: 'Functional',
    title: 'Primary Function',
    type: 'single-select',
    required: true,
    subtitle: 'Select one primary function, and then multiple secondary functions',
    options: [...primaryFunctionOptions, 'Other'],
  },
  {
    id: 'secondary-functions',
    section: 'Functional',
    title: 'Secondary Functions',
    type: 'secondary-functions',
    required: false,
    options: [...primaryFunctionOptions, 'Other'],
  },
  {
    id: 'delivery-date',
    section: 'Functional',
    title: 'Desired Delivery/Installing Date',
    type: 'date-input',
    required: false,
  },
  {
    id: 'signage-needs',
    section: 'Functional',
    title: 'Signage Needs',
    type: 'multi-select',
    required: false,
    options: [
      'Digital Screens',
      'Physical Lettering',
      'Illuminated Signage',
      'Wayfinding',
      'Other',
      'None',
    ],
  },
  
  // Section C: Technical Scope
  {
    id: 'dimensions',
    section: 'Technical Scope',
    title: 'Dimensions',
    type: 'dimensions',
    required: false,
    inputs: [
      { label: 'Length', placeholder: 'm' },
      { label: 'Width', placeholder: 'm' },
      { label: 'Height', placeholder: 'm' },
    ],
  },
  {
    id: 'logistics',
    section: 'Technical Scope',
    title: 'Logistics',
    type: 'logistics',
    required: false,
  },
  {
    id: 'budget-range',
    section: 'Technical Scope',
    title: 'Budget Range',
    type: 'dropdown',
    required: false,
    options: [
      '<$10k',
      '$10k-$30k',
      '$30k-$50k',
      '$50k+',
      'Undecided',
      'Custom fixed budget',
    ],
  },

  // Section: Contact
  {
    id: 'contact-info',
    section: 'Contact',
    title: 'E-mail or phone contact',
    type: 'text-input',
    required: true,
    placeholder: 'Enter an email address or phone number...',
  },
];
