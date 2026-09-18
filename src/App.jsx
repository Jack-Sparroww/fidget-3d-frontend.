import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Box, Cpu, Truck, CreditCard, Printer, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import FidgetViewer from './components/FidgetViewer';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#00f0ff');
  const [activeTab, setActiveTab] = useState('catalog');
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);
  const [printProgress, setPrintProgress] = useState(10);
  const [currentStatus, setCurrentStatus] = useState("PREPARANDO_GCODE");

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/products/')
      .then(res => setProducts(res.data))
      .catch(() => {
        setProducts([
          { id: 1, name: "Cyber Fidget Spinner 3D", base_price: 39.90, description: "Spinner ergonômico impresso em alta precisão." },
          { id: 2, name: "Cube Fidget 3D", base_price: 29.90, description: "Cubo sensorial articulado." }
        ]);
      });
  }, []);

  // Simulação do progresso da impressora 3D em tempo real
  useEffect(() => {
    if (activeTab === 'status' && printProgress < 100) {
      const timer = setInterval(() => {
        setPrintProgress((prev) => {
          const next = prev + 20;
          if (next >= 100) {
            setCurrentStatus("CONCLUÍDO / PRONTO_PARA_ENVIO");
            clearInterval(timer);
            return 100;
          } else if (next >= 60) {
            setCurrentStatus("IMPRIMINDO_CAMADA_45_120 (PLA_NEON)");
          } else if (next >= 30) {
            setCurrentStatus("AQUECENDO_MESA_E_EXTRUSORA (210°C)");
          }
          return next;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [activeTab, printProgress]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, color: selectedColor, cartId: Date.now() }]);
  };

  const calculateShipping = () => {
    if (cep.length >= 8) setShipping(15.00);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.base_price, 0);
  const total = subtotal + (shipping || 0);

  const handleCheckout = () => {
    const orderData = {
      user_id: 1,
      shipping_cost: shipping || 0,
      total_price: total,
      shipping_address: `CEP: ${cep}`
    };

    axios.post('http://127.0.0.1:8000/orders/', orderData)
      .then(res => {
        setOrderCreated(res.data);
        setActiveTab('pix');
      })
      .catch(() => {
        setOrderCreated({ id: Math.floor(Math.random() * 800) + 100 });
        setActiveTab('pix');
      });
  };

  const confirmPixPayment = () => {
    setPrintProgress(10);
    setCurrentStatus("GERANDO_FATIAMENTO_GCODE");
    setActiveTab('status');
    setCart([]);
  };

  return (
    <div style={{ backgroundColor: '#0a0a12', minHeight: '100vh', color: '#fff', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      {/* Header Neon */}
      <header style={{ maxWidth: '1100px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('catalog')}>
          <Cpu style={{ color: '#00f0ff', width: '32px', height: '32px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00f0ff', letterSpacing: '1px' }}>
            CYBER_FIDGET_3D
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setActiveTab('catalog')} 
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', cursor: 'pointer', background: activeTab === 'catalog' ? 'rgba(0,240,255,0.15)' : 'transparent', color: '#00f0ff', border: '1px solid #00f0ff' }}
          >
            CATÁLOGO
          </button>
          <button 
            onClick={() => setActiveTab('cart')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#121225', border: '1px solid #ff007f', borderRadius: '0.5rem', color: '#ff007f', fontFamily: 'monospace', cursor: 'pointer' }}
          >
            <ShoppingCart style={{ width: '16px', height: '16px' }} />
            CARRINHO ({cart.length})
          </button>
          <button 
            onClick={() => setActiveTab('admin')} 
            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontFamily: 'monospace', cursor: 'pointer', background: '#121225', color: '#39ff14', border: '1px solid #39ff14' }}
          >
            ADMIN
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* TAB: CATÁLOGO */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box style={{ width: '20px', height: '20px' }} /> VISUALIZADOR_3D_REALTIME
              </h2>
              <FidgetViewer activeColor={selectedColor} />
              
              <div style={{ background: '#121225', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#aaa', marginBottom: '0.5rem' }}>SELEÇÃO DE FILAMENTO (COR):</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['#00f0ff', '#ff007f', '#39ff14', '#e0e0e0'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: selectedColor === color ? '2px solid #fff' : 'none',
                        backgroundColor: color,
                        cursor: 'pointer',
                        boxShadow: selectedColor === color ? '0 0 10px ' + color : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#ff007f' }}>CATÁLOGO DE MODELOS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {products.map(product => (
                  <div key={product.id} style={{ background: '#121225', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(0,240,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{product.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#aaa', margin: '0.25rem 0 0.5rem 0' }}>{product.description}</p>
                      <span style={{ color: '#39ff14', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        R$ {product.base_price?.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      style={{ padding: '0.6rem 1.2rem', background: 'linear-gradient(90deg, #00f0ff, #0077ff)', color: '#000', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
                    >
                      ADICIONAR
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB: CARRINHO */}
        {activeTab === 'cart' && (
          <div style={{ background: '#121225', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(0,240,255,0.3)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#ff007f', marginBottom: '1rem' }}>CARRINHO DE COMPRAS</h2>
            {cart.length === 0 ? (
              <p style={{ color: '#aaa' }}>Seu carrinho está vazio.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                      <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Cor: <span style={{ color: item.color }}>●</span> {item.color}</p>
                    </div>
                    <span style={{ color: '#39ff14', fontFamily: 'monospace' }}>R$ {item.base_price.toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ marginTop: '1rem', background: '#0a0a12', padding: '1rem', borderRadius: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>
                    <Truck style={{ width: '16px', height: '16px', display: 'inline', marginRight: '0.3rem' }} /> CÁLCULO DE FRETE (CEP):
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="00000-000" 
                      value={cep} 
                      onChange={e => setCep(e.target.value)} 
                      style={{ background: '#121225', border: '1px solid #00f0ff', color: '#fff', padding: '0.5rem', borderRadius: '0.25rem', width: '100%' }}
                    />
                    <button onClick={calculateShipping} style={{ background: '#00f0ff', color: '#000', padding: '0.5rem 1rem', borderRadius: '0.25rem', fontWeight: 'bold', cursor: 'pointer' }}>CALCULAR</button>
                  </div>
                  {shipping !== null && <p style={{ fontSize: '0.85rem', color: '#39ff14', marginTop: '0.5rem' }}>Frete Fixo: R$ {shipping.toFixed(2)}</p>}
                </div>

                <div style={{ borderTop: '1px solid #ff007f', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>TOTAL:</span>
                  <span style={{ color: '#39ff14', fontFamily: 'monospace' }}>R$ {total.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  style={{ background: 'linear-gradient(90deg, #ff007f, #00f0ff)', color: '#fff', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
                >
                  <CreditCard style={{ width: '20px', height: '20px' }} /> GERAR PAGAMENTO PIX
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: PAGAMENTO PIX */}
        {activeTab === 'pix' && (
          <div style={{ background: '#121225', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #00f0ff', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <QrCode style={{ width: '64px', height: '64px', color: '#00f0ff', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.3rem', color: '#00f0ff', fontFamily: 'monospace' }}>PAGAMENTO VIA PIX</h2>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0.5rem 0' }}>Escaneie para iniciar a impressão 3D instantaneamente</p>

            <div style={{ background: '#fff', padding: '1rem', display: 'inline-block', borderRadius: '0.5rem', margin: '1rem 0' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cyberfidget3d-pix-checkout" alt="Pix QR Code" />
            </div>

            <p style={{ fontSize: '1.2rem', color: '#39ff14', fontFamily: 'monospace', fontWeight: 'bold' }}>
              R$ {total.toFixed(2)}
            </p>

            <button 
              onClick={confirmPixPayment} 
              style={{ width: '100%', background: '#39ff14', color: '#000', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1.5rem', border: 'none', cursor: 'pointer' }}
            >
              SIMULAR CONFIRMAÇÃO DE PAGAMENTO
            </button>
          </div>
        )}

        {/* TAB: STATUS DA IMPRESSÃO 3D EM TEMPO REAL */}
        {activeTab === 'status' && orderCreated && (
          <div style={{ background: '#121225', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #39ff14', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
            <Printer style={{ width: '48px', height: '48px', color: '#39ff14', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', color: '#39ff14', fontFamily: 'monospace' }}>IMPRESSÃO EM ANDAMENTO</h2>
            <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#aaa' }}>PEDIDO #{orderCreated.id}</p>
            
            {/* Barra de Progresso */}
            <div style={{ background: '#0a0a12', borderRadius: '1rem', height: '20px', width: '100%', margin: '1.5rem 0', overflow: 'hidden', border: '1px solid #39ff14' }}>
              <div style={{ width: `${printProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00f0ff, #39ff14)', transition: 'width 0.5s ease-in-out' }} />
            </div>

            <div style={{ background: '#0a0a12', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px dashed #00f0ff' }}>
              <p style={{ fontSize: '0.75rem', color: '#aaa' }}>STATUS DA IMPRESSORA 3D:</p>
              <p style={{ fontSize: '1rem', color: '#00f0ff', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                {currentStatus}
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('catalog')} 
              style={{ background: '#00f0ff', color: '#000', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              VOLTAR AO CATÁLOGO
            </button>
          </div>
        )}

        {/* TAB: PAINEL ADMIN */}
        {activeTab === 'admin' && (
          <div style={{ background: '#121225', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #39ff14', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#39ff14', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck /> PAINEL DE CONTROLE DAS IMPRESSORAS 3D
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#0a0a12', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontWeight: 'bold', color: '#00f0ff' }}>Ender 3 V2 - Impressora 01</p>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Status: IMPRIMINDO (Fidget Spinner - Filament Cyan)</p>
                <p style={{ fontSize: '0.85rem', color: '#39ff14' }}>Temperatura: Bico 210°C | Mesa 60°C</p>
              </div>
              <div style={{ background: '#0a0a12', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontWeight: 'bold', color: '#ff007f' }}>Bambu Lab X1 - Impressora 02</p>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Status: AGUARDANDO FILA (Cube Fidget)</p>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Temperatura: Standby</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}