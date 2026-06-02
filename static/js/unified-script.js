// ========================================
// UNIFIED DASHBOARD - JAVASCRIPT
// Beautiful all-in-one resume analyzer
// ========================================

let currentAnalysis = null;
let currentFile = null;

// ========== DOM ELEMENTS ==========
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const uploadView = document.getElementById('upload-view');
const resultsView = document.getElementById('results-view');

// ========== EVENT LISTENERS ==========

// Drag and Drop
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);

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
                displayUnifiedDashboard();
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

// ========== UNIFIED DASHBOARD DISPLAY ==========

function displayUnifiedDashboard() {
    if (!currentAnalysis) return;

    const data = currentAnalysis.analysis;

    // Hide upload, show results
    uploadView.classList.add('hidden');
    resultsView.classList.remove('hidden');

    // Scroll to top of results
    setTimeout(() => {
        resultsView.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Update all sections
    updateAtsScores(data);
    updateStrengthsAndWeaknesses(data);
    updateSkillsDisplay(data);
    updateCareerPaths(data);
    updateJobRoles(data);
    updateSkillsToLearn(data);
    updateMissingKeywords(data);
    displayImprovements(data.improvement_suggestions || []);
}

function updateAtsScores(data) {
    // ATS Score
    const atsScore = data.ats_score || 0;
    updateCircularProgress('atsScoreCircle', atsScore);
    document.getElementById('atsScore').innerHTML = `${atsScore}<span>%</span>`;
    document.getElementById('atsScoreDesc').textContent = getScoreDescription(atsScore);

    // Readability Score
    const readabilityScore = data.readability_score || 0;
    updateCircularProgress('readabilityScoreCircle', readabilityScore);
    document.getElementById('readabilityScore').innerHTML = `${readabilityScore}<span>%</span>`;
    document.getElementById('readabilityScoreDesc').textContent = getScoreDescription(readabilityScore);

    // Keyword Score
    const keywordScore = data.keyword_optimization_score || 0;
    updateCircularProgress('keywordScoreCircle', keywordScore);
    document.getElementById('keywordScore').innerHTML = `${keywordScore}<span>%</span>`;
    document.getElementById('keywordScoreDesc').textContent = getScoreDescription(keywordScore);
}

function updateCircularProgress(elementId, percentage) {
    const circle = document.getElementById(elementId);
    if (!circle) return;

    const normalized = Math.max(0, Math.min(Number(percentage) || 0, 100));
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (normalized / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    circle.classList.remove('score-low', 'score-mid', 'score-high');
    circle.classList.add(getScoreClass(normalized));
}

function getScoreDescription(score) {
    if (score >= 80) return 'Excellent - Ready for ATS';
    if (score >= 60) return 'Good - Some optimization needed';
    if (score >= 40) return 'Fair - Significant improvements recommended';
    return 'Needs improvement - Review suggestions';
}

function getScoreClass(score) {
    if (score >= 75) return 'score-high';
    if (score >= 45) return 'score-mid';
    return 'score-low';
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function updateStrengthsAndWeaknesses(data) {
    const strengthsList = document.getElementById('strengthsList');
    const weaknessesList = document.getElementById('weaknessesList');

    strengthsList.innerHTML = (data.strengths || []).length > 0
        ? (data.strengths.map(s => `<li>${escapeHTML(s)}</li>`).join(''))
        : '<li>Add more resume details so strengths can be detected.</li>';

    weaknessesList.innerHTML = (data.weaknesses || []).length > 0
        ? (data.weaknesses.map(w => `<li>${escapeHTML(w)}</li>`).join(''))
        : '<li>Add measurable project, skill, and achievement details.</li>';
}

function updateSkillsDisplay(data) {
    const skillsDiv = document.getElementById('currentSkills');
    const skills = data.skills || [];

    if (skills.length > 0) {
        skillsDiv.innerHTML = skills
            .map(skill => `<div class="skill-badge">${escapeHTML(skill)}</div>`)
            .join('');
    } else {
        skillsDiv.innerHTML = '<p class="placeholder">Add a clear Skills section to improve detection.</p>';
    }
}

function updateCareerPaths(data) {
    const careerPathsList = document.getElementById('careerPaths');
    const paths = data.career_paths || [];

    careerPathsList.innerHTML = paths.length > 0
        ? (paths.map(p => `<li>${escapeHTML(p)}</li>`).join(''))
        : '<li>Software Development</li><li>Data Analytics</li><li>Web Development</li>';
}

function updateJobRoles(data) {
    const rolesDiv = document.getElementById('jobRoles');
    const roles = data.job_roles || [];

    if (roles.length > 0) {
        rolesDiv.innerHTML = roles
            .map(role => `<div class="skill-badge">${escapeHTML(role)}</div>`)
            .join('');
    } else {
        rolesDiv.innerHTML = '<p class="placeholder">Add more skills and projects to improve role matching.</p>';
    }
}

function updateSkillsToLearn(data) {
    const skillsDiv = document.getElementById('skillsToLearn');
    const skills = data.skills_to_learn || [];

    if (skills.length > 0) {
        skillsDiv.innerHTML = skills
            .map(skill => `<div class="skill-badge">${escapeHTML(skill)}</div>`)
            .join('');
    } else {
        skillsDiv.innerHTML = '<p class="placeholder">All in-demand skills covered!</p>';
    }
}

function updateMissingKeywords(data) {
    const keywordsDiv = document.getElementById('keywordsList');
    const keywords = data.missing_keywords || [];

    if (keywords.length > 0) {
        keywordsDiv.innerHTML = keywords
            .map(keyword => `<div class="skill-badge">${escapeHTML(keyword)}</div>`)
            .join('');
    } else {
        keywordsDiv.innerHTML = '<p class="placeholder">Strong keyword coverage detected.</p>';
    }
}

// ========== JOB MATCHER ==========

function analyzeJobMatch() {
    const jobDescription = document.getElementById('jobDescription').value.trim();

    if (!jobDescription) {
        showNotification('Please paste a job description', 'warning');
        return;
    }

    if (!currentAnalysis) {
        showNotification('Please upload a resume first', 'error');
        return;
    }

    const requestData = {
        job_description: jobDescription,
        resume_data: currentAnalysis.analysis
    };

    fetch('/analyze-job-match', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayJobMatchResults(data.analysis);
                showNotification('Job match analysis complete!', 'success');
            } else {
                showNotification(data.error || 'Error analyzing job match', 'error');
            }
        })
        .catch(error => {
            showNotification('Error: ' + error.message, 'error');
        });
}

function displayJobMatchResults(analysis) {
    const resultsDiv = document.getElementById('jobMatchResults');
    const matchScore = analysis.match_score || 0;

    // Update score
    updateCircularProgress('matchScoreCircle', matchScore);
    document.getElementById('matchScore').innerHTML = `${matchScore}<span>%</span>`;
    
    if (matchScore >= 80) {
        document.getElementById('matchScoreText').textContent = 'Excellent match. You are a strong fit for this role.';
    } else if (matchScore >= 60) {
        document.getElementById('matchScoreText').textContent = 'Good match. You have most required skills.';
    } else if (matchScore >= 40) {
        document.getElementById('matchScoreText').textContent = 'Moderate match. Consider learning missing skills.';
    } else {
        document.getElementById('matchScoreText').textContent = 'Low match. Significant skill development is needed.';
    }

    // Update matching skills
    const matchingSkillsList = document.getElementById('matchingSkillsList');
    const matchingSkills = analysis.matching_skills || [];
    matchingSkillsList.innerHTML = matchingSkills.length > 0
        ? matchingSkills.map(s => `<div class="skill-badge">${escapeHTML(s)}</div>`).join('')
        : '<p class="placeholder">No matching skills found</p>';

    // Update missing skills
    const missingSkillsList = document.getElementById('missingSkillsList');
    const missingSkills = analysis.missing_skills || [];
    missingSkillsList.innerHTML = missingSkills.length > 0
        ? missingSkills.map(s => `<div class="skill-badge missing-badge">${escapeHTML(s)}</div>`).join('')
        : '<p class="placeholder">No missing skills found from this job description.</p>';

    // Update recommendations
    const recommendations = document.getElementById('jobMatchRecommendations');
    const recs = analysis.recommendations || [];
    recommendations.innerHTML = recs.length > 0
        ? recs.map(r => `<li>${escapeHTML(r)}</li>`).join('')
        : '<li>You have all necessary skills!</li>';

    // Show results
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== IMPROVEMENTS DISPLAY ==========

function displayImprovements(suggestions) {
    const improvementsList = document.getElementById('improvementsList');

    if (suggestions.length === 0) {
        improvementsList.innerHTML = '<p class="placeholder">No improvement suggestions available</p>';
        return;
    }

    const improvementsHTML = suggestions.map((suggestion, idx) => {
        const before = escapeHTML(suggestion.before || '');
        const after = escapeHTML(suggestion.after || '');

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
    });

    improvementsList.innerHTML = improvementsHTML.join('');
}

// Call this after displaying dashboard
function initImprovements() {
    if (currentAnalysis && currentAnalysis.analysis.improvement_suggestions) {
        displayImprovements(currentAnalysis.analysis.improvement_suggestions);
    }
}

// ========== REPORT DOWNLOAD ==========

function downloadReport() {
    if (!currentAnalysis) {
        showNotification('No analysis data available', 'error');
        return;
    }

    const data = currentAnalysis.analysis;
    const reportContent = generateReportHTML(data);

    const element = document.createElement('div');
    element.innerHTML = reportContent;
    element.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: 794px;
        min-height: 1123px;
        background: #ffffff;
        color: #111827;
        z-index: -1;
    `;
    document.body.appendChild(element);

    const options = {
        margin: 10,
        filename: 'resume-analysis-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
            windowWidth: 794
        },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save().then(() => {
        document.body.removeChild(element);
        showNotification('Report downloaded successfully!', 'success');
    }).catch(err => {
        document.body.removeChild(element);
        showNotification('Error generating report: ' + err.message, 'error');
    });
}

function generateReportHTML(data) {
    const listItems = items => (items || []).length > 0
        ? items.map(item => `<li>${escapeHTML(item)}</li>`).join('')
        : '<li>Not available</li>';
    const scoreCard = (label, value) => `
        <div style="padding: 14px; border: 1px solid #dbeafe; border-radius: 12px; background: #f8fafc;">
            <div style="font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em;">${label}</div>
            <div style="font-size: 28px; font-weight: 700; color: #0f172a;">${value || 0}%</div>
        </div>
    `;

    return `
        <div style="font-family: Arial, sans-serif; width: 734px; padding: 30px; color: #111827; background: #ffffff; box-sizing: border-box;">
            <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, #eef2ff, #fdf2f8); border: 1px solid #e0e7ff; margin-bottom: 24px;">
                <h1 style="margin: 0 0 8px; color: #312e81; font-size: 30px;">Resume Analysis Report</h1>
                <p style="margin: 0; color: #475569;">Generated by Resume Analyzer</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                ${scoreCard('ATS Score', data.ats_score)}
                ${scoreCard('Readability', data.readability_score)}
                ${scoreCard('Keywords', data.keyword_optimization_score)}
            </div>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Strengths</h2>
            <ul style="line-height: 1.7;">${listItems(data.strengths)}</ul>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Areas to Improve</h2>
            <ul style="line-height: 1.7;">${listItems(data.weaknesses)}</ul>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Skills</h2>
            <p style="line-height: 1.7;">${escapeHTML((data.skills || []).join(', ') || 'No skills identified')}</p>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Suitable Job Roles</h2>
            <ul style="line-height: 1.7;">${listItems(data.job_roles)}</ul>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Skills to Learn</h2>
            <ul style="line-height: 1.7;">${listItems(data.skills_to_learn)}</ul>
            
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Recommended Improvements</h2>
            ${(data.improvement_suggestions || []).map(imp => `
                <div style="margin-bottom: 14px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
                    <p style="margin: 0 0 8px;"><strong style="color: #be123c;">Before:</strong> ${escapeHTML(imp.before || '')}</p>
                    <p style="margin: 0;"><strong style="color: #047857;">After:</strong> ${escapeHTML(imp.after || '')}</p>
                </div>
            `).join('') || '<p>No improvement suggestions available.</p>'}
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 28px;">Built with love &#129655; by Bhavika | ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

// ========== RESET ANALYZER ==========

function resetAnalyzer() {
    currentAnalysis = null;
    currentFile = null;

    // Reset UI
    uploadView.classList.remove('hidden');
    resultsView.classList.add('hidden');
    fileInput.value = '';
    document.getElementById('jobDescription').value = '';
    document.getElementById('jobMatchResults').classList.add('hidden');

    // Scroll to top
    uploadView.scrollIntoView({ behavior: 'smooth' });
    showNotification('Ready for a new analysis', 'info');
}

// ========== ENHANCED NOTIFICATIONS ==========

function showNotification(message, type = 'info') {
    // Remove existing notifications to avoid stacking
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Create notification element with enhanced styling
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };

    notification.innerHTML = `
        <span style="margin-right: 10px;">${icons[type] || icons.info}</span>
        ${message}
    `;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('slideOut');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ========== SCROLL ANIMATIONS ==========

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize improvements after page load
window.addEventListener('load', () => {
    initImprovements();

    // Apply fade-in animations to elements
    const animatedElements = document.querySelectorAll(
        '.stat-card, .dashboard-section, .feature-card, .upload-card'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });

    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to hero section on mouse move
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            const cards = heroVisual.querySelectorAll('.floating-card');
            cards.forEach((card, index) => {
                const depth = (index + 1) * 10;
                card.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
            });
        });
    }
});
