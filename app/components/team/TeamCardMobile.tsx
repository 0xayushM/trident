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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: '40px 20px',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
          background: '#0b0d11',
        }}
      >
        <Image src={member.photo} alt={member.firstname} fill className="object-cover object-top" sizes="90vw" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: '#ef4444',
            fontWeight: 600,
          }}
        >
          {member.number}
        </span>
        <h3
          style={{
            fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
            fontSize: 'clamp(24px, 7vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#0f172a',
            margin: 0,
          }}
        >
          {member.firstname} {member.lastname}
        </h3>
        <p
          style={{
            fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ef4444',
            margin: 0,
          }}
        >
          {member.role}
        </p>
        <div style={{ width: 32, height: 2, background: '#e2e8f0' }} />
        <p
          style={{
            fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
            fontSize: 15,
            lineHeight: 1.7,
            color: '#64748b',
            margin: 0,
          }}
        >
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}
