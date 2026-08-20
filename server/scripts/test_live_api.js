const BASE_URL = 'https://new-state-six.vercel.app/api/portal';

async function testLiveApi() {
  console.log('Testing live Vercel API & MongoDB Atlas integration...\n');
  const results = {};

  // 1. Data GET
  try {
    const res = await fetch(`${BASE_URL}/data`);
    const data = await res.json();
    results['1. GET /data'] = res.ok && Array.isArray(data.students) && Array.isArray(data.announcements)
      ? `PASSED (Students: ${data.students.length}, Announcements: ${data.announcements.length})`
      : 'FAILED';
  } catch (e) {
    results['1. GET /data'] = `ERROR: ${e.message}`;
  }

  // 2. Post Announcement
  try {
    const res = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `ANN-${Date.now()}`,
        title: 'Inter-House Sports Schedule Update',
        author: 'Principal / Admin Office',
        date: new Date().toISOString().split('T')[0],
        content: 'All sports houses are requested to assemble at the main pavilion by 9:00 AM on Friday.'
      })
    });
    const data = await res.json();
    results['2. POST /announcements'] = res.ok && (data.announcementId || data.title)
      ? 'PASSED (Saved to Atlas)'
      : `FAILED: ${JSON.stringify(data)}`;
  } catch (e) {
    results['2. POST /announcements'] = `ERROR: ${e.message}`;
  }

  // 3. Post Student
  try {
    const testId = `NSHS/2026/99${Math.floor(10 + Math.random() * 90)}`;
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testId,
        name: 'CHIDERA TEST JOHNSON',
        gender: 'Female',
        class: 'JSS 1',
        house: 'Blue House (Eagle)',
        guardian: 'Mrs. Johnson (Mother)',
        guardianPhone: '08023456789',
        feeStatus: 'Unpaid',
        feeAmount: '₦95,000',
        paidAmount: '₦0',
        stateOfOrigin: 'Anambra',
        lga: 'Onitsha',
        bloodGroup: 'AA',
        genotype: 'O+'
      })
    });
    const data = await res.json();
    results['3. POST /students'] = res.ok && data.id === testId
      ? 'PASSED (Saved to Atlas)'
      : `FAILED: ${JSON.stringify(data)}`;
  } catch (e) {
    results['3. POST /students'] = `ERROR: ${e.message}`;
  }

  // 4. Post Score / Result
  try {
    const res = await fetch(`${BASE_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'NSHS/2024/001',
        result: {
          subject: 'Economics & Commerce',
          ca1: 18,
          ca2: 17,
          exam: 52,
          total: 87,
          grade: 'A1',
          remark: 'Excellent performance'
        }
      })
    });
    const data = await res.json();
    results['4. POST /results'] = res.ok && data.subject === 'Economics & Commerce'
      ? 'PASSED (Saved to Atlas)'
      : `FAILED: ${JSON.stringify(data)}`;
  } catch (e) {
    results['4. POST /results'] = `ERROR: ${e.message}`;
  }

  // 5. Post Tuition Payment Receipt
  try {
    const res = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'NSHS/2024/001',
        studentName: 'Adewale Johnson',
        amount: '₦125,000',
        bankName: 'First Bank Nigeria',
        reference: `TRX-${Date.now()}`,
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'Pending'
      })
    });
    const data = await res.json();
    results['5. POST /payments'] = res.ok && data.studentId === 'NSHS/2024/001'
      ? 'PASSED (Saved to Atlas)'
      : `FAILED: ${JSON.stringify(data)}`;
  } catch (e) {
    results['5. POST /payments'] = `ERROR: ${e.message}`;
  }

  // 6. Post Homework Assignment
  try {
    const res = await fetch(`${BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Computer Studies (AI & Coding)',
        title: 'Python Function & Conditionals Assignment',
        dueDate: '2026-09-05',
        desc: 'Write a Python program to calculate the average of 5 continuous assessment test scores.'
      })
    });
    const data = await res.json();
    results['6. POST /assignments'] = res.ok && data.title
      ? 'PASSED (Saved to Atlas)'
      : `FAILED: ${JSON.stringify(data)}`;
  } catch (e) {
    results['6. POST /assignments'] = `ERROR: ${e.message}`;
  }

  console.log('=== END-TO-END LIVE API & MONGODB REPORT ===');
  console.log(JSON.stringify(results, null, 2));
}

testLiveApi();
