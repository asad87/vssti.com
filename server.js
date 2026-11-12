const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '151214';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database File Path
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial Seed Data
const defaultData = {
  settings: {
    siteTitle: 'VSSTI - Vector Safety Solutions and Technical Training Institute',
    tagline: 'Together We Grow....',
    phone1: '+0330-0078640',
    phone2: '+0330-0078641',
    email: 'vsstinstitute@gmail.com',
    address: 'Office #303, Talha Heights, 6th Road, Rawalpindi, Pakistan',
    timing: 'Mon – Sat: 09:00 am – 06:00 pm | Sunday: CLOSED',
    announcement: '📢 Admissions Open for OSHA 30/48h, IOSH Managing Safely & ISO 45001! Special discounts for group enrollments.',
    heroHeading: 'Shaping Global Safety Leaders & Certified Professionals',
    heroSubheading: 'VSSTI provides internationally recognized Occupational Safety & Health (OSH) certifications, industrial inspections, and corporate risk management consultancy.',
    studentsCount: '5,800+',
    passRate: '98.6%',
    partnersCount: '190+',
    coursesCount: '25+'
  },
  courses: [
    {
      id: 'iosh-ms',
      title: 'IOSH Managing Safely',
      code: 'IOSH-MS-v5.0',
      category: 'International Safety',
      duration: '3 Days (24 Hours)',
      level: 'Professional',
      mode: 'On-Campus / Online / Weekend',
      featured: true,
      badge: 'Globally Recognized',
      description: 'The market-leading health and safety course for managers and supervisors in any sector worldwide. Delivers practical step-by-step guidance on workplace hazards.',
      topics: ['Assessing Risks', 'Controlling Risks', 'Understanding Responsibilities', 'Understanding Hazards', 'Investigating Incidents', 'Measuring Performance'],
      certificationBody: 'Institution of Occupational Safety and Health (UK)'
    },
    {
      id: 'osha-30',
      title: 'OSHA 30-Hour General Industry',
      code: 'OSHA-GI-30',
      category: 'OSHA Certifications',
      duration: '5 Days (30 Hours)',
      level: 'Intermediate',
      mode: 'On-Campus / Online',
      featured: true,
      badge: 'High Demand',
      description: 'Comprehensive occupational health and safety training covering hazard recognition, prevention, fall protection, electrical safety, machine guarding, and PPE.',
      topics: ['Walking & Working Surfaces', 'Exit Routes & Emergency Action', 'Electrical Safety', 'Hazard Communication', 'Personal Protective Equipment', 'Materials Handling'],
      certificationBody: 'OSHA Aligned / International Standards'
    },
    {
      id: 'osha-48',
      title: 'OSHA 48-Hour Field Safety Officer',
      code: 'OSHA-SO-48',
      category: 'OSHA Certifications',
      duration: '6 Days (48 Hours)',
      level: 'Advanced',
      mode: 'Classroom & Field Practical',
      featured: true,
      badge: 'Career Accelerator',
      description: 'Intensive course engineered for aspiring and working Safety Officers. Includes live hazard identification audits, permit-to-work systems, and incident investigation methodologies.',
      topics: ['Safety Audits & Inspections', 'Lockout/Tagout (LOTO)', 'Confined Space Entry', 'Incident Investigation & Root Cause', 'Risk Assessment Matrices', 'Emergency Response Plans'],
      certificationBody: 'Vector Safety Standards & International OSHA Guidelines'
    },
    {
      id: 'iso-45001',
      title: 'ISO 45001:2018 Lead Auditor',
      code: 'ISO-45001-LA',
      category: 'ISO Systems',
      duration: '5 Days (40 Hours)',
      level: 'Executive',
      mode: 'Live Virtual / Hybrid',
      featured: true,
      badge: 'IRCA Certified Pathway',
      description: 'Learn to plan, conduct, report, and follow up an audit of an Occupational Health & Safety management system in accordance with ISO 19011 and ISO 17021.',
      topics: ['PDCA Cycle in OHS', 'Audit Scopes & Objectives', 'Non-Conformance Reporting', 'Closing Meetings & Follow-up', 'Legal Compliance Auditing'],
      certificationBody: 'Exemplar Global / IRCA Pathway'
    },
    {
      id: 'nvq-level6',
      title: 'NVQ Level 6 Diploma in OHS Practice',
      code: 'NVQ-L6-OHS',
      category: 'UK Qualifications',
      duration: '6 - 9 Months (Portfolio Based)',
      level: 'Degree Equivalent',
      mode: 'Distance Learning / Portfolio Assessment',
      featured: false,
      badge: 'Chartered IOSH Pathway',
      description: 'Designed for safety directors and senior practitioners wishing to obtain GradIOSH and achieve Chartered Safety and Health Practitioner (CMIOSH) status.',
      topics: ['Health & Safety Culture', 'Developing Safety Procedures', 'Emergency Response Systems', 'Continuous Safety Improvement'],
      certificationBody: 'ProQual / City & Guilds Framework'
    },
    {
      id: 'othm-level7',
      title: 'OTHM Level 7 Diploma in OHS Management',
      code: 'OTHM-L7-OHS',
      category: 'UK Qualifications',
      duration: '6 Months',
      level: 'Postgraduate Diploma',
      mode: 'Hybrid / Blended Learning',
      featured: false,
      badge: 'Master Degree Level',
      description: 'For senior HSE professionals who develop and implement safety policies across complex industrial operations.',
      topics: ['Management Science in HSE', 'Strategic Risk Management', 'Global Safety Governance', 'Sustainability & Environmental Policy'],
      certificationBody: 'OTHM Qualifications (UK Ofqual Regulated)'
    },
    {
      id: 'fire-safety',
      title: 'Certified Fire Safety & Evacuation Warden',
      code: 'FS-WARDEN-101',
      category: 'Industrial Safety',
      duration: '2 Days (16 Hours)',
      level: 'Practical Workshop',
      mode: 'Hands-on Lab & Live Simulator',
      featured: false,
      badge: 'Hands-on Drills',
      description: 'Live firefighting apparatus training, fire triangle science, emergency evacuation protocols, smoke hazard control, and building safety compliance.',
      topics: ['Classes of Fire & Extinguishers', 'Evacuation Drill Management', 'Fire Alarm Testing', 'Smoke Control & Triage'],
      certificationBody: 'VSSTI Industrial Safety Wing'
    },
    {
      id: 'scaffolding-safety',
      title: 'Scaffolding Inspector & Erector Safety',
      code: 'SCAF-INSP-202',
      category: 'Industrial Safety',
      duration: '3 Days',
      level: 'Field Specialized',
      mode: 'Practical Yard & Classroom',
      featured: false,
      badge: 'Construction Core',
      description: 'Covers scaffolding inspection tags (green/red), load calculation, stability checks, fall arrest anchors, and compliance with international standards.',
      topics: ['Scaffold Component Inspection', 'Load Tolerances', 'Tie-in & Bracing Rules', 'Scafftag Management'],
      certificationBody: 'International Industrial Safety Standards'
    },
    {
      id: 'computer-it-safety',
      title: 'Computer & IT Skills for Safety Management',
      code: 'IT-HSE-MIS',
      category: 'Technical & IT',
      duration: '4 Weeks (Weekend)',
      level: 'Foundational to Intermediate',
      mode: 'Computer Lab / Online',
      featured: false,
      badge: 'Digital Skills',
      description: 'Master safety reporting software, computerized risk logs, advanced Excel for incident metrics, PowerBI dashboards, and digital safety audits.',
      topics: ['Safety Incident KPI Dashboards', 'Excel for HSE Metrics', 'Digital Audit Forms', 'Cloud Incident Loggers'],
      certificationBody: 'VSSTI Tech Academy'
    }
  ],
  blogs: [
    {
      id: 'iso-45001-importance',
      title: 'Why ISO 45001 Certification Is Important for Modern Organizations',
      slug: 'why-iso-45001-certification-is-important-for-modern-organizations',
      category: 'ISO Certifications',
      author: 'Engr. Tariq Mehmood (Lead Auditor)',
      date: 'February 19, 2026',
      readTime: '4 min read',
      views: 318,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
      excerpt: 'ISO 45001 is the world’s benchmark standard for occupational health and safety. Discover how adopting it mitigates industrial risks, saves insurance costs, and unlocks global contracts.',
      content: `
        <h3>The Paradigm Shift in Workplace Safety</h3>
        <p>In today's highly competitive industrial ecosystem, occupational safety is no longer just a regulatory checkbox—it is a cornerstone of corporate resilience and operational excellence. ISO 45001:2018 provides an internationally agreed blueprint that empowers enterprises to preemptively identify workplace hazards, reduce workplace fatalities, and champion employee health.</p>
        
        <h3>Key Pillars of ISO 45001</h3>
        <ul>
          <li><strong>Proactive Risk Mitigation:</strong> Transitioning from reactive firefighting to systematic predictive risk management using Plan-Do-Check-Act (PDCA).</li>
          <li><strong>Top Management Leadership:</strong> Direct accountability from executive boards to embed safety into organizational culture.</li>
          <li><strong>Worker Participation:</strong> Involving frontline staff in hazard reporting without fear of reprisal.</li>
          <li><strong>Legal & Regulatory Adherence:</strong> Full compliance with national and international occupational safety statutes.</li>
        </ul>

        <h3>Real-world Impact on Profitability</h3>
        <p>Organizations certified in ISO 45001 experience measurable reductions in costly downtime, workers' compensation payouts, and equipment damage. Furthermore, top multinational tenders and government infrastructure projects now mandate ISO 45001 compliance as a prerequisite for bidding.</p>
      `,
      comments: [
        { name: 'Muhammad Usman', date: 'Feb 20, 2026', text: 'Very insightful read. We are implementing ISO 45001 at our manufacturing facility in Taxila.' },
        { name: 'Sarah Jenkins', date: 'Feb 22, 2026', text: 'Does VSSTI provide in-house auditor training for corporate teams?' }
      ]
    },
    {
      id: 'workplace-safety-training-accidents',
      title: 'How Workplace Safety Training Reduces Industrial Accidents',
      slug: 'how-workplace-safety-training-reduces-industrial-accidents',
      category: 'Industrial Safety',
      author: 'HSE Specialist Team',
      date: 'February 19, 2026',
      readTime: '5 min read',
      views: 342,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      excerpt: 'Over 80% of industrial incidents stem from unsafe acts rather than equipment failure. Learn how continuous behavioral safety coaching transforms factory floors.',
      content: `
        <h3>The Human Factor in Industrial Operations</h3>
        <p>Across heavy construction, oil & gas installations, and manufacturing plants, high-tech safety gear is only as reliable as the worker operating it. Unsafe human behavior—caused by fatigue, lack of training, or shortcut culture—accounts for the overwhelming majority of workplace mishaps.</p>

        <h3>Core Benefits of Structured Safety Drills</h3>
        <ul>
          <li><strong>Hazard Intuition:</strong> Workers trained under OSHA and IOSH curricula develop an immediate instinct for pinch points, slip hazards, and electrical load limits.</li>
          <li><strong>Emergency Reaction Time:</strong> During critical events such as chemical spillage or flash fires, muscle memory from evacuation drills saves lives.</li>
          <li><strong>Empowerment to "Stop Work":</strong> A robust safety culture empowers every employee to halt an unsafe operation immediately.</li>
        </ul>

        <p>At VSSTI, we emphasize practical, hands-on simulations rather than rote textbook memorization. Our mock safety walks and live equipment drills prepare students for real-world high-hazard environments.</p>
      `,
      comments: [
        { name: 'Kamran Ali', date: 'Feb 21, 2026', text: 'Spot on! The practical mock drills at VSSTI Rawalpindi were fantastic.' }
      ]
    },
    {
      id: 'osha-30-vs-48',
      title: 'OSHA 30 vs OSHA 48: Which Safety Certification Matches Your Career Goals?',
      slug: 'osha-30-vs-48-comparison',
      category: 'Career Guidance',
      author: 'VSSTI Academic Advisor',
      date: 'February 24, 2026',
      readTime: '3 min read',
      views: 410,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      excerpt: 'Deciding between the OSHA 30-Hour General Industry and the OSHA 48-Hour Field Safety Officer? Here is an exhaustive breakdown of syllabus, job prospects, and market salaries.',
      content: `
        <h3>Understanding the Core Distinctions</h3>
        <p>Both OSHA 30 and OSHA 48 are revered across Gulf countries, Pakistan, and multinational engineering contractors. However, they cater to distinct professional milestones:</p>
        
        <h3>OSHA 30-Hour General Industry</h3>
        <p>Best suited for site supervisors, junior engineers, production line foremen, and team leaders who oversee teams in industrial environments and require an authoritative understanding of hazard communication, PPE, and OSHA standards.</p>

        <h3>OSHA 48-Hour Safety Officer</h3>
        <p>Engineered for candidates aspiring to work as dedicated HSE Officers or Safety Inspectors. It goes deeper into safety documentation, work permits (hot work, height work, confined spaces), accident root cause analysis, and safety audit preparation.</p>

        <p>Speak with a VSSTI academic counselor at our Rawalpindi campus to map your qualifications to international job requirements in the UAE, Saudi Arabia, and Qatar.</p>
      `,
      comments: []
    }
  ],
  students: [
    {
      id: 'VSSTI-2026-1001',
      firstName: 'Hamza',
      lastName: 'Tariq',
      mobile: '0333-5129841',
      city: 'Rawalpindi',
      email: 'hamza.tariq@gmail.com',
      course: 'OSHA 30-Hour General Industry',
      mode: 'On-Campus',
      status: 'Enrolled',
      createdAt: '2026-02-15T10:30:00Z',
      notes: 'Fee paid. Enrolled in Morning Batch.'
    },
    {
      id: 'VSSTI-2026-1002',
      firstName: 'Ahmad',
      lastName: 'Khan',
      mobile: '0300-8547219',
      city: 'Islamabad',
      email: 'ahmad.khan.hse@outlook.com',
      course: 'IOSH Managing Safely',
      mode: 'Weekend',
      status: 'Enrolled',
      createdAt: '2026-02-18T14:15:00Z',
      notes: 'Corporate sponsorship through Oil & Gas client.'
    },
    {
      id: 'VSSTI-2026-1003',
      firstName: 'Zainab',
      lastName: 'Bib',
      mobile: '0345-9988112',
      city: 'Taxila',
      email: 'zainab.engr@yahoo.com',
      course: 'ISO 45001:2018 Lead Auditor',
      mode: 'Online',
      status: 'Pending',
      createdAt: '2026-02-22T09:40:00Z',
      notes: 'Requested online schedule details.'
    }
  ],
  subscribers: [
    {
      id: 'sub-1',
      email: 'contact@al-noorindustries.com',
      subscribedAt: '2026-02-10T12:00:00Z',
      status: 'Active'
    },
    {
      id: 'sub-2',
      email: 'bilal.safety@gmail.com',
      subscribedAt: '2026-02-16T15:20:00Z',
      status: 'Active'
    },
    {
      id: 'sub-3',
      email: 'rashid.engr@fauji.com.pk',
      subscribedAt: '2026-02-24T18:05:00Z',
      status: 'Active'
    }
  ]
};

// Database Helpers
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db, returning default:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

// Authentication Middleware
function checkAdminAuth(req, res, next) {
  const authHeader = req.headers['x-admin-password'] || req.body.adminPassword || req.query.password;
  if (authHeader === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Unauthorized: Invalid Admin Password. Please use password "151214".'
  });
}

// ================= API ROUTES =================

// 1. Health check & Stats
app.get('/api/health', (req, res) => {
  const db = readDb();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    studentsCount: db.students.length,
    subscribersCount: db.subscribers.length,
    coursesCount: db.courses.length,
    blogsCount: db.blogs.length
  });
});

// 2. Settings
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json({ success: true, settings: db.settings });
});

app.post('/api/settings', checkAdminAuth, (req, res) => {
  const db = readDb();
  const updates = req.body.settings || {};
  db.settings = { ...db.settings, ...updates };
  writeDb(db);
  res.json({ success: true, message: 'Settings updated successfully', settings: db.settings });
});

// 3. Courses
app.get('/api/courses', (req, res) => {
  const db = readDb();
  res.json({ success: true, courses: db.courses });
});

app.post('/api/courses', checkAdminAuth, (req, res) => {
  const db = readDb();
  const { title, code, category, duration, level, mode, featured, badge, description, topics, certificationBody } = req.body;
  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and Category are required.' });
  }

  const newCourse = {
    id: req.body.id || 'course-' + Date.now(),
    title,
    code: code || 'VSSTI-' + Math.floor(100 + Math.random() * 900),
    category,
    duration: duration || '3 Days',
    level: level || 'Professional',
    mode: mode || 'On-Campus / Online',
    featured: !!featured,
    badge: badge || 'New',
    description: description || '',
    topics: Array.isArray(topics) ? topics : (topics ? topics.split(',').map(s => s.trim()) : []),
    certificationBody: certificationBody || 'VSSTI Certification'
  };

  // Check if updating existing
  const existingIndex = db.courses.findIndex(c => c.id === newCourse.id);
  if (existingIndex >= 0) {
    db.courses[existingIndex] = newCourse;
  } else {
    db.courses.unshift(newCourse);
  }

  writeDb(db);
  res.json({ success: true, message: 'Course saved successfully', course: newCourse });
});

app.delete('/api/courses/:id', checkAdminAuth, (req, res) => {
  const db = readDb();
  const courseId = req.params.id;
  db.courses = db.courses.filter(c => c.id !== courseId);
  writeDb(db);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// 4. Blogs
app.get('/api/blogs', (req, res) => {
  const db = readDb();
  const { category, search } = req.query;
  let list = db.blogs || [];

  if (category && category !== 'All') {
    list = list.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.content.toLowerCase().includes(q));
  }

  res.json({ success: true, blogs: list });
});

app.get('/api/blogs/:id', (req, res) => {
  const db = readDb();
  const blog = db.blogs.find(b => b.id === req.params.id || b.slug === req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog article not found' });
  }
  // increment view count
  blog.views = (blog.views || 0) + 1;
  writeDb(db);
  res.json({ success: true, blog });
});

app.post('/api/blogs', checkAdminAuth, (req, res) => {
  const db = readDb();
  const { title, category, author, readTime, image, excerpt, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const id = req.body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newBlog = {
    id: id || 'blog-' + Date.now(),
    title,
    slug: id,
    category: category || 'Safety Updates',
    author: author || 'VSSTI Editorial',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: readTime || '4 min read',
    views: req.body.views || 1,
    image: image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    excerpt: excerpt || (content.replace(/<[^>]+>/g, '').substring(0, 160) + '...'),
    content,
    comments: req.body.comments || []
  };

  const existingIdx = db.blogs.findIndex(b => b.id === newBlog.id);
  if (existingIdx >= 0) {
    db.blogs[existingIdx] = { ...db.blogs[existingIdx], ...newBlog };
  } else {
    db.blogs.unshift(newBlog);
  }

  writeDb(db);
  res.json({ success: true, message: 'Blog article published successfully', blog: newBlog });
});

app.delete('/api/blogs/:id', checkAdminAuth, (req, res) => {
  const db = readDb();
  db.blogs = db.blogs.filter(b => b.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Blog article deleted successfully' });
});

app.post('/api/blogs/:id/comments', (req, res) => {
  const db = readDb();
  const blog = db.blogs.find(b => b.id === req.params.id || b.slug === req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog article not found' });
  }

  const { name, text } = req.body;
  if (!name || !text) {
    return res.status(400).json({ success: false, message: 'Name and comment are required' });
  }

  const comment = {
    name: name.trim(),
    text: text.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  if (!blog.comments) blog.comments = [];
  blog.comments.push(comment);
  writeDb(db);
  res.json({ success: true, message: 'Comment posted successfully', comments: blog.comments });
});

// 5. Student Registration Form
app.post('/api/students', (req, res) => {
  const db = readDb();
  const { first_name, last_name, mobile, city, email, course, mode, notes } = req.body;

  if (!first_name || !last_name || !mobile || !city || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (First Name, Last Name, Mobile, City, Email).'
    });
  }

  // Generate unique registration ID
  const seq = db.students.length + 1001;
  const newStudent = {
    id: `VSSTI-${new Date().getFullYear()}-${seq}`,
    firstName: first_name.trim(),
    lastName: last_name.trim(),
    mobile: mobile.trim(),
    city: city.trim(),
    email: email.trim().toLowerCase(),
    course: course || 'General Health & Safety Consultation',
    mode: mode || 'On-Campus',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    notes: notes || 'Submitted via VSSTI online portal'
  };

  db.students.unshift(newStudent);
  writeDb(db);

  res.json({
    success: true,
    message: 'Student record registered successfully!',
    student: newStudent
  });
});

app.get('/api/students', checkAdminAuth, (req, res) => {
  const db = readDb();
  res.json({ success: true, students: db.students });
});

app.put('/api/students/:id/status', checkAdminAuth, (req, res) => {
  const db = readDb();
  const student = db.students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  student.status = req.body.status || student.status;
  if (req.body.notes !== undefined) {
    student.notes = req.body.notes;
  }
  writeDb(db);
  res.json({ success: true, message: 'Student record updated', student });
});

app.delete('/api/students/:id', checkAdminAuth, (req, res) => {
  const db = readDb();
  db.students = db.students.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Student record deleted successfully' });
});

// 6. Newsletter Subscription
app.post('/api/subscribe', (req, res) => {
  const db = readDb();
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const existing = db.subscribers.find(s => s.email.toLowerCase() === email);
  if (existing) {
    return res.json({
      success: true,
      message: 'You are already subscribed to VSSTI safety updates and batch notifications!'
    });
  }

  const newSub = {
    id: 'sub-' + Date.now(),
    email,
    subscribedAt: new Date().toISOString(),
    status: 'Active'
  };

  db.subscribers.unshift(newSub);
  writeDb(db);

  res.json({
    success: true,
    message: 'Thank you for subscribing to VSSTI! You will receive our latest safety news and course updates.'
  });
});

app.get('/api/subscribers', checkAdminAuth, (req, res) => {
  const db = readDb();
  res.json({ success: true, subscribers: db.subscribers });
});

app.delete('/api/subscribers/:id', checkAdminAuth, (req, res) => {
  const db = readDb();
  db.subscribers = db.subscribers.filter(s => s.id !== req.params.id && s.email !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Subscriber removed successfully' });
});

// 7. Admin Login Verification
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token: 'vssti-admin-session-token-' + Date.now()
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Incorrect password! Please enter password "151214".'
  });
});

// Fallback route for SPA navigation
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`VSSTI Web App running on http://localhost:${PORT}`);
  console.log(`Admin Password: ${ADMIN_PASSWORD}`);
  console.log(`===============================================`);
});
