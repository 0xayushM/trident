'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import TeamHeader from './team/TeamHeader';
import TeamCard from './team/TeamCard';
import TeamCardMobile from './team/TeamCardMobile';
import { TEAM } from './team/teamData';

export default function Team() {
  const [isMobile, setIsMobile] = useState(false);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section style={{ width: '100%', background: '#ffffff', overflow: 'hidden' }}>
      <div ref={headerRef}>
        <TeamHeader />
      </div>

      {isMobile
        ? TEAM.map((member) => <TeamCardMobile key={member.number} member={member} />)
        : TEAM.map((member, index) => <TeamCard key={member.number} member={member} index={index} />)}
    </section>
  );
}
