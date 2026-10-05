import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolidAxisLogo = () => (
  <svg className="w-9 h-9" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="85" stroke="#334155" strokeWidth="4" />
    <path d="M100 15 A85 85 0 0 1 185 100" stroke="#84cc16" strokeWidth="8" strokeLinecap="round" />
    <path d="M15 100 A85 85 0 0 1 100 185" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="100" cy="100" r="65" stroke="#1e293b" strokeWidth="6" />
    <g transform="translate(100,100)">
      <path d="M0 -25 L22 -12 L0 0 L-22 -12 Z" fill="#e2e8f0" />
      <path d="M-22 -12 L0 0 L0 25 L-22 13 Z" fill="#64748b" />
      <path d="M0 0 L22 -12 L22 13 L0 25 Z" fill="#334155" />
    </g>
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' ou 'orcamento'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState({ 
    name: 'Preto Unicolor', 
    colors: ['#18181b'], 
    category: 'Unicolor',
    pricePerGram: 0.12 
  });
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Estados para o Orçamento Instantâneo
  const [quoteFile, setQuoteFile] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 5, width: 5, height: 5 }); // em cm
  const [infill, setInfill] = useState({ name: 'Padrão / Uso Geral (20%) [Recomendado]', multiplier: 1.0 });
  const [layerHeight, setLayerHeight] = useState({ name: '0.20mm (Padrão / Recomendado)', timeMultiplier: 1.0, qualityDesc: 'Espessura de um fio de cabelo grosso ou cartão de crédito dividido.' });

  const mountRef = useRef(null);
  const filamentLayersRef = useRef([]);
  const spoolGroupRef = useRef(null);

  const colorsList = [
    { name: 'Preto Unicolor', colors: ['#18181b'], category: 'Unicolor', pricePerGram: 0.10 },
    { name: 'Branco Unicolor', colors: ['#f4f4f5'], category: 'Unicolor', pricePerGram: 0.10 },
    { name: 'Cinza Unicolor', colors: ['#71717a'], category: 'Unicolor', pricePerGram: 0.10 },
    { name: 'Azul Royal Unicolor', colors: ['#1d4ed8'], category: 'Unicolor', pricePerGram: 0.11 },
    { name: 'Vermelho Unicolor', colors: ['#b91c1c'], category: 'Unicolor', pricePerGram: 0.11 },
    { name: 'Dourado Silk', colors: ['#eab308', '#facc15'], category: 'Silk', pricePerGram: 0.15 },
    { name: 'Prata Silk', colors: ['#94a3b8', '#cbd5e1'], category: 'Silk', pricePerGram: 0.15 },
    { name: 'Vermelho Silk', colors: ['#dc2626', '#ef4444'], category: 'Silk', pricePerGram: 0.15 },
    { name: 'Azul Silk', colors: ['#2563eb', '#3b82f6'], category: 'Silk', pricePerGram: 0.15 },
    { name: 'Preto Matte', colors: ['#27272a', '#3f3f46'], category: 'Matte', pricePerGram: 0.13 },
    { name: 'Branco Matte', colors: ['#e4e4e7', '#d4d4d8'], category: 'Matte', pricePerGram: 0.13 },
    { name: 'Cinza Matte', colors: ['#52525b', '#71717a'], category: 'Matte', pricePerGram: 0.13 },
    { name: 'Azul/Verde DualColor', colors: ['#06b6d4', '#10b981'], category: 'DualColor', pricePerGram: 0.18 },
    { name: 'Rosa/Roxo DualColor', colors: ['#d946ef', '#8b5cf6'], category: 'DualColor', pricePerGram: 0.18 },
    { name: 'Cobre/Dourado DualColor', colors: ['#d97706', '#f59e0b'], category: 'DualColor', pricePerGram: 0.18 },
    { name: 'Rainbow Tricolor', colors: ['#3b82f6', '#ec4899', '#facc15'], category: 'Tricolor', pricePerGram: 0.20 },
    { name: 'Sunset Tricolor', colors: ['#9333ea', '#f97316', '#facc15'], category: 'Tricolor', pricePerGram: 0.20 }
  ];

  const products = [
    {
      id: 1,
      name: 'Spinner Articulado SolidAxis',
      category: 'Spinners',
      price: 34.90,
      rating: 4.9,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400',
      description: 'Design exclusivo de alta rotação impresso em PLA Premium com tolerância de 0.1mm.'
    },
    {
      id: 2,
      name: 'Cubo Infinito Sensorial',
      category: 'Cubos',
      price: 42.00,
      rating: 5.0,
      reviews: 94,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      description: 'Engrenagens dobráveis para alívio de estresse. Movimento fluido contínuo.'
    },
    {
      id: 3,
      name: 'Lagarta Flexível 3D',
      category: 'Articulados',
      price: 29.90,
      rating: 4.8,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
      description: 'Corpo multi-articulado impresso em peça única sem necessidade de montagem.'
    },
    {
      id: 4,
      name: 'Engrenagem Giroscópica Hex',
      category: 'Spinners',
      price: 49.90,
      rating: 4.9,
      reviews: 76,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
      description: 'Anéis eixos triplos independentes e acabamento acetinado.'
    }
  ];

  // Configuração do simulador 3D do carretel
  useEffect(() => {
    const currentRef = mountRef.current;
    if (!currentRef) return;

    let renderer;
    let animationFrameId;

    try {
      const width = currentRef.clientWidth || 300;
      const height = currentRef.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentRef.replaceChildren(renderer.domElement);

      const group = new THREE.Group();
      spoolGroupRef.current = group;
      group.scale.set(0.85, 0.85, 0.85);

      filamentLayersRef.current = [];

      const totalSlices = 12;
      const sliceHeight = 0.76 / totalSlices;

      for (let i = 0; i < totalSlices; i++) {
        const radius = 0.82;
        const geo = new THREE.CylinderGeometry(radius, radius, sliceHeight * 0.95, 32, 1, true);
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.2, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = -0.38 + (i * sliceHeight) + (sliceHeight / 2);
        
        group.add(mesh);
        filamentLayersRef.current.push({ mesh, material: mat });
      }

      const coreGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.78, 32);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      const spoolMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.45 });
      const flange1 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.08, 48), spoolMat);
      flange1.position.y = 0.42;
      group.add(flange1);

      const flange2 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.08, 48), spoolMat);
      flange2.position.y = -0.42;
      group.add(flange2);

      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2;
        const ribGeo = new THREE.BoxGeometry(0.15, 0.09, 0.6);
        const rib1 = new THREE.Mesh(ribGeo, spoolMat);
        rib1.position.set(Math.cos(angle) * 1.05, 0.42, Math.sin(angle) * 1.05);
        rib1.rotation.y = -angle;
        group.add(rib1);

        const rib2 = rib1.clone();
        rib2.position.y = -0.42;
        group.add(rib2);
      }

      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.95, 24), new THREE.MeshStandardMaterial({ color: 0x090d16 }));
      group.add(hole);

      group.rotation.set(0.4, 0.5, 0);
      scene.add(group);

      scene.add(new THREE.AmbientLight(0xffffff, 1.3));
      const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight.position.set(6, 6, 6);
      scene.add(dirLight);

      camera.position.set(0, 0, 3.8);

      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isDragging && spoolGroupRef.current) {
          spoolGroupRef.current.rotateY(0.008);
        }
        renderer.render(scene, camera);
      };
      animate();

      const onMouseDown = (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e) => {
        if (!isDragging || !spoolGroupRef.current) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const rotationSpeed = 0.008;
        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

        spoolGroupRef.current.applyQuaternion(quaternionX);
        spoolGroupRef.current.quaternion.premultiply(quaternionY);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = () => { isDragging = false; };

      const onTouchStart = (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      };

      const onTouchMove = (e) => {
        if (!isDragging || !spoolGroupRef.current || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        const rotationSpeed = 0.008;
        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

        spoolGroupRef.current.applyQuaternion(quaternionX);
        spoolGroupRef.current.quaternion.premultiply(quaternionY);

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };

      const onTouchEnd = () => { isDragging = false; };

      currentRef.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      currentRef.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);

      const handleResize = () => {
        if (!currentRef) return;
        const w = currentRef.clientWidth || 300;
        const h = currentRef.clientHeight || 300;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        currentRef.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        currentRef.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Atualiza cores do carretel 3D
  useEffect(() => {
    filamentLayersRef.current.forEach((item, index) => {
      const colors = selectedColor.colors;
      const colorHex = colors[index % colors.length];
      
      item.material.color.set(new THREE.Color(colorHex));
      
      if (selectedColor.category === 'Silk') {
        item.material.roughness = 0.2;
        item.material.metalness = 0.5;
      } else if (selectedColor.category === 'Matte') {
        item.material.roughness = 0.85;
        item.material.metalness = 0.0;
      } else {
        item.material.roughness = 0.4;
        item.material.metalness = 0.1;
      }
    });
  }, [selectedColor]);

  // Cálculos automáticos para o Orçamento Instantâneo
  const volumeCm3 = dimensions.length * dimensions.width * dimensions.height;
  const estimatedWeightGrams = Math.round(volumeCm3 * 0.25 * infill.multiplier);
  const estimatedHours = Math.max(0.5, (estimatedWeightGrams / 12) * layerHeight.timeMultiplier).toFixed(1);
  const calculatedPrice = (estimatedWeightGrams * selectedColor.pricePerGram) + (parseFloat(estimatedHours) * 8.00);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.color === selectedColor.name);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.color === selectedColor.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, color: selectedColor.name, colors: selectedColor.colors }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, color) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.color === color)));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sendWhatsAppQuote = () => {
    const fileName = quoteFile ? quoteFile.name : 'Peça personalizada';
    const message = `Olá, SolidAxis! Gostaria de aprovar o seguinte orçamento gerado no site:\n\n` +
      `- Arquivo/Peça: ${fileName}\n` +
      `- Dimensões: ${dimensions.length}x{dimensions.width}x{dimensions.height} cm\n` +
      `- Material: ${selectedColor.name}\n` +
      `- Altura de Camada: ${layerHeight.name}\n` +
      `- Preenchimento: ${infill.name}\n` +
      `- Peso Estimado: ~${estimatedWeightGrams}g\n` +
      `- Tempo Estimado: ~${estimatedHours}h\n` +
      `- *Valor Total: R$ ${calculatedPrice.toFixed(2).replace('.', ',')}*\n\nAguardo instruções para pagamento!`;
    
    window.open(`https://wa.me/5541999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-lime-500 selection:text-black">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0c10]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SolidAxisLogo />
            <div>
              <span className="text-2xl font-black tracking-wider text-white">
                SOLID<span className="text-lime-500">AXIS</span>
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 font-mono -mt-1 uppercase">
                Manufacture 3D Lab
              </span>
            </div>
          </div>

          {/* ABAS DE NAVEGAÇÃO PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('catalogo')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalogo'
                  ? 'bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Catálogo & Fidgets
            </button>
            <button
              onClick={() => setActiveTab('orcamento')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'orcamento'
                  ? 'bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Orçamento Instantâneo
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-lime-500/50 transition-all text-slate-200 hover:text-lime-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-lime-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE PARA ABAS */}
      <div className="flex md:hidden justify-center bg-slate-950 border-b border-slate-800 p-2 gap-2">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl ${activeTab === 'catalogo' ? 'bg-lime-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setActiveTab('orcamento')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl ${activeTab === 'orcamento' ? 'bg-lime-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          Orçamento Instantâneo
        </button>
      </div>

      {/* CONTEÚDO CONDICIONAL: CATÁLOGO OU ORÇAMENTO */}
      {activeTab === 'catalogo' ? (
        <>
          <section className="relative overflow-hidden py-12 md:py-20 border-b border-slate-800/60 bg-gradient-to-b from-[#0a0c10] via-slate-950 to-[#0a0c10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono mb-6">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
                  Simulador 3D com Rotação Orbital Livre 360°
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6">
                  Fidget Toys 3D com <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-slate-200">
                    Precisão SolidAxis
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl">
                  Inspecione o carretel livremente em qualquer ângulo 360° e experimente as opções Unicolor, Silk, Matte, DualColor e Tricolor em tempo real.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    onClick={() => setIsColorModalOpen(true)}
                    className="px-6 py-3.5 bg-slate-900 border border-lime-500/50 hover:border-lime-400 text-lime-400 font-bold rounded-xl shadow-lg transition-all flex items-center gap-3 hover:scale-105"
                  >
                    <div className="flex -space-x-1 overflow-hidden">
                      {selectedColor.colors.map((c, i) => (
                        <span key={i} className="inline-block w-3.5 h-3.5 rounded-full ring-2 ring-slate-900" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    Escolher Filamento ({selectedColor.name})
                  </button>
                  <button
                    onClick={() => setActiveTab('orcamento')}
                    className="px-6 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105"
                  >
                    Fazer Orçamento de Peça CAD/STL
                  </button>
                </div>
              </div>

              <div className="relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                <div className="absolute top-4 left-4 z-10 flex items-center justify-between w-[calc(100%-2rem)]">
                  <span className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                    Filamento Ativo: <strong className="text-lime-400 ml-1">{selectedColor.name}</strong>
                  </span>
                  <button
                    onClick={() => setIsColorModalOpen(true)}
                    className="text-xs font-mono text-lime-400 hover:text-lime-300 underline"
                  >
                    Alterar
                  </button>
                </div>

                <div ref={mountRef} className="w-full h-72 sm:h-80 rounded-2xl cursor-grab active:cursor-grabbing mt-6" />

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 Arraste para girar em 360° em qualquer direção.</span>
                  <span className="font-mono text-slate-500">Three.js Quaternion</span>
                </div>
              </div>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Catálogo de Fidgets</h2>
                <p className="text-slate-400 text-sm">Impressos no filamento: <strong className="text-lime-400">{selectedColor.name}</strong></p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['Todos', 'Spinners', 'Cubos', 'Articulados'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat ? 'bg-lime-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-slate-900/60 border border-slate-800/80 hover:border-lime-500/40 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-950">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-lime-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-800">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">★ {product.rating} <span className="text-slate-500">({product.reviews})</span></span>
                      <span className="font-mono text-lime-400/80">Em Estoque</span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-lime-400 transition-colors mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{product.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Preço</span>
                      <span className="text-xl font-black text-white">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button onClick={() => addToCart(product)} className="px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl text-xs transition-all hover:scale-105">Adicionar</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      ) : (
        /* ABA DE ORÇAMENTO INSTANTÂNEO */
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Gerador Automático de Orçamento 3D
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Orçamento Instantâneo de Peças CAD & STL
            </h2>
            <p className="text-slate-400 text-sm">
              Envie seu arquivo técnico, defina os parâmetros e obtenha o preço e tempo de impressão na hora, sem espera!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUNA DA ESQUERDA: PARÂMETROS */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. UPLOAD DE ARQUIVO */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-mono uppercase tracking-wider text-lime-400 mb-4">1. Enviar Arquivo 3D (CAD / STL)</h3>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-lime-500/60 rounded-2xl p-8 cursor-pointer bg-slate-950/50 transition-all group">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-10 h-10 text-slate-500 group-hover:text-lime-400 mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-bold text-white mb-1">
                      {quoteFile ? quoteFile.name : 'Clique para carregar o arquivo (.step, .stp, .iges, .stl, .obj)'}
                    </p>
                    <p className="text-xs text-slate-500">Suporta arquivos CAD de engenharia e malhas 3D</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".stl,.obj,.step,.stp,.iges"
                    onChange={(e) => {
                      if (e.target.files[0]) setQuoteFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              {/* 2. DIMENSÕES APROXIMADAS */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-mono uppercase tracking-wider text-lime-400 mb-2">2. Dimensões Estimadas da Peça (em cm)</h3>
                <p className="text-xs text-slate-400 mb-4">Insira o tamanho aproximado da peça para o cálculo automático de volume e peso.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Comprimento (X)</label>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: Math.max(1, parseFloat(e.target.value) || 1) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Largura (Y)</label>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: Math.max(1, parseFloat(e.target.value) || 1) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Altura (Z)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: Math.max(1, parseFloat(e.target.value) || 1) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. MATERIAL / FILAMENTO */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-lime-400">3. Material e Cor do Filamento</h3>
                  <button onClick={() => setIsColorModalOpen(true)} className="text-xs text-lime-400 underline font-mono">Alterar cor</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      {selectedColor.colors.map((c, i) => (
                        <span key={i} className="w-4 h-4 rounded-full ring-2 ring-slate-900" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">{selectedColor.name}</span>
                      <span className="block text-xs text-slate-400 font-mono">PLA {selectedColor.category}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsColorModalOpen(true)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold rounded-xl transition-all">
                    Selecionar Outro
                  </button>
                </div>
              </div>

              {/* 4. QUALIDADE E PREENCHIMENTO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Altura de Camada com comparação do dia a dia */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-lime-400 mb-2">4. Altura de Camada (Qualidade)</h3>
                    <p className="text-xs text-slate-400 mb-4">Define a precisão dos detalhes visuais.</p>
                    <div className="space-y-2.5">
                      {[
                        { name: '0.28mm (Rascunho / Econômico)', timeMultiplier: 0.7, qualityDesc: 'Espessura de 3 folhas de papel sulfite juntas. Ideal para protótipos rápidos.' },
                        { name: '0.20mm (Padrão / Recomendado)', timeMultiplier: 1.0, qualityDesc: 'Espessura de um fio de cabelo grosso ou cartão de crédito dividido.' },
                        { name: '0.12mm (Alta Definição / Miniaturas)', timeMultiplier: 1.8, qualityDesc: 'Fino como uma teia de aranha estruturada. Máximo de detalhes.' }
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setLayerHeight(item)}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                            layerHeight.name === item.name ? 'bg-slate-800 border-lime-500 font-bold text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <span className="block font-semibold">{item.name}</span>
                          <span className="block text-[11px] text-slate-400 mt-1 font-normal">💡 {item.qualityDesc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preenchimento (Infill) */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-lime-400 mb-2">5. Preenchimento Interno (Infill)</h3>
                    <p className="text-xs text-slate-400 mb-4">Define a resistência estrutural da peça.</p>
                    <div className="space-y-2.5">
                      {[
                        { name: 'Leve / Decorativo (15%)', multiplier: 0.8 },
                        { name: 'Padrão / Uso Geral (20%) [Recomendado]', multiplier: 1.0 },
                        { name: 'Resistente / Mecânico (40%)', multiplier: 1.35 }
                      ].map((inf) => (
                        <button
                          key={inf.name}
                          onClick={() => setInfill(inf)}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                            infill.name === inf.name ? 'bg-slate-800 border-lime-500 font-bold text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          {inf.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DA DIREITA: RESUMO E FECHAMENTO DO ORÇAMENTO */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sticky top-28 shadow-2xl">
                <h3 className="text-base font-black text-white mb-6 pb-4 border-b border-slate-800">
                  Resumo do Orçamento
                </h3>

                <div className="space-y-4 text-xs text-slate-300 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Arquivo:</span>
                    <span className="font-mono text-white truncate max-w-[180px]">{quoteFile ? quoteFile.name : 'Nenhum arquivo enviado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensões:</span>
                    <span className="font-mono text-white">{dimensions.length}x{dimensions.width}x{dimensions.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Material:</span>
                    <span className="font-mono text-lime-400">{selectedColor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peso Estimado:</span>
                    <span className="font-mono text-white">~{estimatedWeightGrams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tempo de Máquina:</span>
                    <span className="font-mono text-white">~{estimatedHours} horas</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-300">Valor Total</span>
                    <span className="text-3xl font-black text-white">
                      R$ {calculatedPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Já inclui custo de material, depreciação e tempo de máquina.</span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={sendWhatsAppQuote}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <span>💬 Aprovar e Enviar no WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart({
                        id: Date.now(),
                        name: quoteFile ? `Peça Customizada (${quoteFile.name})` : 'Peça Customizada 3D',
                        category: 'Sob Encomenda',
                        price: calculatedPrice,
                        rating: 5.0,
                        reviews: 1,
                        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400',
                        description: `Impresso em ${selectedColor.name} | Altura: ${layerHeight.name} | Infill: ${infill.name}`
                      });
                      setActiveTab('catalogo');
                    }}
                    className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all text-xs uppercase tracking-wider border border-slate-700"
                  >
                    Adicionar Orçamento ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* MODAL DE SELEÇÃO DE FILAMENTOS */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsColorModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-[#0e1217] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Catálogo de Filamentos 3D</h3>
                <p className="text-xs text-slate-400 mt-0.5">Selecione o tipo e acabamento desejado</p>
              </div>
              <button onClick={() => setIsColorModalOpen(false)} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {['Unicolor', 'Silk', 'Matte', 'DualColor', 'Tricolor'].map((catName) => {
                const categoryColors = colorsList.filter((c) => c.category === catName);
                if (categoryColors.length === 0) return null;

                return (
                  <div key={catName}>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-3">— {catName}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryColors.map((color) => {
                        const isSelected = selectedColor.name === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                              setSelectedColor(color);
                              setIsColorModalOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                              isSelected ? 'bg-slate-800 border-lime-500 shadow-md' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex -space-x-1 shrink-0">
                              {color.colors.map((c, idx) => (
                                <span key={idx} className="inline-block w-4 h-4 rounded-full ring-2 ring-black/30" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                            <div className="overflow-hidden">
                              <span className="block text-xs font-bold text-white truncate">{color.name}</span>
                              <span className="block text-[10px] text-slate-500 font-mono">PLA {color.category}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CARRINHO LATERAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0c10] border-l border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Carrinho</span>
                    <span className="text-xs font-mono text-lime-400">({cart.length} itens)</span>
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">Seu carrinho está vazio no momento.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.name}</h4>
                            <span className="text-xs text-slate-400 block mt-0.5">R$ {item.price.toFixed(2)} x {item.quantity}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.color)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1">Remover</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total do Pedido</span>
                    <span className="text-2xl font-black text-white">R$ {totalCartPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button onClick={() => alert('Pedido encaminhado para pagamento!')} className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl transition-all text-sm uppercase tracking-wider shadow-lg">
                    Finalizar Pedido com Pix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>© 2026 SolidAxis 3D Lab. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}