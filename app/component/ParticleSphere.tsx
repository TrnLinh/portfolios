import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float randomOffset;
  varying vec3 vColor;
  varying float vAlpha;
  
  uniform float time;
  uniform vec3 mousePosition3D;
  uniform vec3 prevMousePosition3D;
  uniform float mouseInfluence;
  uniform float globalSize;
  uniform float chaosAmount;
  uniform float fluidViscosity;
  uniform float waveAmplitude;
  uniform vec3 dropPosition;
  uniform float dropTime;
  uniform float dropStrength;
  uniform float baseOpacity;
  
  void main() {
    vColor = customColor;
    
    vec3 pos = position;
    vec3 originalPos = pos;
    
    // Optimized base chaotic movement
    float timeOffset = randomOffset * 6.28318; // Use 2π for better distribution
    float chaos = chaosAmount * 0.2; // Reduced for better performance
    
    // Simplified wave calculations
    float wave1 = sin(time * 0.8 + timeOffset + pos.y * 1.5) * chaos;
    float wave2 = cos(time * 1.0 + timeOffset + pos.z * 1.3) * chaos;
    float wave3 = sin(time * 1.2 + timeOffset + pos.x * 1.7) * chaos;
    
    pos += vec3(wave1, wave2, wave3);
    
    // Enhanced water drop effect with realistic physics
    if (dropStrength > 0.01) {
      float dropAge = time - dropTime;
      float distanceToDrop = length(pos - dropPosition);
      vec3 dropDirection = normalize(pos - dropPosition + vec3(0.001));
      
      // Phase 1: Initial Impact Splash (0.0 - 0.3s)
      if (dropAge < 0.3 && distanceToDrop < 2.5) {
        float impactIntensity = exp(-dropAge * 8.0) * (1.0 - distanceToDrop / 2.5);
        
        // Upward splash with gravity
        float upwardForce = impactIntensity * dropStrength * 0.8;
        float gravity = -9.8 * dropAge * dropAge * 0.02; // Realistic gravity
        float verticalDisplacement = upwardForce + gravity;
        
        // Radial explosion from impact point
        float radialForce = impactIntensity * dropStrength * 0.6;
        
        // Add some randomness for natural splash pattern
        float splashVariation = sin(randomOffset * 20.0 + dropAge * 15.0) * 0.3;
        
        pos += dropDirection * (radialForce + splashVariation * impactIntensity);
        pos.z += verticalDisplacement;
      }
      
      // Phase 2: Primary Ripple Wave (starts immediately, travels outward)
      float primaryRipple = dropAge * 4.0; // Ripple speed
      float primaryWidth = 0.4 + dropAge * 0.2; // Expanding width
      float primaryDecay = exp(-dropAge * 1.2);
      
      if (primaryDecay > 0.01) {
        float primaryInfluence = exp(-abs(distanceToDrop - primaryRipple) / primaryWidth);
        float primaryWave = sin((distanceToDrop - primaryRipple) * 18.0) * 
                           primaryInfluence * 
                           dropStrength * 
                           primaryDecay * 0.25;
        
        pos += dropDirection * primaryWave;
        
        // Vertical component for the wave crest
        float waveHeight = cos((distanceToDrop - primaryRipple) * 18.0) * 
                          primaryInfluence * 
                          dropStrength * 
                          primaryDecay * 0.15;
        pos.z += waveHeight;
      }
      
      // Phase 3: Secondary Ripple (follows primary, smaller amplitude)
      if (dropAge > 0.1) {
        float secondaryAge = dropAge - 0.1;
        float secondaryRipple = secondaryAge * 3.2;
        float secondaryWidth = 0.6;
        float secondaryDecay = exp(-secondaryAge * 0.8);
        
        if (secondaryDecay > 0.01) {
          float secondaryInfluence = exp(-abs(distanceToDrop - secondaryRipple) / secondaryWidth);
          float secondaryWave = sin((distanceToDrop - secondaryRipple) * 12.0) * 
                               secondaryInfluence * 
                               dropStrength * 
                               secondaryDecay * 0.15;
          
          pos += dropDirection * secondaryWave;
        }
      }
      
      // Phase 4: Surface Tension Oscillation (creates the "bounce back" effect)
      if (distanceToDrop < 1.8 && dropAge > 0.2 && dropAge < 1.2) {
        float tensionAge = dropAge - 0.2;
        float tensionFalloff = (1.8 - distanceToDrop) / 1.8;
        float tensionOscillation = sin(tensionAge * 12.0) * 
                                  exp(-tensionAge * 2.5) * 
                                  tensionFalloff * 
                                  dropStrength * 0.12;
        
        pos.z += tensionOscillation;
        
        // Subtle inward pull during surface tension
        float inwardPull = cos(tensionAge * 8.0) * 
                          exp(-tensionAge * 3.0) * 
                          tensionFalloff * 
                          dropStrength * 0.08;
        pos -= dropDirection * inwardPull;
      }
      
      // Phase 5: Capillary Waves (fine ripples on the surface)
      if (dropAge < 2.0) {
        float capillaryFreq = 25.0 + randomOffset * 10.0; // High frequency, varies per particle
        float capillaryDecay = exp(-dropAge * 1.8);
        float capillaryWave = sin(distanceToDrop * capillaryFreq - time * 8.0) * 
                             capillaryDecay * 
                             dropStrength * 
                             0.05;
        
        pos += dropDirection * capillaryWave;
      }
    }
    
    // Optimized mouse interaction
    if (mouseInfluence > 0.01) {
      vec3 mousePos3D = mousePosition3D;
      float distanceToMouse = length(pos - mousePos3D);
      
      if (distanceToMouse < 4.0) { // Only affect nearby particles
        // Single wave calculation
        float wave = sin(distanceToMouse * 4.0 - time * 3.0) * 
                    exp(-distanceToMouse * 0.8) * 
                    waveAmplitude * 
                    mouseInfluence;
        
        vec3 waveDirection = normalize(pos - mousePos3D + vec3(0.001));
        pos += waveDirection * wave * 0.3;
        
        // Simplified flow
        vec3 mouseVelocity = (mousePos3D - prevMousePosition3D) * 20.0;
        float influence = exp(-distanceToMouse * 0.6) * mouseInfluence;
        pos += mouseVelocity * influence * fluidViscosity * 0.01;
      }
    }
    
    // Simplified base water motion
    float waterMotion = sin(time * 0.5 + originalPos.x + originalPos.y * 0.8) * 0.02;
    pos.z += waterMotion;
    
    // Enhanced alpha calculation with realistic drop effects
    float movement = length(pos - originalPos);
    float mouseEffect = mouseInfluence * exp(-length(pos - mousePosition3D) * 0.8);
    
    float dropEffect = 0.0;
    if (dropStrength > 0.01) {
      float dropAge = time - dropTime;
      float distanceToDrop = length(pos - dropPosition);
      
      // Splash zone - brighter, more visible particles
      if (distanceToDrop < 2.0 && dropAge < 0.4) {
        float splashAlpha = exp(-distanceToDrop * 0.8) * dropStrength * exp(-dropAge * 3.0);
        dropEffect += splashAlpha * 0.8;
      }
      
      // Primary ripple glow
      float primaryRipple = dropAge * 4.0;
      float rippleProximity = abs(distanceToDrop - primaryRipple);
      if (rippleProximity < 0.6) {
        float rippleGlow = exp(-rippleProximity * 3.0) * dropStrength * exp(-dropAge * 1.2);
        dropEffect += rippleGlow * 0.4;
      }
      
      // Secondary ripple glow
      if (dropAge > 0.1) {
        float secondaryAge = dropAge - 0.1;
        float secondaryRipple = secondaryAge * 3.2;
        float secondaryProximity = abs(distanceToDrop - secondaryRipple);
        if (secondaryProximity < 0.8) {
          float secondaryGlow = exp(-secondaryProximity * 2.0) * dropStrength * exp(-secondaryAge * 0.8);
          dropEffect += secondaryGlow * 0.3;
        }
      }
      
      // Surface tension area highlight
      if (distanceToDrop < 1.8 && dropAge > 0.2 && dropAge < 1.2) {
        float tensionGlow = (1.8 - distanceToDrop) / 1.8 * dropStrength * exp(-(dropAge - 0.2) * 2.0);
        dropEffect += tensionGlow * 0.2;
      }
    }
    
    vAlpha = clamp(baseOpacity + movement * 0.2 + dropEffect + mouseEffect * 0.15, 0.1, 1.0);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Enhanced size calculation with realistic drop particle scaling
    float dynamicSize = 1.0 + movement * 0.3 + mouseEffect * 0.15;
    
    if (dropStrength > 0.01) {
      float dropAge = time - dropTime;
      float distanceToDrop = length(pos - dropPosition);
      
      // Splash particles are significantly larger
      if (distanceToDrop < 2.5 && dropAge < 0.4) {
        float splashSize = exp(-distanceToDrop * 0.6) * dropStrength * exp(-dropAge * 2.5);
        dynamicSize += splashSize * 1.2;
      }
      
      // Ripple crest particles are moderately larger
      float primaryRipple = dropAge * 4.0;
      float rippleProximity = abs(distanceToDrop - primaryRipple);
      if (rippleProximity < 0.4) {
        float rippleSize = exp(-rippleProximity * 4.0) * dropStrength * exp(-dropAge * 1.5);
        dynamicSize += rippleSize * 0.6;
      }
      
      // Surface tension particles have pulsating size
      if (distanceToDrop < 1.8 && dropAge > 0.2 && dropAge < 1.2) {
        float tensionAge = dropAge - 0.2;
        float tensionPulse = abs(sin(tensionAge * 10.0)) * 
                            (1.8 - distanceToDrop) / 1.8 * 
                            dropStrength * 
                            exp(-tensionAge * 2.0);
        dynamicSize += tensionPulse * 0.4;
      }
    }
    
    gl_PointSize = size * globalSize * dynamicSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  uniform float blurAmount;
  uniform float baseOpacity;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float r = length(center);
    
    if (r > 0.5) discard;
    
    // Optimized blur calculation
    float alpha;
    if (blurAmount > 0.8) {
      alpha = vAlpha * exp(-r * r * 3.0);
    } else if (blurAmount > 0.5) {
      alpha = vAlpha * (1.0 - r * r * 1.5);
    } else {
      alpha = vAlpha * (1.0 - smoothstep(0.2, 0.5, r));
    }
    
    alpha *= baseOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

interface ParticleSystemProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  blurAmount?: number;
  sizeVariation?: number;
  chaosAmount?: number;
  fluidViscosity?: number;
  waveAmplitude?: number;
  opacity?: number;
}

function ParticleSystem({
  color = "#4a90e2",
  particleCount = 6000, // Reduced for better performance
  particleSize = 1.5,
  blurAmount = 0.6,
  sizeVariation = 0.5,
  chaosAmount = 0.25,
  fluidViscosity = 0.4,
  waveAmplitude = 0.3,
  opacity = 0.7,
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  const currentMousePos = useRef(new THREE.Vector3());
  const prevMousePos = useRef(new THREE.Vector3());
  const mouseInfluenceRef = useRef(0);
  const lastMouseTime = useRef(0);
  const isMouseOverSphere = useRef(false);
  const frameCount = useRef(0);

  const { raycaster, mouse, camera, gl } = useThree();

  // Optimized geometry creation with reduced complexity
  const [positions, colors, sizes, randomOffsets] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randomOffsets = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);
    const radius = 3;

    // Use more efficient distribution
    for (let i = 0; i < particleCount; i++) {
      // Optimized sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Simplified color variation
      const variation = 0.08;
      const randVar = (Math.random() - 0.5) * variation;
      colors[i * 3] = Math.max(0, Math.min(1, colorObj.r + randVar));
      colors[i * 3 + 1] = Math.max(0, Math.min(1, colorObj.g + randVar));
      colors[i * 3 + 2] = Math.max(0, Math.min(1, colorObj.b + randVar));

      sizes[i] = 1 + (Math.random() - 0.5) * sizeVariation;
      randomOffsets[i] = Math.random();
    }

    return [positions, colors, sizes, randomOffsets];
  }, [particleCount, color, sizeVariation]);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      mousePosition3D: { value: new THREE.Vector3() },
      prevMousePosition3D: { value: new THREE.Vector3() },
      mouseInfluence: { value: 0 },
      globalSize: { value: particleSize },
      blurAmount: { value: blurAmount },
      chaosAmount: { value: chaosAmount },
      fluidViscosity: { value: fluidViscosity },
      waveAmplitude: { value: waveAmplitude },
      dropPosition: { value: new THREE.Vector3() },
      dropTime: { value: 0 },
      dropStrength: { value: 0 },
      baseOpacity: { value: opacity },
    }),
    []
  );

  // Update uniforms only when props change
  useEffect(() => {
    uniforms.globalSize.value = particleSize;
    uniforms.blurAmount.value = blurAmount;
    uniforms.chaosAmount.value = chaosAmount;
    uniforms.fluidViscosity.value = fluidViscosity;
    uniforms.waveAmplitude.value = waveAmplitude;
    uniforms.baseOpacity.value = opacity;
  }, [
    particleSize,
    blurAmount,
    chaosAmount,
    fluidViscosity,
    waveAmplitude,
    opacity,
    uniforms,
  ]);

  const interactionSphere = useMemo(
    () => new THREE.SphereGeometry(3.5, 32, 32),
    []
  );

  // Throttled mouse update function
  // Update the updateMousePosition function:
  const updateMousePosition = useCallback(
    (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);

      // FIX: Create a mesh that rotates with the particle group
      if (particleGroupRef.current) {
        const tempMesh = new THREE.Mesh(interactionSphere);

        // Apply the same transformation as the particle group
        tempMesh.position.copy(particleGroupRef.current.position);
        tempMesh.rotation.copy(particleGroupRef.current.rotation);
        tempMesh.scale.copy(particleGroupRef.current.scale);
        tempMesh.updateMatrixWorld();

        const intersects = raycaster.intersectObject(tempMesh);

        if (intersects.length > 0) {
          isMouseOverSphere.current = true;
          const point = intersects[0].point;

          // Transform the world space intersection point to local space
          const localPoint = point.clone();
          particleGroupRef.current.worldToLocal(localPoint);

          prevMousePos.current.copy(currentMousePos.current);
          currentMousePos.current.copy(localPoint);
          mouseInfluenceRef.current = 1;
          lastMouseTime.current = Date.now();
        } else {
          isMouseOverSphere.current = false;
          mouseInfluenceRef.current = 0;
        }
      }
    },
    [raycaster, mouse, camera, gl, interactionSphere]
  );

  // Throttled event handlers
  useEffect(() => {
    const canvas = gl.domElement;
    let mouseMoveThrottle: number;
    let isThrottling = false;

    const throttledMouseMove = (event: MouseEvent) => {
      if (!isThrottling) {
        isThrottling = true;
        updateMousePosition(event);
        mouseMoveThrottle = window.setTimeout(() => {
          isThrottling = false;
        }, 16); // ~60fps throttling
      }
    };

    const handleClick = (event: MouseEvent) => {
      updateMousePosition(event);

      if (isMouseOverSphere.current) {
        const currentTime = uniforms.time.value;

        // The currentMousePos is already in local space from updateMousePosition
        const clickPosition = currentMousePos.current.clone();

        // Add slight randomization to drop position for more natural effect
        const randomOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        clickPosition.add(randomOffset);

        uniforms.dropPosition.value.copy(clickPosition);
        uniforms.dropTime.value = currentTime;
        uniforms.dropStrength.value = 1.0;

        // Rest of the animation code stays the same...
        const fadeStart = currentTime;
        const totalDuration = 4.0;

        const fadeInterval = setInterval(() => {
          const elapsed = uniforms.time.value - fadeStart;

          if (elapsed >= totalDuration) {
            uniforms.dropStrength.value = 0;
            clearInterval(fadeInterval);
          } else {
            let strength = 1.0;

            if (elapsed < 0.5) {
              strength = 1.0;
            } else if (elapsed < 1.5) {
              strength = 0.9 * Math.exp(-(elapsed - 0.5) * 0.8);
            } else if (elapsed < 2.5) {
              strength = 0.4 * Math.exp(-(elapsed - 1.5) * 1.2);
            } else {
              strength = 0.2 * Math.exp(-(elapsed - 2.5) * 2.0);
            }

            uniforms.dropStrength.value = Math.max(0, strength);
          }
        }, 32);
      }
    };

    canvas.addEventListener("mousemove", throttledMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", throttledMouseMove);
      canvas.removeEventListener("click", handleClick);
      if (mouseMoveThrottle) clearTimeout(mouseMoveThrottle);
    };
  }, [gl, uniforms, updateMousePosition]);

  useFrame((state) => {
    frameCount.current++;

    if (meshRef.current && particleGroupRef.current) {
      uniforms.time.value = state.clock.elapsedTime;

      // Update mouse influence with throttling
      if (frameCount.current % 2 === 0) {
        // Update every other frame
        if (isMouseOverSphere.current) {
          const timeSinceLastMouse = Date.now() - lastMouseTime.current;
          if (timeSinceLastMouse > 100) {
            mouseInfluenceRef.current = Math.max(
              0,
              mouseInfluenceRef.current - 0.02
            );
          }
        }

        uniforms.mouseInfluence.value = mouseInfluenceRef.current;
        uniforms.mousePosition3D.value.copy(currentMousePos.current);
        uniforms.prevMousePosition3D.value.copy(prevMousePos.current);
      }

      // Slower rotation for better performance
      particleGroupRef.current.rotation.y += 0.0008;
      particleGroupRef.current.rotation.x += 0.0004;
    }
  });

  return (
    <group>
      <group ref={particleGroupRef}>
        <points ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              args={[positions, 3]}
            />
            <bufferAttribute
              attach='attributes-customColor'
              args={[colors, 3]}
            />
            <bufferAttribute attach='attributes-size' args={[sizes, 1]} />
            <bufferAttribute
              attach='attributes-randomOffset'
              args={[randomOffsets, 1]}
            />
          </bufferGeometry>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

interface ParticleSphereProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  blurAmount?: number;
  sizeVariation?: number;
  chaosAmount?: number;
  fluidViscosity?: number;
  waveAmplitude?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParticleSphere({
  color = "#4a90e2",
  particleCount = 6000,
  particleSize = 1.5,
  blurAmount = 0.6,
  sizeVariation = 0.5,
  chaosAmount = 0.25,
  fluidViscosity = 0.4,
  waveAmplitude = 0.3,
  opacity = 0.7,
  className = "",
  style = {},
}: ParticleSphereProps) {
  return (
    <div className={`w-full h-screen ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance", // Request high-performance GPU
        }}
        // Limit pixel ratio for performance
      >
        <ParticleSystem
          color={color}
          particleCount={particleCount}
          particleSize={particleSize}
          blurAmount={blurAmount}
          sizeVariation={sizeVariation}
          chaosAmount={chaosAmount}
          fluidViscosity={fluidViscosity}
          waveAmplitude={waveAmplitude}
          opacity={opacity}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          maxDistance={12}
          minDistance={6}
        />
      </Canvas>
    </div>
  );
}
