/**
 * VSSTI (Vector Safety Solutions and Technical Training Institute)
 * Interactive Web Application Engine
 */

// Global State
const state = {
  settings: {},
  courses: [],
  blogs: [],
  students: [],
  subscribers: [],
  activeCategory: 'All',
  activeBlogCategory: 'All',
  adminAuthenticated: false,
  adminPassword: '',
  currentAdminTab: 'students'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  setupEventListeners();
  checkStoredAdminSession();
  await loadSettings();
  await loadCourses();
  await loadBlogs();
}

// ================= API CALLS =================
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      state.settings = data.settings;
      renderSettings();
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

async function loadCourses() {
  try {
    const res = await fetch('/api/courses');
    const data = await res.json();
    if (data.success && data.courses) {
      state.courses = data.courses;
      renderCourses();
      populateCourseSelect();
    }
  } catch (err) {
    console.error('Failed to load courses:', err);
  }
}

async function loadBlogs() {
  try {
    const res = await fetch('/api/blogs');
    const data = await res.json();
    if (data.success && data.blogs) {
      state.blogs = data.blogs;
      renderBlogs();
    }
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }
}

// ================= RENDER FUNCTIONS =================

function renderSettings() {
  const s = state.settings;
  // Top bar & contact elements
  document.querySelectorAll('.js-phone1').forEach(el => el.textContent = s.phone1);
  document.querySelectorAll('.js-phone2').forEach(el => el.textContent = s.phone2);
  document.querySelectorAll('.js-phone-link1').forEach(el => el.href = `tel:${s.phone1}`);
  document.querySelectorAll('.js-phone-link2').forEach(el => el.href = `tel:${s.phone2}`);
  document.querySelectorAll('.js-email').forEach(el => {
    el.textContent = s.email;
    if (el.tagName === 'A') el.href = `mailto:${s.email}`;
  });
  document.querySelectorAll('.js-address').forEach(el => el.textContent = s.address);
  document.querySelectorAll('.js-timing').forEach(el => el.textContent = s.timing);
  
  const announcementEl = document.getElementById('announcement-text');
  if (announcementEl && s.announcement) announcementEl.textContent = s.announcement;

  const heroHeadingEl = document.getElementById('hero-heading');
  if (heroHeadingEl && s.heroHeading) {
    heroHeadingEl.innerHTML = s.heroHeading.replace('Global Safety Leaders', '<span class="highlight-orange">Global Safety Leaders</span>');
  }

  const heroSubheadingEl = document.getElementById('hero-subheading');
  if (heroSubheadingEl && s.heroSubheading) heroSubheadingEl.textContent = s.heroSubheading;
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  let list = state.courses;
  if (state.activeCategory !== 'All') {
    list = list.filter(c => c.category.toLowerCase().includes(state.activeCategory.toLowerCase()));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; color: var(--primary-orange);"></i>
        <p>No courses found in this category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(course => `
    <div class="course-card">
      <div class="course-card-top">
        <span class="course-badge">${course.badge || course.category}</span>
        <span class="course-code">${course.code}</span>
      </div>
      <h3 class="course-title">${course.title}</h3>
      <p class="course-desc">${course.description}</p>
      
      <div class="course-meta">
        <div class="course-meta-item">
          <i class="far fa-clock"></i>
          <span>${course.duration}</span>
        </div>
        <div class="course-meta-item">
          <i class="fas fa-layer-group"></i>
          <span>${course.level}</span>
        </div>
        <div class="course-meta-item">
          <i class="fas fa-chalkboard-teacher"></i>
          <span>${course.mode}</span>
        </div>
        <div class="course-meta-item">
          <i class="fas fa-award"></i>
          <span>${course.certificationBody.split(' ')[0]}</span>
        </div>
      </div>

      <div class="course-topics-tags">
        ${(course.topics || []).slice(0, 4).map(t => `<span class="topic-tag">${t}</span>`).join('')}
      </div>

      <div class="course-card-footer">
        <button class="btn-enroll-card" onclick="selectCourseForEnrollment('${escapeHtml(course.title)}')">
          <i class="fas fa-user-plus"></i> Enroll Now
        </button>
        <button class="btn-syllabus-card" onclick="openSyllabusModal('${course.id}')">
          <i class="fas fa-file-alt"></i> Syllabus
        </button>
      </div>
    </div>
  `).join('');
}

function populateCourseSelect() {
  const select = document.getElementById('student-course-select');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = `
    <option value="" disabled selected>Select Course / Qualification</option>
    ${state.courses.map(c => `<option value="${escapeHtml(c.title)}">${c.title} (${c.code})</option>`).join('')}
    <option value="Corporate Health & Safety Training">Corporate Health & Safety Training</option>
    <option value="Industrial Workplace Inspection Consultation">Industrial Workplace Inspection Consultation</option>
  `;

  if (currentVal) select.value = currentVal;
}

function renderBlogs() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const searchInput = document.getElementById('blog-search-input');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let list = state.blogs;
  if (state.activeBlogCategory !== 'All') {
    list = list.filter(b => b.category.toLowerCase() === state.activeBlogCategory.toLowerCase());
  }

  if (query) {
    list = list.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.excerpt.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
        <i class="fas fa-newspaper" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--primary-orange);"></i>
        <p>No safety articles found matching your criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(blog => `
    <div class="blog-card">
      <div class="blog-img-wrap">
        <img src="${blog.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'}" alt="${escapeHtml(blog.title)}">
        <span class="blog-category-badge">${blog.category}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-meta">
          <span><i class="far fa-calendar-alt"></i> ${blog.date}</span>
          <span><i class="far fa-clock"></i> ${blog.readTime}</span>
          <span><i class="far fa-eye"></i> ${blog.views || 100}</span>
        </div>
        <h4 class="blog-card-title" onclick="openBlogReader('${blog.id}')">${blog.title}</h4>
        <p class="blog-card-excerpt">${blog.excerpt}</p>
        <div class="blog-card-footer">
          <span style="font-size: 0.78rem; color: var(--text-muted);"><i class="far fa-user"></i> ${blog.author}</span>
          <button class="btn-read-more" onclick="openBlogReader('${blog.id}')">
            Read Full <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#content') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (navMenu) navMenu.classList.remove('mobile-open');
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Course Category Filter Buttons
  document.querySelectorAll('.category-filter-nav .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.category-filter-nav .filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      state.activeCategory = this.getAttribute('data-category');
      renderCourses();
    });
  });

  // Blog Category Filter Buttons
  document.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      state.activeBlogCategory = this.getAttribute('data-category');
      renderBlogs();
    });
  });

  // Blog Search Input
  const blogSearchInput = document.getElementById('blog-search-input');
  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', () => {
      renderBlogs();
    });
  }

  // Interactive Student Registration Form Submission
  const studentForm = document.getElementById('student-record-form');
  if (studentForm) {
    studentForm.addEventListener('submit', handleStudentFormSubmit);
  }

  // Interactive Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Admin Modal Triggers
  document.querySelectorAll('.js-open-admin').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminModal();
    });
  });

  const closeAdminBtn = document.getElementById('close-admin-btn');
  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', closeAdminModal);
  }

  // Admin Login Form
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }

  // Admin Logout
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', handleAdminLogout);
  }

  // Admin Tab Navigation
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tab = this.getAttribute('data-tab');
      switchAdminTab(tab);
    });
  });
}

// ================= INTERACTIVE STUDENT REGISTRATION FORM =================
async function handleStudentFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.btn-submit-record');
  const alertBox = document.getElementById('form-feedback-alert');

  const formData = {
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    mobile: form.mobile.value.trim(),
    city: form.city.value.trim(),
    email: form.email.value.trim(),
    course: form.course.value,
    mode: form.mode ? form.mode.value : 'On-Campus',
    notes: form.notes ? form.notes.value.trim() : ''
  };

  if (!formData.first_name || !formData.last_name || !formData.mobile || !formData.city || !formData.email) {
    showAlert(alertBox, 'error', 'Please fill in all required fields.');
    return;
  }

  try {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Record...';

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (data.success && data.student) {
      showRegistrationReceipt(data.student);
      form.reset();
      showToast(`Record registered successfully! Student ID: ${data.student.id}`);
    } else {
      showAlert(alertBox, 'error', data.message || 'Failed to submit record. Please try again.');
    }
  } catch (err) {
    console.error('Registration error:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Record';
    showAlert(alertBox, 'error', 'Network error. Please check your connection.');
  }
}

function showRegistrationReceipt(student) {
  const container = document.getElementById('student-form-card-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 18px;">
        <i class="fas fa-check"></i>
      </div>
      <h3 style="font-size: 1.8rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 6px;">Registration Confirmed!</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">Thank you, <strong>${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}</strong>. Your application has been logged into the VSSTI admissions ledger.</p>
      
      <div style="background: var(--bg-light); border: 2px dashed var(--primary-orange); border-radius: var(--radius-md); padding: 24px; text-align: left; margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 12px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Registration ID:</span>
          <strong style="color: var(--primary-orange); font-family: monospace; font-size: 1.05rem;">${student.id}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Enrolled Course:</span>
          <strong>${escapeHtml(student.course)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Training Mode:</span>
          <strong>${escapeHtml(student.mode)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Mobile:</span>
          <strong>${escapeHtml(student.mobile)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Campus Location:</span>
          <strong>Office #303, Talha Heights, Rawalpindi</strong>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn-primary-orange" onclick="window.print()">
          <i class="fas fa-print"></i> Print Enrollment Slip
        </button>
        <button class="btn-hero-white" style="border: 1px solid var(--border-color);" onclick="resetStudentForm()">
          <i class="fas fa-plus"></i> Submit Another Record
        </button>
      </div>
    </div>
  `;
}

function resetStudentForm() {
  location.reload();
}

function selectCourseForEnrollment(courseTitle) {
  const select = document.getElementById('student-course-select');
  if (select) {
    select.value = courseTitle;
  }
  const formSection = document.getElementById('registration');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
  showToast(`Selected "${courseTitle}" for registration!`);
}

// ================= INTERACTIVE NEWSLETTER FORM =================
async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('.newsletter-input');
  const email = input.value.trim();

  if (!email) return;

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      form.reset();
    } else {
      showToast(data.message || 'Subscription failed');
    }
  } catch (err) {
    showToast('Failed to subscribe. Please try again.');
  }
}

// ================= SYLLABUS MODAL =================
function openSyllabusModal(courseId) {
  const course = state.courses.find(c => c.id === courseId);
  if (!course) return;

  const modalBackdrop = document.getElementById('reader-modal-backdrop');
  const modalContent = document.getElementById('reader-modal-body');

  modalContent.innerHTML = `
    <div style="border-bottom: 2px solid var(--primary-orange); padding-bottom: 15px; margin-bottom: 20px;">
      <span class="course-badge" style="margin-bottom: 8px; display: inline-block;">${course.category}</span>
      <h2 style="font-size: 1.8rem; font-weight: 900; color: var(--navy-dark);">${course.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Course Code: <strong>${course.code}</strong> | Certified By: <strong>${course.certificationBody}</strong></p>
    </div>

    <div style="margin-bottom: 25px;">
      <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--navy-dark); margin-bottom: 8px;">Course Overview</h4>
      <p style="color: #475569; line-height: 1.7;">${course.description}</p>
    </div>

    <div style="background: var(--bg-light); padding: 18px; border-radius: var(--radius-md); margin-bottom: 25px;">
      <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--navy-dark); margin-bottom: 12px;"><i class="fas fa-list-check" style="color: var(--primary-orange);"></i> Core Modules & Syllabus Breakdown</h4>
      <ul style="padding-left: 20px; line-height: 1.8; color: #334155;">
        ${(course.topics || []).map(t => `<li><strong>${t}</strong> - In-depth theoretical principles and simulated workplace assessments.</li>`).join('')}
      </ul>
    </div>

    <div style="display: flex; gap: 14px; justify-content: flex-end;">
      <button class="btn-primary-orange" onclick="closeReaderModal(); selectCourseForEnrollment('${escapeHtml(course.title)}');">
        <i class="fas fa-user-plus"></i> Enroll in this Course
      </button>
    </div>
  `;

  modalBackdrop.classList.add('active');
}

// ================= BLOG READER MODAL & COMMENTS =================
async function openBlogReader(blogId) {
  try {
    const res = await fetch(`/api/blogs/${blogId}`);
    const data = await res.json();
    if (!data.success || !data.blog) return;

    const blog = data.blog;
    const modalBackdrop = document.getElementById('reader-modal-backdrop');
    const modalContent = document.getElementById('reader-modal-body');

    modalContent.innerHTML = `
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 20px;">
        <span class="blog-category-badge" style="position: static; margin-bottom: 10px; display: inline-block;">${blog.category}</span>
        <h2 style="font-size: 1.85rem; font-weight: 900; color: var(--navy-dark); line-height: 1.3; margin-bottom: 10px;">${blog.title}</h2>
        <div style="display: flex; gap: 16px; font-size: 0.85rem; color: var(--text-muted); flex-wrap: wrap;">
          <span><i class="far fa-user"></i> By ${blog.author}</span>
          <span><i class="far fa-calendar-alt"></i> ${blog.date}</span>
          <span><i class="far fa-clock"></i> ${blog.readTime}</span>
          <span><i class="far fa-eye"></i> ${blog.views} views</span>
        </div>
      </div>

      <img src="${blog.image}" alt="${escapeHtml(blog.title)}" style="width: 100%; max-height: 360px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 25px;">

      <div class="article-content">
        ${blog.content}
      </div>

      <div class="comments-section">
        <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 16px;">
          <i class="far fa-comments" style="color: var(--primary-orange);"></i> Comments & Discussion (${(blog.comments || []).length})
        </h4>

        <div id="blog-comments-list" style="margin-bottom: 25px;">
          ${(blog.comments || []).length === 0 ? '<p style="color: var(--text-muted); font-size: 0.9rem;">No comments yet. Be the first to share your insights!</p>' : 
            (blog.comments || []).map(c => `
              <div class="comment-bubble">
                <div class="comment-header">
                  <span>${escapeHtml(c.name)}</span>
                  <span style="font-weight: 400; color: var(--text-muted); font-size: 0.78rem;">${c.date}</span>
                </div>
                <p style="font-size: 0.88rem; color: #475569;">${escapeHtml(c.text)}</p>
              </div>
            `).join('')}
        </div>

        <form id="comment-form" onsubmit="handleCommentSubmit(event, '${blog.id}')">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <input type="text" name="comment_name" placeholder="Your Full Name" class="form-control" required>
            <input type="email" name="comment_email" placeholder="Your Email Address (optional)" class="form-control">
          </div>
          <div style="margin-bottom: 12px;">
            <textarea name="comment_text" rows="3" placeholder="Join the discussion or ask an HSE question..." class="form-control" required></textarea>
          </div>
          <button type="submit" class="btn-primary-orange" style="font-size: 0.88rem; padding: 9px 18px;">
            <i class="far fa-paper-plane"></i> Post Comment
          </button>
        </form>
      </div>
    `;

    modalBackdrop.classList.add('active');
  } catch (err) {
    console.error('Error opening blog:', err);
  }
}

async function handleCommentSubmit(e, blogId) {
  e.preventDefault();
  const form = e.target;
  const name = form.comment_name.value.trim();
  const text = form.comment_text.value.trim();

  if (!name || !text) return;

  try {
    const res = await fetch(`/api/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Comment posted successfully!');
      // Re-open or update comments list
      openBlogReader(blogId);
      await loadBlogs();
    }
  } catch (err) {
    showToast('Failed to post comment.');
  }
}

function closeReaderModal() {
  const modalBackdrop = document.getElementById('reader-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

// ================= ADMIN PANEL LOGIC =================

function openAdminModal() {
  const modal = document.getElementById('admin-modal-backdrop');
  if (modal) modal.classList.add('active');

  if (state.adminAuthenticated) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal-backdrop');
  if (modal) modal.classList.remove('active');
}

function showAdminLogin() {
  document.getElementById('admin-login-screen').style.display = 'block';
  document.getElementById('admin-dashboard-screen').style.display = 'none';
  const pwdInput = document.getElementById('admin-password-input');
  if (pwdInput) {
    pwdInput.value = '';
    pwdInput.focus();
  }
}

function showAdminDashboard() {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-dashboard-screen').style.display = 'block';
  switchAdminTab(state.currentAdminTab || 'students');
  loadAdminStats();
}

function checkStoredAdminSession() {
  const stored = sessionStorage.getItem('vssti_admin_pwd');
  if (stored === '151214') {
    state.adminAuthenticated = true;
    state.adminPassword = stored;
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const pwdInput = document.getElementById('admin-password-input');
  const password = pwdInput ? pwdInput.value.trim() : '';
  const errorMsg = document.getElementById('admin-login-error');

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (data.success) {
      state.adminAuthenticated = true;
      state.adminPassword = password;
      sessionStorage.setItem('vssti_admin_pwd', password);
      if (errorMsg) errorMsg.style.display = 'none';
      showAdminDashboard();
      showToast('Admin logged in successfully!');
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.message || 'Incorrect password!';
        errorMsg.style.display = 'block';
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = 'Server connection error.';
      errorMsg.style.display = 'block';
    }
  }
}

function handleAdminLogout() {
  state.adminAuthenticated = false;
  state.adminPassword = '';
  sessionStorage.removeItem('vssti_admin_pwd');
  showAdminLogin();
  showToast('Logged out of Admin Portal');
}

async function loadAdminStats() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.status === 'online') {
      document.getElementById('stat-students-count').textContent = data.studentsCount;
      document.getElementById('stat-subscribers-count').textContent = data.subscribersCount;
      document.getElementById('stat-courses-count').textContent = data.coursesCount;
      document.getElementById('stat-blogs-count').textContent = data.blogsCount;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

function switchAdminTab(tabName) {
  state.currentAdminTab = tabName;
  const container = document.getElementById('admin-tab-content');
  if (!container) return;

  switch (tabName) {
    case 'students':
      renderAdminStudentsTab(container);
      break;
    case 'blogs':
      renderAdminBlogsTab(container);
      break;
    case 'courses':
      renderAdminCoursesTab(container);
      break;
    case 'subscribers':
      renderAdminSubscribersTab(container);
      break;
    case 'settings':
      renderAdminSettingsTab(container);
      break;
  }
}

// Admin Tab 1: Students
async function renderAdminStudentsTab(container) {
  container.innerHTML = '<div style="text-align:center; padding:30px;"><i class="fas fa-spinner fa-spin"></i> Loading registered students...</div>';
  try {
    const res = await fetch('/api/students', {
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    state.students = data.students || [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div>
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy-dark);">Registered Student Records (${state.students.length})</h3>
          <p style="font-size:0.85rem; color:var(--text-muted);">View, update status, and manage student enrollments.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="admin-student-search" placeholder="Search by name, city, phone..." class="form-control" style="width:240px; padding:6px 12px; font-size:0.85rem;" oninput="filterAdminStudents(this.value)">
          <button class="btn-primary-orange" style="font-size:0.85rem; padding:6px 14px;" onclick="exportStudentsCSV()">
            <i class="fas fa-file-excel"></i> Export CSV
          </button>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table" id="admin-students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Contact Info</th>
              <th>City</th>
              <th>Course Selected</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${renderStudentsTableRows(state.students)}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<div style="color:var(--danger); padding:20px;">Failed to load students ledger.</div>';
  }
}

function renderStudentsTableRows(list) {
  if (list.length === 0) {
    return '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No student records found.</td></tr>';
  }
  return list.map(s => `
    <tr>
      <td style="font-family:monospace; font-weight:700; color:var(--primary-orange);">${s.id}</td>
      <td><strong>${escapeHtml(s.firstName)} ${escapeHtml(s.lastName)}</strong></td>
      <td>
        <div style="font-size:0.82rem;">${escapeHtml(s.mobile)}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(s.email)}</div>
      </td>
      <td>${escapeHtml(s.city)}</td>
      <td style="max-width:180px;">${escapeHtml(s.course)}</td>
      <td><span class="topic-tag">${escapeHtml(s.mode)}</span></td>
      <td>
        <select class="form-control" style="padding:4px 8px; font-size:0.78rem; font-weight:700; width:110px;" onchange="updateStudentStatus('${s.id}', this.value)">
          <option value="Pending" ${s.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Enrolled" ${s.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
          <option value="Completed" ${s.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button class="btn-table-action delete" title="Delete record" onclick="deleteStudentRecord('${s.id}')">
          <i class="far fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterAdminStudents(query) {
  const q = query.toLowerCase();
  const filtered = state.students.filter(s => 
    s.id.toLowerCase().includes(q) ||
    s.firstName.toLowerCase().includes(q) ||
    s.lastName.toLowerCase().includes(q) ||
    s.city.toLowerCase().includes(q) ||
    s.mobile.includes(q) ||
    s.course.toLowerCase().includes(q)
  );
  const tbody = document.querySelector('#admin-students-table tbody');
  if (tbody) tbody.innerHTML = renderStudentsTableRows(filtered);
}

async function updateStudentStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/students/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': state.adminPassword
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Student ${id} status updated to "${newStatus}"`);
    }
  } catch (err) {
    showToast('Failed to update status');
  }
}

async function deleteStudentRecord(id) {
  if (!confirm(`Are you sure you want to delete student record ${id}?`)) return;

  try {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Record ${id} deleted.`);
      renderAdminStudentsTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to delete student');
  }
}

function exportStudentsCSV() {
  if (state.students.length === 0) {
    showToast('No student records to export.');
    return;
  }
  let csv = 'Student ID,First Name,Last Name,Mobile,Email,City,Course,Mode,Status,Created At\n';
  state.students.forEach(s => {
    csv += `"${s.id}","${s.firstName}","${s.lastName}","${s.mobile}","${s.email}","${s.city}","${s.course}","${s.mode}","${s.status}","${s.createdAt}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VSSTI_Students_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// Admin Tab 2: Blogs Management
async function renderAdminBlogsTab(container) {
  await loadBlogs();
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div>
        <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy-dark);">Blog Article Manager</h3>
        <p style="font-size:0.85rem; color:var(--text-muted);">Publish new educational safety articles or edit existing posts.</p>
      </div>
      <button class="btn-primary-orange" style="font-size:0.85rem;" onclick="showAddBlogModal()">
        <i class="fas fa-plus-circle"></i> Create New Article
      </button>
    </div>

    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Article Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Date</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.blogs.map(b => `
            <tr>
              <td><strong>${escapeHtml(b.title)}</strong></td>
              <td><span class="topic-tag">${b.category}</span></td>
              <td>${b.author}</td>
              <td>${b.date}</td>
              <td>${b.views || 0}</td>
              <td>
                <div style="display:flex; gap:6px;">
                  <button class="btn-table-action" onclick="openBlogReader('${b.id}')" title="Preview"><i class="far fa-eye"></i></button>
                  <button class="btn-table-action delete" onclick="deleteBlogPost('${b.id}')" title="Delete"><i class="far fa-trash-alt"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Blog Form Box -->
    <div id="add-blog-box" style="display:none; margin-top:30px; background:var(--bg-light); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:24px;">
      <h4 style="font-size:1.15rem; font-weight:800; color:var(--navy-dark); margin-bottom:15px;">Publish New Safety Article</h4>
      <form id="create-blog-form" onsubmit="handleCreateBlogSubmit(event)">
        <div class="form-grid-row">
          <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" class="form-control" placeholder="e.g. Essential Scaffolding Tags Explained" required>
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select name="category" class="form-control">
              <option value="ISO Certifications">ISO Certifications</option>
              <option value="Industrial Safety">Industrial Safety</option>
              <option value="OSHA Guidelines">OSHA Guidelines</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Safety Updates">Safety Updates</option>
            </select>
          </div>
        </div>
        <div class="form-grid-row">
          <div class="form-group">
            <label>Author</label>
            <input type="text" name="author" class="form-control" value="VSSTI Safety Faculty" required>
          </div>
          <div class="form-group">
            <label>Reading Time</label>
            <input type="text" name="readTime" class="form-control" value="4 min read" required>
          </div>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="url" name="image" class="form-control" value="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop">
        </div>
        <div class="form-group">
          <label>Short Excerpt</label>
          <textarea name="excerpt" rows="2" class="form-control" placeholder="Brief summary for card preview..."></textarea>
        </div>
        <div class="form-group">
          <label>Full HTML Content *</label>
          <textarea name="content" rows="6" class="form-control" placeholder="<p>Write your detailed article content here...</p>" required></textarea>
        </div>
        <div style="display:flex; gap:10px;">
          <button type="submit" class="btn-primary-orange"><i class="fas fa-check"></i> Publish Article</button>
          <button type="button" class="btn-table-action" onclick="document.getElementById('add-blog-box').style.display='none'">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

function showAddBlogModal() {
  const box = document.getElementById('add-blog-box');
  if (box) {
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
  }
}

async function handleCreateBlogSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const payload = {
    title: form.title.value.trim(),
    category: form.category.value,
    author: form.author.value.trim(),
    readTime: form.readTime.value.trim(),
    image: form.image.value.trim(),
    excerpt: form.excerpt.value.trim(),
    content: form.content.value.trim()
  };

  try {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': state.adminPassword
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Article published successfully!');
      await loadBlogs();
      renderAdminBlogsTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to publish article.');
  }
}

async function deleteBlogPost(id) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Article deleted.');
      await loadBlogs();
      renderAdminBlogsTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to delete article');
  }
}

// Admin Tab 3: Courses Manager
async function renderAdminCoursesTab(container) {
  await loadCourses();
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div>
        <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy-dark);">Courses & Qualifications Manager</h3>
        <p style="font-size:0.85rem; color:var(--text-muted);">Manage syllabus, course catalog, and active certifications.</p>
      </div>
      <button class="btn-primary-orange" style="font-size:0.85rem;" onclick="showAddCourseBox()">
        <i class="fas fa-plus-circle"></i> Add Qualification
      </button>
    </div>

    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Mode</th>
            <th>Certifying Body</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${state.courses.map(c => `
            <tr>
              <td style="font-family:monospace; font-weight:700;">${c.code}</td>
              <td><strong>${escapeHtml(c.title)}</strong></td>
              <td><span class="topic-tag">${c.category}</span></td>
              <td>${c.duration}</td>
              <td>${c.mode}</td>
              <td>${c.certificationBody}</td>
              <td>
                <button class="btn-table-action delete" onclick="deleteCourse('${c.id}')"><i class="far fa-trash-alt"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Add Course Box -->
    <div id="add-course-box" style="display:none; margin-top:25px; background:var(--bg-light); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:24px;">
      <h4 style="font-size:1.15rem; font-weight:800; color:var(--navy-dark); margin-bottom:15px;">Add New Qualification</h4>
      <form id="create-course-form" onsubmit="handleCreateCourseSubmit(event)">
        <div class="form-grid-row">
          <div class="form-group">
            <label>Course Title *</label>
            <input type="text" name="title" class="form-control" required placeholder="e.g. Scaffolding Inspector Level 2">
          </div>
          <div class="form-group">
            <label>Course Code</label>
            <input type="text" name="code" class="form-control" placeholder="e.g. SCAF-202">
          </div>
        </div>
        <div class="form-grid-row">
          <div class="form-group">
            <label>Category *</label>
            <select name="category" class="form-control">
              <option value="International Safety">International Safety</option>
              <option value="OSHA Certifications">OSHA Certifications</option>
              <option value="ISO Systems">ISO Systems</option>
              <option value="Industrial Safety">Industrial Safety</option>
              <option value="UK Qualifications">UK Qualifications</option>
              <option value="Technical & IT">Technical & IT</option>
            </select>
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" name="duration" class="form-control" placeholder="e.g. 4 Days (32 Hours)">
          </div>
        </div>
        <div class="form-grid-row">
          <div class="form-group">
            <label>Training Mode</label>
            <input type="text" name="mode" class="form-control" value="On-Campus / Online">
          </div>
          <div class="form-group">
            <label>Certifying Body</label>
            <input type="text" name="certificationBody" class="form-control" value="VSSTI Industrial Standards">
          </div>
        </div>
        <div class="form-group">
          <label>Course Description</label>
          <textarea name="description" rows="2" class="form-control" placeholder="Summary of course benefits..."></textarea>
        </div>
        <div class="form-group">
          <label>Key Topics (Comma separated)</label>
          <input type="text" name="topics" class="form-control" placeholder="Module 1, Module 2, Practical Labs">
        </div>
        <div style="display:flex; gap:10px;">
          <button type="submit" class="btn-primary-orange"><i class="fas fa-save"></i> Save Course</button>
          <button type="button" class="btn-table-action" onclick="document.getElementById('add-course-box').style.display='none'">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

function showAddCourseBox() {
  const box = document.getElementById('add-course-box');
  if (box) {
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
  }
}

async function handleCreateCourseSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const payload = {
    title: form.title.value.trim(),
    code: form.code.value.trim(),
    category: form.category.value,
    duration: form.duration.value.trim(),
    mode: form.mode.value.trim(),
    certificationBody: form.certificationBody.value.trim(),
    description: form.description.value.trim(),
    topics: form.topics.value.trim()
  };

  try {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': state.adminPassword
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Course added successfully!');
      await loadCourses();
      renderAdminCoursesTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to add course');
  }
}

async function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return;
  try {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Course removed');
      await loadCourses();
      renderAdminCoursesTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to delete course');
  }
}

// Admin Tab 4: Subscribers
async function renderAdminSubscribersTab(container) {
  try {
    const res = await fetch('/api/subscribers', {
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    state.subscribers = data.subscribers || [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div>
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy-dark);">Newsletter Subscribers (${state.subscribers.length})</h3>
          <p style="font-size:0.85rem; color:var(--text-muted);">Mailing list for batch alerts, safety guidelines, and updates.</p>
        </div>
        <button class="btn-primary-orange" style="font-size:0.85rem;" onclick="showBroadcastSimulator()">
          <i class="fas fa-bullhorn"></i> Send Batch Announcement
        </button>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subscriber Email</th>
              <th>Subscribed Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.subscribers.map((sub, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(sub.email)}</strong></td>
                <td>${new Date(sub.subscribedAt).toLocaleDateString()}</td>
                <td><span class="status-badge Enrolled">${sub.status}</span></td>
                <td>
                  <button class="btn-table-action delete" onclick="deleteSubscriber('${sub.id}')"><i class="far fa-trash-alt"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<div style="color:var(--danger);">Failed to load subscribers.</div>';
  }
}

async function deleteSubscriber(id) {
  if (!confirm('Remove this subscriber from the list?')) return;
  try {
    const res = await fetch(`/api/subscribers/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': state.adminPassword }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Subscriber removed');
      renderAdminSubscribersTab(document.getElementById('admin-tab-content'));
      loadAdminStats();
    }
  } catch (err) {
    showToast('Failed to remove subscriber');
  }
}

function showBroadcastSimulator() {
  const msg = prompt(`Enter announcement to dispatch to all ${state.subscribers.length} subscribers:`, "New weekend batch for OSHA 48h starts this Saturday!");
  if (msg) {
    showToast(`Broadcast sent to ${state.subscribers.length} emails!`);
  }
}

// Admin Tab 5: Website Settings Editor
function renderAdminSettingsTab(container) {
  const s = state.settings;
  container.innerHTML = `
    <div style="margin-bottom:20px;">
      <h3 style="font-size:1.3rem; font-weight:800; color:var(--navy-dark);">Website Configuration & Content</h3>
      <p style="font-size:0.85rem; color:var(--text-muted);">Update live contact numbers, office address, announcement bar, and hero text.</p>
    </div>

    <form id="admin-settings-form" onsubmit="handleSettingsUpdate(event)">
      <div class="form-grid-row">
        <div class="form-group">
          <label>Primary Phone Number</label>
          <input type="text" name="phone1" class="form-control" value="${escapeHtml(s.phone1 || '+0330-0078640')}">
        </div>
        <div class="form-group">
          <label>Secondary Phone Number</label>
          <input type="text" name="phone2" class="form-control" value="${escapeHtml(s.phone2 || '+0330-0078641')}">
        </div>
      </div>

      <div class="form-grid-row">
        <div class="form-group">
          <label>Official Email Address</label>
          <input type="email" name="email" class="form-control" value="${escapeHtml(s.email || 'vsstinstitute@gmail.com')}">
        </div>
        <div class="form-group">
          <label>Office Timings</label>
          <input type="text" name="timing" class="form-control" value="${escapeHtml(s.timing || 'Mon – Sat: 09:00 am – 06:00 pm | Sunday: CLOSED')}">
        </div>
      </div>

      <div class="form-group">
        <label>Campus Office Address</label>
        <input type="text" name="address" class="form-control" value="${escapeHtml(s.address || 'Office #303, Talha Heights, 6th Road, Rawalpindi, Pakistan')}">
      </div>

      <div class="form-group">
        <label>Top Announcement Bar Message</label>
        <input type="text" name="announcement" class="form-control" value="${escapeHtml(s.announcement || '')}">
      </div>

      <div class="form-group">
        <label>Hero Heading</label>
        <input type="text" name="heroHeading" class="form-control" value="${escapeHtml(s.heroHeading || '')}">
      </div>

      <div class="form-group">
        <label>Hero Subheading</label>
        <textarea name="heroSubheading" rows="2" class="form-control">${escapeHtml(s.heroSubheading || '')}</textarea>
      </div>

      <button type="submit" class="btn-primary-orange" style="margin-top:10px;">
        <i class="fas fa-save"></i> Save Website Changes
      </button>
    </form>
  `;
}

async function handleSettingsUpdate(e) {
  e.preventDefault();
  const form = e.target;
  const updates = {
    phone1: form.phone1.value.trim(),
    phone2: form.phone2.value.trim(),
    email: form.email.value.trim(),
    timing: form.timing.value.trim(),
    address: form.address.value.trim(),
    announcement: form.announcement.value.trim(),
    heroHeading: form.heroHeading.value.trim(),
    heroSubheading: form.heroSubheading.value.trim()
  };

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': state.adminPassword
      },
      body: JSON.stringify({ settings: updates })
    });
    const data = await res.json();
    if (data.success) {
      state.settings = data.settings;
      renderSettings();
      showToast('Website settings updated live!');
    }
  } catch (err) {
    showToast('Failed to save settings.');
  }
}

// ================= UTILITIES =================
function showAlert(el, type, msg) {
  if (!el) return;
  el.className = `form-feedback-alert ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle" style="color:var(--primary-orange);"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
