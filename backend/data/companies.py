# Company-specific interview data

COMPANIES = {
    "Google": {
        "name": "Google",
        "culture": "Innovation-driven, data-focused, collaborative environment",
        "values": ["User focus", "Think big", "Be bold", "Move fast"],
        "interview_style": "Behavioral questions, Googleyness assessment, problem-solving",
        "logo_color": "from-blue-500 to-green-500"
    },
    "Amazon": {
        "name": "Amazon",
        "culture": "Customer obsession, ownership, high standards",
        "values": ["Customer Obsession", "Ownership", "Invent and Simplify", "Bias for Action"],
        "interview_style": "Leadership Principles, STAR method, bar raiser",
        "logo_color": "from-orange-500 to-yellow-500"
    },
    "Microsoft": {
        "name": "Microsoft",
        "culture": "Growth mindset, inclusive, innovative",
        "values": ["Respect", "Integrity", "Accountability"],
        "interview_style": "Behavioral, technical depth, culture fit",
        "logo_color": "from-blue-600 to-cyan-500"
    },
    "Apple": {
        "name": "Apple",
        "culture": "Excellence, innovation, attention to detail",
        "values": ["Innovation", "Quality", "Simplicity"],
        "interview_style": "Product thinking, attention to detail, passion",
        "logo_color": "from-gray-700 to-gray-500"
    },
    "Meta": {
        "name": "Meta (Facebook)",
        "culture": "Move fast, be bold, focus on impact",
        "values": ["Move Fast", "Be Bold", "Focus on Impact", "Be Open"],
        "interview_style": "Behavioral, product sense, execution",
        "logo_color": "from-blue-600 to-blue-400"
    },
    "Netflix": {
        "name": "Netflix",
        "culture": "Freedom and responsibility, high performance",
        "values": ["Judgment", "Communication", "Impact", "Curiosity"],
        "interview_style": "Culture fit, keeper test, context not control",
        "logo_color": "from-red-600 to-red-500"
    },
    "Tesla": {
        "name": "Tesla",
        "culture": "Mission-driven, fast-paced, innovative",
        "values": ["Innovation", "Sustainability", "Excellence"],
        "interview_style": "Problem-solving, passion for mission, technical depth",
        "logo_color": "from-red-500 to-gray-700"
    },
    "Spotify": {
        "name": "Spotify",
        "culture": "Innovative, collaborative, music-loving",
        "values": ["Innovation", "Collaboration", "Passion"],
        "interview_style": "Culture fit, product thinking, teamwork",
        "logo_color": "from-green-500 to-green-400"
    }
}

DIFFICULTY_LEVELS = {
    "beginner": {
        "name": "Beginner",
        "description": "Common HR questions, gentle pacing",
        "question_count": 5,
        "time_per_question": 180  # 3 minutes
    },
    "intermediate": {
        "name": "Intermediate",
        "description": "Situational & cultural fit rounds",
        "question_count": 7,
        "time_per_question": 240  # 4 minutes
    },
    "advanced": {
        "name": "Advanced",
        "description": "High pressure, deep behavioral",
        "question_count": 10,
        "time_per_question": 300  # 5 minutes
    }
}

INTERVIEW_TYPES = {
    "personal": {
        "name": "Personal Interview (PI)",
        "description": "Focus on personality, culture fit, motivation, and leadership",
        "topics": ["Self introduction", "Strengths & Weaknesses", "Career goals", "Motivation"]
    },
    "hr": {
        "name": "HR Interview",
        "description": "Behavioral & situational questions",
        "topics": ["Teamwork", "Conflict resolution", "Leadership", "Problem solving"]
    },
    "technical": {
        "name": "Technical Interview",
        "description": "Role-specific knowledge, project deep-dives",
        "topics": ["Technical skills", "Projects", "Problem solving", "System design"]
    }
}

def get_company_info(company_name):
    """Get company information"""
    return COMPANIES.get(company_name, {
        "name": company_name,
        "culture": "Professional work environment",
        "values": ["Excellence", "Integrity", "Innovation"],
        "interview_style": "Standard behavioral and technical questions",
        "logo_color": "from-gray-600 to-gray-400"
    })

def get_all_companies():
    """Get list of all companies"""
    return list(COMPANIES.keys())
