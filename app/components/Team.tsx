'use client';

import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord, ScrollRevealText } from './animations';
import { TEAM, type TeamMember } from './team/teamData';
import TeamHeader from './team/TeamHeader';
import PhotoCard from './team/PhotoCard';

// ─── Member row ────────────────────────────────────────────────────────────────

function MemberRow({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: false });

  const isFlipped = member.flip;

  const photo = (
    <div className="flex-shrink-0 relative" style={{ width: 'clamp(200px, 24vw, 320px)' }}>
      <PhotoCard src={member.photo} name={`${member.firstname} ${member.lastname}`} />
    </div>
  );

  const content = (
    <div className="flex-1 min-w-0 flex flex-col justify-center gap-5 relative">

      {/* Ghost number */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none unica-text font-bold text-slate-900"
        style={{
          fontSize: 'clamp(100px, 18vw, 220px)',
          lineHeight: 1,
          opacity: 0.04,
          top: '50%',
          left: isFlipped ? 'auto' : '-0.1em',
          right: isFlipped ? '-0.1em' : 'auto',
          transform: 'translateY(-50%)',
          letterSpacing: '-0.04em',
        }}
      >
        {member.number}
      </span>

      {/* Index + role row */}
      <div className="flex items-center gap-3 relative z-10">
        <span className="font-mono text-[10px] text-red-500 tracking-[0.25em] uppercase">
          {member.number}
        </span>
        <span className="w-6 h-px bg-red-400/50" />
        <span className="font-mono text-[10px] text-red-400/80 tracking-[0.18em] uppercase">
          {member.role}
        </span>
      </div>

      {/* Name — AnimatedWord */}
      <h3
        className="unica-text font-bold leading-[0.9] tracking-tight m-0 relative z-10"
        style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}
      >
        <AnimatedWord delay={0} inView={inView}>{member.firstname}</AnimatedWord>{" "}
        <AnimatedWord delay={160} inView={inView}>{member.lastname}</AnimatedWord>
      </h3>

      {/* Red rule */}
      <div
        className="h-px bg-red-500 relative z-10"
        style={{
          width:      inView ? '44px' : '0px',
          transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
          transitionDelay: '0.45s',
        }}
      />

      {/* Bio — ScrollRevealText */}
      <div className="relative z-10 max-w-lg">
        <ScrollRevealText
          text={member.bio}
          containerRef={cardRef}
          className="unica-text text-base md:text-[17px] leading-relaxed"
        />
      </div>

      {/* Credential tags */}
      <div
        className="flex flex-wrap gap-2 relative z-10"
        style={{
          opacity:    inView ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: '0.65s',
        }}
      >
        {member.credentials.map(cred => (
          <span
            key={cred}
            className="font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5
                       rounded-full border border-slate-200 text-slate-400
                       hover:border-red-300 hover:text-red-400 transition-colors duration-200"
          >
            {cred}
          </span>
        ))}
      </div>

      {/* Social links */}
      <div
        className="flex items-center gap-3 relative z-10"
        style={{
          opacity:    inView ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: '0.8s',
        }}
      >
        {/* LinkedIn */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors duration-200"
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href={member.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#25D366] hover:text-[#25D366] transition-colors duration-200"
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </div>
  );

  return (
    <div
      ref={node => {
        ref(node);
        if (node) (cardRef as React.MutableRefObject<HTMLDivElement>).current = node;
      }}
      className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 lg:gap-20
                  py-16 md:py-20 ${isFlipped ? 'md:flex-row-reverse' : ''}`}
    >
      {photo}
      {content}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Team() {
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Header ── */}
        {/* <div ref={headerRef} className="pt-20 md:pt-28 pb-4">
          <p
            className="font-mono text-[10px] text-red-500 tracking-[0.3em] uppercase mb-5"
            style={{
              opacity:    headerInView ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            The People Behind It
          </p>

          <h2
            className="unica-text font-bold leading-[0.88] tracking-tight text-slate-900 m-0"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}
          >
            <AnimatedWord delay={0} inView={headerInView}>Meet</AnimatedWord>{' '}
            <AnimatedWord delay={100} inView={headerInView}>the</AnimatedWord>
            <br />
            <AnimatedWord delay={220} inView={headerInView}>team.</AnimatedWord>
          </h2>
        </div> */}
        <TeamHeader/>
        {/* ── Members ── */}
        {TEAM.map((member, index) => (
          <div key={member.number}>
            {index > 0 && <div className="w-full h-px bg-slate-100" />}
            <MemberRow member={member} index={index} />
          </div>
        ))}

      </div>
    </section>
  );
}
