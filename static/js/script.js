// ========================================
// AI RESUME ANALYZER - JAVASCRIPT
// ========================================

let currentAnalysis = null;
let currentFile = null;

// ========== DOM ELEMENTS ==========
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const sections = document.querySelectorAll('.section');
const sectionTitle = document.getElementById('section-title');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// ========== SECTION NAMES ==========
const sectionNames = {
    'upload': 'Upload Resume',
    'ats': 'ATS Analysis',
    'ai-analysis': 'AI Analysis',
    'job-match': 'Job Matching',
    'skills': 'Skill Analysis',
    'recommendations': 'Career Recommendations',
    'improvements': 'Resume Improvements',
    'report': 'Download Report'
};

// ========== EVENT LISTENERS ==========

// Drag and Drop
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);

// Sidebar Navigation
sidebarItems.forEach(item => {
    item.addEventListener('click', handleSectionChange);
});

// Hamburger Menu
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// ========== FILE HANDLING ==========

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
            handleFileSelect({ target: { files: files } });
        } else {
            showNotification('Please upload a PDF file', 'error');
        }
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    const file = files[0];

    if (file.type !== 'application/pdf') {
        showNotification('Please upload a PDF file', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    currentFile = file;
    uploadResume(file);
}

function uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    // Show progress
    uploadProgress.classList.remove('hidden');
    dropZone.parentElement.style.opacity = '0.5';

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            uploadProgress.classList.add('hidden');
            dropZone.parentElement.style.opacity = '1';

            if (data.success) {
                currentAnalysis = data;
                showNotification('Resume analyzed successfully!', 'success');
                updateAnalysisDisplay();
                // Auto-switch to ATS section
                switchSection('ats');
            } else {
                showNotification(data.error || 'Error analyzing resume', 'error');
            }
        })
        .catch(error => {
            uploadProgress.classList.add('hidden');
            dropZone.parentElement.style.opacity = '1';
            showNotification('Error uploading file: ' + error.message, 'error');
        });
}

// ========== SECTION MANAGEMENT ==========

function handleSectionChange(e) {
    const section = e.currentTarget.dataset.section;
    switchSection(section);
}

function switchSection(sectionName) {
    // Update sidebar
    sidebarItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update content sections
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Update title
    sectionTitle.textContent = sectionNames[sectionName];

    // Scroll to top
    document.querySelector('.main-content').scrollTop = 0;
}

// ========== ANALYSIS DISPLAY ==========

function updateAnalysisDisplay() {
    if (!currentAnalysis) return;

    const data = currentAnalysis.analysis;

    // Update ATS Scores
    updateCircularProgress('atsScoreCircle', data.ats_score || 0);
    updateCircularProgress('readabilityScoreCircle', data.readability_score || 0);
    updateCircularProgress('keywordScoreCircle', data.keyword_optimization_score || 0);

    document.getElementById('atsScore').innerHTML = `${data.ats_score || 0}<span>%</span>`;
    document.getElementById('readabilityScore').innerHTML = `${data.readability_score || 0}<span>%</span>`;
    document.getElementById('keywordScore').innerHTML = `${data.keyword_optimization_score || 0}<span>%</span>`;

    document.getElementById('atsScoreDesc').textContent = getScoreDescription(data.ats_score || 0);
    document.getElementById('readabilityScoreDesc').textContent = getScoreDescription(data.readability_score || 0);
    document.getElementById('keywordScoreDesc').textContent = getScoreDescription(data.keyword_optimization_score || 0);

    // Update AI Analysis
    document.getElementById('resumeSummary').textContent = data.resume_summary || 'No summary available';

    updateList('strengthsList', data.strengths || []);
    updateList('weaknessesList', data.weaknesses || []);
    updateList('keywordsList', data.missing_keywords || []);
    updateList('skillsList', data.missing_skills || []);

    // Update Recommendations
    updateList('jobRoles', data.job_roles || []);
    updateList('careerPaths', data.career_paths || []);
    updateList('skillsToLearn', data.skills_to_learn || []);

    // Update Skills
    displaySkills(data);

    // Update Improvements
    displayImprovements(data.improvement_suggestions || []);

    // Animate counters
    animateCounters();
}

function updateCircularProgress(elementId, percentage) {
    const circle = document.getElementById(elementId);
    if (!circle) return;

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
}

function updateList(elementId, items) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (items.length === 0) {
        element.innerHTML = '<li>No data available</li>';
        return;
    }

    element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function getScoreDescription(score) {
    if (score >= 80) return 'Excellent - Ready for ATS';
    if (score >= 60) return 'Good - Some optimization needed';
    if (score >= 40) return 'Fair - Significant improvements recommended';
    return 'Needs improvement - Review suggestions';
}

function displaySkills(data) {
    const currentSkillsDiv = document.getElementById('currentSkills');
    const skillGapsDiv = document.getElementById('skillGaps');
    const skillProficiencyDiv = document.getElementById('skillProficiency');

    const currentSkills = data.skills || [];
    const missingSkills = data.missing_skills || [];

    if (currentSkills.length > 0) {
        currentSkillsDiv.innerHTML = currentSkills
            .map(skill => `<div class="skill-badge">${skill}</div>`)
            .join('');
    } else {
        currentSkillsDiv.innerHTML = '<p class="placeholder">No skills found</p>';
    }

    if (missingSkills.length > 0) {
        skillGapsDiv.innerHTML = missingSkills
            .map(skill => `<div class="skill-badge" style="border-color: rgba(245, 158, 11, 0.3); color: #f59e0b;">${skill}</div>`)
            .join('');
    } else {
        skillGapsDiv.innerHTML = '<p class="placeholder">No skill gaps identified</p>';
    }

    // Proficiency levels (simulated)
    const proficiencyItems = currentSkills.slice(0, 5).map((skill, idx) => {
        const proficiency = 60 + Math.random() * 40;
        return `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>${skill}</span>
                    <span>${Math.round(proficiency)}%</span>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); width: ${proficiency}%; height: 100%;"></div>
                </div>
            </div>
        `;
    });

    if (proficiencyItems.length > 0) {
        skillProficiencyDiv.innerHTML = proficiencyItems.join('');
    } else {
        skillProficiencyDiv.innerHTML = '<p class="placeholder">No proficiency data</p>';
    }
}

function displayImprovements(suggestions) {
    const improvementsList = document.getElementById('improvementsList');

    if (suggestions.length === 0) {
        improvementsList.innerHTML = '<p class="placeholder">No improvement suggestions available</p>';
        return;
    }

    const improvementsHTML = suggestions.map((suggestion, idx) => {
        const before = suggestion.before || '';
        const after = suggestion.after || '';

        return `
            <div class="improvement-item">
                <div class="improvement-header">
                    <span class="improvement-label">Suggestion ${idx + 1}</span>
                </div>
                <div class="improvement-before">
                    <strong>Before:</strong>
                    <p>${before}</p>
                </div>
                <div class="improvement-after">
                    <strong>After:</strong>
                    <p>${after}</p>
                </div>
            </div>
        `;
    }).join('');

    improvementsList.innerHTML = improvementsHTML;
}

// ========== JOB MATCHING ==========

function analyzeJobMatch() {
    if (!currentAnalysis) {
        showNotification('Please upload a resume first', 'warning');
        return;
    }

    const jobDescription = document.getElementById('jobDescription').value;

    if (!jobDescription.trim()) {
        showNotification('Please paste a job description', 'warning');
        return;
    }

    fetch('/analyze-job-match', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            job_description: jobDescription,
            resume_data: currentAnalysis.analysis
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayJobMatchResults(data.analysis);
                document.getElementById('matchResults').classList.remove('hidden');
                showNotification('Job match analysis complete!', 'success');
            } else {
                showNotification(data.error || 'Error analyzing job match', 'error');
            }
        })
        .catch(error => {
            showNotification('Error: ' + error.message, 'error');
        });
}

function displayJobMatchResults(data) {
    // Update match score
    updateCircularProgress('matchScoreCircle', data.match_score || 0);
    document.getElementById('matchScore').innerHTML = `${data.match_score || 0}<span>%</span>`;

    // Update lists
    updateList('matchingSkills', data.matching_skills || []);
    updateList('missingSkillsForJob', data.missing_skills || []);
    updateList('matchRecommendations', data.recommendations || []);
}

// ========== PDF REPORT GENERATION ==========

function downloadPDF() {
    if (!currentAnalysis) {
        showNotification('No analysis data available', 'warning');
        return;
    }

    const element = document.querySelector('.main-content');
    const opt = {
        margin: 10,
        filename: 'resume_analysis_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showNotification('PDF report downloaded!', 'success');
}

function downloadJSON() {
    if (!currentAnalysis) {
        showNotification('No analysis data available', 'warning');
        return;
    }

    const dataStr = JSON.stringify(currentAnalysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume_analysis_report.json';
    link.click();
    URL.revokeObjectURL(url);

    showNotification('JSON report downloaded!', 'success');
}

// ========== ANIMATIONS ==========

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');

    counters.forEach(counter => {
        const text = counter.textContent;
        const number = parseInt(text);

        if (!isNaN(number)) {
            let count = 0;
            const increment = Math.ceil(number / 50);
            const timer = setInterval(() => {
                count += increment;
                if (count >= number) {
                    count = number;
                    clearInterval(timer);
                }
                counter.textContent = count + '%';
            }, 10);
        }
    });
}

function updateCircularProgressAnimated(elementId, percentage) {
    const circle = document.getElementById(elementId);
    if (!circle) return;

    const circumference = 2 * Math.PI * 54;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    setTimeout(() => {
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// ========== NOTIFICATIONS ==========

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== UTILITIES ==========

function resetAnalyzer() {
    currentAnalysis = null;
    currentFile = null;
    fileInput.value = '';

    // Reset all displays
    document.querySelectorAll('.stat-value').forEach(el => {
        el.innerHTML = '0<span>%</span>';
    });

    document.querySelectorAll('.circular-progress .progress-fill').forEach(el => {
        el.style.strokeDashoffset = 2 * Math.PI * 54;
    });

    // Reset lists
    document.querySelectorAll('.list-items').forEach(el => {
        el.innerHTML = '<li>Upload a resume to see data</li>';
    });

    // Reset text areas
    document.getElementById('jobDescription').value = '';
    document.getElementById('matchResults').classList.add('hidden');

    // Switch to upload section
    switchSection('upload');
    showNotification('Analyzer reset. Ready for a new analysis.', 'success');
}

function toggleMobileMenu() {
    navMenu?.classList.toggle('active');
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    // Add SVG gradient definitions
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.display = 'none';
    svg.innerHTML = `
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    document.body.appendChild(svg);

    // Set initial section
    switchSection('upload');

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'r') {
                e.preventDefault();
                resetAnalyzer();
            }
        }
    });
});

// ========== RESPONSIVE BEHAVIOR ==========

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.style.display = '';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && !navMenu.contains(e.target) && !hamburger?.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});
