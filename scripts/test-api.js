(async ()=>{
  try{
    const adminEmail = process.env.ADMIN_EMAIL || 'emily.pascua002@deped.gov.ph';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('Set ADMIN_PASSWORD in env to test the login flow');
      process.exit(1);
    }

    const login = await fetch('http://localhost:3000/api/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({email: adminEmail, password: adminPassword})
    });
    const l = await login.json();
    if(!l.token){
      console.error('Login failed', l);
      process.exit(1);
    }
    console.log('Login OK');
    const r = await fetch('http://localhost:3000/api/change-requests', { headers: { Authorization: 'Bearer '+l.token } });
    const rr = await r.json();
    console.log('Requests:', (rr.requests||rr).length);
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
