export interface SocialLink {
  label: string
  url: string
  icon: string
}

export interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
  technologies: string[]
}

export interface EducationItem {
  degree: string
  school: string
  period: string
  description?: string
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface CurrentlyCard {
  role: string
  company: string
  description: string
}

export interface Profile {
  name: string
  firstName: string
  title: string
  tagline: string
  about: string[]
  cvUrl: string
  email: string
  socials: SocialLink[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: Project[]
  skills: SkillCategory[]
  currently: CurrentlyCard
  currentFocus: string[]
  languages: string[]
}

export const profile: Profile = {
  name: 'Maarij Ali',
  firstName: 'Maarij',
  title: 'Software Engineer',
  tagline: 'Crafting elegant digital experiences with clean code and creative design.',
  about: [
    'My path into technology was far from conventional. I began by studying Law and was called to the Bar of England and Wales, where I developed a strong foundation in analytical thinking, structured problem-solving and communication. While I enjoyed the challenge of legal reasoning, I became increasingly fascinated by the way technology could solve complex business problems at scale.',
    'That curiosity led me into software engineering before I found my place in Business Analysis, where I now bridge the gap between business strategy and technical delivery. Working across enterprise digital transformation projects has shown me that the best solutions aren\'t simply well engineered—they\'re built around the people and problems they\'re designed to serve.',
    'Today my focus is on AI, intelligent automation and modern software development. I\'m particularly interested in designing AI-powered solutions that help organisations work smarter, make better decisions and deliver meaningful value through technology.',
  ],
  cvUrl: '/cv.pdf',
  email: 'maarij@example.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/maarijali', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/maarijali', icon: 'linkedin' },
    { label: 'Twitter', url: 'https://twitter.com/maarijali', icon: 'twitter' },
  ],
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Inc.',
      period: '2023 — Present',
      description:
        'Leading the frontend architecture for a SaaS platform serving 50K+ users. Spearheaded migration to React 18 and TypeScript, reducing production bugs by 40%. Mentored a team of 4 junior developers.',
      technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS'],
    },
    {
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2021 — 2023',
      description:
        'Built and scaled the core product from MVP to 10K users. Designed RESTful APIs, implemented real-time features with WebSockets, and optimized database queries achieving 60% faster load times.',
      technologies: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    },
    {
      role: 'Frontend Developer',
      company: 'Agency Digital',
      period: '2019 — 2021',
      description:
        'Developed high-performance marketing websites and interactive web applications for Fortune 500 clients. Introduced component library reducing development time by 30% across projects.',
      technologies: ['React', 'JavaScript', 'Sass', 'WordPress', 'Figma'],
    },
    {
      role: 'Junior Developer',
      company: 'CodeLab Studios',
      period: '2018 — 2019',
      description:
        'Started my professional journey building responsive websites and web applications. Contributed to 15+ client projects and developed a passion for clean, maintainable code.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University of Engineering & Technology',
      period: '2014 — 2018',
      description: 'Graduated with honors. Focused on software engineering, algorithms, and human-computer interaction.',
    },
    {
      degree: 'Full Stack Web Development',
      school: 'Microverse Online Bootcamp',
      period: '2018',
      description: 'Intensive remote program focused on pair programming, code reviews, and building real-world projects.',
    },
  ],
  projects: [
    {
      title: 'TaskFlow',
      description:
        'A real-time project management dashboard with drag-and-drop kanban boards, team collaboration features, and analytics. Handles 10K+ concurrent users.',
      technologies: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'PostgreSQL'],
      liveUrl: 'https://taskflow-demo.example.com',
      githubUrl: 'https://github.com/maarijali/taskflow',
    },
    {
      title: 'DevMetrics',
      description:
        'Open-source developer analytics tool that integrates with GitHub and GitLab to provide insights on code quality, velocity, and team performance.',
      technologies: ['Next.js', 'Python', 'FastAPI', 'MongoDB', 'Chart.js'],
      liveUrl: 'https://devmetrics.example.com',
      githubUrl: 'https://github.com/maarijali/devmetrics',
    },
    {
      title: 'PixelCraft',
      description:
        'A browser-based image editor with layers, filters, and AI-powered background removal. Supports real-time collaboration via CRDT.',
      technologies: ['Vue.js', 'WebAssembly', 'Rust', 'WebRTC', 'Canvas API'],
      liveUrl: 'https://pixelcraft.example.com',
      githubUrl: 'https://github.com/maarijali/pixelcraft',
    },
    {
      title: 'CryptoTracker',
      description:
        'Real-time cryptocurrency portfolio tracker with price alerts, interactive charts, and news aggregation from multiple sources.',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'CoinGecko API'],
      liveUrl: 'https://cryptotracker.example.com',
      githubUrl: 'https://github.com/maarijali/cryptotracker',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML', 'CSS'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion', 'Redux', 'React Query'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'REST APIs', 'WebSockets'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Prisma ORM'],
    },
    {
      category: 'DevOps & Tools',
      items: ['Docker', 'AWS', 'Vercel', 'Git', 'GitHub Actions', 'Figma', 'Linux'],
    },
  ],
  currently: {
    role: 'Business Analyst',
    company: 'Cognizant Technology Solutions',
    description:
      'Designing and supporting enterprise digital transformation initiatives while building AI-powered solutions.',
  },
  currentFocus: [
    'Enterprise AI Solutions',
    'Agentic AI Workflows',
    'Intelligent Automation',
  ],
  languages: ['English (Native)', 'Urdu (Spoken)'],
}
