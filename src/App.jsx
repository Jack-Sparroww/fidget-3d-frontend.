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
  const [selectedColor, setSelectedColor] = useState('#84cc16');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const mountRef = useRef(null);
  const cubeMeshRef = useRef(null);

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
      description: 'Anéis eixos triplos independentes em verde neon e acabamento acetinado.'
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
      const geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);

      const materials = [
        new THREE.MeshStandardMaterial({ color: new THREE.Color(selectedColor), roughness: 0.3, metalness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(selectedColor), roughness: 0.3, metalness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.1 }),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(selectedColor), roughness: 0.3, metalness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(selectedColor), roughness: 0.3, metalness: 0.2 })
      ];

      const cube = new THREE.Mesh(geometry, materials);
      cubeMeshRef.current = cube;
      group.add(cube);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xa3e635 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      wireframe.scale.set(1.01, 1.01, 1.01);
      group.add(wireframe);

      const ringGeo = new THREE.TorusGeometry(1.25, 0.025, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      scene.add(group);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      camera.position.set(2.6, 2.2, 3.2);
      camera.lookAt(0, 0, 0);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        group.rotation.y += 0.01;
        ring.rotation.z += 0.015;
        renderer.render(scene, camera);
      };
      animate();

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
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
        }
        if (currentRef) {
          currentRef.replaceChildren();
        }
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (cubeMeshRef.current && Array.isArray(cubeMeshRef.current.material)) {
      const newColor = new THREE.Color(selectedColor);
      cubeMeshRef.current.material[0].color.set(newColor);
      cubeMeshRef.current.material[1].color.set(newColor);
      cubeMeshRef.current.material[4].color.set(newColor);
      cubeMeshRef.current.material[5].color.set(newColor);
    }
  }, [selectedColor]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, color: selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
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
              Impressão 3D de Alta Precisão (0.12mm)
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6">
              Fidget Toys 3D com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-slate-200">
                Precisão SolidAxis
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl">
              Modelos sensoriais articulados fabricados com filamentos ecológicos de alta durabilidade. Personalize as cores em tempo real antes da impressão!
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href="#catalogo"
                className="px-6 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105"
              >
                Ver Catálogo
              </a>
              <button
                onClick={() => addToCart(products[0])}
                className="px-6 py-3.5 bg-slate-900 border border-slate-700 hover:border-lime-500/50 text-white font-semibold rounded-xl transition-all"
              >
                Adicionar em Destaque
              </button>
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
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              Visualizador 3D SolidAxis
            </div>

            <div ref={mountRef} className="w-full h-80 sm:h-96 rounded-2xl cursor-grab active:cursor-grabbing" />

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Cor do PLA:</span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Verde Lime', hex: '#84cc16' },
                  { name: 'Cyber Magenta', hex: '#ec4899' },
                  { name: 'Laranja Flame', hex: '#f97316' },
                  { name: 'Roxo Deep', hex: '#8b5cf6' },
                  { name: 'Azul Neon', hex: '#06b6d4' }
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full transition-all transform hover:scale-125 ${
                      selectedColor === color.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-80'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Catálogo de Fidgets
            </h2>
            <p className="text-slate-400 text-sm">Escolha o seu modelo e receba em casa</p>
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
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    ★ {product.rating} <span className="text-slate-500">({product.reviews})</span>
                  </span>
                  <span className="font-mono text-lime-400/80">In Stock</span>
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
                  Comprar
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
                    cart.map((item) => (
                      <div
                        key={item.id}
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
                            <span className="text-xs text-slate-400">
                              R$ {item.price.toFixed(2)} x {item.quantity}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
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
                    <span className="text-slate-400">Total</span>
                    <span className="text-2xl font-black text-white">
                      R$ {totalCartPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => alert('Checkout enviado!')}
                    className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl transition-all text-sm uppercase tracking-wider"
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