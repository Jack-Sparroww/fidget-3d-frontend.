import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolidAxisLogo = () => (
  <svg className="w-9 h-9" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="85" stroke="#334155" strokeWidth="4" />
    <path d="M100 15 A85 85 0 0 1 185 100" stroke="#84cc16" strokeWidth="8" strokeLinecap="round" />
    <path d="M15 100 A85 85 0 0 1 100 185" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="100" cy="100" r="65" stroke="#1e293b" strokeWidth="6" />
    <path d="M100 35 A65 65 0 0 1 165 100" stroke="#a3e635" strokeWidth="6" />
    <g transform="translate(100,100)">
      <path d="M0 -25 L22 -12 L0 0 L-22 -12 Z" fill="#e2e8f0" />
      <path d="M-22 -12 L0 0 L0 25 L-22 13 Z" fill="#64748b" />
      <path d="M0 0 L22 -12 L22 13 L0 25 Z" fill="#334155" />
    </g>
  </svg>
);

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState({ name: 'Dourado Silk', hex: '#eab308', category: 'Silk' });
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  const mountRef = useRef(null);
  const filamentMaterialsRef = useRef([]);
  const spoolGroupRef = useRef(null);

  const colorsList = [
    { name: 'Dourado Silk', hex: '#eab308', category: 'Silk' },
    { name: 'Prata Silk', hex: '#94a3b8', category: 'Silk' },
    { name: 'Vermelho Silk', hex: '#dc2626', category: 'Silk' },
    { name: 'Azul Silk', hex: '#2563eb', category: 'Silk' },
    { name: 'Preto Matte', hex: '#18181b', category: 'Matte' },
    { name: 'Branco Matte', hex: '#f4f4f5', category: 'Matte' },
    { name: 'Cinza Matte', hex: '#71717a', category: 'Matte' },
    { name: 'Azul/Verde DualColor', hex: '#06b6d4', category: 'DualColor' },
    { name: 'Rosa/Roxo DualColor', hex: '#d946ef', category: 'DualColor' },
    { name: 'Cobre/Dourado DualColor', hex: '#d97706', category: 'DualColor' },
    { name: 'Rainbow Tricolor (Azul/Rosa/Amarelo)', hex: '#ec4899', category: 'Tricolor' },
    { name: 'Sunset Tricolor (Roxo/Laranja/Amarelo)', hex: '#f97316', category: 'Tricolor' }
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

      filamentMaterialsRef.current = [];

      const layersCount = 5;
      for (let i = 0; i < layersCount; i++) {
        const radius = 0.75 + (i * 0.12);
        const heightVal = 0.76;
        
        const filamentGeo = new THREE.CylinderGeometry(radius, radius, heightVal, 48, 12, true);
        const filamentMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(selectedColor.hex),
          roughness: 0.35 - (i * 0.02),
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        
        filamentMaterialsRef.current.push(filamentMat);
        const filamentLayer = new THREE.Mesh(filamentGeo, filamentMat);
        group.add(filamentLayer);
      }

      const coreGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.78, 32);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      const spoolMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.45 });
      
      const flangeGeo1 = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 48);
      const flange1 = new THREE.Mesh(flangeGeo1, spoolMat);
      flange1.position.y = 0.42;
      group.add(flange1);

      const flangeGeo2 = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 48);
      const flange2 = new THREE.Mesh(flangeGeo2, spoolMat);
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

      const holeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.95, 24);
      const holeMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      group.add(hole);

      group.rotation.x = Math.PI / 5;
      group.rotation.y = Math.PI / 4;
      scene.add(group);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight.position.set(6, 6, 6);
      scene.add(dirLight);

      const backLight = new THREE.DirectionalLight(0x84cc16, 0.8);
      backLight.position.set(-6, -6, -6);
      scene.add(backLight);

      camera.position.set(0, 0, 3.8);

      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let autoRotate = true;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (autoRotate && !isDragging) {
          group.rotation.y += 0.008;
          group.rotation.x += 0.003;
        }
        renderer.render(scene, camera);
      };
      animate();

      const onMouseDown = (e) => {
        isDragging = true;
        autoRotate = false;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        group.rotation.y += deltaX * 0.012;
        group.rotation.x += deltaY * 0.012;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const domElem = currentRef;
      domElem.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

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
        domElem.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer) renderer.dispose();
        if (currentRef) currentRef.replaceChildren();
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    filamentMaterialsRef.current.forEach((mat) => {
      mat.color.set(new THREE.Color(selectedColor.hex));
    });
  }, [selectedColor]);

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
      return [...prev, { ...product, quantity: 1, color: selectedColor.name, colorHex: selectedColor.hex }];
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

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-lime-500 selection:text-black">
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

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar fidgets articulados, spinners, cubos..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lime-500 transition-colors"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

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

      <section className="relative overflow-hidden py-12 md:py-20 border-b border-slate-800/60 bg-gradient-to-b from-[#0a0c10] via-slate-950 to-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
              Simulador 3D com Rotação 360° Livre
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6">
              Fidget Toys 3D com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-slate-200">
                Precisão SolidAxis
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl">
              Clique e arraste o carretel para inspecioná-lo de todos os ângulos. Escolha o filamento ideal abrindo o nosso catálogo completo de cores abaixo!
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setIsColorModalOpen(true)}
                className="px-6 py-3.5 bg-slate-900 border border-lime-500/50 hover:border-lime-400 text-lime-400 font-bold rounded-xl shadow-lg transition-all flex items-center gap-3 hover:scale-105"
              >
                <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: selectedColor.hex }} />
                Escolher Filamento ({selectedColor.name})
              </button>
              <a
                href="#catalogo"
                className="px-6 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105"
              >
                Ver Catálogo
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-lime-400">⚡</span> Envio em 24h
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-400">🛡️</span> PLA Premium
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-400">💳</span> Pix & Cartão
              </div>
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
              <span>💡 Dica: Arraste para girar o rolo em 360°.</span>
              <span className="font-mono text-slate-500">Silk, Matte, Dual & Tri</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE SELEÇÃO DE FILAMENTOS ORGANIZADO */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsColorModalOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-2xl bg-[#0e1217] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Catálogo de Filamentos 3D</h3>
                <p className="text-xs text-slate-400 mt-0.5">Selecione o tipo e acabamento desejado para a impressão</p>
              </div>
              <button
                onClick={() => setIsColorModalOpen(false)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {['Silk', 'Matte', 'DualColor', 'Tricolor'].map((catName) => {
                const categoryColors = colorsList.filter((c) => c.category === catName);
                if (categoryColors.length === 0) return null;

                return (
                  <div key={catName}>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-lime-400 mb-3">
                      — {catName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryColors.map((color) => {
                        const isSelected = selectedColor.hex === color.hex;
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                              setSelectedColor(color);
                              setIsColorModalOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                              isSelected
                                ? 'bg-slate-800 border-lime-500 shadow-md shadow-lime-500/10'
                                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <span
                              className="w-7 h-7 rounded-full shadow-inner shrink-0 border border-black/20"
                              style={{ backgroundColor: color.hex }}
                            />
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

            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsColorModalOpen(false)}
                className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
              >
                Confirmar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Catálogo de Fidgets
            </h2>
            <p className="text-slate-400 text-sm">
              Serão impressos no filamento selecionado: <strong className="text-lime-400">{selectedColor.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['Todos', 'Spinners', 'Cubos', 'Articulados'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-lime-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-slate-900/60 border border-slate-800/80 hover:border-lime-500/40 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-lime-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-800">
                    {product.category}
                  </span>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: selectedColor.hex }} />
                    <span className="text-[10px] font-mono text-slate-300">{selectedColor.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    ★ {product.rating} <span className="text-slate-500">({product.reviews})</span>
                  </span>
                  <span className="font-mono text-lime-400/80">Em Estoque</span>
                </div>

                <h3 className="font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                  {product.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Preço</span>
                  <span className="text-xl font-black text-white">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl text-xs transition-all hover:scale-105"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0c10] border-l border-slate-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Carrinho</span>
                    <span className="text-xs font-mono text-lime-400">({cart.length} itens)</span>
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Seu carrinho está vazio no momento.
                    </p>
                  ) : (
                    cart.map((item, idx) => (
                      <div
                        key={`${item.id}-${item.color}-${idx}`}
                        className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.name}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.colorHex }} />
                              <span className="text-[10px] text-slate-400 font-mono">{item.color}</span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              R$ {item.price.toFixed(2)} x {item.quantity}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.color)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                        >
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total do Pedido</span>
                    <span className="text-2xl font-black text-white">
                      R$ {totalCartPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => alert('Pedido encaminhado para pagamento via Pix!')}
                    className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl transition-all text-sm uppercase tracking-wider shadow-lg shadow-lime-500/10"
                  >
                    Finalizar Pedido com Pix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 SolidAxis 3D Lab. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}