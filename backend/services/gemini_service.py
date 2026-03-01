import json
import google.generativeai as genai
from config import Config

class GeminiService:
    def __init__(self):
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def get_assistant_response(self, user_message, context=None):
        if not self.model:
            return "Please configure your Gemini API key in the .env file to use the AI assistant."
        
        try:
            prompt = """You are a personal productivity assistant helping a professional with their career and daily tasks.
Be concise, actionable, and supportive. Provide specific advice when possible."""
            
            if context:
                if context.get('tasks'):
                    prompt += f"\n\nUser's current tasks:\n{context['tasks']}"
                if context.get('notes'):
                    prompt += f"\n\nUser's recent notes:\n{context['notes']}"
            
            prompt += f"\n\nUser question: {user_message}\n\nProvide a helpful, actionable response:"
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    def score_resume(self, resume_text, job_role):
        """Score resume using AI and return detailed analysis"""
        if not self.model:
            return None
        
        try:
            prompt = f"""You are an expert resume reviewer and ATS specialist. Analyze this resume for a {job_role} position.

Resume Content:
{resume_text[:4000]}

Provide a comprehensive score analysis. Return ONLY a valid JSON object with this exact structure:
{{
  "overall": 85,
  "ats_score": 90,
  "keyword_score": 80,
  "structure_score": 85,
  "content_score": 88,
  "feedback": "Detailed improvement suggestions with specific examples..."
}}

Scoring criteria (0-100):
- overall: Weighted average of all scores
- ats_score: ATS compatibility (keywords, formatting, sections)
- keyword_score: Relevant keywords for {job_role}
- structure_score: Organization, readability, formatting
- content_score: Impact statements, quantifiable achievements

Provide actionable feedback with specific examples."""
            
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            # Try to parse JSON from response
            try:
                # Find JSON in response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx > start_idx:
                    json_str = response_text[start_idx:end_idx]
                    score_data = json.loads(json_str)
                    
                    # Validate required fields
                    required_fields = ['overall', 'ats_score', 'keyword_score', 'structure_score', 'content_score', 'feedback']
                    if all(field in score_data for field in required_fields):
                        return score_data
            except json.JSONDecodeError:
                pass
            
            # Fallback if JSON parsing fails
            return {
                "overall": 70,
                "ats_score": 70,
                "keyword_score": 70,
                "structure_score": 70,
                "content_score": 70,
                "feedback": response_text
            }
            
        except Exception as e:
            raise Exception(f"Resume scoring error: {str(e)}")
    
    def improve_resume(self, resume_data, job_role):
        if not self.model:
            return "Please configure your Gemini API key to get resume improvement suggestions."
        
        try:
            prompt = f"""You are an expert resume writer and ATS optimization specialist.
Analyze and improve the following resume for a {job_role} position.

Summary: {resume_data.get('summary', 'Not provided')}
Skills: {', '.join(resume_data.get('skills', []))}

Provide specific improvements:
1. **Summary Improvement**: Better version with impact and metrics
2. **Skills Optimization**: Which skills to highlight or add
3. **ATS Keywords**: Important keywords for {job_role}
4. **Recommendations**: 3-5 actionable tips

Keep it concise and actionable."""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Resume improvement error: {str(e)}")
    
    def simulate_interview(self, question, user_answer, job_role, question_type='technical'):
        if not self.model:
            return "Please configure your Gemini API key for interview practice."
        
        try:
            prompt = f"""You are conducting a {job_role} interview.
Question Type: {question_type}
Question: {question}
Candidate's Answer: {user_answer}

Provide feedback:
**Score**: [1-10]/10
**Strengths**: 2 points
**Areas for Improvement**: 2 points
**Improved Answer**: A better version
**Tips**: Specific tips for this question type"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Interview simulation error: {str(e)}")
    
    def improve_communication(self, text_type, user_text):
        if not self.model:
            return "Please configure your Gemini API key for communication improvement."
        
        try:
            prompt = f"""You are a communication coach improving professional communication.
Type: {text_type}
User's version:
{user_text}

Provide:
1. **Improved Version**: Clear, confident, professional rewrite
2. **Key Improvements Made**: 3-4 specific changes
3. **Delivery Tips**: How to deliver effectively
4. **Score**: Rate the original 1-10"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Communication improvement error: {str(e)}")
    
    def generate_practice_questions(self, job_role, question_type, count=5):
        if not self.model:
            return "Please configure your Gemini API key to generate questions."
        
        try:
            prompt = f"""Generate {count} {question_type} interview questions for a {job_role} position.
Format each question as:
Q1: [Question]
Q2: [Question]
...
Make them realistic and commonly asked."""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Question generation error: {str(e)}")
    
    def generate_interview_question(self, company, company_info, job_role, difficulty, interview_type, question_number):
        """Generate company-specific interview question"""
        if not self.model:
            return "Tell me about yourself."
        
        try:
            prompt = f"""You are conducting a {interview_type} interview for {company}.

Company Culture: {company_info.get('culture', 'Professional')}
Company Values: {', '.join(company_info.get('values', []))}
Job Role: {job_role}
Difficulty: {difficulty}
Question Number: {question_number}

Generate ONE specific, realistic interview question that:
1. Aligns with {company}'s culture and values
2. Is appropriate for {difficulty} level
3. Tests {interview_type} skills
4. Is commonly asked at {company}

Return ONLY the question, no additional text."""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Tell me about a time when you demonstrated leadership or problem-solving skills."
    
    def provide_realtime_feedback(self, question, partial_answer, company):
        """Provide real-time feedback on partial answer"""
        if not self.model or len(partial_answer) < 20:
            return {"suggestions": [], "confidence": 50}
        
        try:
            prompt = f"""You are an interview coach. The candidate is answering this question:

Question: {question}
Partial Answer: {partial_answer}

Provide BRIEF real-time feedback (2-3 sentences max):
1. What's good so far
2. One quick suggestion to improve

Be encouraging and concise."""
            
            response = self.model.generate_content(prompt)
            return {"feedback": response.text.strip(), "confidence": 70}
        except Exception as e:
            return {"feedback": "Keep going, you're doing well!", "confidence": 50}
    
    def evaluate_interview_answer(self, question, answer, company, job_role, interview_type):
        """Evaluate interview answer and provide detailed feedback"""
        if not self.model:
            return {"score": 70, "feedback": "Answer received.", "corrections": []}
        
        try:
            prompt = f"""You are an expert interviewer evaluating this answer:

Question: {question}
Answer: {answer}
Company: {company}
Role: {job_role}

Provide evaluation as JSON:
{{
  "score": 85,
  "feedback": "Detailed feedback with strengths and improvements",
  "corrections": ["Specific correction 1", "Specific correction 2"]
}}

Score 0-100 based on:
- Clarity and structure
- Relevance to question
- Use of examples
- Company culture fit"""
            
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            return {"score": 75, "feedback": response_text, "corrections": []}
        except Exception as e:
            return {"score": 70, "feedback": "Good effort. Keep practicing!", "corrections": []}
    
    def generate_performance_report(self, session):
        """Generate comprehensive performance report"""
        if not self.model:
            return None
        
        try:
            questions_summary = "\n".join([
                f"Q{i+1}: {q['question_text'][:80]}... Score: {q['score']}/100"
                for i, q in enumerate(session['questions']) if q.get('user_answer')
            ])
            
            avg_score = sum(q.get('score', 0) for q in session['questions'] if q.get('user_answer')) / max(len([q for q in session['questions'] if q.get('user_answer')]), 1)
            
            prompt = f"""Generate a comprehensive interview performance report:

Company: {session['company']}
Role: {session['job_role']}
Difficulty: {session['difficulty']}
Average Score: {avg_score:.1f}/100

Questions & Scores:
{questions_summary}

Provide report as JSON:
{{
  "overall_score": 85,
  "communication_score": 80,
  "content_score": 85,
  "confidence_score": 88,
  "culture_fit_score": 82,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Area 1", "Area 2"],
  "improvement_plan": "Specific actionable steps..."
}}"""
            
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            return {
                "overall_score": int(avg_score),
                "communication_score": int(avg_score),
                "content_score": int(avg_score),
                "confidence_score": int(avg_score),
                "culture_fit_score": int(avg_score),
                "strengths": ["Good effort", "Completed interview"],
                "weaknesses": ["Practice more"],
                "improvement_plan": "Continue practicing with different companies and difficulty levels."
            }
        except Exception as e:
            return None

    def analyze_resume_for_interview(self, resume_text, job_role):
        """Analyze resume and extract key points for interview practice"""
        if not self.model:
            return None
        
        try:
            prompt = f"""Analyze this resume for interview practice preparation.

Resume Content:
{resume_text[:4000]}

Job Role: {job_role}

Extract and return ONLY a valid JSON object with this structure:
{{
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {{"name": "Project Name", "description": "Brief desc", "technologies": ["tech1", "tech2"]}}
  ],
  "experience": [
    {{"company": "Company", "role": "Role", "duration": "2 years", "achievements": ["achievement1"]}}
  ],
  "education": [
    {{"degree": "Degree", "institution": "School", "year": "2020"}}
  ],
  "keyStrengths": ["strength1", "strength2"],
  "potentialWeaknesses": ["gap1", "gap2"]
}}

Focus on extracting concrete, specific information that can be used in interview questions."""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            return None
        except Exception as e:
            return None
    
    def generate_resume_based_question(self, resume_analysis, company, company_info, job_role, difficulty, interview_type, question_number):
        """Generate interview question based on resume content"""
        if not self.model or not resume_analysis:
            return self.generate_interview_question(company, company_info, job_role, difficulty, interview_type, question_number)
        
        try:
            skills_str = ", ".join(resume_analysis.get('skills', [])[:5])
            projects = resume_analysis.get('projects', [])
            project_names = ", ".join([p.get('name', '') for p in projects[:3]])
            
            prompt = f"""You are conducting a {interview_type} interview for {company}.

Company Culture: {company_info.get('culture', 'Professional')}
Job Role: {job_role}
Difficulty: {difficulty}

Candidate's Resume Highlights:
- Skills: {skills_str}
- Projects: {project_names}
- Key Strengths: {", ".join(resume_analysis.get('keyStrengths', [])[:3])}

Generate ONE specific interview question that:
1. Targets something specific from their resume (a skill, project, or experience)
2. Tests their depth of knowledge on what they claimed
3. Is appropriate for {difficulty} level
4. Aligns with {company}'s culture

Examples:
- "I see you listed [skill] on your resume. Can you walk me through a challenging situation where you used it?"
- "Tell me about your [project name] project. What was your specific role and the biggest technical challenge?"
- "You mentioned [experience]. How would you apply that experience to this role at {company}?"

Return ONLY the question, no additional text."""

            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return self.generate_interview_question(company, company_info, job_role, difficulty, interview_type, question_number)
    
    def provide_resume_guidance(self, question, current_answer, resume_analysis):
        """Provide real-time guidance based on resume content"""
        if not self.model or not resume_analysis:
            return {"hints": [], "relevantPoints": []}
        
        try:
            prompt = f"""You are an interview coach helping a candidate answer this question:

Question: {question}
Current Answer: {current_answer}

Candidate's Resume Points:
- Skills: {", ".join(resume_analysis.get('skills', [])[:5])}
- Projects: {", ".join([p.get('name', '') for p in resume_analysis.get('projects', [])[:3]])}
- Key Strengths: {", ".join(resume_analysis.get('keyStrengths', [])[:3])}

Provide BRIEF guidance as JSON:
{{
  "hints": ["💡 Mention your [specific project/skill]", "🎯 Highlight your experience with [specific thing]"],
  "relevantPoints": ["Project X from resume", "Skill Y that's relevant"]
}}

Give 1-2 hints max. Be specific and actionable."""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            return {"hints": [], "relevantPoints": []}
        except Exception as e:
            return {"hints": [], "relevantPoints": []}
    
    def evaluate_answer_vs_resume(self, question, answer, resume_analysis, company, job_role):
        """Evaluate answer and compare with resume content"""
        if not self.model:
            return {"score": 70, "feedback": "Answer received.", "corrections": [], "resumeAlignment": {}}
        
        try:
            prompt = f"""Evaluate this interview answer against the candidate's resume:

Question: {question}
Answer: {answer}
Company: {company}
Role: {job_role}

Resume Content:
- Skills: {", ".join(resume_analysis.get('skills', [])[:8])}
- Projects: {", ".join([p.get('name', '') for p in resume_analysis.get('projects', [])[:3]])}
- Experience: {", ".join([e.get('role', '') for e in resume_analysis.get('experience', [])[:2]])}

Provide evaluation as JSON:
{{
  "score": 85,
  "feedback": "Detailed feedback",
  "corrections": ["Correction 1", "Correction 2"],
  "resumeAlignment": {{
    "mentionedSkills": ["skill1", "skill2"],
    "missedSkills": ["skill3", "skill4"],
    "mentionedProjects": ["project1"],
    "missedProjects": ["project2"],
    "alignmentScore": 75
  }}
}}

Score based on:
- How well they leveraged their resume content
- Specific examples from their experience
- Missed opportunities to mention relevant skills/projects"""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            return {"score": 75, "feedback": response_text, "corrections": [], "resumeAlignment": {}}
        except Exception as e:
            return {"score": 70, "feedback": "Good effort!", "corrections": [], "resumeAlignment": {}}
    
    def generate_resume_based_report(self, session, resume_analysis):
        """Generate performance report with resume-specific insights"""
        if not self.model:
            return self.generate_performance_report(session)
        
        try:
            questions_summary = "\n".join([
                f"Q{i+1}: {q['question_text'][:80]}... Score: {q['score']}/100"
                for i, q in enumerate(session['questions']) if q.get('user_answer')
            ])
            
            avg_score = sum(q.get('score', 0) for q in session['questions'] if q.get('user_answer')) / max(len([q for q in session['questions'] if q.get('user_answer')]), 1)
            
            prompt = f"""Generate interview performance report with resume analysis:

Company: {session['company']}
Role: {session['job_role']}
Average Score: {avg_score:.1f}/100

Questions & Scores:
{questions_summary}

Resume Skills: {", ".join(resume_analysis.get('skills', [])[:8])}
Resume Projects: {", ".join([p.get('name', '') for p in resume_analysis.get('projects', [])[:3]])}

Provide comprehensive report as JSON:
{{
  "overall_score": 85,
  "communication_score": 80,
  "content_score": 85,
  "confidence_score": 88,
  "culture_fit_score": 82,
  "resume_alignment_score": 75,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Area 1", "Area 2"],
  "improvement_plan": "Specific steps...",
  "resumeInsights": {{
    "mentionedSkills": ["skill1", "skill2"],
    "missedSkills": ["skill3", "skill4"],
    "mentionedProjects": ["project1"],
    "missedProjects": ["project2"],
    "improvementSuggestions": [
      {{"category": "Skills", "suggestion": "Better articulate your experience with X", "priority": "high"}},
      {{"category": "Projects", "suggestion": "Add more details about Project Y", "priority": "medium"}}
    ]
  }}
}}"""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    return json.loads(response_text[start_idx:end_idx])
            except:
                pass
            
            # Fallback
            base_report = self.generate_performance_report(session)
            if base_report:
                base_report['resume_alignment_score'] = int(avg_score * 0.8)
                base_report['resumeInsights'] = {
                    "mentionedSkills": [],
                    "missedSkills": resume_analysis.get('skills', [])[:3],
                    "improvementSuggestions": []
                }
            return base_report
        except Exception as e:
            return self.generate_performance_report(session)

gemini_service = GeminiService()

