import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const Effects = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.4} // Lowered to allow reflections to glow softly
        luminanceSmoothing={0.9} 
        intensity={1.5} 
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
