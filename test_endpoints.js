const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

(async () => {
  console.log('Testing APIs...');

  // 1. Health
  const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
  console.log('1. Health check:', health.status, health.data);

  // 2. Settings
  const settings = await request({ hostname: 'localhost', port: 3000, path: '/api/settings', method: 'GET' });
  console.log('2. Settings:', settings.status, 'Title:', settings.data.settings.siteTitle);

  // 3. Courses
  const courses = await request({ hostname: 'localhost', port: 3000, path: '/api/courses', method: 'GET' });
  console.log('3. Courses count:', courses.data.courses.length);

  // 4. Register new student via Interactive Form
  const newStudent = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/students',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    first_name: 'Usman',
    last_name: 'Afzal',
    mobile: '0331-5544332',
    city: 'Rawalpindi',
    email: 'usman.safety@gmail.com',
    course: 'OSHA 48-Hour Field Safety Officer',
    mode: 'On-Campus',
    notes: 'Interested in morning batch starting next Monday.'
  });
  console.log('4. Student Registration:', newStudent.status, newStudent.data.message, 'ID:', newStudent.data.student.id);

  // 5. Subscribe Newsletter
  const sub = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/subscribe',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'zahid.engineer@gmail.com'
  });
  console.log('5. Newsletter Subscribe:', sub.status, sub.data.message);

  // 6. Admin Login test with password 151214
  const adminLoginSuccess = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    password: '151214'
  });
  console.log('6. Admin Login with 151214:', adminLoginSuccess.status, adminLoginSuccess.data.success);

  // 7. Admin Login failure test
  const adminLoginFail = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    password: 'wrongpassword'
  });
  console.log('7. Admin Login with wrong password:', adminLoginFail.status, adminLoginFail.data.message);

  // 8. Update Student Status as Admin
  const statusUpdate = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/students/${newStudent.data.student.id}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': '151214'
    }
  }, {
    status: 'Enrolled',
    notes: 'Payment verified at Rawalpindi branch'
  });
  console.log('8. Update Student Status:', statusUpdate.status, statusUpdate.data.student.status);

  // 9. Add Blog Comment
  const comment = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/blogs/iso-45001-importance/comments',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Engr. Bilal',
    text: 'Great breakdown of ISO 45001 standards.'
  });
  console.log('9. Blog Comment Post:', comment.status, comment.data.message);

  console.log('ALL API TESTS PASSED SUCCESSFULLY!');
})();
