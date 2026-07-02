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
  bullets: string[]
  technologies: string[]
}

export interface EducationItem {
  degree: string
  school: string
  year: string
  details: string
}

export interface Project {
  title: string
  type: string
  description: string
  technologies: string[]
  image?: string
  liveUrl?: string
  githubUrl?: string
  status?: 'live' | 'coming-soon'
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
  stack: SkillCategory[]
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
  cvUrl: '/Maarij_Ali_CV.pdf',
  email: 'maarij-ali@outlook.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/m-ali7', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/maarij-ali-76b15019a', icon: 'linkedin' },
  ],
  experience: [
    {
      role: 'AI Trading Assistant – Agentic AI Solution Prototype',
      company: 'Cognizant Technology Solutions',
      period: '2026',
      description:
        'Designed and developed an AI-powered Trading Assistant prototype aimed at reducing data-to-decision latency for commercial trading teams operating across multiple markets.',
      bullets: [
        'Designed an end-to-end agentic AI architecture using Python, Azure Functions, Azure OpenAI and Microsoft Power Platform.',
        'Built modular reasoning engines for trading analysis, root-cause identification, recommendation generation and executive commentary workflows.',
        'Implemented Azure Function endpoints and Power Automate orchestration workflows for scheduled intelligence brief delivery and conversational Q&A.',
        'Integrated Azure OpenAI to generate grounded business commentary, management summaries and contextual responses from structured trading datasets.',
        'Designed a Microsoft Teams conversational assistant experience and interactive React/Vite prototype.',
        'Presented the solution architecture, prototype capabilities and implementation roadmap to senior leadership.',
      ],
      technologies: ['AI Engineering', 'Azure OpenAI', 'Azure Functions', 'Power Platform', 'React/Vite', 'Agentic AI'],
    },
    {
      role: 'Business Analyst',
      company: 'BAT / British American Tobacco via Cognizant',
      period: 'July 2024 – February 2026',
      description:
        'Supported large-scale digital and eCommerce transformation initiatives across multiple international markets within complex enterprise delivery environments.',
      bullets: [
        'Owned the end-to-end requirements lifecycle across platform enhancements and integration initiatives.',
        'Translated business requirements into structured, testable deliverables aligned with delivery objectives.',
        'Collaborated with architects, developers, QA teams and business stakeholders across Agile delivery teams.',
        'Managed and prioritised backlogs within Azure DevOps, supporting sprint planning, refinement and delivery tracking.',
        'Supported risk and issue management, defect triage, UAT coordination and production release readiness.',
        'Delivered knowledge transfer sessions and documentation to support continuity across delivery pods.',
      ],
      technologies: ['Business Analysis', 'eCommerce', 'Azure DevOps', 'Agile', 'UAT', 'Stakeholder Management'],
    },
    {
      role: 'Digital Asset Management Specialist',
      company: 'John Lewis & Partners via Cognizant',
      period: 'November 2022 – July 2024',
      description:
        'Supported digital asset management operations within an Adobe Experience Manager environment, helping streamline digital asset workflows and improve content accessibility.',
      bullets: [
        'Supported DAM operations within an Adobe Experience Manager environment.',
        'Used Jira and ServiceNow to manage DAM-related tasks, defects, incidents and change requests.',
        'Worked closely with stakeholders and technical teams to support DAM processes.',
        'Helped align operational requirements with platform capabilities.',
      ],
      technologies: ['AEM', 'Digital Asset Management', 'Jira', 'ServiceNow', 'Stakeholder Support'],
    },
    {
      role: 'Programmer Analyst / Technical Training Programme',
      company: 'Cognizant Technology Solutions',
      period: 'July 2022 – November 2022',
      description:
        'Completed an intensive technical training programme, gaining hands-on exposure to frontend and backend software development.',
      bullets: [
        'Built foundational experience across HTML, CSS, JavaScript, React.js, Node.js and MongoDB.',
        'Developed understanding of software development fundamentals and Agile ways of working.',
        'Worked on collaborative technical exercises and problem-solving activities.',
      ],
      technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Agile', 'Software Fundamentals'],
    },
  ],
  education: [
    {
      degree: 'LLM Bar Vocational Studies with Corporate Specialism',
      school: 'City Law School, London',
      year: '2022',
      details: 'Merit, with distinctions in advocacy, opinion writing, legal drafting and conference skills.',
    },
    {
      degree: 'LLB Bachelor of Laws with Honours',
      school: 'City Law School, London',
      year: '2020',
      details: 'Class II Upper Division. Completed a dissertation assessing authorities and precedent within the unfair prejudice jurisdiction in company law.',
    },
  ],
  projects: [
    {
      title: 'AI Trading Assistant',
      type: 'Agentic AI Prototype',
      description:
        'A prototype AI assistant designed to reduce data-to-decision latency for commercial trading teams. It combines structured trading data, agentic reasoning workflows and Azure OpenAI-generated commentary to produce management briefings, root-cause analysis and conversational Q&A.',
      technologies: ['Python', 'Azure OpenAI', 'Azure Functions', 'Power Automate', 'React', 'Vite'],
      image: '/ai-trading-assistant-preview.webp',
      githubUrl: 'https://github.com/m-ali7/ai-trading-assistant',
      status: 'live',
    },
    {
      title: 'Personal Portfolio',
      type: 'Personal Brand Website',
      description:
        'A premium animated portfolio built to present my background across business analysis, AI engineering and digital transformation through a cinematic single-page experience.',
      technologies: ['React', 'Vite', 'TypeScript', 'GSAP', 'Framer Motion', 'Lenis'],
      image: '/portfolio-preview.webp',
      githubUrl: 'https://github.com/m-ali7/maarij-portfolio',
      status: 'live',
    },
    {
      title: 'AI Workflow Experiments',
      type: 'Coming Soon',
      description:
        'A future collection of experiments exploring conversational AI, multi-step reasoning workflows, automation patterns and AI-assisted business processes.',
      technologies: ['AI', 'Automation', 'Prompt Engineering', 'Workflows'],
      image: '/ai-workflows-preview.webp',
      githubUrl: '#',
      status: 'coming-soon',
    },
    {
      title: 'Digital Transformation Case Studies',
      type: 'Coming Soon',
      description:
        'A future set of case studies covering enterprise delivery, eCommerce transformation, stakeholder analysis and requirements-led solution design.',
      technologies: ['Business Analysis', 'Agile', 'eCommerce', 'Transformation'],
      image: '/digital-transformation-preview.webp',
      githubUrl: '#',
      status: 'coming-soon',
    },
  ],
  stack: [
    {
      category: 'AI & Automation',
      items: ['Agentic AI', 'Azure OpenAI', 'Azure Functions', 'Microsoft Power Platform', 'Prompt Engineering', 'Conversational AI', 'AI Solution Design', 'Multi-Step Reasoning Workflows', 'RAG Concepts', 'LoRA & Fine-Tuning Concepts', 'LLM Evaluation & Guardrails'],
    },
    {
      category: 'Business Analysis',
      items: ['Requirements Management', 'Backlog Refinement', 'User Stories & Acceptance Criteria', 'Stakeholder Management', 'UAT & Defect Management', 'Agile / Scrum', 'Azure DevOps', 'Multi-Market Delivery', 'Platform Migration & Transformation'],
    },
    {
      category: 'Tools & Technologies',
      items: ['Python', 'React', 'JavaScript', 'Microsoft 365', 'Azure DevOps', 'Magento / Adobe Commerce', 'Adobe Experience Manager', 'Jira', 'ServiceNow'],
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
