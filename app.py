# ========================================
# AI RESUME ANALYZER - FLASK BACKEND
# ========================================

import os
import json
import re
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify
from pathlib import Path
import PyPDF2

# ========== CONFIGURATION ==========

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder if it doesn't exist
Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
genai = None
if not GEMINI_API_KEY:
    print("\nGemini API key not found. Offline analysis is enabled.")
    GEMINI_API_KEY = 'placeholder'  # Allow app to start for testing
else:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        print("Gemini API configured successfully")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        GEMINI_API_KEY = 'placeholder'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf'}

SKILL_CATALOG = {
    'Python': ['python'],
    'Java': ['java'],
    'JavaScript': ['javascript', 'js'],
    'TypeScript': ['typescript', 'ts'],
    'React': ['react', 'react.js', 'reactjs'],
    'Node.js': ['node.js', 'nodejs', 'node'],
    'Express.js': ['express', 'express.js'],
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3'],
    'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite'],
    'MongoDB': ['mongodb', 'mongo'],
    'Flask': ['flask'],
    'Django': ['django'],
    'FastAPI': ['fastapi'],
    'Git': ['git', 'github', 'gitlab'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'AWS': ['aws', 'amazon web services'],
    'Azure': ['azure'],
    'Google Cloud': ['gcp', 'google cloud'],
    'REST API': ['rest api', 'restful', 'api'],
    'Machine Learning': ['machine learning', 'ml'],
    'Data Analysis': ['data analysis', 'data analytics'],
    'Pandas': ['pandas'],
    'NumPy': ['numpy'],
    'Power BI': ['power bi'],
    'Tableau': ['tableau'],
    'Excel': ['excel', 'spreadsheet'],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'c sharp'],
    'PHP': ['php'],
    'Spring Boot': ['spring boot'],
    'Agile': ['agile', 'scrum'],
    'UI/UX': ['ui/ux', 'figma', 'wireframe'],
    'Testing': ['testing', 'unit test', 'selenium', 'pytest'],
    'Linux': ['linux', 'ubuntu', 'bash', 'shell'],
    'Tailwind CSS': ['tailwind', 'tailwind css'],
    'Bootstrap': ['bootstrap'],
    'Next.js': ['next.js', 'nextjs', 'next'],
    'Angular': ['angular'],
    'Vue.js': ['vue', 'vue.js', 'vuejs'],
    'Redux': ['redux'],
    'Firebase': ['firebase', 'firestore'],
    'Supabase': ['supabase'],
    'GraphQL': ['graphql'],
    'Postman': ['postman'],
    'Jira': ['jira'],
    'CI/CD': ['ci/cd', 'github actions', 'jenkins', 'pipeline'],
    'Data Structures': ['data structures', 'dsa'],
    'Algorithms': ['algorithms', 'algorithm'],
    'OOP': ['oop', 'object oriented', 'object-oriented'],
    'Artificial Intelligence': ['artificial intelligence', 'ai'],
    'Deep Learning': ['deep learning'],
    'NLP': ['nlp', 'natural language processing'],
    'Computer Vision': ['computer vision'],
    'Statistics': ['statistics', 'statistical'],
    'Communication': ['communication', 'presented', 'presentation'],
    'Leadership': ['leadership', 'led', 'lead'],
    'Teamwork': ['teamwork', 'collaboration', 'team'],
    'Problem Solving': ['problem solving', 'problem-solving', 'debugging'],
}

ROLE_PROFILES = {
    'Frontend Developer': {'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'UI/UX'},
    'Backend Developer': {'Python', 'Java', 'Node.js', 'Express.js', 'SQL', 'REST API', 'Flask', 'Django', 'FastAPI'},
    'Full Stack Developer': {'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'REST API'},
    'Data Analyst': {'SQL', 'Excel', 'Power BI', 'Tableau', 'Python', 'Data Analysis', 'Pandas'},
    'Data Scientist': {'Python', 'Machine Learning', 'Pandas', 'NumPy', 'SQL', 'Data Analysis'},
    'Cloud Engineer': {'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Linux'},
    'DevOps Engineer': {'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Testing'},
    'Python Developer': {'Python', 'Flask', 'Django', 'FastAPI', 'SQL', 'REST API'},
    'Software Engineer': {'Python', 'Java', 'JavaScript', 'SQL', 'Git', 'Testing', 'REST API'},
}

FOUNDATION_KEYWORDS = [
    'achievements', 'metrics', 'leadership', 'collaboration', 'communication',
    'problem solving', 'projects', 'certifications', 'portfolio', 'github',
    'linkedin', 'deployment', 'testing', 'performance', 'security'
]

STOP_WORDS = {
    'the', 'and', 'for', 'with', 'that', 'this', 'you', 'your', 'our', 'are',
    'will', 'from', 'have', 'has', 'must', 'should', 'into', 'using', 'work',
    'team', 'role', 'job', 'candidate', 'experience', 'years', 'skills',
    'ability', 'strong', 'good', 'excellent', 'required', 'preferred', 'about',
    'responsibilities', 'requirements', 'knowledge', 'based', 'well', 'such'
}

# ========== UTILITY FUNCTIONS ==========

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(pdf_path):
    """Extract text content from PDF file"""
    try:
        text = ""
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)

            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()

        return text if text.strip() else None
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        return None


def generate_ats_analysis(resume_text):
    """Generate ATS-specific scores"""
    ats_keywords = {
        'technical_keywords': ['python', 'java', 'javascript', 'c++', 'sql', 'html', 'css',
                              'api', 'rest', 'microservices', 'docker', 'kubernetes',
                              'aws', 'gcp', 'azure', 'git', 'agile', 'scrum'],
        'action_verbs': ['developed', 'designed', 'implemented', 'managed', 'led',
                        'improved', 'optimized', 'automated', 'created', 'built',
                        'engineered', 'delivered', 'streamlined', 'enhanced'],
        'formatting_keywords': ['phone', 'email', 'linkedin', 'github', 'portfolio',
                               'objective', 'summary', 'experience', 'education',
                               'skills', 'projects', 'certifications']
    }

    resume_lower = resume_text.lower()

    # Calculate scores
    technical_score = sum(1 for keyword in ats_keywords['technical_keywords']
                         if keyword in resume_lower)
    action_verb_score = sum(1 for verb in ats_keywords['action_verbs']
                           if verb in resume_lower)
    formatting_score = sum(1 for keyword in ats_keywords['formatting_keywords']
                          if keyword in resume_lower)

    # Calculate percentages (normalize to 100)
    technical_pct = min((technical_score / len(ats_keywords['technical_keywords'])) * 100, 100)
    action_verb_pct = min((action_verb_score / len(ats_keywords['action_verbs'])) * 100, 100)
    formatting_pct = min((formatting_score / len(ats_keywords['formatting_keywords'])) * 100, 100)

    # ATS Score = weighted average
    ats_score = int((technical_pct * 0.4 + action_verb_pct * 0.3 + formatting_pct * 0.3))

    # Readability Score - based on length, structure, and formatting
    lines = resume_text.split('\n')
    words = resume_text.split()
    avg_line_length = len(' '.join(lines)) / max(len(lines), 1)

    readability_score = 100
    if avg_line_length > 100:
        readability_score -= 10
    if len(words) < 100:
        readability_score -= 20
    if len(words) > 2000:
        readability_score -= 10

    readability_score = max(readability_score, 40)

    # Keyword Optimization Score
    keyword_score = int((technical_pct + action_verb_pct) / 2)

    return {
        'ats_score': min(ats_score, 100),
        'readability_score': min(readability_score, 100),
        'keyword_optimization_score': min(keyword_score, 100),
        'technical_keywords_found': technical_score,
        'action_verbs_found': action_verb_score,
        'formatting_elements_found': formatting_score
    }


def contains_term(text, term):
    """Match terms as words where possible, while supporting symbols like C++."""
    if any(char in term for char in ['+', '#', '.', '/']):
        return term.lower() in text
    return re.search(r'\b' + re.escape(term.lower()) + r'\b', text) is not None


def extract_skills(resume_text):
    """Extract known skills from resume text without an API."""
    text = resume_text.lower()
    skills = []

    for skill, aliases in SKILL_CATALOG.items():
        if any(contains_term(text, alias) for alias in aliases):
            skills.append(skill)

    return sorted(skills)


def extract_weighted_keywords(text, limit=18):
    """Extract meaningful repeated words from resume or job text."""
    words = re.findall(r'\b[a-zA-Z][a-zA-Z+#./-]{2,}\b', text.lower())
    counts = {}

    for word in words:
        normalized = word.strip('.,;:()[]{}').replace('-', ' ')
        if normalized in STOP_WORDS or len(normalized) < 3:
            continue
        counts[normalized] = counts.get(normalized, 0) + 1

    ranked = sorted(counts.items(), key=lambda item: (item[1], len(item[0])), reverse=True)
    return [word.title() for word, _ in ranked[:limit]]


def get_resume_keyword_pool(resume_data):
    """Build a keyword pool from structured resume analysis."""
    values = []
    for key in ['skills', 'strengths', 'job_roles', 'career_paths', 'missing_keywords']:
        item = resume_data.get(key, [])
        if isinstance(item, list):
            values.extend(str(value) for value in item)
        elif item:
            values.append(str(item))
    return ' '.join(values)


def infer_roles(skills):
    """Rank suitable roles from detected skills."""
    skill_set = set(skills)
    ranked = []

    for role, required in ROLE_PROFILES.items():
        overlap = skill_set.intersection(required)
        if overlap:
            ranked.append((role, len(overlap), len(overlap) / len(required)))

    ranked.sort(key=lambda item: (item[2], item[1]), reverse=True)
    return [role for role, _, _ in ranked[:5]]


def infer_learning_skills(skills, roles):
    """Suggest missing skills tied to the best-fit roles."""
    current = set(skills)
    suggestions = []

    for role in roles[:3]:
        for skill in ROLE_PROFILES.get(role, set()):
            if skill not in current and skill not in suggestions:
                suggestions.append(skill)

    if not suggestions:
        for skill in ['Git', 'SQL', 'REST API', 'Testing', 'Docker']:
            if skill not in current:
                suggestions.append(skill)

    return suggestions[:8]


def infer_strengths(resume_text, skills, ats_scores):
    """Create practical strengths from resume signals."""
    text = resume_text.lower()
    strengths = []

    if len(skills) >= 5:
        strengths.append(f"Shows a clear technical toolkit with {len(skills)} detected skills.")
    elif skills:
        strengths.append("Includes relevant technical skills that can be matched to roles.")

    if ats_scores.get('formatting_elements_found', 0) >= 4:
        strengths.append("Contains important resume sections for ATS scanning.")

    if any(contains_term(text, verb) for verb in ['developed', 'built', 'created', 'implemented', 'managed', 'led']):
        strengths.append("Uses action-oriented language to describe work and projects.")

    if re.search(r'\b\d+%|\b\d+\+|\b\d{2,}\b', resume_text):
        strengths.append("Includes measurable details, which makes impact easier to understand.")

    if not strengths:
        strengths.append("The resume has enough text for an initial offline analysis.")

    return strengths[:4]


def infer_weaknesses(resume_text, skills, ats_scores):
    """Create improvement areas from missing resume signals."""
    text = resume_text.lower()
    weaknesses = []

    if len(skills) < 4:
        weaknesses.append("Add a dedicated skills section with tools, languages, and frameworks.")

    if ats_scores.get('action_verbs_found', 0) < 3:
        weaknesses.append("Start more bullet points with strong action verbs like built, improved, led, or automated.")

    if not re.search(r'\b\d+%|\b\d+\+|\b\d{2,}\b', resume_text):
        weaknesses.append("Add numbers to show impact, such as users served, speed improved, marks, ranking, or project results.")

    if 'github' not in text and 'portfolio' not in text:
        weaknesses.append("Add a GitHub or portfolio link so projects are easy to verify.")

    if not any(word in text for word in ['project', 'projects', 'experience', 'internship']):
        weaknesses.append("Add project or experience details that show how you used your skills.")

    return weaknesses[:4] or ['Add more targeted keywords from the jobs you want.']


def build_missing_keywords(resume_text, skills, skills_to_learn):
    """Find useful missing keywords for ATS and job targeting."""
    text = resume_text.lower()
    missing = [keyword.title() for keyword in FOUNDATION_KEYWORDS if keyword not in text]
    missing.extend(skill for skill in skills_to_learn if skill not in skills)
    return list(dict.fromkeys(missing))[:10]


def build_improvement_suggestions(resume_text, weaknesses, skills=None, roles=None):
    """Return before/after suggestions that always render offline."""
    skills = skills or []
    roles = roles or []
    text = resume_text.lower()
    top_skills = ', '.join(skills[:3]) if skills else 'your main tools'
    target_role = roles[0] if roles else 'your target role'
    suggestions = []

    if 'project' in text or 'projects' in text:
        suggestions.append({
            'before': 'Project: Resume Analyzer',
            'after': f'Built a {target_role.lower()}-focused project using {top_skills}, explaining the problem, features, and final result.'
        })
    else:
        suggestions.append({
            'before': 'No clear project section',
            'after': f'Add 2-3 projects that prove {top_skills}, each with tech stack, your role, and outcome.'
        })

    if skills:
        suggestions.append({
            'before': 'Skills listed without context',
            'after': f'Show where you used {top_skills} inside project or experience bullets, not only in the skills list.'
        })
    else:
        suggestions.append({
            'before': 'Skills are hard to find',
            'after': 'Create a dedicated Skills section grouped into Languages, Frameworks, Databases, Tools, and Soft Skills.'
        })

    if any(word in text for word in ['intern', 'experience', 'worked', 'managed', 'developed']):
        suggestions.append({
            'before': 'Experience bullet describes duties',
            'after': 'Rewrite the strongest experience bullet as: action verb + task + tool + measurable result.'
        })
    else:
        suggestions.append({
            'before': 'Experience section is thin',
            'after': 'Add internships, freelance work, club work, hackathons, or academic projects as experience-style bullets.'
        })

    if not re.search(r'\b\d+%|\b\d+\+|\b\d{2,}\b', resume_text):
        suggestions.append({
            'before': 'Improved application performance',
            'after': 'Improved application performance by X%, reduced manual effort by X hours, or supported X users.'
        })

    if any('skills section' in item.lower() for item in weaknesses):
        suggestions.append({
            'before': 'Skills are mixed inside paragraphs',
            'after': 'Add a Skills section grouped by Languages, Frameworks, Databases, Tools, and Soft Skills.'
        })

    if 'github' not in text and 'portfolio' not in text:
        suggestions.append({
            'before': 'Project links not visible',
            'after': 'Add GitHub, portfolio, or live demo links beside your strongest projects.'
        })

    return suggestions[:4]


def build_local_analysis(resume_text):
    """Analyze resume locally so the app works without any API key."""
    ats_scores = generate_ats_analysis(resume_text)
    skills = extract_skills(resume_text)
    roles = infer_roles(skills)
    skills_to_learn = infer_learning_skills(skills, roles)
    weaknesses = infer_weaknesses(resume_text, skills, ats_scores)

    return {
        'resume_summary': '',
        'skills': skills,
        'strengths': infer_strengths(resume_text, skills, ats_scores),
        'weaknesses': weaknesses,
        'missing_keywords': build_missing_keywords(resume_text, skills, skills_to_learn),
        'missing_skills': skills_to_learn,
        'job_roles': roles or ['Software Engineer', 'Entry Level Developer', 'Technical Intern'],
        'career_paths': roles[:3] or ['Software Development', 'Data Analytics', 'Web Development'],
        'skills_to_learn': skills_to_learn,
        'improvement_suggestions': build_improvement_suggestions(resume_text, weaknesses, skills, roles)
    }


def merge_analysis(local_analysis, api_analysis):
    """Prefer API details when present, but never return empty dashboard sections."""
    merged = dict(local_analysis)
    for key, value in api_analysis.items():
        if isinstance(value, list):
            merged[key] = value or local_analysis.get(key, [])
        elif value:
            merged[key] = value
    return merged


def analyze_with_gemini(resume_text):
    """Analyze resume using Google Gemini API"""
    local_analysis = build_local_analysis(resume_text)
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'placeholder':
        return local_analysis

    try:
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        Analyze this resume and provide a comprehensive evaluation. Return ONLY valid JSON with the following structure:
        {{
            "resume_summary": "Brief 2-3 sentence summary of the candidate's profile",
            "skills": ["skill1", "skill2", "skill3", ...],
            "strengths": ["strength1", "strength2", "strength3", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "missing_keywords": ["keyword1", "keyword2", ...],
            "missing_skills": ["skill1", "skill2", ...],
            "job_roles": ["role1", "role2", "role3"],
            "career_paths": ["path1", "path2"],
            "skills_to_learn": ["skill1", "skill2"],
            "improvement_suggestions": [
                {{"before": "example weak bullet point", "after": "example strong bullet point"}},
                ...
            ]
        }}

        Resume Content:
        {resume_text[:3000]}

        Return ONLY the JSON object, no other text. Ensure all fields are present and valid arrays/strings.
        """

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Try to extract JSON if wrapped in markdown code blocks
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        analysis = json.loads(response_text)

        # Validate and set defaults
        required_fields = {
            'resume_summary': '',
            'skills': [],
            'strengths': [],
            'weaknesses': [],
            'missing_keywords': [],
            'missing_skills': [],
            'job_roles': [],
            'career_paths': [],
            'skills_to_learn': [],
            'improvement_suggestions': []
        }

        for field, default in required_fields.items():
            if field not in analysis:
                analysis[field] = default

        return merge_analysis(local_analysis, analysis)

    except json.JSONDecodeError:
        print("Error: Invalid JSON from Gemini API")
        return local_analysis
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        return local_analysis


def analyze_job_match_local(job_description, resume_data):
    """Compare resume and job description locally without an API."""
    job_skills = extract_skills(job_description)
    resume_skills = resume_data.get('skills', [])
    job_keywords = extract_weighted_keywords(job_description, limit=16)
    resume_pool = get_resume_keyword_pool(resume_data).lower()

    job_set = set(job_skills)
    resume_set = set(resume_skills)
    matching = sorted(job_set.intersection(resume_set))
    missing = sorted(job_set.difference(resume_set))
    keyword_matches = [
        keyword for keyword in job_keywords
        if contains_term(resume_pool, keyword.lower()) or keyword.lower() in ' '.join(skill.lower() for skill in resume_skills)
    ]

    role_text = ' '.join(resume_data.get('job_roles', []) + resume_data.get('career_paths', [])).lower()
    job_text = job_description.lower()
    role_bonus = 0
    for role in ['frontend', 'backend', 'full stack', 'data', 'cloud', 'devops', 'software', 'python', 'web']:
        if role in job_text and role in role_text:
            role_bonus = 12
            break

    if job_set:
        skill_score = (len(matching) / len(job_set)) * 70
        keyword_score = (len(keyword_matches) / max(len(job_keywords), 1)) * 18
        match_score = int(skill_score + keyword_score + role_bonus)
    else:
        resume_terms = set(extract_weighted_keywords(resume_pool, limit=30))
        keyword_matches = sorted(set(job_keywords).intersection(resume_terms))
        text_overlap_score = int((len(keyword_matches) / max(len(job_keywords), 1)) * 75)
        match_score = text_overlap_score + role_bonus

        if not keyword_matches:
            match_score = 15 if len(job_description.split()) < 25 else 25

    matching_display = list(dict.fromkeys(matching + keyword_matches))[:10]
    missing_display = missing[:10]
    if not missing_display:
        missing_display = [
            keyword for keyword in job_keywords
            if keyword not in matching_display and not contains_term(resume_pool, keyword.lower())
        ][:8]

    recommendations = []
    if missing_display:
        recommendations.append(f"Add evidence for: {', '.join(missing_display[:4])}.")
    if matching_display:
        recommendations.append(f"Move these matches near the top: {', '.join(matching_display[:4])}.")
    if match_score < 50:
        recommendations.append('Tailor your summary and projects more closely to this job description before applying.')
    elif match_score < 75:
        recommendations.append('You have a partial fit. Add missing keywords and measurable proof for the role.')
    else:
        recommendations.append('Strong fit. Fine-tune the top third of your resume for this exact job.')
    recommendations.append('Customize project bullets with keywords from the job description before applying.')

    return {
        'match_score': max(0, min(match_score, 100)),
        'matching_skills': matching_display,
        'missing_skills': missing_display,
        'recommendations': recommendations[:4]
    }


def analyze_job_match(job_description, resume_data):
    """Analyze job match using Gemini"""
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'placeholder':
        return analyze_job_match_local(job_description, resume_data)

    try:
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        Compare a resume with a job description and provide a match analysis. Return ONLY valid JSON with this structure:
        {{
            "match_score": 85,
            "matching_skills": ["skill1", "skill2"],
            "missing_skills": ["skill3", "skill4"],
            "recommendations": ["recommendation1", "recommendation2"]
        }}

        Resume Skills: {', '.join(resume_data.get('skills', []))}
        Job Description: {job_description[:2000]}

        Calculate match_score as a percentage (0-100). Return ONLY the JSON object.
        """

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Extract JSON from markdown if needed
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        analysis = json.loads(response_text)

        # Set defaults
        analysis['match_score'] = analysis.get('match_score', 50)
        analysis['matching_skills'] = analysis.get('matching_skills', [])
        analysis['missing_skills'] = analysis.get('missing_skills', [])
        analysis['recommendations'] = analysis.get('recommendations', [])

        return analysis

    except json.JSONDecodeError:
        print("Error: Invalid JSON from Gemini API for job matching")
        return analyze_job_match_local(job_description, resume_data)
    except Exception as e:
        print(f"Error in job matching: {str(e)}")
        return analyze_job_match_local(job_description, resume_data)


# ========== ROUTES ==========

@app.route('/')
def index():
    """Render main page"""
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"Error rendering index.html: {e}")
        return f"<h1>Error Loading Page</h1><p>Error: {str(e)}</p>", 500


@app.route('/upload', methods=['POST'])
def upload_resume():
    """Handle resume upload and analysis"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Only PDF files are allowed'
            }), 400

        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Extract text from PDF
        resume_text = extract_text_from_pdf(filepath)

        if not resume_text:
            os.remove(filepath)
            return jsonify({
                'success': False,
                'error': 'Could not extract text from PDF. Please ensure it\'s a valid PDF.'
            }), 400

        # Generate ATS analysis
        ats_scores = generate_ats_analysis(resume_text)

        # Generate Gemini analysis
        gemini_analysis = analyze_with_gemini(resume_text)

        # Combine analyses
        analysis = {
            **ats_scores,
            **gemini_analysis,
            'file_name': filename,
            'upload_date': datetime.now().isoformat(),
            'resume_length': len(resume_text),
            'word_count': len(resume_text.split())
        }

        # Clean up uploaded file
        os.remove(filepath)

        return jsonify({
            'success': True,
            'analysis': analysis,
            'file_name': filename
        }), 200

    except Exception as e:
        print(f"Error uploading resume: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Error processing resume: {str(e)}'
        }), 500


@app.route('/analyze-job-match', methods=['POST'])
def analyze_job_match_route():
    """Analyze job match"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        job_description = data.get('job_description', '')
        resume_data = data.get('resume_data', {})

        if not job_description:
            return jsonify({
                'success': False,
                'error': 'Job description is required'
            }), 400

        if not resume_data:
            return jsonify({
                'success': False,
                'error': 'Resume data is required'
            }), 400

        # Analyze job match
        analysis = analyze_job_match(job_description, resume_data)

        return jsonify({
            'success': True,
            'analysis': analysis
        }), 200

    except Exception as e:
        print(f"Error analyzing job match: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Error analyzing job match: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify app is working"""
    return jsonify({
        'status': 'OK',
        'message': 'App is running!',
        'gemini_configured': GEMINI_API_KEY != 'placeholder'
    }), 200


# ========== ERROR HANDLERS ==========

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        'success': False,
        'error': 'File is too large. Maximum size is 10MB.'
    }), 413


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ========== MAIN ==========

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AI RESUME ANALYZER - STARTING")
    print("="*50)
    print("Flask app initialized")
    print(f"Uploads folder: {app.config['UPLOAD_FOLDER']}")
    if GEMINI_API_KEY and GEMINI_API_KEY != 'placeholder':
        print("Gemini API: Configured")
    else:
        print("Gemini API: NOT configured. Offline analysis is enabled.")
    print("\nStarting server...")
    print("URL: http://127.0.0.1:5000")
    print("Open this URL in your browser")
    print("\nPress Ctrl+C to stop the server")
    print("="*50 + "\n")
    
    # For development
    app.run(debug=True, host='0.0.0.0', port=5000)

    # For production, use:
    # from waitress import serve
    # serve(app, host='0.0.0.0', port=5000)
