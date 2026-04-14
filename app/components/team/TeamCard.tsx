'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PhotoCard from './PhotoCard';
import type { TeamMember } from './teamData';
import { AnimatedWord, ScrollRevealText } from '../animations';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export default function TeamCard({ member, index }: TeamCardProps) {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isFlipped = member.flip;

  const textPanel = (
    <div
      className='px-4 mx-auto w-full items-center'
      style={{
        flex: 1,
        maxWidth: 880,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <div className='flex flex-col h-full gap-0'>
        <span
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: '0.1em',
          color: '#ef4444',
          fontWeight: 600,
        }}
        className="mb-2"
      >
        {member.number}
      </span>

      <h3 className='uppercase mb-4'
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(28px, 3.5vw, 52px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: '#0f172a',
          margin: 0,
        }}
      >
        <AnimatedWord delay={200} inView={inView}>{member.firstname}</AnimatedWord>{" "}
        <AnimatedWord delay={200} inView={inView}>{member.lastname}</AnimatedWord>

      </h3>

      <p
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(12px, 1vw, 14px)',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ef4444',
          margin: 0,
        }}
        className="mt-2"
      >
        {member.role}
      </p>
      <div className="w-full max-w-xl mt-4">
        <ScrollRevealText
          text={member.bio}
          containerRef={cardRef}
          className="text-base md:text-xl leading-[1.4]"
        />
      </div>
      </div>
    </div>
  );

  const photoPanel = (
    <motion.div
      initial={{ opacity: 0, x: isFlipped ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <PhotoCard src={member.photo} name={member.firstname} flip={isFlipped} />
    </motion.div>
  );

  return (
    <div
      className='py-4 px-8 md:px-12 gap-12'
      ref={(node) => {
        ref(node);
        if (node) cardRef.current = node;
      }}
      style={{
        display: 'flex',
        flexDirection: isFlipped ? 'row-reverse' : 'row',
        alignItems: 'center',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      {photoPanel}
      {textPanel}
    </div>
  );
}
