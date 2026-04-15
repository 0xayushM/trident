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
    <div className='px-4 mx-auto w-full items-center flex-1 max-w-[880px] flex flex-col justify-center gap-5'>
      <div className='flex flex-col h-full gap-0'>
        <span className="font-mono text-[11px] tracking-wider text-red-500 font-semibold mb-2">
          {member.number}
        </span>

      <h3 
        className='uppercase mb-4 unica-text font-bold tracking-tight leading-tight text-slate-900 m-0'
        style={{
          fontSize: 'clamp(28px, 3.5vw, 52px)',
        }}
      >
        <AnimatedWord delay={200} inView={inView}>{member.firstname}</AnimatedWord>{" "}
        <AnimatedWord delay={200} inView={inView}>{member.lastname}</AnimatedWord>

      </h3>

      <p
        className="mt-2 unica-text font-semibold tracking-widest uppercase text-red-500 m-0"
        style={{
          fontSize: 'clamp(12px, 1vw, 14px)',
        }}
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
      className={`py-8 px-4 md:px-12 gap-12 flex flex-col md:flex-row ${isFlipped ? 'md:flex-row-reverse' : ''} justify-center items-center`}
      ref={(node) => {
        ref(node);
        if (node) cardRef.current = node;
      }}
    >
      {photoPanel}
      {textPanel}
    </div>
  );
}
