import json
import re
from typing import Dict, List, Any, Optional
import google.generativeai as genai
from config import Config

class ATSService:
    """
    Advanced ATS (Applicant Tracking System) service for comprehensive resume analysis
    using Google's Gemini API
    """
    
    def __init__(self):
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    # Industry-specific keyword databases
    INDUSTRY_KEYWORDS = {
        'software_engineer': [
            'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'git',
            'agile', 'api', 'rest', 'microservices', 'cloud', 'aws', 'docker',
            'kubernetes', 'ci/cd', 'testing', 'debugging', 'algorithms', 'data structures'
        ],
        'data_scientist': [
            'python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'pandas', 'numpy', 'scikit-learn', 'sql', 'statistics', 'data visualization',
            'tableau', 'power bi', 'nlp', 'computer vision', 'model deployment'
        ],
        'product_manager': [
            'product strategy', 'roadmap', 'stakeholder management', 'agile', 'scrum',
            'user research', 'analytics', 'kpi', 'a/b testing', 'wireframing', 'jira',
            'product lifecycle', 'market analysis', 'competitive analysis'
        ],
        'general': [
            'leadership', 'communication', 'problem solving', 'teamwork', 'project management',
            'analytical', 'strategic thinking', 'collaboration', 'innovation'
        ]
    }
    
    def analyze_resume_comprehensive(self, resume_text: str, job_role: str) -> Dict[str, Any]:
        """
        Comprehensive ATS analysis of a resume
        
        Args:
            resume_text: Extracted text from resume
            job_role: Target job role
            
        Returns:
            Dictionary with detailed ATS analysis including all scoring dimensions
        """
        if not self.model:
            return self._get_fallback_analysis()
        
        try:
            # Get AI-powered analysis
            ai_analysis = self._get_gemini_ats_analysis(resume_text, job_role)
            
            # Extract keywords
            keywords_data = self._extract_keywords(resume_text, job_role)
            
            # Analyze sections
            sections_data = self._analyze_sections(resume_text)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                ai_analysis, keywords_data, sections_data, job_role
            )
            
            # Combine all analysis
            comprehensive_analysis = {
                'overall_ats_score': ai_analysis.get('overall_ats_score', 70),
                'scores': {
                    'keyword_match': ai_analysis.get('keyword_score', 70),
                    'format_score': ai_analysis.get('format_score', 70),
                    'content_quality': ai_analysis.get('content_score', 70),
                    'section_completeness': sections_data.get('completeness_score', 70),
                    'readability': ai_analysis.get('readability_score', 70),
                    'ats_compatibility': ai_analysis.get('ats_score', 70)
                },
                'keywords': keywords_data,
                'sections': sections_data,
                'recommendations': recommendations,
                'detailed_feedback': ai_analysis.get('feedback', ''),
                'strengths': ai_analysis.get('strengths', []),
                'weaknesses': ai_analysis.get('weaknesses', [])
            }
            
            return comprehensive_analysis
            
        except Exception as e:
            print(f"ATS Analysis Error: {str(e)}")
            return self._get_fallback_analysis()
    
    def _get_gemini_ats_analysis(self, resume_text: str, job_role: str) -> Dict[str, Any]:
        """Get AI-powered ATS analysis from Gemini"""
        
        prompt = f"""You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer.
Analyze this resume for a {job_role} position with extreme attention to ATS compatibility.

Resume Content:
{resume_text[:5000]}

Provide a comprehensive ATS analysis. Return ONLY a valid JSON object with this exact structure:
{{
  "overall_ats_score": 85,
  "keyword_score": 80,
  "format_score": 90,
  "content_score": 85,
  "readability_score": 88,
  "ats_score": 87,
  "strengths": [
    "Clear section headers make it easy for ATS to parse",
    "Strong use of action verbs and quantifiable achievements",
    "Relevant keywords for {job_role} position"
  ],
  "weaknesses": [
    "Missing some key technical skills commonly required",
    "Could include more industry-specific terminology",
    "Summary section could be more impactful"
  ],
  "feedback": "Detailed paragraph explaining the overall assessment, what works well, and what needs improvement. Be specific and actionable."
}}

Scoring Criteria (0-100):
- overall_ats_score: Weighted average considering all factors
- keyword_score: Presence and relevance of job-specific keywords
- format_score: ATS-friendly formatting (no tables, images, columns that confuse ATS)
- content_score: Quality of achievements, impact statements, quantifiable results
- readability_score: Clear language, proper grammar, professional tone
- ats_score: Technical ATS compatibility (parsing, standard sections, file format)

Focus on:
1. ATS parsing compatibility
2. Keyword optimization for {job_role}
3. Standard section presence (Contact, Summary, Experience, Education, Skills)
4. Quantifiable achievements and impact statements
5. Professional formatting and readability

Be honest and specific in your assessment."""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            # Parse JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                analysis = json.loads(json_str)
                
                # Validate required fields
                required_fields = ['overall_ats_score', 'keyword_score', 'format_score', 
                                 'content_score', 'readability_score', 'ats_score']
                if all(field in analysis for field in required_fields):
                    return analysis
            
            # Fallback if parsing fails
            return self._parse_fallback_scores(response_text)
            
        except Exception as e:
            print(f"Gemini ATS Analysis Error: {str(e)}")
            return self._parse_fallback_scores("")
    
    def _extract_keywords(self, resume_text: str, job_role: str) -> Dict[str, Any]:
        """Extract and analyze keywords from resume"""
        
        # Normalize job role for keyword matching
        normalized_role = job_role.lower().replace(' ', '_')
        industry_keywords = self.INDUSTRY_KEYWORDS.get(
            normalized_role, 
            self.INDUSTRY_KEYWORDS['general']
        )
        
        # Convert resume text to lowercase for matching
        resume_lower = resume_text.lower()
        
        # Find matched keywords
        matched_keywords = []
        missing_keywords = []
        
        for keyword in industry_keywords:
            if keyword.lower() in resume_lower:
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)
        
        # Use Gemini to extract additional relevant keywords
        ai_keywords = self._extract_keywords_with_ai(resume_text, job_role)
        
        match_percentage = (len(matched_keywords) / len(industry_keywords) * 100) if industry_keywords else 0
        
        return {
            'matched_keywords': matched_keywords,
            'missing_keywords': missing_keywords[:10],  # Top 10 missing
            'ai_extracted_keywords': ai_keywords,
            'match_percentage': round(match_percentage, 1),
            'total_matched': len(matched_keywords),
            'total_expected': len(industry_keywords)
        }
    
    def _extract_keywords_with_ai(self, resume_text: str, job_role: str) -> List[str]:
        """Use Gemini to extract relevant keywords from resume"""
        if not self.model:
            return []
        
        try:
            prompt = f"""Extract the top 15 most relevant technical and professional keywords from this resume for a {job_role} position.

Resume:
{resume_text[:3000]}

Return ONLY a JSON array of keywords, like:
["keyword1", "keyword2", "keyword3", ...]

Focus on:
- Technical skills
- Tools and technologies
- Methodologies
- Certifications
- Domain expertise"""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            # Parse JSON array
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                keywords = json.loads(response_text[start_idx:end_idx])
                return keywords[:15]
            
            return []
        except:
            return []
    
    def _analyze_sections(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume sections for completeness"""
        
        resume_lower = resume_text.lower()
        
        # Define expected sections
        sections = {
            'contact_info': {
                'keywords': ['email', 'phone', '@', 'linkedin'],
                'found': False,
                'importance': 'critical'
            },
            'summary': {
                'keywords': ['summary', 'objective', 'profile', 'about'],
                'found': False,
                'importance': 'high'
            },
            'experience': {
                'keywords': ['experience', 'employment', 'work history', 'professional experience'],
                'found': False,
                'importance': 'critical'
            },
            'education': {
                'keywords': ['education', 'degree', 'university', 'college', 'bachelor', 'master'],
                'found': False,
                'importance': 'critical'
            },
            'skills': {
                'keywords': ['skills', 'technical skills', 'competencies', 'expertise'],
                'found': False,
                'importance': 'high'
            },
            'projects': {
                'keywords': ['projects', 'portfolio', 'work samples'],
                'found': False,
                'importance': 'medium'
            },
            'certifications': {
                'keywords': ['certification', 'certificate', 'licensed'],
                'found': False,
                'importance': 'medium'
            }
        }
        
        # Check for each section
        for section_name, section_data in sections.items():
            for keyword in section_data['keywords']:
                if keyword in resume_lower:
                    section_data['found'] = True
                    break
        
        # Calculate completeness score
        critical_sections = [s for s, d in sections.items() if d['importance'] == 'critical']
        critical_found = sum(1 for s in critical_sections if sections[s]['found'])
        
        high_sections = [s for s, d in sections.items() if d['importance'] == 'high']
        high_found = sum(1 for s in high_sections if sections[s]['found'])
        
        # Weighted score
        completeness_score = (
            (critical_found / len(critical_sections) * 60) +
            (high_found / len(high_sections) * 30) +
            10  # Base score
        )
        
        present_sections = [s for s, d in sections.items() if d['found']]
        missing_sections = [s for s, d in sections.items() if not d['found']]
        
        return {
            'completeness_score': round(completeness_score, 1),
            'present_sections': present_sections,
            'missing_sections': missing_sections,
            'section_details': sections
        }
    
    def _generate_recommendations(self, ai_analysis: Dict, keywords_data: Dict, 
                                 sections_data: Dict, job_role: str) -> List[Dict[str, str]]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        # Keyword recommendations
        if keywords_data['match_percentage'] < 60:
            recommendations.append({
                'category': 'Keywords',
                'priority': 'high',
                'suggestion': f"Add more {job_role}-specific keywords. You're missing: {', '.join(keywords_data['missing_keywords'][:5])}",
                'impact': 'Increases ATS match rate by 15-25%'
            })
        
        # Section recommendations
        missing_critical = [s for s in sections_data['missing_sections'] 
                          if sections_data['section_details'][s]['importance'] == 'critical']
        if missing_critical:
            recommendations.append({
                'category': 'Structure',
                'priority': 'critical',
                'suggestion': f"Add missing critical sections: {', '.join(missing_critical)}",
                'impact': 'Essential for ATS parsing'
            })
        
        # Format recommendations
        if ai_analysis.get('format_score', 100) < 70:
            recommendations.append({
                'category': 'Formatting',
                'priority': 'high',
                'suggestion': 'Use standard section headers, avoid tables/columns, use simple formatting',
                'impact': 'Improves ATS readability by 20-30%'
            })
        
        # Content recommendations
        if ai_analysis.get('content_score', 100) < 70:
            recommendations.append({
                'category': 'Content',
                'priority': 'medium',
                'suggestion': 'Add more quantifiable achievements (numbers, percentages, metrics)',
                'impact': 'Makes accomplishments more impactful'
            })
        
        # AI-generated recommendations from weaknesses
        for weakness in ai_analysis.get('weaknesses', [])[:2]:
            recommendations.append({
                'category': 'AI Insight',
                'priority': 'medium',
                'suggestion': weakness,
                'impact': 'Addresses specific improvement area'
            })
        
        return recommendations[:8]  # Return top 8 recommendations
    
    def _parse_fallback_scores(self, text: str) -> Dict[str, Any]:
        """Parse scores from text if JSON parsing fails"""
        return {
            'overall_ats_score': 70,
            'keyword_score': 70,
            'format_score': 70,
            'content_score': 70,
            'readability_score': 70,
            'ats_score': 70,
            'strengths': ['Resume received and analyzed'],
            'weaknesses': ['Unable to generate detailed analysis'],
            'feedback': text if text else 'Resume analysis completed. Consider adding more job-specific keywords and quantifiable achievements.'
        }
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Return fallback analysis when Gemini is unavailable"""
        return {
            'overall_ats_score': 70,
            'scores': {
                'keyword_match': 70,
                'format_score': 70,
                'content_quality': 70,
                'section_completeness': 70,
                'readability': 70,
                'ats_compatibility': 70
            },
            'keywords': {
                'matched_keywords': [],
                'missing_keywords': [],
                'ai_extracted_keywords': [],
                'match_percentage': 0,
                'total_matched': 0,
                'total_expected': 0
            },
            'sections': {
                'completeness_score': 70,
                'present_sections': [],
                'missing_sections': [],
                'section_details': {}
            },
            'recommendations': [{
                'category': 'System',
                'priority': 'high',
                'suggestion': 'Configure Gemini API key for detailed ATS analysis',
                'impact': 'Enables AI-powered resume analysis'
            }],
            'detailed_feedback': 'Please configure Gemini API key for comprehensive ATS analysis.',
            'strengths': [],
            'weaknesses': []
        }
    
    def compare_resumes(self, resumes_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compare multiple resumes and rank them"""
        if not self.model or not resumes_data:
            return {'error': 'Invalid data for comparison'}
        
        try:
            # Prepare comparison data
            comparison_text = ""
            for i, resume in enumerate(resumes_data, 1):
                comparison_text += f"\n\nResume {i} ({resume.get('filename', 'Unknown')}):\n"
                comparison_text += f"Job Role: {resume.get('job_role', 'General')}\n"
                if resume.get('ats_analysis'):
                    ats = resume['ats_analysis']
                    comparison_text += f"Overall ATS Score: {ats.get('overall_ats_score', 'N/A')}\n"
                    comparison_text += f"Key Strengths: {', '.join(ats.get('strengths', [])[:2])}\n"
            
            prompt = f"""Compare these {len(resumes_data)} resumes and provide a ranking analysis.

{comparison_text}

Return ONLY a valid JSON object:
{{
  "ranking": [
    {{"resume_index": 1, "score": 85, "reason": "Strong technical skills and quantifiable achievements"}},
    {{"resume_index": 2, "score": 78, "reason": "Good structure but missing key certifications"}}
  ],
  "comparison_insights": "Overall comparison insights and recommendations",
  "best_resume": 1,
  "common_strengths": ["strength1", "strength2"],
  "common_weaknesses": ["weakness1", "weakness2"]
}}"""

            response = self.model.generate_content(prompt)
            response_text = response.text
            
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                return json.loads(response_text[start_idx:end_idx])
            
            return {'error': 'Failed to parse comparison results'}
            
        except Exception as e:
            return {'error': f'Comparison failed: {str(e)}'}

# Create singleton instance
ats_service = ATSService()
