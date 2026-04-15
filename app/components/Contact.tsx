'use client';

import { useState, useRef, useEffect } from 'react';

const OPTIONS = [
  { id: '01', label: 'Schedule a 30-minute meeting with a freight expert' },
  { id: '02', label: 'Get a custom shipping quote' },
  { id: '03', label: 'Arrange compliance consultation' },
  { id: '04', label: 'Set up a supplier sourcing session' },
  { id: '05', label: 'Something else' },
];

function buildDividerPath({
  tabW   = 300,
  outerR = 0,
  diagW  = 50,
  depth  = 40,
  entryR = 16,
  innerR = 20,
} = {}) {
  const W = 1440, H = 72;
  const cy  = H - depth;
  const len = Math.sqrt(diagW**2 + depth**2);
  const adx = diagW / len,  ady = depth / len;

  const orC = Math.min(outerR, tabW/2, depth/2);
  const erC = Math.min(entryR, tabW/2 - orC/2, len/3);
  const irC = Math.min(innerR, len/3);

  const p = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;

  return [
    `M 0,0 L ${W},0`,
    `L ${W},${H-orC}`,
    `Q ${p(W,H)} ${p(W-orC, H)}`,
    `L ${p(W-tabW+erC, H)}`,
    `Q ${p(W-tabW,H)} ${p(W-tabW-erC*adx, H-erC*ady)}`,
    `L ${p(W-tabW-diagW+irC*adx, cy+irC*ady)}`,
    `Q ${p(W-tabW-diagW,cy)} ${p(W-tabW-diagW-irC, cy)}`,
    `L ${p(tabW+diagW+irC, cy)}`,
    `Q ${p(tabW+diagW,cy)} ${p(tabW+diagW-irC*adx, cy+irC*ady)}`,
    `L ${p(tabW+erC*adx, H-erC*ady)}`,
    `Q ${p(tabW,H)} ${p(tabW-erC, H)}`,
    `L ${p(orC, H)}`,
    `Q ${p(0,H)} ${p(0, H-orC)}`,
    `Z` 
  ].join(' ');
}

function BottomDivider() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxDepth, setMaxDepth] = useState(20);

  useEffect(() => {
    const updateMaxDepth = () => {
      const vw = window.innerWidth;
      if (vw < 768) {
        setMaxDepth(20);
      } else if (vw < 1024) {
        setMaxDepth(20);
      } else {
        setMaxDepth(30);
      }
    };

    updateMaxDepth();
    window.addEventListener('resize', updateMaxDepth);
    return () => window.removeEventListener('resize', updateMaxDepth);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementTop = rect.top;
      const triggerPoint = windowHeight; 
      
      if (elementTop < triggerPoint) {
        const scrollProgress = Math.max(0, Math.min(1, (triggerPoint - elementTop) / (windowHeight)));
        setProgress(scrollProgress);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    
    const depth = maxDepth * (1 - progress);
    const path = buildDividerPath({ depth });
    pathRef.current.setAttribute('d', path);
  }, [progress, maxDepth]);

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none bg-white"
      style={{ height: '72px', transform: 'translateY(100%)' }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-full block"
        style={{ transform: 'scaleY(-1)' }}
      >
        <path
          ref={pathRef}
          fill="#000000"
          d={buildDividerPath({ depth: 44 })}
        />
      </svg>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    phone: '',
    email: '',
    company: '',
    helpWith: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="relative w-full bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left Column - Options List */}
          <div>
            <h2
              style={{
                fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                marginBottom: 40,
                lineHeight: 1.3,
              }}
            >
              Reach out to learn more about Trident, on your terms:
            </h2>

            <div
              style={{
                borderLeft: '3px solid #22c55e',
                paddingLeft: 24,
              }}
            >
              {OPTIONS.map((option) => (
                <div
                  key={option.id}
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#94a3b8',
                      flexShrink: 0,
                    }}
                  >
                    {option.id}
                  </span>
                  <p
                    style={{
                      fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                      fontSize: 16,
                      fontWeight: 400,
                      color: '#475569',
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {option.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <h3
              style={{
                fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                fontSize: 'clamp(22px, 2.5vw, 32px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                marginBottom: 32,
              }}
            >
              Tell us a bit about you:
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: '#0f172a',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                />
              </div>

              {/* Role or Position */}
              <div>
                <label
                  htmlFor="role"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  Role or position *
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Project manager"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: '#0f172a',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(323) 555-0147"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: '#0f172a',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: '#0f172a',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                />
              </div>

              {/* Company Name */}
              <div>
                <label
                  htmlFor="company"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  Company name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: '#0f172a',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                />
              </div>

              {/* How Can We Help */}
              <div>
                <label
                  htmlFor="helpWith"
                  style={{
                    display: 'block',
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  How Can We Help? *
                </label>
                <select
                  id="helpWith"
                  name="helpWith"
                  required
                  value={formData.helpWith}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: 15,
                    fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                    color: formData.helpWith ? '#0f172a' : '#94a3b8',
                    border: 'none',
                    borderBottom: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#22c55e')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e2e8f0')}
                >
                  <option value="" disabled>Select options</option>
                  <option value="meeting">Schedule a 30-minute meeting</option>
                  <option value="quote">Get a custom shipping quote</option>
                  <option value="compliance">Arrange compliance consultation</option>
                  <option value="sourcing">Set up supplier sourcing session</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  marginTop: 16,
                  fontSize: 13,
                  fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                Submit
              </button>
            </form>
          </div>

        </div>
      </div>
      <BottomDivider />
    </section>
  );
}
