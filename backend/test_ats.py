"""
Test script for ATS Service
Run this to verify the ATS service is working correctly
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.ats_service import ats_service

# Sample resume text for testing
SAMPLE_RESUME = """
John Doe
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years of expertise in full-stack development.
Proficient in Python, JavaScript, React, and Node.js. Led teams of 5+ developers
and delivered 10+ successful projects with 99.9% uptime.

TECHNICAL SKILLS
- Languages: Python, JavaScript, Java, SQL
- Frameworks: React, Node.js, Django, Flask
- Tools: Git, Docker, AWS, Jenkins
- Databases: PostgreSQL, MongoDB, Redis

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Corp | 2021 - Present
- Developed microservices architecture serving 1M+ users
- Reduced API response time by 40% through optimization
- Mentored 3 junior developers
- Implemented CI/CD pipeline reducing deployment time by 60%

Software Engineer | StartupXYZ | 2019 - 2021
- Built RESTful APIs using Python and Flask
- Increased test coverage from 60% to 95%
- Collaborated with cross-functional teams of 10+ members

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2019
GPA: 3.8/4.0

PROJECTS
E-Commerce Platform
- Built full-stack application using React and Node.js
- Integrated payment gateway processing $100K+ monthly
- Technologies: React, Node.js, MongoDB, Stripe API
"""

def test_ats_analysis():
    """Test comprehensive ATS analysis"""
    print("=" * 60)
    print("Testing ATS Service - Comprehensive Analysis")
    print("=" * 60)
    
    job_role = "Software Engineer"
    
    print(f"\nAnalyzing resume for: {job_role}")
    print("-" * 60)
    
    try:
        # Perform analysis
        analysis = ats_service.analyze_resume_comprehensive(SAMPLE_RESUME, job_role)
        
        # Display results
        print(f"\n✅ OVERALL ATS SCORE: {analysis['overall_ats_score']}/100")
        print("\n📊 DETAILED SCORES:")
        for score_name, score_value in analysis['scores'].items():
            print(f"  • {score_name.replace('_', ' ').title()}: {score_value}/100")
        
        print("\n🔑 KEYWORD ANALYSIS:")
        keywords = analysis['keywords']
        print(f"  • Match Percentage: {keywords['match_percentage']}%")
        print(f"  • Matched: {keywords['total_matched']}/{keywords['total_expected']}")
        print(f"  • Matched Keywords: {', '.join(keywords['matched_keywords'][:5])}")
        if keywords['missing_keywords']:
            print(f"  • Missing Keywords: {', '.join(keywords['missing_keywords'][:5])}")
        
        print("\n📋 SECTION ANALYSIS:")
        sections = analysis['sections']
        print(f"  • Completeness Score: {sections['completeness_score']}/100")
        print(f"  • Present Sections: {', '.join(sections['present_sections'])}")
        if sections['missing_sections']:
            print(f"  • Missing Sections: {', '.join(sections['missing_sections'])}")
        
        print("\n💪 STRENGTHS:")
        for i, strength in enumerate(analysis['strengths'][:3], 1):
            print(f"  {i}. {strength}")
        
        print("\n⚠️  WEAKNESSES:")
        for i, weakness in enumerate(analysis['weaknesses'][:3], 1):
            print(f"  {i}. {weakness}")
        
        print("\n💡 TOP RECOMMENDATIONS:")
        for i, rec in enumerate(analysis['recommendations'][:3], 1):
            print(f"  {i}. [{rec['priority'].upper()}] {rec['suggestion']}")
            print(f"     Impact: {rec['impact']}")
        
        print("\n" + "=" * 60)
        print("✅ ATS Service Test PASSED!")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_keyword_extraction():
    """Test keyword extraction"""
    print("\n" + "=" * 60)
    print("Testing Keyword Extraction")
    print("=" * 60)
    
    try:
        analysis = ats_service.analyze_resume_comprehensive(SAMPLE_RESUME, "Software Engineer")
        keywords = analysis['keywords']
        
        print(f"\n✅ Extracted {len(keywords['ai_extracted_keywords'])} AI keywords")
        print(f"AI Keywords: {', '.join(keywords['ai_extracted_keywords'][:10])}")
        
        return True
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n🚀 Starting ATS Service Tests\n")
    
    # Run tests
    test1 = test_ats_analysis()
    test2 = test_keyword_extraction()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Comprehensive Analysis: {'✅ PASSED' if test1 else '❌ FAILED'}")
    print(f"Keyword Extraction: {'✅ PASSED' if test2 else '❌ FAILED'}")
    
    if test1 and test2:
        print("\n🎉 All tests passed! ATS Service is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        sys.exit(1)
