/**
 * Utility functions to generate cinematic, volumetric plasma lightning bolts
 */

export const COLORS = {
  roseGold: '#d4967a',
  warm: '#c8845e',
  platinum: '#b8ccd8',
};

export const random = (min, max) => Math.random() * (max - min) + min;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generate a jagged path using Midpoint Displacement
 */
const generatePath = (startX, startY, endX, endY, roughness, iterations) => {
  let segments = [{ x: startX, y: startY }];
  segments.push({ x: endX, y: endY });

  for (let i = 0; i < iterations; i++) {
    const newSegments = [];
    for (let j = 0; j < segments.length - 1; j++) {
      const p1 = segments[j];
      const p2 = segments[j + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const nx = -(p2.y - p1.y);
      const ny = p2.x - p1.x;
      const len = Math.sqrt(nx * nx + ny * ny);

      const nnx = len === 0 ? 0 : nx / len;
      const nny = len === 0 ? 0 : ny / len;

      const offset = random(-roughness, roughness) * (len / 2);

      const displacedX = midX + nnx * offset;
      const displacedY = midY + nny * offset;

      newSegments.push(p1);
      newSegments.push({ x: displacedX, y: displacedY });
    }
    newSegments.push(segments[segments.length - 1]);
    segments = newSegments;
    roughness *= 0.55; 
  }

  return segments;
};

/**
 * Pushes a point out of the dynamic center safe zone.
 * Inward travel is allowed up to maxOffset.
 */
const enforceDynamicSafeZone = (x, y, width, height, maxOffset) => {
  const safeXMin = maxOffset;
  const safeXMax = width - maxOffset;
  const safeYMin = height * 0.15; // Vertical safe zone remains mostly static
  const safeYMax = height * 0.85;

  if (x > safeXMin && x < safeXMax && y > safeYMin && y < safeYMax) {
    const distLeft = x - safeXMin;
    const distRight = safeXMax - x;
    const distTop = y - safeYMin;
    const distBottom = safeYMax - y;

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    if (minDist === distLeft) return { x: safeXMin, y };
    if (minDist === distRight) return { x: safeXMax, y };
    if (minDist === distTop) return { x, y: safeYMin };
    if (minDist === distBottom) return { x, y: safeYMax };
  }
  return { x, y };
};

export const createVolumetricBolt = (width, height, isMobile) => {
  // Determine Strike Type
  // 0 = Short, 1 = Medium, 2 = Large
  const typeRoll = Math.random();
  let strikeType;
  let inwardPercentage;
  
  if (typeRoll < 0.3) {
    strikeType = 'Short';
    inwardPercentage = 0.15; // 15% inward
  } else if (typeRoll < 0.7) {
    strikeType = 'Medium';
    inwardPercentage = 0.25; // 25% inward
  } else {
    strikeType = 'Large';
    inwardPercentage = 0.40; // 40% inward (dramatic)
  }

  const maxOffset = width * inwardPercentage;
  
  // Origin edge: 0 = Left, 1 = Right, 2 = Top
  const originEdge = Math.floor(random(0, 3));
  
  let startX, startY, endX, endY;

  if (originEdge === 0) { // Left edge
    startX = random(-20, width * 0.05);
    startY = random(0, height);
    endX = startX + random(maxOffset * 0.5, maxOffset);
    endY = startY + random(-height * 0.3, height * 0.3);
  } else if (originEdge === 1) { // Right edge
    startX = random(width - width * 0.05, width + 20);
    startY = random(0, height);
    endX = startX - random(maxOffset * 0.5, maxOffset);
    endY = startY + random(-height * 0.3, height * 0.3);
  } else { // Top edge
    const isTopLeft = Math.random() > 0.5;
    startX = isTopLeft ? random(-20, width * 0.1) : random(width - width * 0.1, width + 20);
    startY = random(-20, 20);
    // Strike inward towards the center
    endX = isTopLeft ? startX + random(maxOffset * 0.5, maxOffset) : startX - random(maxOffset * 0.5, maxOffset);
    endY = startY + random(height * 0.3, height * 0.8);
  }

  const safeEnd = enforceDynamicSafeZone(endX, endY, width, height, maxOffset);
  endX = safeEnd.x;
  endY = safeEnd.y;

  const paths = []; 
  
  // Roughness based on strike type
  const baseRoughness = strikeType === 'Large' ? 0.6 : (strikeType === 'Medium' ? 0.5 : 0.4);
  
  // 1. Main Trunk
  const trunkSegments = generatePath(startX, startY, endX, endY, baseRoughness, 6);
  for (let i = 0; i < trunkSegments.length; i++) {
    const safe = enforceDynamicSafeZone(trunkSegments[i].x, trunkSegments[i].y, width, height, maxOffset);
    trunkSegments[i].x = safe.x;
    trunkSegments[i].y = safe.y;
  }
  paths.push({ segments: trunkSegments, type: 'trunk', baseThickness: isMobile ? 3 : 5 });

  // 2. Secondary Arcs
  const numArcs = isMobile ? 1 : (strikeType === 'Large' ? random(3, 5) : random(1, 3));
  for (let i = 0; i < numArcs; i++) {
    const startIndex = Math.floor(random(2, trunkSegments.length - 10));
    const startPt = trunkSegments[startIndex];
    
    const mergeBack = Math.random() > 0.4;
    let arcEndPt;
    
    if (mergeBack) {
      const endIndex = Math.min(trunkSegments.length - 1, startIndex + Math.floor(random(5, 20)));
      arcEndPt = { ...trunkSegments[endIndex] };
    } else {
      const branchLen = strikeType === 'Large' ? random(150, 400) : random(100, 250);
      const angle = Math.atan2(trunkSegments[startIndex+1].y - startPt.y, trunkSegments[startIndex+1].x - startPt.x);
      const branchAngle = angle + random(-Math.PI/2, Math.PI/2);
      
      arcEndPt = {
        x: startPt.x + Math.cos(branchAngle) * branchLen,
        y: startPt.y + Math.sin(branchAngle) * branchLen
      };
    }

    const arcSegments = generatePath(startPt.x, startPt.y, arcEndPt.x, arcEndPt.y, baseRoughness * 1.5, 5);
    for (let j = 0; j < arcSegments.length; j++) {
      const safe = enforceDynamicSafeZone(arcSegments[j].x, arcSegments[j].y, width, height, maxOffset);
      arcSegments[j].x = safe.x;
      arcSegments[j].y = safe.y;
    }

    paths.push({ segments: arcSegments, type: 'arc', baseThickness: isMobile ? 2 : 3 });
  }

  // 3. Micro Branches
  const numMicro = isMobile ? random(2, 4) : (strikeType === 'Large' ? random(10, 20) : random(5, 10));
  for (let i = 0; i < numMicro; i++) {
    const startIndex = Math.floor(random(1, trunkSegments.length - 2));
    const startPt = trunkSegments[startIndex];
    
    const branchLen = random(20, strikeType === 'Large' ? 120 : 60);
    const angle = random(0, Math.PI * 2);
    let mEndPt = {
      x: startPt.x + Math.cos(angle) * branchLen,
      y: startPt.y + Math.sin(angle) * branchLen
    };
    mEndPt = enforceDynamicSafeZone(mEndPt.x, mEndPt.y, width, height, maxOffset);
    
    const mSegments = generatePath(startPt.x, startPt.y, mEndPt.x, mEndPt.y, 0.6, 3);
    for (let j = 0; j < mSegments.length; j++) {
      const safe = enforceDynamicSafeZone(mSegments[j].x, mSegments[j].y, width, height, maxOffset);
      mSegments[j].x = safe.x;
      mSegments[j].y = safe.y;
    }

    paths.push({ segments: mSegments, type: 'micro', baseThickness: 1 });
  }

  // 4. Generate Particles at sharp corners
  const particles = [];
  if (!isMobile) {
    const particleChance = strikeType === 'Large' ? 0.5 : 0.2;
    trunkSegments.forEach((pt, i) => {
      if (i === 0 || i === trunkSegments.length - 1) return;
      if (Math.random() < particleChance) {
        particles.push({
          x: pt.x,
          y: pt.y,
          vx: random(-2, 2),
          vy: random(-1, 3), 
          life: random(0.5, 1.0),
          size: random(0.5, 2.5) 
        });
      }
    });
  }

  // 1 to 3 seconds visibility (in frames at 60fps)
  const holdFrames = Math.floor(random(60, 180));

  return {
    paths,
    particles,
    color: randomItem([COLORS.roseGold, COLORS.warm]),
    coreColor: COLORS.platinum,
    strikeType,
    holdFrames,
    currentFrame: 0,
    opacity: 1.0,
    originEdge // 0: Left, 1: Right, 2: Top
  };
};
