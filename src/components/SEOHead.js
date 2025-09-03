
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogTitle, 
  ogDescription, 
  ogUrl, 
  ogImage, 
  twitterCard, 
  twitterTitle, 
  twitterDescription, 
  twitterImage 
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {keywords && <meta name="keywords" content={keywords} />}
    {canonical && <link rel="canonical" href={canonical} />}
    
    {/* Open Graph */}
    <meta property="og:title" content={ogTitle || title} />
    <meta property="og:description" content={ogDescription || description} />
    {ogUrl && <meta property="og:url" content={ogUrl} />}
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:type" content="website" />
    
    {/* Twitter */}
    <meta name="twitter:card" content={twitterCard || "summary_large_image"} />
    <meta name="twitter:title" content={twitterTitle || title} />
    <meta name="twitter:description" content={twitterDescription || description} />
    {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    
    {/* Favicons */}
    <link rel="icon" href="/favicon.ico" /> 
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  </Helmet>
);

export default SEOHead;
