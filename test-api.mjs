async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: { tr: 'test', en: '', de: '', ru: '', ar: '' },
        content: { tr: 'duyusudur şimdi', en: '', de: '', ru: '', ar: '' },
        image: '',
        isActive: true,
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
