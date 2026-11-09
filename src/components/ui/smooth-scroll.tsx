// component.tsx
'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

const Component = forwardRef<HTMLElement, { children?: React.ReactNode }>((props, ref) => {
  return (
    <ReactLenis root>
      <main ref={ref as any}>
        {props.children}
      </main>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;

