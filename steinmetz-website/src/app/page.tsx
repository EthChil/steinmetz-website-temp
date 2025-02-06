'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import ContactForm from "@/components/ContactModal";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const currentRef = threeRef.current; // Store the current ref value

    if (currentRef) {
      const { clientWidth, clientHeight } = currentRef;
      renderer.setSize(clientWidth, clientHeight);
    }

    const enableAsciiRendering = true; // Set this to true to enable ASCII rendering

    if (threeRef.current) {
      camera.aspect = threeRef.current.clientWidth / threeRef.current.clientHeight;
      camera.updateProjectionMatrix();
    }

    let effect: AsciiEffect | undefined;
    const characters = ' .:-+*=%@#steinmetz';
    const effectSize = { amount: 0.25 };
    const backgroundColor = 'black';
    const ASCIIColor = 'white';

    function createEffect() {
      if (threeRef.current) {
        effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
        effect.setSize(threeRef.current.clientWidth, threeRef.current.clientHeight);
        effect.domElement.style.color = ASCIIColor;
        effect.domElement.style.backgroundColor = backgroundColor;
      }
    }

    if (enableAsciiRendering) {
      createEffect();
      if (threeRef.current && effect) {
        threeRef.current.appendChild(effect.domElement);
      }
    } else {
      // Append the renderer's DOM element to ensure the mesh is visible when ASCII rendering is disabled
      if (threeRef.current) {
        threeRef.current.appendChild(renderer.domElement);
      }
    }

    // Add ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    // Add directional light to highlight the model
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    if (!enableAsciiRendering) {
      // Add lines on the axis to indicate where the mesh is rotating about
      const xAxisLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-100, 0, 0), new THREE.Vector3(100, 0, 0)]),
        new THREE.LineBasicMaterial({ color: 0xff0000 })
      );
      const yAxisLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -100, 0), new THREE.Vector3(0, 100, 0)]),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      );
      const zAxisLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -100), new THREE.Vector3(0, 0, 100)]),
        new THREE.LineBasicMaterial({ color: 0x0000ff })
      );
      scene.add(xAxisLine, yAxisLine, zAxisLine);
    }

    // Load STL model from an online source for debugging
    const stlLoader = new STLLoader();
    stlLoader.load('./RenderAssem.STL', (geometry) => {
      if (!geometry) {
        console.error('Failed to load geometry');
        return;
      }
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);
      const object = new THREE.Object3D();
      mesh.position.set(-180, -30, -50);
      object.add(mesh);
      object.position.set(0,-75,0);
      scene.add(object);

      // Log camera position for debugging
      console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);

      // Log renderer size for debugging
      console.log(`Renderer size: width=${renderer.domElement.width}, height=${renderer.domElement.height}`);

      // Animation loop capped at 60fps
      let lastFrameTime = 0;
      const animate = function (time: number) {
        requestAnimationFrame(animate);
        const deltaTime = time - lastFrameTime;
        if (deltaTime < 1000 / 60) return; // Cap at 60fps
        lastFrameTime = time;
        
        object.rotation.y += 0.015;
        // object.rotation.x += 0.02;
        if (enableAsciiRendering && effect) {
          effect.render(scene, camera);
        } else {
          renderer.render(scene, camera);
        }
      };

      animate(performance.now());
    }, undefined, (error) => {
      console.error('An error occurred while loading the STL model:', error);
    });

    camera.rotation.x = -(3.14159 / 5);
    camera.position.z = 275;
    camera.position.y = 75;

    // Handle window resize
    const handleResize = () => {
      if (threeRef.current) {
        const { clientWidth, clientHeight } = threeRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        if (effect) {
          effect.setSize(clientWidth, clientHeight);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      if (currentRef && effect) {
        currentRef.removeChild(effect.domElement);
      }
      if (currentRef) {
        currentRef.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    <>
      <div className="min-h-screen bg-black text-white font-sans">
        <header className="relative flex items-center">
          <div className="flex w-full" style={{ height: '100%' }}>
            <div className=" w-[15%] flex items-center justify-center border-b border-transparent" style={{ borderImage: 'linear-gradient(to left, #e5e7eb, #000000) 1' }}>
              <div className="grid-background-left w-full h-full"></div>
            </div>
            
            <div className="relative z-10 flex justify-between items-center w-[70%] p-4 border-l border-r border-b bg-grey-200">
              <Image src="/steinmetz_fet_m_white.png" alt="Company Logo" width={200} height={100} />
              <button
                className="bg-white text-black px-4 py-2 rounded"
                onClick={() => setModalOpen(true)}
              >
                Contact Us
              </button>
            </div>

            <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{ borderImage: 'linear-gradient(to right, #e5e7eb, #000000) 1' }}>
              <div className="grid-background-right flex w-full h-full"></div>
            </div>
          </div>
        </header>

        <section className="flex w-full" style={{ height: 'calc(80vh - 100px)' }}>
          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{ borderImage: 'linear-gradient(to left, #e5e7eb, #000000) 1' }}>
            <div className="grid-background w-full h-full [mask-image:radial-gradient(ellipse_100%_100%_at_10%_50%,#000_50%,transparent_100%)]"></div>
          </div>

          <div className="relative z-10 flex justify-between items-center w-[70%] p-4 border-l border-r border-b">
            <div className="text-4xl sm:text-6xl font-bold">
              Hardware for the EV Age
            </div>
            <div ref={threeRef} className="w-full h-full"></div>
          </div>

          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{borderImage: 'linear-gradient(to right, #e5e7eb, #000000) 1' }}>
            <div className="grid-background w-full h-full [mask-image:radial-gradient(ellipse_100%_100%_at_90%_50%,#000_50%,transparent_100%)]"></div>
          </div>
        </section>

        <section className="flex w-full">
          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{ borderImage: 'linear-gradient(to left, #e5e7eb, #000000) 1' }}>
            <div className="grid-background-left w-full h-full"></div>
          </div>

          <div className="w-[70%] p-8 bg-grey-200 flex flex-col items-center border-b">
            <h2 className="text-4xl font-bold mb-4 text-center">Our Products</h2>

            <div className="flex w-full justify-between border-b pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-center items-center">
                <h2 className="text-3xl font-bold mb-2">Threshold</h2>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-center items-center">
                <h2 className="text-3xl font-bold mb-2">Junction</h2>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-center items-center">
                <h2 className="text-3xl font-bold mb-2">Bandgap</h2>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-center items-center">
                <h2 className="text-3xl font-bold mb-2">Avalanche</h2>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 aspect-h-1">
                <Image src="/omar.png" alt="Image 1" className="object-cover" width={500} height={500}/>
              </div>
              <div className="w-1/4 aspect-w-1 aspect-h-1">
                <Image src="/omar.png" alt="Image 2" className="object-cover" width={500} height={500}/>
              </div>
              <div className="w-1/4 aspect-w-1 aspect-h-1">
                <Image src="/omar.png" alt="Image 3" className="object-cover" width={500} height={500}/>
              </div>
              <div className="w-1/4 aspect-w-1 aspect-h-1">
                <Image src="/omar.png" alt="Image 3" className="object-cover" width={500} height={500}/>
              </div>
            </div>

            <div className="flex w-full justify-between border-b pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-left items-center">
                <h2 className="text-2xl font-bold mb-2">Interface</h2>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">One Click Tuning</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">One Click Tuning</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">One Click Tuning</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">One Click Tuning</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">Resolver, Encoder (ABZ, Sin/Cos)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">Resolver, Encoder (ABZ, Sin/Cos)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
              <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">Resolver, Encoder (ABZ, Sin/Cos)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
              <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">Resolver, Encoder (ABZ, Sin/Cos)</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Communication</h5>
                <h5 className="text-xl">CAN, Ethercat</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Communication</h5>
                <h5 className="text-xl">CAN, Ethercat</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">CAN, Ethercat</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Rotor Sensor</h5>
                <h5 className="text-xl">CAN, Ethercat</h5>
              </div>
            </div>

            <div className="flex w-full justify-between border-b pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-left items-center">
                <h2 className="text-2xl font-bold mb-2">Electrical</h2>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Power</h5>
                <h5 className="text-xl">10 kW</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Power</h5>
                <h5 className="text-xl">50 kW</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Power</h5>
                <h5 className="text-xl">150 kW</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Power</h5>
                <h5 className="text-xl">225 kW</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-8">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Voltage</h5>
                <h5 className="text-xl mb-1">800 V<sub>peak</sub> </h5>
                <h5 className="text-xl mb-1">600 V<sub>rms</sub> </h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Voltage</h5>
                <h5 className="text-xl mb-1">600 V<sub>peak</sub> </h5>
                <h5 className="text-xl mb-1">400 V<sub>rms</sub> </h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Voltage</h5>
                <h5 className="text-xl mb-1">600 V<sub>peak</sub> </h5>
                <h5 className="text-xl mb-1">400 V<sub>rms</sub> </h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Voltage</h5>
                <h5 className="text-xl mb-1">600 V<sub>peak</sub> </h5>
                <h5 className="text-xl mb-1">400 V<sub>rms</sub> </h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-8">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Current</h5>
                <h5 className="text-xl mb-1">20 A<sub>rms</sub> (60s)</h5>
                <h5 className="text-xl mb-1">10 A<sub>rms</sub> (continuous)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Current</h5>
                <h5 className="text-xl mb-1">100 A<sub>rms</sub> (60s)</h5>
                <h5 className="text-xl mb-1">50 A<sub>rms</sub> (continuous)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Current</h5>
                <h5 className="text-xl mb-1">200 A<sub>rms</sub> (60s)</h5>
                <h5 className="text-xl mb-1">100 A<sub>rms</sub> (continuous)</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-2">Current</h5>
                <h5 className="text-xl mb-1">250 A<sub>rms</sub> (60s)</h5>
                <h5 className="text-xl mb-1">150 A<sub>rms</sub> (continuous)</h5>
              </div>
            </div>

            <div className="flex w-full justify-between border-b pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-left items-center">
                <h2 className="text-2xl font-bold mb-2">Mechanical</h2>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Height</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Height</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Height</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Height</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-2">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Width</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Width</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Width</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-">Width</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-2">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Depth</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Depth</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Depth</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Depth</h5>
                <h5 className="text-xl mb-2">200 mm</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-8">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Weight</h5>
                <h5 className="text-xl mb-2">0.5 kg</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Weight</h5>
                <h5 className="text-xl mb-2">0.5 kg</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Weight</h5>
                <h5 className="text-xl mb-2">0.75 kg</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Weight</h5>
                <h5 className="text-xl mb-2">1.0 kg</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-2">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Volume</h5>
                <h5 className="text-xl mb-2">0.15 L</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Volume</h5>
                <h5 className="text-xl mb-2">0.15 L</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Volume</h5>
                <h5 className="text-xl mb-2">0.25 L</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Volume</h5>
                <h5 className="text-xl mb-2">0.80 L</h5>
              </div>
            </div>

            <div className="flex w-full justify-between border-b pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-left items-center">
                <h2 className="text-2xl font-bold mb-2">Environmental</h2>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex justify-left">
                <h5 className="text-xl font-bold mb-2">IP67</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-left">
                <h5 className="text-xl font-bold mb-2">IP67</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-left">
                <h5 className="text-xl font-bold mb-2">IP67</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex justify-left">
                <h5 className="text-xl font-bold mb-2">IP67</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Coolant</h5>
                <h5 className="text-xl mb-2">50/50 Water Glycol Mix</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Coolant</h5>
                <h5 className="text-xl mb-2">50/50 Water Glycol Mix</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Coolant</h5>
                <h5 className="text-xl mb-2">50/50 Water Glycol Mix</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Coolant</h5>
                <h5 className="text-xl mb-2">50/50 Water Glycol Mix</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Flow Rate</h5>
                <h5 className="text-xl mb-2">6 L/min</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Flow Rate</h5>
                <h5 className="text-xl mb-2">6 L/min</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Flow Rate</h5>
                <h5 className="text-xl mb-2">6 L/min</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Flow Rate</h5>
                <h5 className="text-xl mb-2">6 L/min</h5>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Operating Temp</h5>
                <h5 className="text-xl mb-2">-40&deg;C to 80&deg;C</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Operating Temp</h5>
                <h5 className="text-xl mb-2">-40&deg;C to 80&deg;C</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Operating Temp</h5>
                <h5 className="text-xl mb-2">-40&deg;C to 80&deg;C</h5>
              </div>
              <div className="w-1/4 aspect-w-1 flex flex-col justify-left">
                <h5 className="text-xl font-bold mb-1">Operating Temp</h5>
                <h5 className="text-xl mb-2">-40&deg;C to 80&deg;C</h5>
              </div>
            </div>
          </div>

          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{borderImage: 'linear-gradient(to right, #e5e7eb, #000000) 1' }}>
            <div className="grid-background-right w-full h-full "></div>
          </div>
        </section>

        <section className="flex w-full">
          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{ borderImage: 'linear-gradient(to left, #e5e7eb, #000000) 1' }}>
            <div className="grid-background-left w-full h-full"></div>
          </div>

          <div className="w-[70%] p-8 bg-grey-200 flex flex-col items-center border-b">
            <h2 className="text-4xl font-bold mb-4 text-center">Team</h2>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/2 aspect-w-1 aspect-h-1">
                <Image src="/owen.JPG" alt="Image 1" className="object-cover rounded-full" width={500} height={500}/>
              </div>
              <div className="w-1/2 aspect-w-1 aspect-h-1">
                <Image src="/ethan.JPG" alt="Image 2" className="object-cover rounded-full" width={500} height={500}/>
              </div>
            </div>

            <div className="flex w-full justify-between pt-4">
              <div className="w-1/2 aspect-w-1 aspect-h-1">
              {/* TODO swap the font / colour on this do the same to the prodcuts header */}
                <h1 className="text-5xl font-bold mb-1">Owen Brake</h1>
                <h5 className="text-xl font-bold mb-1">Co-Founder & CEO</h5>
                <h5 className="text-xl mb-2">Owen has worked </h5>
              </div>
              <div className="w-1/2 aspect-w-1 aspect-h-1">
                <h1 className="text-5xl font-bold mb-1">Ethan Childerhose</h1>
                <h5 className="text-xl font-bold mb-1">Co-Founder & CTO</h5>
                <h5 className="text-xl mb-2">Ethan grew up in Ontario, Canada cutting his teeth on numerous hobby projects and competing extensively in student robotics reaching international success. Ethan has fullstack engineering skills from mechanical engineering to semiconductor design at companies such as Tesla, Neuralink, Nvidia, and RocketLab. He prides himself in working across the technical stack, tackling complex problems in cross disciplinary ways.</h5>
              </div>
            </div>
          </div>

          <div className="w-[15%] flex items-center justify-center border-b border-transparent" style={{borderImage: 'linear-gradient(to right, #e5e7eb, #000000) 1' }}>
            <div className="grid-background-right w-full h-full "></div>
          </div>
        </section>

        <footer className="p-4 text-center mx-[20%]">
          <p>© {new Date().getFullYear()} Steinmetz, Inc. All rights reserved.</p>
        </footer>

        {/* {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-8 rounded">
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <form>
                <input type="text" placeholder="Your Name" className="block w-full mb-2 p-2 border" />
                <input type="email" placeholder="Your Email" className="block w-full mb-2 p-2 border" />
                <textarea placeholder="Your Message" className="block w-full mb-2 p-2 border"></textarea>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded">Send</button>
              </form>
              <button onClick={() => setModalOpen(false)} className="mt-4 text-red-500">Close</button>
            </div>
          </div>
        )} */}
        {isModalOpen && (
          <ContactForm onClose={() => setModalOpen(false)} />
        )}
      </div>
    </>
  );
}