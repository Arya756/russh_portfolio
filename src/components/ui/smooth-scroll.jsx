'use client';

import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

const SmoothScroll = forwardRef(({ children, ...props }, ref) => {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }} {...props}>
      <div ref={ref}>
        {children}
      </div>
    </ReactLenis>
  );
});

SmoothScroll.displayName = 'SmoothScroll';

export default SmoothScroll;

