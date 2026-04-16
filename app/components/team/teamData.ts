export interface TeamMember {
  number: string;
  firstname: string;
  lastname: string;
  role: string;
  photo: string;
  bio: string;
  credentials: string[];
  flip: boolean;
  linkedin: string;
  whatsapp: string;
}

export const TEAM: TeamMember[] = [
  {
    number: '01',
    firstname: 'Anand',
    lastname: 'Agarwal',
    role: 'Managing Director',
    photo: '/images/team/anand_agarwal.png',
    bio: 'With over two decades of experience in global freight and cold-chain logistics, Anand built Trident on the belief that transparency and precision are non-negotiable. His network spans every major trade corridor from South Asia to North America and Europe.',
    credentials: ['20+ Years Logistics', 'HACCP Certified Network', 'FDA Import Compliance', 'Cold-Chain Expert'],
    flip: false,
    linkedin: 'https://www.linkedin.com/in/anand-agarwal-b0423b104/',
    whatsapp: 'https://wa.me/919431267872',
  },
  {
    number: '02',
    firstname: 'Ayush',
    lastname: 'Agarwal',
    role: 'International Sales Manager',
    photo: '/images/team/ayush_agarwal.png',
    bio: "Ayush leads operations and compliance, ensuring every shipment meets the strictest regulatory standards across FDA, EU, and HACCP frameworks. His systems-first thinking has turned Trident's operations into a repeatable, scalable machine.",
    credentials: ['500+ Containers', 'EU · US · APAC Markets', 'Zero FDA Holds', 'Systems & Scale'],
    flip: true,
    linkedin: 'https://www.linkedin.com/in/ayush-agarwal-408a75192/',
    whatsapp: 'https://wa.me/917541964200',
  },
];
