export interface TeamMember {
  number: string;
  firstname: string;
  lastname: string;
  role: string;
  photo: string;
  bio: string;
  flip: boolean;
}

export const TEAM: TeamMember[] = [
  {
    number: '01',
    firstname: 'Anand',
    lastname: 'Agarwal',
    role: 'Managing Director',
    photo: '/images/team/anand_agarwal.webp',
    bio: 'With over two decades of experience in global freight and cold-chain logistics, Anand built Trident on the belief that transparency and precision are non-negotiable. His network spans every major trade corridor from South Asia to North America and Europe.',
    flip: false,
  },
  {
    number: '02',
    firstname: 'Ayush',
    lastname: 'Agarwal',
    role: 'International Sales Manager',
    photo: '/images/team/ayush_agarwal.webp',
    bio: "Ayush leads operations and compliance, ensuring every shipment meets the strictest regulatory standards across FDA, EU, and HACCP frameworks. His systems-first thinking has turned Trident's operations into a repeatable, scalable machine.",
    flip: true,
  },
];
