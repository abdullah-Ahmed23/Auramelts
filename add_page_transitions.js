// Script to add PageTransition to About, Contact, FAQ, Blog pages
// This is a reference for the changes needed

const pagesToUpdate = [
    'About.tsx',
    'Contact.tsx',
    'FAQ.tsx',
    'Blog.tsx',
    'NotFound.tsx'
];

// For each page:
// 1. Add import: import PageTransition from '@/components/PageTransition';
// 2. Wrap return with: <PageTransition>...</PageTransition>
