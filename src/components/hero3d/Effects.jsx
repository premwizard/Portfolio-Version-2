import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const Effects = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.5} // High threshold so only emissive things bloom
        luminanceSmoothing={0.9} 
        intensity={1.2} 
        mipmapBlur 
      />
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
    </EffectComposer>
  );
};

export default Effects;
