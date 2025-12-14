(async ()=>{
  try{
    const login = await fetch('http://localhost:3001/api/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({email:'emily.pascua002@deped.gov.ph', password:'Emp.082289'})
    });
    const l = await login.json();
    if(!l.token){
      console.error('Login failed', l);
      process.exit(1);
    }
    console.log('Login OK');
    const r = await fetch('http://localhost:3001/api/change-requests', { headers: { Authorization: 'Bearer '+l.token } });
    const rr = await r.json();
    console.log('Requests:', (rr.requests||rr).length);
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
