export interface Language {
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  year: string;
  gpa?: string;
  honors?: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  role?: string;
  technologies?: string;
  results?: string;
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
  link?: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: Date;
  description?: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  photo?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: Language[];
}

export interface Resume {
  url?: string;
  publicId?: string;
  updatedAt: Date;
}

export interface CV {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  resume?: Resume;
  createdAt: Date;
  updatedAt: Date;
} 