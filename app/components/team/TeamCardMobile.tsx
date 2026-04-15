'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { TeamMember } from './teamData';

interface TeamCardMobileProps {
  member: TeamMember;
}

export default function TeamCardMobile({ member }: TeamCardMobileProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 py-10 px-5 border-b border-slate-100"
    >
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-[#0b0d11]">
        <Image src={member.photo} alt={member.firstname} fill className="object-cover object-top" sizes="90vw" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] tracking-wider text-red-500 font-semibold">
          {member.number}
        </span>
        <h3
          className="unica-text font-bold tracking-tight leading-tight text-slate-900 m-0"
          style={{
            fontSize: 'clamp(24px, 7vw, 36px)',
          }}
        >
          {member.firstname} {member.lastname}
        </h3>
        <p className="unica-text text-xs font-semibold tracking-widest uppercase text-slate-500 m-0">
          {member.role}
        </p>
        <div className="w-8 h-0.5 bg-slate-200" />
        <p className="unica-text text-sm leading-relaxed text-slate-600 m-0">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}
