import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import WhatWeDo from './WhatWeDo';

function PortfolioSection() {
  const [navigation, setNavigation] = useState({ id: null, version: 0 });
  useEffect(() => {
    const navigate = event => setNavigation(previous => ({ id: event.detail, version: previous.version + 1 }));
    window.addEventListener('signta:category', navigate);
    return () => window.removeEventListener('signta:category', navigate);
  }, []);
  return <WhatWeDo key={navigation.version} initialCategory={navigation.id} />;
}

createRoot(document.getElementById('portfolio-root')).render(<PortfolioSection />);
