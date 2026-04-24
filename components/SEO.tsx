
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  useEffect(() => {
    // Update Title
    document.title = title;
    
    // Update Meta Description
    if (description) {
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags for better sharing
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc && description) ogDesc.setAttribute('content', description);

  }, [title, description]);

  return null;
};

export default SEO;
