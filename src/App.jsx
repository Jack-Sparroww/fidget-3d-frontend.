import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  ShoppingCart, Trash2, Box, Cpu, ShieldCheck, Truck, 
  Search, Star, Lock, CheckCircle2, RefreshCw, Layers, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://fidget-3d-backend.onrender.com';

// Componente 3D com Canvas e Three.js
function ThreeViewer({ color }) {
  const containerRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Limpa o container antes de anexar o canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Iluminação Profissional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 2);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Geometria TorusKnot representando o Fidget 3D
    const geometry = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.25,
      metalness: 0.65,
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.008;
        meshRef.current.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Atualização dinâmica da cor do filamento
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.color.set(color);
    }
  }, [color]);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] cursor-grab active:cursor-grabbing" />;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#06b6d4');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [printProgress, setPrintProgress] = useState(68);

  // Busca produtos do Back-end
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err);
        // Fallback para exibição em caso de falha de conexão inicial
        setProducts([
          { id: 1, name: 'Cyber Fidget Spinner 3D', price: 39.90, category: 'Spinners', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', description: 'Spinner ergonômico de alta rotação impresso com filamento PLA Premium.' },
          { id: 2, name: 'Cube Fidget Infinito', price: 29.90, category: 'Cubos', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', description: 'Cubo articulado sensorial para alívio imediato de estresse e ansiedade.' },
          { id: 3, name: 'Dragão Articulado 3D', price: 69.90, category: 'Articulados', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500', description: 'Modelo altamente detalhado com mais de 20 pontos de articulação flexíveis.' },
        ]);
        setLoading(false);
      });
  }, []);

  // Simulação dinâmica da barra de progresso da Impressora 3D
  useEffect(() => {
    const interval = setInterval(() => {
      setPrintProgress(prev => (prev >= 100 ? 10 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product, color = selectedColor) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.color === color);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const totalCart = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 120.00;
  const progressToFreeShipping = Math.min((totalCart / freeShippingThreshold) * 100, 100);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header & Navegação */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-gradient uppercase">CYBER FIDGET 3D</span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">E-Commerce & Tech Lab</span>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Buscar fidgets, articulados, spinners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Ações & Carrinho */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-full transition-colors border border-slate-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 2. Hero Section com Visualizador 3D */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900 via-slate-900/60 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Impressão 3D de Alta Precisão (0.12mm)
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Fidget Toys 3D com <span className="text-gradient">Design Cyberpunk</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Modelos sensoriais articulados fabricados com filamentos ecológicos de alta durabilidade. Personalize as cores em tempo real antes da impressão!
            </p>

            {/* Benefícios Rápidos */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300 font-medium">Envio em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">PLA Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-slate-300 font-medium">Pix & Cartão</span>
              </div>
            </div>
          </div>

          {/* Visualizador 3D Interativo */}
          <div className="lg:col-span-6 relative bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 shadow-inner flex flex-col items-center">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Visualizador 3D Realtime
            </div>
            
            <ThreeViewer color={selectedColor} />

            {/* Paleta de Cores do Filamento */}
            <div className="mt-4 flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-full border border-slate-800 z-10">
              <span className="text-xs text-slate-400 font-mono px-2">Cor do PLA:</span>
              {[
                { name: 'Cyan Neon', hex: '#06b6d4' },
                { name: 'Magenta Tech', hex: '#ec4899' },
                { name: 'Verde Matrix', hex: '#10b981' },
                { name: 'Roxo Cyber', hex: '#8b5cf6' },
                { name: 'Preto Carbono', hex: '#1e293b' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${selectedColor === c.hex ? 'ring-2 ring-white scale-110' : ''}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Status da Impressora 3D (Telemetria) */}
        <section className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Telemetria da Fazenda de Impressão</h3>
              <p className="text-xs text-slate-400 font-mono">Creality HI • Bico 0.4mm • Temperatura Extrusora: 215°C</p>
            </div>
          </div>
          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Lote em produção</span>
              <span className="text-cyan-400 font-bold">{printProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${printProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* 4. Catálogo de Produtos */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Catálogo de Fidgets</h2>
              <p className="text-sm text-slate-400">Escolha o seu modelo e receba em casa</p>
            </div>

            {/* Categorias */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {['Todos', 'Spinners', 'Cubos', 'Articulados'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos */}
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-mono flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" /> Carregando produtos da fábrica...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-slate-900/60 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-cyan-500/5">
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-400 text-[10px] font-mono px-2.5 py-1 rounded-full uppercase">
                      {product.category || 'Fidget 3D'}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-slate-400 text-[11px] ml-1">(4.9)</span>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                      <p className="text-slate-400 text-xs line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <div>
                        <span className="text-xs text-slate-500 block font-mono">A partir de</span>
                        <span className="text-xl font-extrabold text-white">R$ {Number(product.price).toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" /> Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 5. Carrinho Deslizante (Slide-over Cart) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold">Seu Carrinho</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white text-sm font-mono">
                  [Fechar ✕]
                </button>
              </div>

              {/* Progresso de Frete Grátis */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Frete Grátis acima de R$ 120,00</span>
                  <span className="text-cyan-400 font-bold">{progressToFreeShipping.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full transition-all" style={{ width: `${progressToFreeShipping}%` }} />
                </div>
              </div>

              {/* Itens do Carrinho */}
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm space-y-2">
                  <Box className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Seu carrinho está vazio no momento.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                        <div>
                          <h4 className="text-sm font-bold">{item.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">Qtd: {item.quantity} × R$ {Number(item.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-rose-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total e Checkout */}
            {cart.length > 0 && (
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-cyan-400">R$ {totalCart.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => alert("Integração do checkout ativada! Em breve com Mercado Pago e Pix Oficial.")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" /> Finalizar Pedido via Pix
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Rodapé Comercial */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-base font-extrabold text-gradient uppercase">CYBER FIDGET 3D</span>
            <p className="text-slate-500 leading-relaxed">
              Desenvolvimento e manufatura aditiva de Fidget Toys de alta performance com filamentos sustentáveis.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold">Navegação</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Todos os Produtos</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Fazenda de Impressão</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold">Ajuda & Suporte</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Termos e Condições</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidade (LGPD)</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Envios e Devoluções</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold">Atendimento</h4>
            <p className="text-slate-400">Seg. a Sex. das 09h às 18h</p>
            <p className="text-cyan-400 font-mono font-bold">suporte@cyberfidget3d.com.br</p>
          </div>
        </div>
        <div className="border-t border-slate-800/80 py-4 text-center text-slate-600 font-mono">
          © 2026 CYBER FIDGET 3D. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}