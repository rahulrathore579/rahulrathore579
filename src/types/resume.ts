export interface Project {
    title: string;
    description: string;
    technologies: string[];
    url?: string;
}

export interface Experience {
    company: string;
    position: string;
    duration: string;
    responsibilities: string[];
}

export interface Education {
    institution: string;
    degree: string;
    year: string;
}

export interface Resume {
    id: string;
    user_id: string;
    job_role: string;
    summary: string;
    skills: string[];
    projects: Project[];
    experience: Experience[];
    education: Education[];
    created_at: string;
    updated_at: string;
}

export interface CreateResumeData {
    job_role: string;
    summary?: string;
    skills?: string[];
    projects?: Project[];
    experience?: Experience[];
    education?: Education[];
}

export interface UpdateResumeData extends Partial<CreateResumeData> { }
