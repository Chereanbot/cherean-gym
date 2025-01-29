'use client';

import { FaReact, FaNodeJs, FaPython, FaGit, FaLinux, FaAws, FaVuejs, FaAngular, FaSass, FaDocker, FaGithub, FaMicrosoft, FaJira, FaFigma } from 'react-icons/fa';
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiMongodb, 
  SiPostgresql, 
  SiRedis, 
  SiGraphql, 
  SiKubernetes, 
  SiTerraform, 
  SiJenkins,
  SiSvelte,
  SiRedux,
  SiMui,
  SiDjango,
  SiFastapi,
  SiNestjs,
  SiSpring,
  SiExpress,
  SiMysql,
  SiFirebase,
  SiAmazondynamodb,
  SiApachecassandra,
  SiGithubactions,
  SiGitlab,
  SiAnsible,
  SiVisualstudiocode,
  SiPostman,
  SiDocker
} from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';

export const techStacks = {
  frontend: [
    { 
      icon: TbBrandNextjs, 
      name: 'Next.js', 
      color: 'text-black dark:text-white',
      description: 'React framework for production'
    },
    { 
      icon: FaReact, 
      name: 'React', 
      color: 'text-blue-500',
      description: 'UI component library'
    },
    { 
      icon: SiTypescript, 
      name: 'TypeScript', 
      color: 'text-blue-600',
      description: 'JavaScript with types'
    },
    { 
      icon: SiTailwindcss, 
      name: 'Tailwind CSS', 
      color: 'text-cyan-500',
      description: 'Utility-first CSS framework'
    },
    {
      icon: FaVuejs,
      name: 'Vue.js',
      color: 'text-emerald-500',
      description: 'Progressive JavaScript framework'
    },
    {
      icon: FaAngular,
      name: 'Angular',
      color: 'text-red-600',
      description: 'Platform for building web applications'
    },
    {
      icon: SiSvelte,
      name: 'Svelte',
      color: 'text-orange-600',
      description: 'Compiler as a framework'
    },
    {
      icon: SiRedux,
      name: 'Redux',
      color: 'text-purple-600',
      description: 'State management library'
    },
    {
      icon: SiMui,
      name: 'Material UI',
      color: 'text-blue-500',
      description: 'React UI component library'
    },
    {
      icon: FaSass,
      name: 'Sass',
      color: 'text-pink-500',
      description: 'CSS preprocessor'
    }
  ],
  backend: [
    { 
      icon: FaNodeJs, 
      name: 'Node.js', 
      color: 'text-green-500',
      description: 'JavaScript runtime'
    },
    { 
      icon: FaPython, 
      name: 'Python', 
      color: 'text-yellow-500',
      description: 'Versatile programming language'
    },
    { 
      icon: SiGraphql, 
      name: 'GraphQL', 
      color: 'text-pink-600',
      description: 'API query language'
    },
    {
      icon: SiDjango,
      name: 'Django',
      color: 'text-green-700',
      description: 'Python web framework'
    },
    {
      icon: SiFastapi,
      name: 'FastAPI',
      color: 'text-teal-500',
      description: 'Modern Python web framework'
    },
    {
      icon: SiNestjs,
      name: 'NestJS',
      color: 'text-red-500',
      description: 'Node.js framework'
    },
    {
      icon: SiSpring,
      name: 'Spring Boot',
      color: 'text-green-600',
      description: 'Java framework'
    },
    {
      icon: SiExpress,
      name: 'Express.js',
      color: 'text-gray-600',
      description: 'Node.js web framework'
    }
  ],
  database: [
    { 
      icon: SiMongodb, 
      name: 'MongoDB', 
      color: 'text-green-600',
      description: 'NoSQL database'
    },
    { 
      icon: SiPostgresql, 
      name: 'PostgreSQL', 
      color: 'text-blue-400',
      description: 'Relational database'
    },
    { 
      icon: SiRedis, 
      name: 'Redis', 
      color: 'text-red-500',
      description: 'In-memory data store'
    },
    {
      icon: SiMysql,
      name: 'MySQL',
      color: 'text-blue-600',
      description: 'Relational database'
    },
    {
      icon: SiFirebase,
      name: 'Firebase',
      color: 'text-yellow-500',
      description: 'Backend-as-a-Service'
    },
    {
      icon: SiAmazondynamodb,
      name: 'DynamoDB',
      color: 'text-blue-500',
      description: 'NoSQL database by AWS'
    },
    {
      icon: SiApachecassandra,
      name: 'Cassandra',
      color: 'text-blue-300',
      description: 'Distributed NoSQL database'
    }
  ],
  devops: [
    { 
      icon: SiKubernetes, 
      name: 'Kubernetes', 
      color: 'text-blue-600',
      description: 'Container orchestration'
    },
    { 
      icon: FaAws,
      name: 'AWS', 
      color: 'text-orange-500',
      description: 'Cloud platform'
    },
    { 
      icon: SiTerraform, 
      name: 'Terraform', 
      color: 'text-purple-500',
      description: 'Infrastructure as code'
    },
    {
      icon: FaDocker,
      name: 'Docker',
      color: 'text-blue-500',
      description: 'Container platform'
    },
    {
      icon: SiGithubactions,
      name: 'GitHub Actions',
      color: 'text-gray-700',
      description: 'CI/CD platform'
    },
    {
      icon: FaMicrosoft,
      name: 'Azure',
      color: 'text-blue-500',
      description: 'Cloud platform'
    },
    {
      icon: SiGitlab,
      name: 'GitLab CI',
      color: 'text-orange-600',
      description: 'CI/CD platform'
    },
    {
      icon: SiAnsible,
      name: 'Ansible',
      color: 'text-red-600',
      description: 'Automation platform'
    }
  ],
  tools: [
    { 
      icon: FaGit, 
      name: 'Git', 
      color: 'text-orange-600',
      description: 'Version control'
    },
    { 
      icon: SiJenkins, 
      name: 'Jenkins', 
      color: 'text-red-500',
      description: 'CI/CD automation'
    },
    { 
      icon: FaLinux, 
      name: 'Linux', 
      color: 'text-yellow-600',
      description: 'Operating system'
    },
    {
      icon: SiVisualstudiocode,
      name: 'VS Code',
      color: 'text-blue-500',
      description: 'Code editor'
    },
    {
      icon: SiPostman,
      name: 'Postman',
      color: 'text-orange-500',
      description: 'API development'
    },
    {
      icon: FaJira,
      name: 'Jira',
      color: 'text-blue-500',
      description: 'Project management'
    },
    {
      icon: FaFigma,
      name: 'Figma',
      color: 'text-purple-500',
      description: 'Design tool'
    },
    {
      icon: SiDocker,
      name: 'Docker Compose',
      color: 'text-blue-400',
      description: 'Multi-container Docker'
    }
  ],
};

export const stackCategories = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Database Management',
  devops: 'DevOps & Cloud',
  tools: 'Development Tools'
}; 