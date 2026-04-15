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
