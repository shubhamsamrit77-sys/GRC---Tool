/* ════════════════════════════════════════
   Clarix — Application JS
   Split from index.html
════════════════════════════════════════ */

"use strict";

function forceLogout(){
  if(currentUser) writeAuditLog('LOGOUT','System','User logged out: '+(currentUser.email||''));
  clearAIKeyFromMemory();
  secureWipe(['grc-session','grc-session-iv','grc-attempts','grc-lockout']);
  _secKey = null;
  currentUser = null;
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('l-email').value='';
  document.getElementById('l-pass').value='';
  showDueDateToast('','🔒 Session ended — please sign in again.');
}
// ── SLIDE PANELS ──
function isMobile(){return window.innerWidth<=768;}

function openPanel(id){
  var panelPerms={
    'item-panel': can('add'),
    'risk-panel': can('add'),
    'user-panel': can('admin'),
    'action-panel': can('actions'),
    'audit-panel': can('actions'),
    'evidence-panel': can('actions'),
    'ev-submit-panel': can('actions'),
    'cert-tracker-panel': can('actions'),
    'schedule-audit-panel': can('actions'),
    'policy-panel': can('add'),
    'policy-view-panel': true
  };
  if(id in panelPerms && !panelPerms[id]){
    noPermission('You do not have permission to perform this action.');
    return;
  }
  var panel=document.getElementById(id);
  var overlay=document.getElementById('panel-overlay');
  if(!panel||!overlay) return;
  // On mobile reset bottom so CSS transition works
  if(isMobile()) panel.style.bottom='';
  panel.classList.add('open');
  overlay.style.display='block';
  document.body.style.overflow='hidden';
  var first=panel.querySelector('input,select,textarea');
  if(first) setTimeout(function(){first.focus();},320);
  // Swipe-down to close on mobile
  if(isMobile()) enableSwipeClose(panel);
}

function closePanel(){
  document.querySelectorAll('.slide-panel').forEach(function(p){p.classList.remove('open');});
  var overlay=document.getElementById('panel-overlay');
  if(overlay) overlay.style.display='none';
  document.body.style.overflow='';
}

// Swipe-down gesture to close bottom-sheet panels on mobile
function enableSwipeClose(panel){
  var startY=0,isDragging=false,startBottom=0;
  function onTouchStart(e){
    var header=panel.querySelector('.panel-header');
    if(!header||!header.contains(e.target)) return;
    startY=e.touches[0].clientY;
    startBottom=0;
    isDragging=true;
    panel.style.transition='none';
  }
  function onTouchMove(e){
    if(!isDragging) return;
    var dy=e.touches[0].clientY - startY;
    if(dy>0){ panel.style.bottom='-'+dy+'px'; e.preventDefault(); }
  }
  function onTouchEnd(e){
    if(!isDragging) return;
    isDragging=false;
    panel.style.transition='';
    var dy=e.changedTouches[0].clientY - startY;
    if(dy>90){ closePanel(); } else { panel.style.bottom='0'; }
  }
  panel.removeEventListener('touchstart',panel._swipeStart);
  panel.removeEventListener('touchmove',panel._swipeMove);
  panel.removeEventListener('touchend',panel._swipeEnd);
  panel._swipeStart=onTouchStart; panel._swipeMove=onTouchMove; panel._swipeEnd=onTouchEnd;
  panel.addEventListener('touchstart',onTouchStart,{passive:true});
  panel.addEventListener('touchmove',onTouchMove,{passive:false});
  panel.addEventListener('touchend',onTouchEnd,{passive:true});
}



function $(id){return document.getElementById(id);}
function safeOn(id,ev,fn){var el=$(id);if(el)el.addEventListener(ev,fn);}

// ── CONFIG (obfuscated at rest, decoded at runtime) ──
(function(){
  var _x=[7,13,23,31,41,53,61,71];
  var _u=[111, 121, 99, 111, 90, 15, 18, 104, 108, 124, 97, 105, 88, 71, 84, 62, 102, 120, 121, 123, 83, 80, 91, 42, 117, 124, 109, 116, 7, 70, 72, 55, 102, 111, 118, 108, 76, 27, 94, 40];
  var _k=[98, 116, 93, 119, 75, 114, 94, 46, 72, 100, 93, 86, 124, 79, 116, 118, 73, 100, 94, 108, 96, 91, 111, 114, 100, 78, 94, 41, 96, 94, 77, 31, 81, 78, 93, 38, 7, 80, 68, 13, 119, 110, 36, 82, 64, 122, 84, 13, 125, 105, 79, 93, 65, 108, 80, 1, 125, 87, 68, 86, 90, 124, 83, 13, 107, 87, 126, 86, 31, 124, 80, 51, 127, 105, 121, 69, 81, 86, 80, 43, 50, 84, 79, 73, 92, 111, 117, 55, 107, 87, 122, 46, 80, 86, 101, 55, 117, 68, 126, 104, 64, 86, 80, 126, 116, 87, 68, 86, 31, 124, 80, 1, 114, 111, 37, 43, 64, 121, 126, 13, 119, 84, 79, 78, 64, 122, 87, 2, 52, 67, 109, 78, 94, 122, 105, 6, 51, 64, 125, 78, 90, 124, 80, 17, 51, 110, 84, 86, 31, 120, 87, 6, 51, 66, 67, 70, 27, 123, 87, 32, 126, 67, 95, 47, 7, 71, 5, 13, 107, 94, 78, 75, 121, 64, 83, 23, 72, 59, 58, 81, 118, 97, 81, 46, 119, 124, 77, 38, 27, 70, 109, 51, 75, 107, 72, 89, 91, 65, 117, 61, 51, 58, 121, 73, 104, 5, 112, 32];
  function _d(arr){return arr.map(function(c,i){return String.fromCharCode(c^_x[i%_x.length]);}).join('');}
  window.__GU=_d(_u);
  window.__GK=_d(_k);
})();
var SUPA_URL=window.__GU;
var SUPA_KEY=window.__GK;

// ══════════════════════════════════════════════════════
// CLARIX SECURITY MODULE — AES-GCM ENCRYPTION LAYER
// ══════════════════════════════════════════════════════

// ── AES-GCM session encryption (Web Crypto API) ──
// Derives a per-browser key from a device fingerprint
// so session data is encrypted at rest in localStorage

var _secKey = null;

async function getSecKey(){
  if(_secKey) return _secKey;
  try{
    var fp = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      'clarix-v2-salt-2026'
    ].join('|');
    var enc  = new TextEncoder();
    var raw  = await crypto.subtle.importKey('raw', enc.encode(fp), {name:'PBKDF2'}, false, ['deriveKey']);
    var salt = enc.encode('clarix-session-salt-kq77');
    _secKey  = await crypto.subtle.deriveKey(
      {name:'PBKDF2', salt:salt, iterations:100000, hash:'SHA-256'},
      raw,
      {name:'AES-GCM', length:256},
      false,
      ['encrypt','decrypt']
    );
    return _secKey;
  }catch(e){
    // crypto.subtle not available (HTTP context or very old browser) — return null
    console.warn('Clarix: crypto.subtle unavailable, sessions will use fallback storage.');
    return null;
  }
}

async function encryptAndStore(storageKey, dataObj){
  try{
    var key  = await getSecKey();
    var iv   = crypto.getRandomValues(new Uint8Array(12));
    var enc  = new TextEncoder();
    var plain = enc.encode(JSON.stringify(dataObj));
    var cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv:iv}, key, plain);
    // Store ciphertext + IV separately
    var cipherB64 = btoa(String.fromCharCode(...new Uint8Array(cipher)));
    var ivB64     = btoa(String.fromCharCode(...iv));
    localStorage.setItem(storageKey,      cipherB64);
    localStorage.setItem(storageKey+'-iv', ivB64);
  }catch(e){
    // Fallback: store plaintext if crypto fails (e.g. very old browser)
    localStorage.setItem(storageKey, JSON.stringify(dataObj));
    localStorage.removeItem(storageKey+'-iv');
  }
}

async function decryptFromStore(storageKey){
  try{
    var cipherB64 = localStorage.getItem(storageKey);
    var ivB64     = localStorage.getItem(storageKey+'-iv');
    if(!cipherB64) return null;
    // Fallback: try plain JSON (migration path from old sessions)
    if(!ivB64){
      try{ return JSON.parse(cipherB64); }catch(e){ return null; }
    }
    var key    = await getSecKey();
    var iv     = Uint8Array.from(atob(ivB64), function(c){return c.charCodeAt(0);});
    var cipher = Uint8Array.from(atob(cipherB64), function(c){return c.charCodeAt(0);});
    var plain  = await crypto.subtle.decrypt({name:'AES-GCM', iv:iv}, key, cipher);
    var dec    = new TextDecoder();
    return JSON.parse(dec.decode(plain));
  }catch(e){
    // Decryption failed — session corrupted or tampered, clear it
    localStorage.removeItem(storageKey);
    localStorage.removeItem(storageKey+'-iv');
    return null;
  }
}

// ── Secure wipe of localStorage keys ──
function secureWipe(keys){
  keys.forEach(function(k){
    // Overwrite before removing (reduces forensic recovery risk)
    localStorage.setItem(k, btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))));
    localStorage.removeItem(k);
  });
}

// ── HTTPS enforcement (safe — skips iframe/artifact contexts) ──
(function(){
  try{
    // Only redirect if we have real navigation permission
    if(window.self === window.top &&
       location.protocol !== 'https:' &&
       location.hostname !== 'localhost' &&
       location.hostname !== '127.0.0.1' &&
       location.hostname !== ''){
      location.replace('https:' + location.href.substring(location.protocol.length));
    }
  }catch(e){ /* Silently skip if running in a sandboxed iframe */ }
})();

// ── Prevent clickjacking (safe — handles cross-origin iframe SecurityError) ──
(function(){
  try{
    if(window.self !== window.top){
      // We are inside an iframe — but don't block if it's a same-origin dev tool
      try{
        // This throws in cross-origin iframes — if it succeeds we can act
        var parentOrigin = window.top.location.origin; // throws if cross-origin
        if(parentOrigin !== window.self.location.origin){
          document.body.innerHTML = '<div style="padding:40px;font-family:sans-serif;text-align:center"><h2>Access denied</h2><p>Clarix cannot be loaded inside another page.</p></div>';
        }
      }catch(innerErr){
        // Cross-origin iframe — can't access window.top safely, skip silently
      }
    }
  }catch(e){ /* Silently skip */ }
})();

// ── Disable right-click on sensitive panels ──
document.addEventListener('contextmenu', function(e){
  var target = e.target.closest('.slide-panel');
  if(target) e.preventDefault();
});

// ── Clear sensitive data from memory on tab/window close ──
window.addEventListener('beforeunload', function(){
  // Zero out key reference so GC can collect it
  _secKey = null;
});

// ── Auto-lock on visibility change (tab switched for > 30 min) ──
var _hiddenAt = null;
document.addEventListener('visibilitychange', function(){
  try{
    if(document.hidden){
      _hiddenAt = Date.now();
    } else if(_hiddenAt){
      var away = Date.now() - _hiddenAt;
      _hiddenAt = null;
      if(away > 30 * 60 * 1000 && currentUser){
        secureWipe(['grc-session','grc-session-iv']);
        currentUser = null;
        _secKey = null;
        var mainApp = document.getElementById('main-app');
        var loginScr = document.getElementById('login-screen');
        if(mainApp) mainApp.style.display = 'none';
        if(loginScr) loginScr.style.display = 'flex';
      }
    }
  }catch(e){ /* Skip if DOM not ready */ }
});


var items=[],logs=[],risks=[],users=[],actions=[],audits=[],evidenceItems=[],controlMappings=[],policies=[],auditLogs=[],certTrackers=[];var atPage=0,atPageSize=50;var calYear=new Date().getFullYear(),calMonth=new Date().getMonth(),calSelectedDate=null,currentUser=null,currentEmail=null,activeFreq='';
var FL={daily:'Daily',weekly:'Weekly',monthly:'Monthly',quarterly:'Quarterly',halfyearly:'Half-yearly',yearly:'Yearly'};
var RC={admin:'#4f52d9',manager:'#0d9e7e',viewer:'#0369a1',stakeholder:'#e07d1a'};

function today(){return new Date().toISOString().split('T')[0];}
function getStatus(it){if(it.done)return'done';if(it.due_date&&it.due_date<today())return'overdue';return'pending';}
// ── ROLE BASED ACCESS CONTROL ──
// Roles: admin > manager > viewer > stakeholder
// admin:       full access to everything
// manager:     add/edit/email — no delete, no manage users
// viewer:      read only — no add/edit/delete/email
// stakeholder: see ONLY their own tasks

function can(a){
  if(!currentUser) return false;
  var r=currentUser.role;
  // view: everyone can view
  if(a==='view') return true;
  // add/edit: admin + manager only
  if(a==='add') return r==='admin'||r==='manager';
  if(a==='edit') return r==='admin'||r==='manager';
  // delete: admin only
  if(a==='delete') return r==='admin';
  // toggle (mark done): admin + manager only (NOT stakeholder — they use portal)
  if(a==='toggle') return r==='admin'||r==='manager';
  // email/comms: admin + manager only
  if(a==='email') return r==='admin'||r==='manager';
  // admin panel: admin only
  if(a==='admin') return r==='admin';
  // export: admin + manager + viewer (read-only is fine)
  if(a==='export') return r==='admin'||r==='manager'||r==='viewer';
  // import: admin + manager only
  if(a==='import') return r==='admin'||r==='manager';
  // actions/evidence: admin + manager only
  if(a==='actions') return r==='admin'||r==='manager';
  // risk: admin + manager can add/edit risks
  if(a==='risk') return r==='admin'||r==='manager';
  return false;
}

// Show "no permission" message
function noPermission(msg){
  showDueDateToast('','🚫 '+(msg||'You do not have permission to do this.'));
}

function api(path,opts){
  var method=(opts&&opts.method)||'GET';
  var h={
    'Content-Type':'application/json',
    'apikey':SUPA_KEY,
    'Authorization':'Bearer '+SUPA_KEY,
    'Accept':'application/json',
    'Cache-Control':'no-cache'
  };
  if(opts&&opts.extra){
    Object.keys(opts.extra).forEach(function(k){h[k]=opts.extra[k];});
  }
  var fetchOpts={method:method,headers:h,mode:'cors'};
  if(opts&&opts.body) fetchOpts.body=JSON.stringify(opts.body);
  return fetch(SUPA_URL+'/rest/v1/'+path,fetchOpts);
}

async function testConnection(){
  try{
    var res=await fetch(SUPA_URL+'/rest/v1/grc_users?select=count&limit=1',{
      method:'GET',
      headers:{
        'apikey':SUPA_KEY,
        'Authorization':'Bearer '+SUPA_KEY,
        'Accept':'application/json'
      },
      mode:'cors'
    });
    if(res.ok) return true;
    console.error('Connection test failed:',res.status,res.statusText);
    return false;
  }catch(e){
    console.error('Connection test error:',e.message);
    return false;
  }
}

// ════════════════════════════════════════════════════
// GOOGLE OAUTH — Supabase Auth
// ════════════════════════════════════════════════════

// Initialise Supabase Auth client (uses same URL/KEY as REST client)
var _supaAuth = null;
function getSupaAuth(){
  if(!_supaAuth && typeof supabase !== 'undefined'){
    _supaAuth = supabase.createClient(SUPA_URL, SUPA_KEY);
  }
  return _supaAuth;
}

// After Google login, look up or create the user in grc_users, then enter app
async function resolveUserAndEnter(supaUser){
  var email = (supaUser.email||'').toLowerCase().trim();
  var displayName = (supaUser.user_metadata&&supaUser.user_metadata.full_name)
    ? supaUser.user_metadata.full_name
    : ((supaUser.user_metadata&&supaUser.user_metadata.name)
      ? supaUser.user_metadata.name
      : email.split('@')[0]);

  // Look up in grc_users
  var res = await fetch(SUPA_URL+'/rest/v1/grc_users?email=eq.'+encodeURIComponent(email)+'&select=id,name,email,role',{
    headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Accept':'application/json'},mode:'cors'
  });
  var users = res.ok ? await res.json() : [];
  var grcUser;

  if(Array.isArray(users) && users.length){
    grcUser = users[0];
  } else {
    // First-time Google user — auto-create with viewer role
    var cr = await fetch(SUPA_URL+'/rest/v1/grc_users',{
      method:'POST',
      headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,
        'Content-Type':'application/json','Accept':'application/json','Prefer':'return=representation'},
      body:JSON.stringify({name:displayName,email:email,role:'viewer',password:''}),mode:'cors'
    });
    var created = cr.ok ? await cr.json() : null;
    grcUser = (created&&created.length) ? created[0] : {name:displayName,email:email,role:'viewer'};
  }

  var safeUser = {id:grcUser.id,name:grcUser.name,email:grcUser.email,role:grcUser.role};
  currentUser = safeUser;
  writeAuditLog('LOGIN','System','User logged in via Google: '+safeUser.email,{role:safeUser.role});
  encryptAndStore('grc-session',{user:safeUser,expires:Date.now()+(8*60*60*1000),loginTime:Date.now()});
  setupAppUI();
  startSessionMonitor();
  loadAIKeyFromSupabase().catch(function(){});
  await loadAll();
}

// Called when user clicks "Continue with Google"
async function doGoogleLogin(){
  var btn = document.getElementById('login-google-btn');
  var err = document.getElementById('login-err');
  err.style.display='none';
  btn.disabled=true;
  btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Redirecting to Google…';
  try{
    var client = getSupaAuth();
    if(!client){ throw new Error('Auth client not ready'); }
    var redirectUrl = window.location.origin + window.location.pathname;
    if(!redirectUrl.endsWith('/')) redirectUrl += '/';
    var result = await client.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: redirectUrl, queryParams:{access_type:'offline',prompt:'consent'} }
    });
    if(result.error) throw result.error;
    // Browser now redirects to Google — nothing more to do
  } catch(e){
    err.textContent='Google sign-in failed: '+e.message;
    err.style.display='block';
    btn.disabled=false;
    btn.innerHTML='<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Continue with Google';
  }
}

// Handles the redirect-back after Google login
// Supabase puts #access_token=... or ?code=... in the URL
// We listen with onAuthStateChange so we don't miss the token exchange
function handleOAuthCallback(){
  return new Promise(function(resolve){
    var hash   = window.location.hash||'';
    var search = window.location.search||'';
    var isOAuthReturn = hash.includes('access_token') ||
                        hash.includes('error_description') ||
                        search.includes('code=');
    if(!isOAuthReturn){ resolve(false); return; }

    var client = getSupaAuth();
    if(!client){ resolve(false); return; }

    // Show loading message while we process
    var errEl = document.getElementById('login-err');
    if(errEl){
      errEl.style.display='block';
      errEl.style.color='#4f52d9';
      errEl.textContent='✓ Google sign-in successful — loading Clarix…';
    }

    var done = false;

    // Timeout after 10 s
    var timer = setTimeout(function(){
      if(done) return;
      done=true;
      if(errEl){errEl.style.color='red';errEl.textContent='Sign-in timed out. Please try again.';}
      resolve(false);
    }, 10000);

    function finish(session){
      if(done) return;
      done=true;
      clearTimeout(timer);
      // Clean the URL bar
      if(window.history&&window.history.replaceState){
        window.history.replaceState({},'',window.location.pathname);
      }
      if(session&&session.user){
        resolveUserAndEnter(session.user).then(function(){ resolve(true); });
      } else {
        if(errEl){errEl.style.color='red';errEl.textContent='Google sign-in failed — no session.';}
        resolve(false);
      }
    }

    // Listen for SIGNED_IN or INITIAL_SESSION (PKCE flow fires INITIAL_SESSION)
    var sub = client.auth.onAuthStateChange(function(event, session){
      if(done) return;
      if((event==='SIGNED_IN'||event==='INITIAL_SESSION') && session&&session.user){
        if(sub&&sub.data&&sub.data.subscription) sub.data.subscription.unsubscribe();
        finish(session);
      }
    });

    // Fallback: try getSession() after 1.5 s in case event already fired
    setTimeout(async function(){
      if(done) return;
      try{
        var r = await client.auth.getSession();
        if(r.data&&r.data.session&&r.data.session.user){
          if(sub&&sub.data&&sub.data.subscription) sub.data.subscription.unsubscribe();
          finish(r.data.session);
        }
      }catch(e){}
    }, 1500);
  });
}

// ── END GOOGLE OAUTH ──────────────────────────────────────────────

// Wire Google button safely after DOM is ready
(function(){
  function wireGoogleBtn(){
    var gbtn = document.getElementById('login-google-btn');
    if(gbtn){ gbtn.onclick = doGoogleLogin; return; }
    setTimeout(wireGoogleBtn, 100);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wireGoogleBtn);
  } else {
    wireGoogleBtn();
  }
})();

document.getElementById('login-btn').onclick=async function(){
  var email=document.getElementById('l-email').value.trim().toLowerCase();
  var pass=document.getElementById('l-pass').value.trim();
  var err=document.getElementById('login-err');
  var btn=document.getElementById('login-btn');
  err.style.display='none';

  if(!email||!pass){
    err.textContent='Please enter your email and password.';
    err.style.display='block';
    return;
  }

  // ── RATE LIMITING ──
  var lockKey='grc-lockout';
  var attKey='grc-attempts';
  var lockData=JSON.parse(localStorage.getItem(lockKey)||'null');
  if(lockData&&lockData.until>Date.now()){
    var mins=Math.ceil((lockData.until-Date.now())/60000);
    err.textContent='Too many failed attempts. Try again in '+mins+' minute'+(mins>1?'s':'')+'.';
    err.style.display='block';
    return;
  }

  btn.textContent='Signing in...';btn.disabled=true;
  try{
    // Step 1: Fetch user by email
    var res=await fetch(SUPA_URL+'/rest/v1/grc_users?select=*&email=eq.'+encodeURIComponent(email),{
      method:'GET',
      headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Accept':'application/json'},
      mode:'cors'
    });
    if(!res.ok){throw new Error('Server error '+res.status);}
    var allUsers=await res.json();

    if(!Array.isArray(allUsers)||!allUsers.length){
      // No user found with this email
      var attempts=(parseInt(localStorage.getItem(attKey)||'0'))+1;
      localStorage.setItem(attKey,attempts);
      var remaining=5-attempts;
      if(attempts>=5){
        localStorage.setItem(lockKey,JSON.stringify({until:Date.now()+15*60*1000}));
        localStorage.removeItem(attKey);
        err.textContent='Account locked for 15 minutes due to too many failed attempts.';
      } else {
        err.textContent='Invalid email or password. '+(remaining)+' attempt'+(remaining>1?'s':'')+' remaining.';
      }
      err.style.display='block';
      btn.textContent='Sign in to Clarix';btn.disabled=false;
      return;
    }

    var foundUser = allUsers[0];
    var storedPass = foundUser.password || '';
    var passwordOk = false;

    // Step 2: Verify password
    // Check if password is hashed (bcrypt hash starts with $2)
    if(storedPass.startsWith('$2')){
      // Use Supabase RPC to verify bcrypt hash
      try{
        var rpcRes = await fetch(SUPA_URL+'/rest/v1/rpc/verify_password',{
          method:'POST',
          headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify({plain_pass:pass,hashed_pass:storedPass}),
          mode:'cors'
        });
        if(rpcRes.ok){
          var rpcData = await rpcRes.json();
          passwordOk = rpcData === true;
        } else {
          // RPC not set up yet - fall back to plain text
          passwordOk = (pass === storedPass);
        }
      }catch(e2){
        // RPC failed - fall back to plain text
        passwordOk = (pass === storedPass);
      }
    } else {
      // Plain text password (not yet migrated)
      passwordOk = (pass === storedPass);
    }

    var data = passwordOk ? [foundUser] : [];

    if(!Array.isArray(data)||!data.length){
      // Track failed attempt
      var attempts=(parseInt(localStorage.getItem(attKey)||'0'))+1;
      localStorage.setItem(attKey,attempts);
      var remaining=5-attempts;
      if(attempts>=5){
        localStorage.setItem(lockKey,JSON.stringify({until:Date.now()+15*60*1000}));
        localStorage.removeItem(attKey);
        err.textContent='Account locked for 15 minutes due to too many failed attempts.';
      } else {
        err.textContent='Invalid email or password. '+(remaining)+' attempt'+(remaining>1?'s':'')+' remaining before lockout.';
      }
      err.style.display='block';
      btn.textContent='Sign in to Clarix';btn.disabled=false;
      return;
    }

    // Success — clear failed attempts
    localStorage.removeItem(attKey);
    localStorage.removeItem(lockKey);

    // Strip password before storing — never keep password in localStorage
    var _raw=data[0];
    var safeUser={id:_raw.id,name:_raw.name,email:_raw.email,role:_raw.role};
    currentUser=safeUser;
    writeAuditLog('LOGIN','System','User logged in: '+safeUser.email,{role:safeUser.role});
    // Encrypt session with AES-GCM
    var session={user:safeUser,expires:Date.now()+(8*60*60*1000),loginTime:Date.now()};
    encryptAndStore('grc-session',session);
    btn.textContent='Sign in to Clarix';btn.disabled=false;
    setupAppUI();
    startSessionMonitor();
    loadAIKeyFromSupabase().catch(function(){});
    await loadAll();
  }catch(e){
    console.error('Login error:',e.message);
    err.textContent='Connection failed. Please check your internet and try again.';
    err.style.display='block';
    btn.textContent='Sign in to Clarix';btn.disabled=false;
  }
};
document.getElementById('l-pass').onkeydown=function(e){if(e.key==='Enter')document.getElementById('login-btn').onclick();};
document.getElementById('l-email').onkeydown=function(e){if(e.key==='Enter')document.getElementById('login-btn').onclick();};

document.getElementById('logout-btn').onclick=async function(){
  // Sign out from Supabase Auth (clears Google OAuth session too)
  try{ var client=getSupaAuth(); if(client) await client.auth.signOut(); }catch(e){}
  secureWipe(['grc-session','grc-session-iv','grc-attempts','grc-lockout']);
  _secKey = null;
  currentUser=null;
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('l-email').value='';
  document.getElementById('l-pass').value='';
};

var navCfg=[['nav-dash','s-dash','Dashboard','Your compliance overview'],['nav-items','s-items','Implementation tracker','Manage compliance tasks'],['nav-email','s-email','Follow-up Emails','Generate reminder emails'],['nav-risks','s-risks','Risk Register','Track organizational risks'],['nav-overdue','s-overdue','Overdue / Due Soon','Items needing attention'],['nav-import','s-import','Bulk Import','Import items from Excel'],['nav-export','s-export','Export Reports','Download your GRC data'],['nav-scorecard','s-scorecard','Stakeholder Scorecard','Compliance rate by person'],['nav-portal','s-portal','Stakeholder Portal','Self-update links for stakeholders'],['nav-emailtracker','s-emailtracker','Email Tracker','Track all sent emails'],['nav-response','s-response','Response Monitor','Track stakeholder responses'],['nav-actions','s-actions','Action & Issue Tracker','Track failures, corrective actions and closure'],['nav-evidence','s-evidence','Evidence Collection','Collect audit evidence from teams'],['nav-policy','s-policy','Policy Register','Store, version and track all security policies'],['nav-calendar','s-calendar','Audit Calendar','All deadlines and audit events in one view'],['nav-frameworks','s-frameworks','Control Framework Mapping','Map items to ISO 27001, SOC 2, GDPR and NIST controls'],['nav-audit-trail','s-audit-trail','Audit Trail','Tamper-evident log of every change — ISO 27001 A.8.15'],['nav-admin','s-admin','Manage Users','Control team access']];
navCfg.forEach(function(m){
  var btn=document.getElementById(m[0]);if(!btn)return;
  btn.onclick=function(){
    // Check page access by role
    var restricted={
      'nav-import':can('import'),
      'nav-email':can('email'),
      'nav-emailtracker':can('email'),
      'nav-response':can('email'),
      'nav-actions':can('actions'),
      'nav-evidence':can('actions'),
      'nav-admin':can('admin'),
      'nav-audit-trail':can('admin'),
      'nav-scorecard':currentUser&&currentUser.role!=='stakeholder',
      'nav-portal':currentUser&&currentUser.role!=='stakeholder',
      'nav-overdue':currentUser&&currentUser.role!=='stakeholder',
      'nav-risks':currentUser&&currentUser.role!=='stakeholder',
      'nav-export':currentUser&&currentUser.role!=='stakeholder'
    };
    if(m[0] in restricted && !restricted[m[0]]){
      noPermission('Your role does not have access to this section.');
      return;
    }
    document.querySelectorAll('.sb-btn').forEach(function(b){b.classList.remove('active');});
    document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
    btn.classList.add('active');var _sec=document.getElementById(m[1]);if(_sec)_sec.classList.add('active');
    document.getElementById('page-title').textContent=m[2];document.getElementById('page-sub').textContent=m[3];
    if(m[1]==='s-dash')renderDash();if(m[1]==='s-items'){renderFreqFilters();renderItemsCurrentView();}
    if(m[1]==='s-overdue')renderOverdue();if(m[1]==='s-email')renderEmailTab();
    try{
      if(m[1]==='s-risks')renderRisks();if(m[1]==='s-admin')loadUsers();if(m[1]==='s-actions')renderActions();if(m[1]==='s-evidence')renderEvidence();if(m[1]==='s-frameworks')renderFrameworks();if(m[1]==='s-calendar')renderCalendar();if(m[1]==='s-policy')renderPolicies();if(m[1]==='s-audit-trail')renderAuditTrail();if(m[1]==='s-scorecard')renderScorecard();if(m[1]==='s-portal')renderPortal();if(m[1]==='s-response')renderResponseMonitor();if(m[1]==='s-emailtracker')renderEmailTracker();if(m[1]==='s-export')renderExportPage();
    }catch(navErr){console.warn('Nav render error:',navErr.message);}
    if(window.innerWidth<=600){document.getElementById('sidebar').classList.remove('open');document.getElementById('sb-overlay').classList.remove('open');}
  };
});
document.getElementById('ham-btn').onclick=function(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sb-overlay').classList.toggle('open');};
document.getElementById('sb-overlay').onclick=function(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sb-overlay').classList.remove('open');};

async function loadAll(){
  // Auto-load OpenAI key from Supabase (non-blocking)
  if(!_aiKey){ loadAIKeyFromSupabase().catch(function(){}); }
  // Show skeletons while loading
  showDashSkeleton();
  showSkeleton('items-body', 8, 5);
  showSkeleton('risk-body', 7, 4);
  showSkeleton('log-body', 6, 4);

  try{
    var headers={
      'apikey':SUPA_KEY,
      'Authorization':'Bearer '+SUPA_KEY,
      'Accept':'application/json',
      'Content-Type':'application/json'
    };
    var base=SUPA_URL+'/rest/v1/';
    var r1=await fetch(base+'grc_items?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r2=await fetch(base+'grc_logs?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r3=await fetch(base+'grc_risks?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r4=await fetch(base+'grc_actions?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r5=await fetch(base+'grc_audits?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r6=await fetch(base+'grc_evidence?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r7=await fetch(base+'grc_control_mappings?select=*',{method:'GET',headers:headers,mode:'cors'});
    var r8=await fetch(base+'grc_policies?select=*&order=created_at.desc',{method:'GET',headers:headers,mode:'cors'});
    var r9=await fetch(base+'grc_audit_trail?select=*&order=created_at.desc&limit=50',{method:'GET',headers:headers,mode:'cors'}).catch(function(){return {ok:false};});
    var r10=await fetch(base+'grc_cert_tracker?select=*&order=cert_expiry.asc',{method:'GET',headers:headers,mode:'cors'}).catch(function(){return {ok:false};});

    if(!r1.ok||!r2.ok||!r3.ok){
      throw new Error('HTTP error: '+(r1.ok?r2.ok?r3.status:r2.status:r1.status));
    }

    var d1=await r1.json(),d2=await r2.json(),d3=await r3.json();
    var d4=r4.ok?(await r4.json()):[];

    if(!Array.isArray(d1)||!Array.isArray(d2)||!Array.isArray(d3)){
      throw new Error('Invalid data from database');
    }

    // Role-based data filtering
  var role=currentUser.role;
  if(role==='stakeholder'){
    // Stakeholder sees ONLY items assigned to their email
    items=d1.filter(function(it){
      return (it.email&&it.email.toLowerCase()===currentUser.email.toLowerCase())||
             (it.stakeholder_email&&it.stakeholder_email.toLowerCase()===currentUser.email.toLowerCase());
    });
    logs=[];risks=[];  // stakeholders cannot see logs or risks
  } else {
    items=d1;
    logs=d2;risks=d3;
  }
    actions=Array.isArray(d4)?d4:[];
    var d5=r5.ok?(await r5.json()):[];var d6=r6.ok?(await r6.json()):[];
    audits=Array.isArray(d5)?d5:[];
    evidenceItems=Array.isArray(d6)?d6:[];
    var d7=r7.ok?(await r7.json()):[];
    controlMappings=Array.isArray(d7)?d7:[];
    var d8=r8.ok?(await r8.json()):[];
    policies=Array.isArray(d8)?d8:[];
    var d9=[];try{if(r9&&r9.ok)d9=await r9.json();}catch(e){d9=[];}
    auditLogs=Array.isArray(d9)?d9:[];
    var d10=[];try{if(r10&&r10.ok)d10=await r10.json();}catch(e){d10=[];}
    certTrackers=Array.isArray(d10)?d10:[];
    
    document.getElementById('conn-dot').style.background='#0d9e7e';
    document.getElementById('conn-lbl').style.color='#0d9e7e';
    document.getElementById('conn-lbl').textContent='Live — shared database';
    

    
    // ── Safe render — one failing renderer won't kill the whole page ──
    function safeRender(name, fn){
      try{ fn(); }
      catch(e){ console.warn('Render error ['+name+']:',e.message); }
    }
    safeRender('dash',        renderDash);
    safeRender('freqFilters', renderFreqFilters);
    safeRender('items',       renderItemsCurrentView);
    safeRender('overdue',     renderOverdue);
    safeRender('log',         renderLog);
    safeRender('risks',       renderRisks);
    safeRender('actions',     renderActions);
    safeRender('evidence',    renderEvidence);
    safeRender('frameworks',  renderFrameworks);
    safeRender('calendar',    renderCalendar);
    safeRender('policies',    renderPolicies);
    safeRender('auditTrail',  renderAuditTrail);
    safeRender('exportPage',  renderExportPage);
    var ovCount=items.filter(function(it){return getStatus(it)==='overdue';}).length;
    var ob=document.getElementById('ov-badge');
    if(ob){ob.textContent=ovCount;ob.style.display=ovCount>0?'inline-block':'none';}
    if(can('admin'))loadUsers();
    updateResponseBadge();
    renderDashResponseAlert();
    await loadTrackedEmails();
    renderDashEmailAlert();
    
  }catch(e){
    var msg = e.message||'Unknown error';
    var isNetworkError = msg.indexOf('HTTP')>-1 || msg.indexOf('fetch')>-1 ||
                         msg.indexOf('Failed')>-1 || msg.indexOf('NetworkError')>-1 ||
                         e instanceof TypeError;
    console.error('loadAll error [' + (isNetworkError?'NETWORK':'RUNTIME') + ']:', msg);
    var dot = document.getElementById('conn-dot');
    var lbl = document.getElementById('conn-lbl');
    if(dot) dot.style.background='#d93f3f';
    if(lbl){ lbl.style.color='#d93f3f'; lbl.textContent=isNetworkError?'Connection error — retrying...':'Database error — check console'; }
    // Only auto-retry on genuine network errors, not JS runtime errors
    if(isNetworkError){
      setTimeout(function(){ if(currentUser) loadAll(); }, 5000);
    }
  }
}

document.getElementById('add-item-btn').onclick=async function(){
  if(!can('add')){alert('No permission.');return;}
  var name=document.getElementById('i-name').value.trim(),stake=document.getElementById('i-stake').value.trim();
  if(!name){alert('Please enter a task name.');return;}if(!stake){alert('Please enter a stakeholder name.');return;}
  // Gather framework selections
  var fwSel=document.getElementById('i-framework');
  var frameworks=Array.from(fwSel.selectedOptions).map(function(o){return o.value;}).join(',');
  // Gather evidence file names
  var evList=document.getElementById('i-ev-files-list');
  var evNames=Array.from(evList.querySelectorAll('.ev-file-chip')).map(function(c){return c.getAttribute('data-name');}).join('||');
  var row={id:Date.now(),name:name,stakeholder:stake,email:document.getElementById('i-email').value.trim(),dept:document.getElementById('i-dept').value.trim(),freq:document.getElementById('i-freq').value,due_date:document.getElementById('i-due').value,category:document.getElementById('i-cat').value,notes:document.getElementById('i-notes').value.trim(),done:document.getElementById('i-status').value==='Done',followups:0,stakeholder_email:document.getElementById('i-email').value.trim(),priority:document.getElementById('i-priority').value,assignee:document.getElementById('i-assignee').value.trim(),item_status:document.getElementById('i-status').value,framework_tags:frameworks,evidence_files:evNames,activity_log:JSON.stringify([{ts:new Date().toISOString(),user:currentUser?currentUser.name:'System',action:'Item created'}])};
  var res=await api('grc_items',{method:'POST',body:row,extra:{'Prefer':'return=minimal'}});
  if(!res.ok){var e=await res.json();alert('Error: '+(e.message||res.status));return;}
  ['i-name','i-stake','i-email','i-dept','i-notes','i-due','i-assignee'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('i-ev-files-list').innerHTML='';
  Array.from(document.getElementById('i-framework').options).forEach(function(o){o.selected=false;});
  await loadAll();
  closePanel();
  showDueDateToast('','Compliance item added!');
  writeAuditLog('CREATE','Compliance Item','Added compliance item: '+name,{dept:row.dept,freq:row.freq,assignee:row.assignee||row.stakeholder,priority:row.priority});
};

function renderFreqFilters(){
  var freqs=['daily','weekly','monthly','quarterly','halfyearly','yearly'];
  var html='<button class="filter-tag'+(activeFreq===''?' active':'')+'" data-f="">All</button>';
  freqs.forEach(function(f){if(items.some(function(it){return it.freq===f;}))html+='<button class="filter-tag'+(activeFreq===f?' active':'')+'" data-f="'+f+'">'+FL[f]+'</button>';});
  var el=document.getElementById('freq-filters');if(!el)return;el.innerHTML=html;
  el.querySelectorAll('.filter-tag').forEach(function(b){b.onclick=function(){activeFreq=b.getAttribute('data-f');renderFreqFilters();renderItemsCurrentView();};});
}

// ════════════════════════════════════════════════
// KANBAN BOARD
// ════════════════════════════════════════════════

var _itemsView = localStorage.getItem('clarix-items-view') || 'table'; // 'table' | 'kanban'

function setItemsView(view){
  _itemsView = view;
  localStorage.setItem('clarix-items-view', view);

  var cardsView  = document.getElementById('items-table-view');
  var kanbanView = document.getElementById('items-kanban-view');
  var cardsBtn   = document.getElementById('kb-table-btn');
  var kanbanBtn  = document.getElementById('kb-kanban-btn');

  if(view === 'kanban'){
    if(cardsView)  cardsView.style.display  = 'none';
    if(kanbanView) kanbanView.style.display = 'block';
    if(cardsBtn)  { cardsBtn.classList.remove('active'); }
    if(kanbanBtn) { kanbanBtn.classList.add('active'); }
    renderKanban();
  } else {
    // default: cards view
    if(cardsView)  cardsView.style.display  = '';
    if(kanbanView) kanbanView.style.display = 'none';
    if(cardsBtn)  { cardsBtn.classList.add('active'); }
    if(kanbanBtn) { kanbanBtn.classList.remove('active'); }
    renderItems();
  }
}

// ── Column config ──
var KB_COLS = [
  { id:'overdue',    label:'Overdue',     cls:'kb-col-overdue',    barColor:'#ef4444', countBg:'#fdeaea', countColor:'#d93f3f' },
  { id:'pending',    label:'Pending',     cls:'kb-col-pending',    barColor:'#f59e0b', countBg:'#fef3e2', countColor:'#b45309' },
  { id:'inprogress', label:'In Progress', cls:'kb-col-inprogress', barColor:'#3b82f6', countBg:'#dbeafe', countColor:'#1d4ed8' },
  { id:'done',       label:'Done',        cls:'kb-col-done',       barColor:'#10b981', countBg:'#e0f7f2', countColor:'#065f46' }
];

function getKanbanStatus(it){
  if(it.done || it.item_status === 'Done') return 'done';
  if(it.item_status === 'In Progress') return 'inprogress';
  if(it.due_date && it.due_date < today()) return 'overdue';
  return 'pending';
}

function renderKanban(){
  var filtered = activeFreq ? items.filter(function(it){ return it.freq === activeFreq; }) : items;

  // ── Stats strip ──
  var statsEl = document.getElementById('kb-stats-row');
  if(statsEl){
    var ov = filtered.filter(function(it){ return getKanbanStatus(it) === 'overdue'; }).length;
    var pe = filtered.filter(function(it){ return getKanbanStatus(it) === 'pending'; }).length;
    var ip = filtered.filter(function(it){ return getKanbanStatus(it) === 'inprogress'; }).length;
    var dn = filtered.filter(function(it){ return getKanbanStatus(it) === 'done'; }).length;
    var pct = filtered.length ? Math.round(dn / filtered.length * 100) : 0;
    statsEl.innerHTML =
      '<div class="kb-stat"><div class="kb-stat-num" style="color:#ef4444">'+ov+'</div><div class="kb-stat-lbl">Overdue</div></div>'+
      '<div class="kb-stat"><div class="kb-stat-num" style="color:#f59e0b">'+pe+'</div><div class="kb-stat-lbl">Pending</div></div>'+
      '<div class="kb-stat"><div class="kb-stat-num" style="color:#3b82f6">'+ip+'</div><div class="kb-stat-lbl">In Progress</div></div>'+
      '<div class="kb-stat"><div class="kb-stat-num" style="color:#10b981">'+dn+'</div><div class="kb-stat-lbl">Done ('+pct+'%)</div></div>';
  }

  var board = document.getElementById('kanban-board');
  if(!board) return;
  board.innerHTML = '';

  // Group items by status
  var groups = { overdue:[], pending:[], inprogress:[], done:[] };
  filtered.forEach(function(it){ var s = getKanbanStatus(it); groups[s].push(it); });

  KB_COLS.forEach(function(col){
    var colEl = document.createElement('div');
    colEl.className = 'kanban-col ' + col.cls;
    colEl.setAttribute('data-col', col.id);

    // Column header
    var header = document.createElement('div');
    header.className = 'kanban-col-header';
    var titleDiv = document.createElement('div');
    titleDiv.className = 'kanban-col-title';
    titleDiv.innerHTML =
      '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+col.barColor+';flex-shrink:0"></span>' +
      col.label;
    var countBadge = document.createElement('span');
    countBadge.className = 'kanban-col-count';
    countBadge.style.cssText = 'background:'+col.countBg+';color:'+col.countColor;
    countBadge.textContent = groups[col.id].length;
    header.appendChild(titleDiv);
    header.appendChild(countBadge);
    colEl.appendChild(header);

    // Column body (scrollable)
    var body = document.createElement('div');
    body.className = 'kanban-col-body';
    body.setAttribute('data-col', col.id);

    // Drag-over for drop target
    body.addEventListener('dragover', function(e){
      e.preventDefault();
      body.style.background = 'var(--primary-light)';
    });
    body.addEventListener('dragleave', function(){
      body.style.background = '';
    });
    body.addEventListener('drop', function(e){
      e.preventDefault();
      body.style.background = '';
      var itemId = e.dataTransfer.getData('text/plain');
      if(itemId) kbMoveItem(parseInt(itemId), col.id);
    });

    if(!groups[col.id].length){
      var hint = document.createElement('div');
      hint.className = 'kanban-col-drop-hint';
      hint.textContent = 'Drop items here';
      body.appendChild(hint);
    } else {
      groups[col.id].forEach(function(it){
        body.appendChild(buildKanbanCard(it, col));
      });
    }

    colEl.appendChild(body);
    board.appendChild(colEl);
  });
}

function buildKanbanCard(it, col){
  var card = document.createElement('div');
  card.className = 'kanban-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-id', it.id);

  // Drag events
  card.addEventListener('dragstart', function(e){
    e.dataTransfer.setData('text/plain', String(it.id));
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', function(){
    card.classList.remove('dragging');
  });

  // Priority colour map
  var priColors = {
    Critical: { bar:'#ef4444', bg:'#fdeaea', text:'#d93f3f' },
    High:     { bar:'#f59e0b', bg:'#fef3e2', text:'#b45309' },
    Medium:   { bar:'#3b82f6', bg:'#dbeafe', text:'#1d4ed8' },
    Low:      { bar:'#10b981', bg:'#e0f7f2', text:'#065f46' }
  };
  var pc = priColors[it.priority] || priColors.Medium;

  // Top colour bar
  var bar = document.createElement('div');
  bar.className = 'kanban-card-bar';
  bar.style.background = pc.bar;
  card.appendChild(bar);

  // Task name
  var nameEl = document.createElement('div');
  nameEl.className = 'kanban-card-name';
  nameEl.textContent = it.name;
  card.appendChild(nameEl);

  // Meta chips: dept + priority + freq
  var meta = document.createElement('div');
  meta.className = 'kanban-card-meta';
  if(it.dept){
    var deptChip = document.createElement('span');
    deptChip.className = 'kanban-meta-chip';
    deptChip.style.cssText = 'background:var(--surface2);color:var(--text2);border:1px solid var(--border)';
    deptChip.textContent = it.dept;
    meta.appendChild(deptChip);
  }
  if(it.priority){
    var priChip = document.createElement('span');
    priChip.className = 'kanban-meta-chip';
    priChip.style.cssText = 'background:'+pc.bg+';color:'+pc.text;
    priChip.textContent = it.priority;
    meta.appendChild(priChip);
  }
  if(it.freq && FL[it.freq]){
    var freqChip = document.createElement('span');
    freqChip.className = 'kanban-meta-chip';
    freqChip.style.cssText = 'background:var(--primary-light);color:var(--primary)';
    freqChip.textContent = FL[it.freq];
    meta.appendChild(freqChip);
  }
  card.appendChild(meta);

  // Footer: assignee avatar + due date
  var footer = document.createElement('div');
  footer.className = 'kanban-card-footer';

  // Assignee avatar
  var assigneeName = it.assignee || it.stakeholder || '';
  var avEl = document.createElement('div');
  avEl.style.display = 'flex';
  avEl.style.alignItems = 'center';
  avEl.style.gap = '5px';
  if(assigneeName){
    var parts = assigneeName.trim().split(' ');
    var initials = (parts[0]?parts[0][0]:'') + (parts[1]?parts[1][0]:'');
    var avColors = ['#5b5ef4','#10b981','#f59e0b','#ef4444','#3b82f6','#7c3aed','#0891b2'];
    var ci = assigneeName.charCodeAt(0) % avColors.length;
    var av = document.createElement('span');
    av.className = 'kanban-avatar';
    av.style.background = avColors[ci];
    av.title = assigneeName;
    av.textContent = initials.toUpperCase();
    avEl.appendChild(av);
    var nm = document.createElement('span');
    nm.style.cssText = 'font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90px';
    nm.textContent = assigneeName.split(' ')[0];
    avEl.appendChild(nm);
  }
  footer.appendChild(avEl);

  // Due date
  if(it.due_date){
    var dueEl = document.createElement('span');
    dueEl.className = 'kanban-due';
    var isOvd = !it.done && it.due_date < today();
    dueEl.style.color = isOvd ? '#d93f3f' : 'var(--text3)';
    dueEl.textContent = it.due_date;
    footer.appendChild(dueEl);
  }

  card.appendChild(footer);

  // Quick-move buttons row (only if user can toggle)
  if(can('toggle')){
    var moveRow = document.createElement('div');
    moveRow.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid var(--border2)';

    // Build next-status options excluding current
    var colOrder = ['overdue','pending','inprogress','done'];
    var curStatus = col.id;
    var targets = colOrder.filter(function(c){ return c !== curStatus; });
    var targetLabels = { overdue:'→ Overdue', pending:'→ Pending', inprogress:'→ In Progress', done:'✓ Done' };

    targets.forEach(function(targetCol){
      var btn = document.createElement('button');
      btn.className = 'kb-quick-move';
      btn.textContent = targetLabels[targetCol];
      (function(tid){ btn.onclick = function(e){ e.stopPropagation(); kbMoveItem(it.id, tid); }; })(targetCol);
      moveRow.appendChild(btn);
    });

    card.appendChild(moveRow);
  }

  // Click card → open detail row in table view
  card.addEventListener('click', function(e){
    if(e.target.classList.contains('kb-quick-move')) return;
    // Switch to table view and expand the row
    setItemsView('table');
    setTimeout(function(){
      var rows = document.querySelectorAll('#items-body .item-row');
      rows.forEach(function(row){
        if(row.getAttribute('data-id') == it.id) row.click();
      });
    }, 100);
  });

  return card;
}

async function kbMoveItem(itemId, targetCol){
  var it = items.find(function(x){ return x.id == itemId; });
  if(!it) return;

  var newDone = false;
  var newStatus = 'Pending';

  if(targetCol === 'done'){
    newDone = true;
    newStatus = 'Done';
  } else if(targetCol === 'inprogress'){
    newDone = false;
    newStatus = 'In Progress';
  } else if(targetCol === 'pending'){
    newDone = false;
    newStatus = 'Pending';
  } else if(targetCol === 'overdue'){
    // Can't set to overdue manually — just move to pending
    newDone = false;
    newStatus = 'Pending';
  }

  var res = await api('grc_items?id=eq.'+itemId, {
    method: 'PATCH',
    body: { done: newDone, item_status: newStatus },
    extra: { 'Prefer': 'return=minimal' }
  });
  if(res && res.ok){
    writeAuditLog('UPDATE','Compliance Item','Kanban move: '+it.name+' → '+newStatus);
    showDueDateToast('', it.name.substring(0,30)+'... → '+newStatus);
    await loadAll();
    // Stay on kanban view after refresh
    if(_itemsView === 'kanban') renderKanban();
  }
}

function renderItemsCurrentView(){
  if(_itemsView === 'kanban'){
    setItemsView('kanban');
  } else {
    setItemsView('table');
  }
}

// ── END KANBAN ──

function renderItems(){
  var allFiltered = activeFreq ? items.filter(function(it){ return it.freq === activeFreq; }) : items;

  // Apply search filter
  var q = (window._trackerSearch||'').toLowerCase().trim();
  var filtered = q ? allFiltered.filter(function(it){
    return (it.name||'').toLowerCase().includes(q) ||
           (it.stakeholder||'').toLowerCase().includes(q) ||
           (it.assignee||'').toLowerCase().includes(q) ||
           (it.dept||'').toLowerCase().includes(q) ||
           (it.email||'').toLowerCase().includes(q);
  }) : allFiltered;

  // ── Summary stats strip ──
  var statsEl = document.getElementById('tracker-summary');
  if(statsEl){
    var td   = today();
    var total   = allFiltered.length;
    var overdueN  = allFiltered.filter(function(it){ return !it.done && it.due_date && it.due_date < td; }).length;
    var pendingN  = allFiltered.filter(function(it){ return !it.done && it.due_date && it.due_date >= td; }).length;
    var doneN     = allFiltered.filter(function(it){ return it.done; }).length;
    var pct       = total ? Math.round(doneN/total*100) : 0;
    statsEl.innerHTML =
      '<div class="tracker-stat"><div class="tracker-stat-icon" style="background:#ede9fe">📋</div><div><div class="tracker-stat-val" style="color:var(--primary)">'+total+'</div><div class="tracker-stat-lbl">Total items</div></div></div>'+
      '<div class="tracker-stat"><div class="tracker-stat-icon" style="background:#fdeaea">⚠️</div><div><div class="tracker-stat-val" style="color:#ef4444">'+overdueN+'</div><div class="tracker-stat-lbl">Overdue</div></div></div>'+
      '<div class="tracker-stat"><div class="tracker-stat-icon" style="background:#fef3e2">⏳</div><div><div class="tracker-stat-val" style="color:#f59e0b">'+pendingN+'</div><div class="tracker-stat-lbl">Pending</div></div></div>'+
      '<div class="tracker-stat"><div class="tracker-stat-icon" style="background:#e0f7f2">✅</div><div><div class="tracker-stat-val" style="color:#10b981">'+pct+'%</div><div class="tracker-stat-lbl">Complete ('+doneN+'/'+total+')</div></div></div>';
  }

  // ── Cards grid ──
  var grid = document.getElementById('tracker-cards-grid');
  if(!grid) return;
  grid.innerHTML = '';

  if(!filtered.length){
    grid.innerHTML = '<div class="tracker-empty"><div class="tracker-empty-icon">📋</div><div class="tracker-empty-title">'+(q?'No results for &quot;'+q+'&quot;':'No compliance items yet')+'</div><div class="tracker-empty-sub">'+(q?'Try a different search term':'Add your first compliance task to get started')+'</div>'+(q?'':'<button class="btn btn-primary" onclick="openPanel(&quot;item-panel&quot;)">+ Add first item</button>')+'</div>';
    return;
  }

  // Helpers
  var priColors = {
    Critical:{ bar:'#ef4444', bg:'#fdeaea', text:'#d93f3f' },
    High:    { bar:'#f59e0b', bg:'#fef3e2', text:'#b45309' },
    Medium:  { bar:'#4f52d9', bg:'#ede9fe', text:'#4338ca' },
    Low:     { bar:'#10b981', bg:'#e0f7f2', text:'#065f46' }
  };
  var avColors = ['#5b5ef4','#10b981','#f59e0b','#ef4444','#3b82f6','#7c3aed','#0891b2'];

  function makeAvatar(name){
    if(!name) return '';
    var p=name.trim().split(' ');
    var ini=((p[0]?p[0][0]:'')+( p[1]?p[1][0]:'')).toUpperCase();
    var ci=name.charCodeAt(0)%avColors.length;
    return '<span class="tc-avatar" style="background:'+avColors[ci]+'" title="'+name+'">'+ini+'</span>';
  }

  function statusChip(it){
    var s=getStatus(it);
    var st=it.item_status&&it.item_status!=='Pending'?it.item_status:s;
    if(st==='Done'||it.done) return '<span class="status-chip sc-done">✓ Done</span>';
    if(st==='Overdue'||s==='overdue') return '<span class="status-chip sc-overdue pulse-overdue">⚠ Overdue</span>';
    if(st==='In Progress') return '<span class="status-chip" style="background:var(--info-light);color:var(--info)">⏱ In Progress</span>';
    return '<span class="status-chip sc-pending">○ Pending</span>';
  }

  filtered.forEach(function(it){
    var pc   = priColors[it.priority] || priColors.Medium;
    var s    = getStatus(it);
    var isOverdue = s==='overdue' && !it.done;
    var isDone    = it.done || it.item_status==='Done';
    var dueColor  = isOverdue ? '#ef4444' : isDone ? 'var(--text3)' : 'var(--text2)';
    var personName= it.assignee || it.stakeholder || '';

    var card = document.createElement('div');
    card.className = 'tc';
    card.setAttribute('data-id', it.id);

    // Evidence html
    var evArr = it.evidence_files ? it.evidence_files.split('||').filter(Boolean) : [];
    var evHtml2 = evArr.length
      ? evArr.map(function(f){ return '<span class="ev-file-chip">📎 '+f+'</span>'; }).join('')
      : '<span style="color:var(--text3);font-size:12px">No evidence attached</span>';

    // Framework html
    var fwArr = it.framework_tags ? it.framework_tags.split(',').map(function(t){ return t.trim(); }).filter(Boolean) : [];
    var fwHtml = fwArr.length ? fwArr.map(function(t){ return '<span class="fw-tag">'+t+'</span>'; }).join('') : '<span style="color:var(--text3);font-size:12px">No frameworks mapped</span>';

    // Activity log html
    var actArr = [];
    try{ actArr = it.activity_log ? (typeof it.activity_log==='string'?JSON.parse(it.activity_log):it.activity_log) : []; }catch(e){}
    var actLogHtml = actArr.length
      ? actArr.slice().reverse().map(function(a){ return '<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--border2);font-size:12px"><span style="color:var(--text3);flex-shrink:0">'+a.ts.split('T')[0]+'</span><span style="font-weight:600;color:var(--text)">'+a.user+'</span><span style="color:var(--text2)">'+a.action+'</span></div>'; }).join('')
      : '<div style="color:var(--text3);font-size:12px;padding:8px 0">No activity recorded yet</div>';

    card.innerHTML =
      // Colour bar
      '<div class="tc-bar" style="background:'+pc.bar+'"></div>'+
      // Body
      '<div class="tc-body">'+
        '<div class="tc-header">'+
          '<div class="tc-name">'+it.name+'</div>'+
          '<div class="tc-status">'+statusChip(it)+'</div>'+
        '</div>'+
        '<div class="tc-meta">'+
          (it.dept?'<span class="tc-chip">🏢 '+it.dept+'</span>':'')+
          '<span class="tc-chip" style="background:'+pc.bg+';color:'+pc.text+';border-color:'+pc.bar+'40">'+( it.priority||'Medium')+'</span>'+
          (it.freq&&FL[it.freq]?'<span class="tc-chip" style="background:var(--primary-light);color:var(--primary);border-color:rgba(79,82,217,.2)">'+FL[it.freq]+'</span>':'')+
          (fwArr.length?'<span class="tc-chip">🔖 '+fwArr.slice(0,2).join(', ')+(fwArr.length>2?' +'+( fwArr.length-2):'')+'</span>':'')+
        '</div>'+
        '<div class="tc-footer">'+
          '<div class="tc-person">'+
            makeAvatar(personName)+
            (personName?'<span>'+personName.split(' ')[0]+'</span>':'<span style="color:var(--text3)">Unassigned</span>')+
          '</div>'+
          (it.due_date?'<span class="tc-due" style="color:'+dueColor+'">📅 '+it.due_date+'</span>':'<span class="tc-due" style="color:var(--text3)">No due date</span>')+
        '</div>'+
      '</div>'+
      // Action buttons
      '<div class="tc-actions">'+
        (can('toggle')?(isDone?'<button class="tc-btn pending-btn" data-toggle="'+it.id+'">↩ Mark pending</button>':'<button class="tc-btn done-btn" data-toggle="'+it.id+'">✓ Mark done</button>'):'')+
        (can('email')?'<button class="tc-btn fu-btn" data-email="'+it.id+'">✉ Follow-up</button>':'')+
        (can('delete')?'<button class="tc-btn del-btn" data-del="'+it.id+'">🗑 Delete</button>':'')+
        (can('add')?'<button class="tc-btn" onclick="editItem('+it.id+')">✏ Edit</button>':'')+
      '</div>'+
      // Expandable detail section (hidden by default)
      '<div class="tc-detail" id="tc-detail-'+it.id+'" style="display:none">'+
        '<div class="tc-detail-tabs">'+
          '<button class="tc-dtab active" data-pane="tc-overview-'+it.id+'">Overview</button>'+
          '<button class="tc-dtab" data-pane="tc-evidence-'+it.id+'">Evidence</button>'+
          '<button class="tc-dtab" data-pane="tc-framework-'+it.id+'">Framework</button>'+
          '<button class="tc-dtab" data-pane="tc-activity-'+it.id+'">Activity</button>'+
        '</div>'+
        // Overview pane
        '<div class="tc-dpane active" id="tc-overview-'+it.id+'">'+
          '<div class="tc-dgrid">'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Stakeholder</div><div class="tc-dfield-val">'+(it.stakeholder||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Assignee</div><div class="tc-dfield-val">'+(it.assignee||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Department</div><div class="tc-dfield-val">'+(it.dept||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Priority</div><div class="tc-dfield-val"><span style="background:'+pc.bg+';color:'+pc.text+';padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">'+(it.priority||'Medium')+'</span></div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Frequency</div><div class="tc-dfield-val">'+(FL[it.freq]||it.freq||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Category</div><div class="tc-dfield-val">'+(it.category||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Due date</div><div class="tc-dfield-val" style="color:'+dueColor+';font-weight:600">'+(it.due_date||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Email</div><div class="tc-dfield-val" style="font-size:12px;color:#4f52d9;word-break:break-all">'+(it.email||'—')+'</div></div>'+
            '<div class="tc-dfield"><div class="tc-dfield-label">Status</div><div class="tc-dfield-val">'+statusChip(it)+'</div></div>'+
          '</div>'+
          (it.notes?'<div class="tc-dfield"><div class="tc-dfield-label">Notes</div><div style="font-size:13px;color:var(--text);background:var(--surface);padding:10px 12px;border-radius:8px;border:1px solid var(--border)">'+it.notes+'</div></div>':'')+
        '</div>'+
        // Evidence pane
        '<div class="tc-dpane" id="tc-evidence-'+it.id+'">'+
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">'+evHtml2+'</div>'+
          (can('add')?'<label class="ev-upload-zone" style="display:inline-block;cursor:pointer"><input type="file" style="display:none" multiple onchange="addEvidenceToItem(this,'+it.id+')"><div style="font-size:12px;font-weight:600;color:var(--text2)">📎 Upload evidence</div></label>':'')+
        '</div>'+
        // Framework pane
        '<div class="tc-dpane" id="tc-framework-'+it.id+'">'+
          '<div style="display:flex;flex-wrap:wrap;gap:6px">'+fwHtml+'</div>'+
        '</div>'+
        // Activity pane
        '<div class="tc-dpane" id="tc-activity-'+it.id+'">'+
          actLogHtml+
        '</div>'+
      '</div>';

    // ── Card click: expand/collapse detail ──
    card.querySelector('.tc-body').addEventListener('click', function(e){
      if(e.target.closest('.tc-btn,.tc-actions')) return;
      var detail = document.getElementById('tc-detail-'+it.id);
      var isOpen = detail.style.display !== 'none';
      // Close all other cards first
      document.querySelectorAll('.tc.expanded').forEach(function(c){
        c.classList.remove('expanded');
        c.querySelector('.tc-detail').style.display='none';
      });
      if(!isOpen){
        card.classList.add('expanded');
        detail.style.display='block';
        card.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
    });

    // ── Tab switching ──
    card.querySelectorAll('.tc-dtab').forEach(function(tab){
      tab.addEventListener('click', function(e){
        e.stopPropagation();
        var detailEl = document.getElementById('tc-detail-'+it.id);
        detailEl.querySelectorAll('.tc-dtab').forEach(function(t){ t.classList.remove('active'); });
        detailEl.querySelectorAll('.tc-dpane').forEach(function(p){ p.classList.remove('active'); p.style.display='none'; });
        tab.classList.add('active');
        var pane = document.getElementById(tab.getAttribute('data-pane'));
        if(pane){ pane.classList.add('active'); pane.style.display='block'; }
      });
    });

    // ── Wire toggle (mark done/pending) ──
    var toggleBtn = card.querySelector('[data-toggle]');
    if(toggleBtn){
      toggleBtn.addEventListener('click', async function(e){
        e.stopPropagation();
        toggleBtn.disabled=true;
        var updateBody={done:!it.done, item_status:it.done?'Pending':'Done'};
        if(!it.done&&it.due_date){ var nd=calcNextDueDate(it.freq,it.due_date); if(nd) updateBody.due_date=nd; }
        var actLog=[]; try{ actLog=it.activity_log?(typeof it.activity_log==='string'?JSON.parse(it.activity_log):it.activity_log):[]; }catch(e2){}
        actLog.push({ts:new Date().toISOString(),user:currentUser?currentUser.name:'User',action:(it.done?'Marked as Pending':'Marked as Done')});
        updateBody.activity_log=actLog;
        var res = await api('grc_items?id=eq.'+it.id,{method:'PATCH',body:updateBody,extra:{'Prefer':'return=minimal'}});
        if(res&&!res.ok){
          var et=await res.text(); alert('Update failed ('+res.status+'): '+et);
          toggleBtn.disabled=false; return;
        }
        writeAuditLog('UPDATE','Compliance Item',(it.done?'Marked pending: ':'Marked done: ')+it.name);
        if(!it.done) showDueDateToast(it.freq,updateBody.due_date||it.due_date);
        await loadAll();
      });
    }

    // ── Wire follow-up ──
    var fuBtn = card.querySelector('[data-email]');
    if(fuBtn){ fuBtn.addEventListener('click',function(e){ e.stopPropagation(); goEmail(it.id); }); }

    // ── Wire delete ──
    var delBtn = card.querySelector('[data-del]');
    if(delBtn){
      delBtn.addEventListener('click', async function(e){
        e.stopPropagation();
        if(!confirm('Delete "'+it.name+'"? This cannot be undone.')) return;
        delBtn.disabled=true;
        var res = await api('grc_items?id=eq.'+it.id,{method:'DELETE',extra:{'Prefer':'return=minimal'}});
        if(res&&!res.ok){
          var et=await res.text();
          if(res.status===403){
            alert('Delete blocked by Row Level Security.\n\nFix: Go to Supabase SQL Editor and run:\nALTER TABLE grc_items DISABLE ROW LEVEL SECURITY;');
          } else { alert('Delete failed ('+res.status+'): '+et); }
          delBtn.disabled=false; return;
        }
        writeAuditLog('DELETE','Compliance Item','Deleted: '+it.name);
        await loadAll();
      });
    }

    grid.appendChild(card);
  });
}

// Helper: open edit panel for a specific item
function editItem(itemId){
  var it = items.find(function(x){ return x.id == itemId; });
  if(!it) return;
  openPanel('item-panel');
  setTimeout(function(){
    var fields = ['i-name','i-stake','i-email','i-dept','i-freq','i-due','i-cat','i-notes','i-priority','i-assignee','i-status'];
    var vals   = [it.name,it.stakeholder,it.email,it.dept,it.freq,it.due_date,it.category,it.notes,it.priority,it.assignee,it.item_status||'Pending'];
    fields.forEach(function(f,i){ var el=document.getElementById(f); if(el) el.value=vals[i]||''; });
    var hidEl = document.getElementById('i-edit-id');
    if(hidEl) hidEl.value=itemId;
  }, 200);
}


function goEmail(id){
  // Navigate to the email section
  var navEl = document.getElementById('nav-email');
  if(!navEl){ alert('Email tracker section not found. Please check your sidebar.'); return; }
  navEl.onclick();
  // Wait for the section to render, then select the item
  var attempts = 0;
  var interval = setInterval(function(){
    var sel = document.getElementById('fu-select');
    if(sel){
      sel.value = id;
      // Trigger change so the form populates
      sel.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
    if(++attempts > 20) clearInterval(interval);
  }, 100);
}

// ── Evidence upload helpers ──
function handleItemEvUpload(input){
  var list=document.getElementById('i-ev-files-list');
  if(!list) return;
  Array.from(input.files).forEach(function(f){
    // Prevent duplicates
    var exists=Array.from(list.querySelectorAll('.ev-file-chip')).some(function(c){return c.getAttribute('data-name')===f.name;});
    if(exists) return;
    var chip=document.createElement('span');
    chip.className='ev-file-chip';
    chip.setAttribute('data-name',f.name);
    chip.innerHTML='📎 '+f.name+' <span style="cursor:pointer;margin-left:4px;opacity:.6" onclick="this.parentNode.remove()">✕</span>';
    list.appendChild(chip);
  });
  // Reset input so same file can be re-selected if removed
  input.value='';
}

async function addEvidenceToItem(input, itemId){
  var it=items.find(function(x){return x.id==itemId;});
  if(!it) return;
  var newFiles=Array.from(input.files).map(function(f){return f.name;});
  if(!newFiles.length) return;
  var existing=(it.evidence_files||'').split('||').filter(Boolean);
  var merged=existing.concat(newFiles.filter(function(n){return existing.indexOf(n)===-1;}));
  // Append activity log entry
  var actLog=[];try{actLog=JSON.parse(it.activity_log||'[]');}catch(e){}
  actLog.push({ts:new Date().toISOString(),user:currentUser?currentUser.name:'User',action:'Evidence uploaded: '+newFiles.join(', ')});
  var updateBody={evidence_files:merged.join('||'),activity_log:JSON.stringify(actLog)};
  var res=await api('grc_items?id=eq.'+itemId,{method:'PATCH',body:updateBody,extra:{'Prefer':'return=minimal'}});
  if(res.ok){
    await loadAll();
    showDueDateToast('','Evidence file(s) attached!');
  } else {
    alert('Upload failed — check your connection.');
  }
  input.value='';
}

function renderDash(){
  var total = items.length;
  var done  = items.filter(function(it){ return getStatus(it)==='done'; }).length;
  var ov    = items.filter(function(it){ return getStatus(it)==='overdue'; }).length;
  var pend  = total - done - ov;
  var pct   = total ? Math.round(done/total*100) : 0;

  // ── High risks (score >= 15) ──
  var highRisks = risks.filter(function(r){ return (r.likelihood||1)*(r.impact||1)>=15 && r.status!=='Closed'; });

  // ── Open actions ──
  var openActions = actions.filter(function(a){ return a.status!=='Closed'; });
  var overdueActions = actions.filter(function(a){ return getActionStatus(a)==='overdue'; });

  // ── Evidence pending ──
  var pendingEv = evidenceItems.filter(function(e){ return e.status==='Pending'||e.status==='Submitted'; });

  // ── Policies due for review ──
  var polDue = policies.filter(function(p){ var s=getPolicyStatus(p); return s==='due-soon'||s==='expired'; });

  // ════ ROW 1: 6 metric cards ════
  function setEl(id,val){ var e=document.getElementById(id);if(e)e.textContent=val; }
  setEl('d-total', total);
  setEl('d-done',  done);
  setEl('d-over',  ov);
  setEl('d-risks', highRisks.length);
  setEl('d-actions', openActions.length);
  setEl('d-pct',   pct+'%');

  setEl('d-total-sub',   total+' compliance task'+(total!==1?'s':''));
  var doneSubEl = document.getElementById('d-done-sub');
  if(doneSubEl) doneSubEl.innerHTML = pct+'% completion rate';
  var overSubEl = document.getElementById('d-over-sub');
  if(overSubEl) overSubEl.innerHTML = ov>0?'<span style="color:#ef4444;font-weight:600">'+ov+' need attention</span>':'<span style="color:#10b981">All on track</span>';
  var riskSubEl = document.getElementById('d-risks-sub');
  if(riskSubEl) riskSubEl.innerHTML = highRisks.length>0?'<span style="color:#f59e0b;font-weight:600">'+highRisks.length+' critical</span>':'<span style="color:#10b981">No critical risks</span>';
  var actSubEl = document.getElementById('d-actions-sub');
  if(actSubEl) actSubEl.innerHTML = overdueActions.length>0?'<span style="color:#ef4444;font-weight:600">'+overdueActions.length+' overdue</span>':'<span style="color:#10b981">All on time</span>';
  var pctSubEl = document.getElementById('d-pct-sub');
  if(pctSubEl) pctSubEl.innerHTML = pct>=80?'<span style="color:#10b981;font-weight:600">Excellent ✓</span>':pct>=60?'<span style="color:#e07d1a;font-weight:600">On track</span>':'<span style="color:#ef4444;font-weight:600">Needs focus</span>';

  // ════ Ring chart ════
  var circ = 339.3;
  var ringDone = document.getElementById('ring-done');
  var ringOver = document.getElementById('ring-over');
  if(ringDone) ringDone.style.strokeDashoffset = total>0 ? circ-(done/total*circ) : circ;
  if(ringOver && total>0){
    var ovArc = ov/total*circ;
    var doneDeg = done/total*360;
    ringOver.style.strokeDasharray  = ovArc+' '+(circ-ovArc);
    ringOver.style.strokeDashoffset = circ-ovArc;
    ringOver.style.transform = 'rotate('+(doneDeg-90)+'deg)';
  } else if(ringOver){
    ringOver.style.strokeDashoffset = circ;
  }
  setEl('ring-pct-val', pct+'%');
  setEl('leg-done', done);
  setEl('leg-over', ov);
  setEl('leg-pend', pend);

  // ════ Dept bar chart ════
  var depts={};
  items.forEach(function(it){
    var d=it.dept||'Unassigned';
    if(!depts[d]) depts[d]={done:0,total:0};
    depts[d].total++;
    if(getStatus(it)==='done') depts[d].done++;
  });
  var deptKeys=Object.keys(depts).sort(function(a,b){
    return (depts[b].done/depts[b].total)-(depts[a].done/depts[a].total);
  }).slice(0,7);
  var deptEl=document.getElementById('dept-bars');
  if(deptEl){
    while(deptEl.firstChild) deptEl.removeChild(deptEl.firstChild);
    if(!deptKeys.length){
      var nd=document.createElement('div');nd.style.cssText='color:var(--text3);font-size:13px;padding:20px 0;text-align:center';nd.textContent='No items assigned to departments yet.';deptEl.appendChild(nd);
    } else {
      deptKeys.forEach(function(d){
        var p=Math.round(depts[d].done/depts[d].total*100);
        var barC=p>=80?'#10b981':p>=50?'#e07d1a':'#ef4444';
        var row=document.createElement('div');row.className='dept-bar-row';
        row.innerHTML='<div class="dept-bar-top"><span class="dept-bar-name">'+escHtml(d)+'</span><span class="dept-bar-pct" style="color:'+barC+'">'+p+'%</span></div>'+
          '<div class="dept-bar-track"><div class="dept-bar-fill" style="width:0%;background:'+barC+'" data-width="'+p+'"></div></div>'+
          '<div class="dept-bar-counts">'+depts[d].done+' of '+depts[d].total+' done</div>';
        deptEl.appendChild(row);
      });
      setTimeout(function(){
        deptEl.querySelectorAll('.dept-bar-fill').forEach(function(b){ b.style.width=b.getAttribute('data-width')+'%'; });
      },120);
    }
  }

  // ════ Attention feed ════
  var alertEl=document.getElementById('dash-alerts');
  if(alertEl){
    while(alertEl.firstChild) alertEl.removeChild(alertEl.firstChild);
    var alertItems=[];
    // Overdue compliance items
    items.filter(function(it){ return getStatus(it)==='overdue'; }).slice(0,3).forEach(function(it){
      alertItems.push({color:'#ef4444',icon:'⚠',title:it.name,meta:'Compliance · '+it.stakeholder,nav:'nav-overdue'});
    });
    // High risks
    highRisks.slice(0,2).forEach(function(r){
      alertItems.push({color:'#f59e0b',icon:'🔴',title:r.name,meta:'Risk · Score '+(r.likelihood*r.impact),nav:'nav-risks'});
    });
    // Overdue actions
    overdueActions.slice(0,2).forEach(function(a){
      alertItems.push({color:'#7c3aed',icon:'!',title:a.title,meta:'Action · '+a.owner,nav:'nav-actions'});
    });
    // Pending evidence
    pendingEv.slice(0,2).forEach(function(e){
      alertItems.push({color:'#e07d1a',icon:'📎',title:e.title,meta:'Evidence · '+e.owner,nav:'nav-evidence'});
    });
    // Policies due
    polDue.slice(0,1).forEach(function(p){
      alertItems.push({color:'#5b5ef4',icon:'📋',title:p.name,meta:'Policy review due',nav:'nav-policy'});
    });

    if(!alertItems.length){
      var ok=document.createElement('div');
      ok.style.cssText='text-align:center;padding:30px 10px;color:var(--text3)';
      ok.innerHTML='<div style="font-size:28px;margin-bottom:6px">✅</div><div style="font-size:12px">All clear — nothing needs attention!</div>';
      alertEl.appendChild(ok);
    } else {
      alertItems.slice(0,7).forEach(function(al){
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid var(--border2);cursor:pointer;transition:background .1s';
        row.onmouseenter=function(){row.style.background='var(--hover)';};
        row.onmouseleave=function(){row.style.background='';};
        var dot=document.createElement('div');
        dot.style.cssText='width:8px;height:8px;border-radius:50%;flex-shrink:0;background:'+al.color;
        var info=document.createElement('div');info.style.cssText='flex:1;min-width:0';
        var t=document.createElement('div');t.style.cssText='font-size:12px;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap';t.textContent=al.title;
        var m=document.createElement('div');m.style.cssText='font-size:10px;color:var(--text3)';m.textContent=al.meta;
        info.appendChild(t);info.appendChild(m);
        row.appendChild(dot);row.appendChild(info);
        (function(navId){row.onclick=function(){var b=document.getElementById(navId);if(b)b.click();};})(al.nav);
        alertEl.appendChild(row);
      });
    }
  }

  // ════ Risk snapshot ════
  var rsnap=document.getElementById('dash-risk-snap');
  if(rsnap){
    while(rsnap.firstChild) rsnap.removeChild(rsnap.firstChild);
    var crit=risks.filter(function(r){return (r.likelihood||1)*(r.impact||1)>=15&&r.status!=='Closed';}).length;
    var high=risks.filter(function(r){var s=(r.likelihood||1)*(r.impact||1);return s>=8&&s<15&&r.status!=='Closed';}).length;
    var low =risks.filter(function(r){return (r.likelihood||1)*(r.impact||1)<8&&r.status!=='Closed';}).length;
    var closed=risks.filter(function(r){return r.status==='Closed';}).length;
    if(!risks.length){
      var nr=document.createElement('div');nr.style.cssText='text-align:center;padding:30px 10px;color:var(--text3);font-size:12px';nr.textContent='No risks logged yet.';rsnap.appendChild(nr);
    } else {
      [
        {l:'Critical',v:crit,c:'#ef4444',bg:'rgba(239,68,68,.1)',nav:'nav-risks'},
        {l:'High',    v:high,c:'#f59e0b',bg:'rgba(245,158,11,.1)',nav:'nav-risks'},
        {l:'Low',     v:low, c:'#10b981',bg:'rgba(16,185,129,.1)',nav:'nav-risks'},
        {l:'Closed',  v:closed,c:'#9ca3af',bg:'var(--surface2)',nav:'nav-risks'}
      ].forEach(function(r){
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:8px;margin-bottom:6px;background:'+r.bg+';cursor:pointer;transition:opacity .15s';
        row.onmouseenter=function(){row.style.opacity='.75';};
        row.onmouseleave=function(){row.style.opacity='1';};
        (function(n){row.onclick=function(){var b=document.getElementById(n);if(b)b.click();};})(r.nav);
        var lbl=document.createElement('div');lbl.style.cssText='font-size:13px;font-weight:600;color:'+r.c;lbl.textContent=r.l;
        var val=document.createElement('div');val.style.cssText='font-size:20px;font-weight:800;color:'+r.c;val.textContent=r.v;
        row.appendChild(lbl);row.appendChild(val);rsnap.appendChild(row);
      });
    }
  }

  // ════ Upcoming deadlines — next 14 days ════
  var upEl=document.getElementById('dash-upcoming');
  if(upEl){
    while(upEl.firstChild) upEl.removeChild(upEl.firstChild);
    var tod=today();
    var in14=new Date();in14.setDate(in14.getDate()+14);
    var in14Str=in14.toISOString().split('T')[0];
    var upcoming=[];
    items.forEach(function(it){
      if(it.due_date&&it.due_date>=tod&&it.due_date<=in14Str&&getStatus(it)!=='done')
        upcoming.push({date:it.due_date,title:it.name,meta:it.stakeholder,color:'#5b5ef4',nav:'nav-items'});
    });
    evidenceItems.forEach(function(e){
      if(e.deadline&&e.deadline>=tod&&e.deadline<=in14Str&&e.status!=='Approved')
        upcoming.push({date:e.deadline,title:e.title,meta:'Evidence · '+e.owner,color:'#f59e0b',nav:'nav-evidence'});
    });
    actions.forEach(function(a){
      if(a.due_date&&a.due_date>=tod&&a.due_date<=in14Str&&a.status!=='Closed')
        upcoming.push({date:a.due_date,title:a.title,meta:'Action · '+a.owner,color:'#7c3aed',nav:'nav-actions'});
    });
    upcoming.sort(function(a,b){return a.date.localeCompare(b.date);});
    if(!upcoming.length){
      var nu=document.createElement('div');nu.style.cssText='text-align:center;padding:30px 10px;color:var(--text3)';
      nu.innerHTML='<div style="font-size:24px;margin-bottom:6px">🗓</div><div style="font-size:12px">Nothing due in the next 14 days</div>';
      upEl.appendChild(nu);
    } else {
      upcoming.slice(0,8).forEach(function(u){
        var dL=Math.ceil((new Date(u.date)-new Date(tod))/86400000);
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 8px;border-bottom:1px solid var(--border2);cursor:pointer;transition:background .1s';
        row.onmouseenter=function(){row.style.background='var(--hover)';};
        row.onmouseleave=function(){row.style.background='';};
        var dateDiv=document.createElement('div');
        dateDiv.style.cssText='min-width:36px;text-align:center;padding:4px 5px;border-radius:6px;background:'+u.color+'22';
        dateDiv.innerHTML='<div style="font-size:10px;font-weight:800;color:'+u.color+'">'+dL+'d</div>';
        var info=document.createElement('div');info.style.cssText='flex:1;min-width:0';
        var t=document.createElement('div');t.style.cssText='font-size:12px;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap';t.textContent=u.title;
        var m=document.createElement('div');m.style.cssText='font-size:10px;color:var(--text3)';m.textContent=u.meta+' · '+u.date;
        info.appendChild(t);info.appendChild(m);
        row.appendChild(dateDiv);row.appendChild(info);
        (function(n){row.onclick=function(){var b=document.getElementById(n);if(b)b.click();};})(u.nav);
        upEl.appendChild(row);
      });
    }
  }

  // ════ Freq progress bars ════
  var freqs=['daily','weekly','monthly','quarterly','halfyearly','yearly'];
  var fpEl=document.getElementById('freq-progress');
  if(fpEl){
    while(fpEl.firstChild) fpEl.removeChild(fpEl.firstChild);
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:10px';
    var hasAny=false;
    freqs.forEach(function(f){
      var grp=items.filter(function(it){return it.freq===f;});
      if(!grp.length) return;
      hasAny=true;
      var gd=grp.filter(function(it){return getStatus(it)==='done';}).length;
      var gp=Math.round(gd/grp.length*100);
      var bc=gp>=80?'#10b981':gp>=50?'#e07d1a':'#ef4444';
      var row=document.createElement('div');row.className='dept-bar-row';
      row.innerHTML='<div class="dept-bar-top"><span class="dept-bar-name">'+FL[f]+'</span><span class="dept-bar-pct" style="color:'+bc+'">'+gd+'/'+grp.length+' · '+gp+'%</span></div>'+
        '<div class="dept-bar-track"><div class="dept-bar-fill" style="width:0%;background:'+bc+'" data-width="'+gp+'"></div></div>';
      wrap.appendChild(row);
    });
    if(!hasAny){
      var nf=document.createElement('div');nf.style.cssText='color:var(--text3);font-size:12px;padding:20px 0;text-align:center';nf.textContent='No items yet.';wrap.appendChild(nf);
    }
    fpEl.appendChild(wrap);
    setTimeout(function(){fpEl.querySelectorAll('.dept-bar-fill').forEach(function(b){b.style.width=b.getAttribute('data-width')+'%';});},120);
  }

  // ════ Module status strip ════
  var modEl=document.getElementById('dash-module-strip');
  if(modEl){
    while(modEl.firstChild) modEl.removeChild(modEl.firstChild);
    var openEv=evidenceItems.filter(function(e){return e.status==='Pending';}).length;
    var modules=[
      {icon:'📋',label:'Policies',  val:policies.length,  sub:polDue.length>0?polDue.length+' due for review':'All current',  ok:polDue.length===0, nav:'nav-policy'},
      {icon:'🛡',label:'Risks',     val:risks.length,     sub:highRisks.length>0?highRisks.length+' critical':'No critical risks', ok:highRisks.length===0, nav:'nav-risks'},
      {icon:'✅',label:'Actions',   val:openActions.length, sub:overdueActions.length>0?overdueActions.length+' overdue':'All on time',  ok:overdueActions.length===0, nav:'nav-actions'},
      {icon:'📁',label:'Evidence',  val:pendingEv.length, sub:openEv>0?openEv+' pending':'All submitted',   ok:openEv===0, nav:'nav-evidence'},
      {icon:'🗓',label:'Audits',    val:audits.length,    sub:audits.length+' audit'+(audits.length!==1?'s':''),            ok:audits.length>0, nav:'nav-evidence'},
      {icon:'🗺',label:'Controls',  val:controlMappings.length, sub:controlMappings.length+' mapped',               ok:controlMappings.length>0,nav:'nav-frameworks'},
    ];
    modules.forEach(function(m){
      var card=document.createElement('div');
      card.style.cssText='background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;transition:all .15s;text-align:center';
      card.onmouseenter=function(){card.style.borderColor='var(--primary)';card.style.background='var(--primary-light)';};
      card.onmouseleave=function(){card.style.borderColor='var(--border)';card.style.background='var(--surface2)';};
      (function(n){card.onclick=function(){var b=document.getElementById(n);if(b)b.click();};})(m.nav);
      var statusDot='<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:'+(m.ok?'#10b981':'#f59e0b')+';margin-right:4px"></span>';
      card.innerHTML=
        '<div style="font-size:22px;margin-bottom:4px">'+m.icon+'</div>'+
        '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">'+m.val+'</div>'+
        '<div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px">'+m.label+'</div>'+
        '<div style="font-size:10px;color:var(--text3);display:flex;align-items:center;justify-content:center">'+statusDot+m.sub+'</div>';
      modEl.appendChild(card);
    });
  }
}



// ── USERS ──
async function loadUsers(){
  var res=await api('grc_users?select=*&order=created_at.asc');
  if(!res.ok) return;
  var data=await res.json();
  users=Array.isArray(data)?data:[];
  renderUsers();
}

document.getElementById('add-user-btn').onclick=async function(){
  var name=document.getElementById('u-name').value.trim();
  var email=document.getElementById('u-email').value.trim().toLowerCase();
  var pass=document.getElementById('u-pass').value.trim();
  var role=document.getElementById('u-role').value;
  if(!name||!email||!pass){alert('Please fill all fields.');return;}
  var res=await api('grc_users',{method:'POST',body:{name:name,email:email,password:pass,role:role},extra:{'Prefer':'return=minimal'}});
  if(!res.ok){var e=await res.json();alert('Error: '+(e.message||'Could not add user'));return;}
  ['u-name','u-email','u-pass'].forEach(function(id){document.getElementById(id).value='';});
  await loadUsers();
  alert('User added successfully!');
};
function renderUsers(){
  var tb=document.getElementById('user-body');
  if(!users.length){tb.innerHTML='<tr><td colspan="5" class="empty">No users.</td></tr>';return;}
  tb.innerHTML=users.map(function(u){var ini=u.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase(),col=RC[u.role]||'#4f52d9',date=u.created_at?u.created_at.split('T')[0]:'';return'<tr><td><span style="display:inline-flex;align-items:center;gap:8px"><span style="width:26px;height:26px;border-radius:50%;background:'+col+';display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">'+ini+'</span>'+u.name+'</span></td><td>'+u.email+'</td><td><span class="badge r-'+u.role+'">'+u.role+'</span></td><td>'+date+'</td><td>'+(u.id!==currentUser.id?'<button class="btn btn-sm btn-danger" data-du="'+u.id+'">Remove</button>':'<span style="font-size:12px;color:#b0b6c8">You</span>')+'</td></tr>';}).join('');
  tb.querySelectorAll('[data-du]').forEach(function(el){el.onclick=async function(){if(!confirm('Remove user?'))return;await api('grc_users?id=eq.'+el.getAttribute('data-du'),{method:'DELETE',extra:{'Prefer':'return=minimal'}});await loadUsers();};});
}

// ── SHOW AI FLOAT BTN AFTER LOGIN ──
function showAIBtn(){
  var btn=document.getElementById('ai-float-btn');
  if(btn) btn.style.display='flex';
}

// ── AI CHAT ──
var aiChatOpen=false;

document.getElementById('open-ai-chat').onclick=function(){
  toggleAIChat();
};

function toggleAIChat(){
  var panel=document.getElementById('ai-chat-panel');
  var floatBtn=document.getElementById('ai-float-btn');
  aiChatOpen=!aiChatOpen;
  if(aiChatOpen){
    panel.style.display='flex';
    floatBtn.style.display='none';
    document.getElementById('ai-chat-input').focus();
  } else {
    panel.style.display='none';
    floatBtn.style.display='flex';
  }
}



// ════════════════════════════════════════════════
// CLARIX AI — OPENAI POWERED
// ════════════════════════════════════════════════

var _aiModel       = 'gpt-4o-mini';   // cheapest + best quality OpenAI model
var _aiChatHistory = [];
var _aiKey         = '';              // OpenAI API key

// ── Save / restore key (session only, never localStorage) ──
// ── OpenAI key — stored in Supabase grc_settings, never in localStorage ──
// In-memory only after fetch. sessionStorage used ONLY as session cache.

async function saveAIKeyToSupabase(key){
  // Store in Supabase — admin only
  if(!currentUser || currentUser.role !== 'admin'){
    showDueDateToast('','Only admins can save the AI key.');
    return false;
  }
  // XOR-obfuscate before storing (not full encryption, but prevents plain-text in DB)
  var encoded = btoa(unescape(encodeURIComponent(key)));
  var existing = await api('grc_settings?key_name=eq.openai_key', {method:'GET'});
  var exData = existing.ok ? await existing.json() : [];
  var res;
  if(exData && exData.length){
    res = await api('grc_settings?key_name=eq.openai_key', {
      method:'PATCH',
      body:{ key_value: encoded, updated_by: currentUser.email, updated_at: new Date().toISOString() },
      extra:{'Prefer':'return=minimal'}
    });
  } else {
    res = await api('grc_settings', {
      method:'POST',
      body:{ key_name:'openai_key', key_value: encoded, updated_by: currentUser.email, updated_at: new Date().toISOString() },
      extra:{'Prefer':'return=representation'}
    });
  }
  if(res && res.ok){
    // Cache in session memory only — cleared on tab close
    try{ sessionStorage.setItem('_oaik', encoded); }catch(e){}
    return true;
  }
  return false;
}

async function loadAIKeyFromSupabase(){
  // Try session cache first (avoid unnecessary DB call)
  try{
    var cached = sessionStorage.getItem('_oaik');
    if(cached){
      _aiKey = decodeURIComponent(escape(atob(cached)));
      return;
    }
  }catch(e){}
  // Fetch from Supabase
  try{
    var res = await api('grc_settings?key_name=eq.openai_key&select=key_value', {method:'GET'});
    if(res && res.ok){
      var data = await res.json();
      if(data && data.length && data[0].key_value){
        var decoded = decodeURIComponent(escape(atob(data[0].key_value)));
        _aiKey = decoded;
        try{ sessionStorage.setItem('_oaik', data[0].key_value); }catch(e){}
      }
    }
  }catch(e){ _aiKey = ''; }
}

function clearAIKeyFromMemory(){
  _aiKey = '';
  try{ sessionStorage.removeItem('_oaik'); }catch(e){}
}

// ── Core OpenAI API call ──
async function callAI(systemPrompt, userMessage, maxTokens){
  maxTokens = maxTokens || 1024;
  if(!_aiKey){ throw new Error('NO_KEY'); }

  var messages = [{role:'system', content: systemPrompt}]
    .concat(_aiChatHistory)
    .concat([{role:'user', content: userMessage}]);

  var res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + _aiKey
    },
    body: JSON.stringify({
      model:      _aiModel,
      max_tokens: maxTokens,
      messages:   messages
    })
  });

  if(!res.ok){
    var err = await res.json().catch(function(){ return {}; });
    var msg = err.error && err.error.message ? err.error.message : 'API error ' + res.status;
    throw new Error(msg);
  }

  var data = await res.json();
  return (data.choices && data.choices[0] && data.choices[0].message)
    ? data.choices[0].message.content
    : '';
}

// ── Build live GRC data context ──
function buildGRCContext(){
  var total  = items.length;
  var done   = items.filter(function(it){ return getStatus(it)==='done'; }).length;
  var ov     = items.filter(function(it){ return getStatus(it)==='overdue'; }).length;
  var pct    = total ? Math.round(done/total*100) : 0;
  var highR  = risks.filter(function(r){ return (r.likelihood||1)*(r.impact||1)>=15 && r.status!=='Closed'; });
  var openAc = actions.filter(function(a){ return a.status!=='Closed'; });
  var overdAc= actions.filter(function(a){ return getActionStatus(a)==='overdue'; });
  var pendEv = evidenceItems.filter(function(e){ return e.status==='Pending'; });
  var polDue = policies.filter(function(p){ var s=getPolicyStatus(p); return s==='due-soon'||s==='expired'; });
  var depts  = {};
  items.forEach(function(it){
    var d = it.dept||'Unknown';
    if(!depts[d]) depts[d]={done:0,total:0};
    depts[d].total++;
    if(getStatus(it)==='done') depts[d].done++;
  });
  var ctx  = 'CLARIX GRC LIVE DATA\n===================================\n';
  ctx += 'Compliance: '+total+' items, '+done+' done ('+pct+'%), '+ov+' overdue\n';
  ctx += 'Risks: '+risks.length+' total, '+highR.length+' critical (score>=15)\n';
  ctx += 'Actions: '+openAc.length+' open, '+overdAc.length+' overdue\n';
  ctx += 'Evidence: '+pendEv.length+' pending\n';
  ctx += 'Policies: '+policies.length+' total, '+polDue.length+' due for review\n';
  ctx += 'Audits: '+audits.length+', Controls mapped: '+controlMappings.length+'\n\n';
  if(ov>0){
    ctx += 'OVERDUE ITEMS:\n';
    items.filter(function(it){ return getStatus(it)==='overdue'; }).slice(0,5).forEach(function(it){
      ctx += '- '+it.name+' | '+it.stakeholder+' | Due: '+it.due_date+'\n';
    });
    ctx += '\n';
  }
  if(highR.length){
    ctx += 'CRITICAL RISKS:\n';
    highR.slice(0,5).forEach(function(r){
      ctx += '- '+r.name+' | Score: '+((r.likelihood||1)*(r.impact||1))+' | '+( r.owner||'—')+'\n';
    });
    ctx += '\n';
  }
  if(overdAc.length){
    ctx += 'OVERDUE ACTIONS:\n';
    overdAc.slice(0,3).forEach(function(a){
      ctx += '- '+a.title+' | '+(a.owner||'—')+' | Due: '+(a.due_date||'—')+'\n';
    });
    ctx += '\n';
  }
  if(Object.keys(depts).length){
    ctx += 'DEPARTMENTS:\n';
    Object.keys(depts).forEach(function(d){
      ctx += '- '+d+': '+Math.round(depts[d].done/depts[d].total*100)+'% ('+depts[d].done+'/'+depts[d].total+')\n';
    });
  }
  return ctx;
}

function getSystemPrompt(){
  return 'You are Clarix AI, a GRC (Governance Risk and Compliance) expert assistant built into the Clarix compliance tool.\n\n'+
    'You help compliance teams:\n'+
    '- Analyse compliance data and identify what needs immediate attention\n'+
    '- Write professional policies, action plans and risk descriptions\n'+
    '- Assess readiness for ISO 27001, SOC 2, GDPR and NIST audits\n'+
    '- Suggest corrective actions for overdue items and risks\n\n'+
    'Rules:\n'+
    '- Be specific, practical and concise\n'+
    '- Use bullet points for lists\n'+
    '- Keep responses under 300 words unless writing a full document\n'+
    '- Use plain text, no markdown symbols like ** or ##\n\n'+
    'LIVE GRC DATA FROM THIS ORGANISATION:\n'+
    buildGRCContext();
}

// ── Main chat handler ──
function sendAIMessage(){var inp=document.getElementById('ai-chat-input');if(!inp)return;var q=inp.value.trim();if(!q)return;inp.value='';askAI(q);}

function askAI(question){
  if(!question || !question.trim()) return;
  addMsg(question, 'user');
  _aiChatHistory.push({role:'user', content:question});

  var thinkEl = document.getElementById('ai-thinking');
  if(thinkEl) thinkEl.style.display = 'flex';

  callAI(getSystemPrompt(), question, 1024)
    .then(function(answer){
      if(thinkEl) thinkEl.style.display = 'none';
      _aiChatHistory.push({role:'assistant', content:answer});
      if(_aiChatHistory.length > 20) _aiChatHistory = _aiChatHistory.slice(-20);
      addMsg(answer, 'bot');
      var msgs = document.getElementById('ai-chat-messages');
      if(msgs) msgs.scrollTop = msgs.scrollHeight;
    })
    .catch(function(err){
      if(thinkEl) thinkEl.style.display = 'none';
      var msg = err.message || '';

      if(msg === 'NO_KEY'){
        addMsg(
          '<strong>OpenAI API key not set yet.</strong><br><br>'+
          'Follow these steps to get started:<br><br>'+
          '1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" style="color:#5b5ef4;font-weight:600">platform.openai.com/api-keys</a><br>'+
          '2. Sign up or log in (free account)<br>'+
          '3. Click "Create new secret key"<br>'+
          '4. Copy the key (starts with <strong>sk-...</strong>)<br>'+
          '5. Click <strong>Set API Key</strong> button below and paste it<br><br>'+
          '<em>Cost: ~$0.002 per 1000 tokens (very cheap — typical chat costs less than $0.001)</em><br><br>'+
          'Meanwhile, here is what I can see from your local data:',
          'bot'
        );
        addMsg(processAIQuestion(question), 'bot');
      } else if(msg.indexOf('401') > -1 || msg.toLowerCase().indexOf('invalid') > -1 || msg.toLowerCase().indexOf('incorrect') > -1){
        addMsg(
          'Invalid API key. Please check your key and try again.<br><br>'+
          'Click <strong>Set API Key</strong> to enter the correct key.',
          'bot'
        );
      } else if(msg.indexOf('429') > -1 || msg.toLowerCase().indexOf('rate') > -1){
        addMsg('Rate limit reached. Please wait a moment and try again.', 'bot');
      } else if(msg.indexOf('insufficient') > -1 || msg.indexOf('quota') > -1){
        addMsg(
          'Your OpenAI account has run out of credits.<br>'+
          'Add credits at <a href="https://platform.openai.com/settings/billing" target="_blank" style="color:#5b5ef4">platform.openai.com/settings/billing</a><br><br>'+
          'Using local data instead:',
          'bot'
        );
        addMsg(processAIQuestion(question), 'bot');
      } else {
        addMsg('Error: ' + msg + '<br>Using local data instead:', 'bot');
        addMsg(processAIQuestion(question), 'bot');
      }

      var msgs = document.getElementById('ai-chat-messages');
      if(msgs) msgs.scrollTop = msgs.scrollHeight;
    });
}

// ── Set API key ──
async function promptSetApiKey(){
  if(!currentUser){ showDueDateToast('','Please log in first.'); return; }
  if(currentUser.role !== 'admin'){
    showDueDateToast('','Only admins can set the OpenAI API key.');
    return;
  }
  var cur = _aiKey ? 'Key is set ✓ (loaded from Supabase)' : 'No key set';
  var newKey = prompt(
    'Set OpenAI API Key — stored securely in Supabase\n\n'+
    'Current status: ' + cur + '\n\n'+
    'How to get your key (one time setup):\n'+
    '1. Go to platform.openai.com/api-keys\n'+
    '2. Sign up or log in (free account)\n'+
    '3. Click "Create new secret key"\n'+
    '4. Copy the key (starts with sk-...)\n'+
    '5. Paste it below — saved to Supabase, shared with all admins\n\n'+
    'The key is stored in your Supabase database, not in the browser.'
  );
  if(newKey === null) return;
  newKey = newKey.trim();
  if(newKey.startsWith('sk-') && newKey.length > 20){
    _aiKey = newKey;
    var saved = await saveAIKeyToSupabase(newKey);
    _aiChatHistory = [];
    var btn = document.getElementById('ai-key-btn');
    if(saved){
      if(btn){ btn.textContent='🔑 Key saved ✓'; btn.style.background='rgba(16,185,129,.12)'; btn.style.color='#10b981'; }
      showDueDateToast('','✅ OpenAI key saved to Supabase! All admins can now use Clarix AI.');
      addMsg(
        'OpenAI API key saved securely to Supabase!<br><br>'+
        'The key is <strong>not stored in your browser</strong> — it lives in your Supabase database and is loaded on login.<br><br>'+
        'I am now powered by <strong>GPT-4o mini</strong>. Ask me anything!',
        'bot'
      );
    } else {
      // Supabase save failed — keep in memory for this session only
      if(btn){ btn.textContent='🔑 Key active (session)'; btn.style.background='rgba(245,158,11,.12)'; btn.style.color='#f59e0b'; }
      showDueDateToast('','Key active for this session. Make sure grc_settings table exists in Supabase.');
      addMsg('Key set for this session. Run the SQL below to enable permanent Supabase storage.','bot');
    }
  } else if(newKey.length > 0){
    showDueDateToast('','❌ Invalid key. Key must start with sk- and be at least 20 characters.');
  }
}

// ── AI feature functions ──
function aiAnalyseRisks(){
  if(!risks.length){ showDueDateToast('','No risks to analyse. Add risks first.'); return; }
  toggleAIChat();
  var riskList = risks.slice(0,10).map(function(r){
    return r.name+' (Likelihood:'+r.likelihood+' Impact:'+r.impact+' Score:'+(r.likelihood*r.impact)+' Status:'+(r.status||'Open')+')';
  }).join('\n');
  askAI('Analyse these risks and give me:\n1. Top 3 most critical to fix immediately\n2. A simple mitigation action for each\n3. Which ISO 27001 control each maps to\n\nRisks:\n'+riskList);
}

function aiSuggestActions(){
  var ov = items.filter(function(it){ return getStatus(it)==='overdue'; });
  var hr = risks.filter(function(r){ return (r.likelihood||1)*(r.impact||1)>=15 && r.status!=='Closed'; });
  if(!ov.length && !hr.length){ showDueDateToast('','Nothing critical right now — all on track!'); return; }
  toggleAIChat();
  var ctx = '';
  if(ov.length) ctx += 'OVERDUE COMPLIANCE ITEMS:\n'+ov.slice(0,5).map(function(it){ return '- '+it.name+' (Owner: '+it.stakeholder+', Due: '+it.due_date+')'; }).join('\n')+'\n\n';
  if(hr.length) ctx += 'CRITICAL RISKS:\n'+hr.slice(0,5).map(function(r){ return '- '+r.name+' (Score: '+(r.likelihood*r.impact)+')'; }).join('\n');
  askAI('Suggest corrective actions for these issues:\n\n'+ctx+'\n\nGive me:\n1. Immediate actions (this week)\n2. Short-term fixes (this month)\n3. Who should own each action\n4. Realistic timeline');
}

function aiWritePolicy(){
  var name = prompt('What policy should AI write?\n\nExamples:\n• Information Security Policy\n• Password & Authentication Policy\n• Acceptable Use Policy\n• Data Protection Policy\n• Remote Working Security Policy\n• Incident Response Policy\n• Access Control Policy');
  if(!name || !name.trim()) return;
  toggleAIChat();
  askAI('Write a complete, professional '+name.trim()+' for our organisation.\n\nInclude these sections:\n1. Purpose\n2. Scope\n3. Policy Statements\n4. Roles and Responsibilities\n5. Procedures\n6. Compliance and Enforcement\n7. Review Schedule\n\nMake it ISO 27001 aligned, practical and ready to use. 400-600 words.');
}

function aiAuditReadiness(framework){
  framework = framework || 'ISO 27001';
  toggleAIChat();
  askAI('Give me a '+framework+' audit readiness assessment based on our current GRC data.\n\n1. Overall readiness score out of 10\n2. What we are doing well\n3. Critical gaps that would cause audit failure\n4. Top 5 actions to take before the audit\n5. Estimated time to become fully audit-ready\n\nBe honest, specific and practical.');
}

async function aiPrefillField(fieldId, prompt, btnEl){
  var field = document.getElementById(fieldId);
  if(!field) return;
  var origText = btnEl ? btnEl.textContent : '';
  if(btnEl){ btnEl.textContent = 'AI writing...'; btnEl.disabled = true; }
  try{
    var sys = 'You are a GRC writing assistant. Write concise, professional content for compliance documents. Return only the content itself — no preamble, no labels, no markdown.';
    var answer = await callAI(sys, prompt, 600);
    field.value = answer.trim();
    if(btnEl){
      btnEl.textContent = '✓ Done';
      setTimeout(function(){ btnEl.textContent = origText; btnEl.disabled = false; }, 2000);
    }
  }catch(e){
    if(btnEl){ btnEl.textContent = origText; btnEl.disabled = false; }
    if(e.message === 'NO_KEY'){
      showDueDateToast('','Set your OpenAI API key first — click the AI chat button');
    } else {
      showDueDateToast('','AI error: '+e.message);
    }
  }
}


function addMsg(text,type){
  var msgs=document.getElementById('ai-chat-messages');
  var div=document.createElement('div');
  if(type==='user') div.className='ai-msg-user';
  else if(type==='bot') div.className='ai-msg-bot';
  else div.className='ai-msg-loading';
  div.innerHTML=text;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
  return div;
}

function processAIQuestion(q){
  var ql=q.toLowerCase().trim();
  var NL='<br>';
  var total=items.length;
  var done=items.filter(function(it){return getStatus(it)==='done';});
  var overdue=items.filter(function(it){return getStatus(it)==='overdue';});
  var pending=items.filter(function(it){return getStatus(it)==='pending';});
  var pct=total?Math.round(done.length/total*100):0;

  // Overdue questions
  if(ql.indexOf('overdue')>-1&&ql.indexOf('how many')>-1||ql.indexOf('count overdue')>-1){
    if(!overdue.length) return 'Good news! You have no overdue items currently.';
    return 'You have <strong>'+overdue.length+' overdue items</strong> out of '+total+' total.'+NL+NL+overdue.slice(0,5).map(function(it){return '• '+it.name+' ('+it.stakeholder+') — due '+it.due_date;}).join(NL)+(overdue.length>5?NL+'...and '+(overdue.length-5)+' more.':'');
  }

  if((ql.indexOf('overdue')>-1||ql.indexOf('show overdue')>-1||ql.indexOf('list overdue')>-1)&&ql.indexOf('how many')===-1){
    if(!overdue.length) return 'No overdue items currently. All on track!';
    return '<strong>'+overdue.length+' overdue items:</strong>'+NL+NL+overdue.map(function(it){return '• '+it.name+NL+'  Stakeholder: '+it.stakeholder+' | Due: '+it.due_date;}).join(NL+NL);
  }

  // Compliance % questions
  if(ql.indexOf('overall')>-1||ql.indexOf('compliance percent')>-1||ql.indexOf('completion rate')>-1||ql.indexOf('overall %')>-1||ql.indexOf('progress')>-1){
    return 'Your overall compliance is <strong>'+pct+'%</strong>'+NL+NL+'• Total items: '+total+NL+'• Completed: '+done.length+NL+'• Overdue: '+overdue.length+NL+'• Pending: '+pending.length;
  }

  // Pending questions
  if(ql.indexOf('pending')>-1){
    if(!pending.length) return 'No pending items! Everything is either completed or overdue.';
    return '<strong>'+pending.length+' pending items:</strong>'+NL+NL+pending.slice(0,6).map(function(it){return '• '+it.name+' ('+it.stakeholder+') — due '+it.due_date;}).join(NL)+(pending.length>6?NL+'...and '+(pending.length-6)+' more.':'');
  }

  // Worst stakeholder / lowest compliance
  if(ql.indexOf('worst')>-1||ql.indexOf('lowest')>-1||ql.indexOf('bad')>-1){
    var sc=buildScorecardData();
    if(!sc.length) return 'No stakeholder data yet. Add compliance items first.';
    var worst=sc[sc.length-1];
    return '<strong>'+worst.name+'</strong> has the lowest compliance rate at <strong>'+worst.pct+'%</strong>'+NL+'('+worst.done+' done out of '+worst.total+' tasks, '+worst.followups+' follow-ups sent)';
  }

  // Best stakeholder
  if(ql.indexOf('best')>-1||ql.indexOf('top')>-1||ql.indexOf('highest')>-1){
    var sc=buildScorecardData();
    if(!sc.length) return 'No stakeholder data yet.';
    var best=sc[0];
    return '<strong>'+best.name+'</strong> has the best compliance rate at <strong>'+best.pct+'%</strong>'+NL+'('+best.done+' done out of '+best.total+' tasks)';
  }

  // High risks
  if(ql.indexOf('high risk')>-1||ql.indexOf('high risks')>-1){
    var hr=risks.filter(function(r){return r.likelihood*r.impact>=15;});
    if(!hr.length) return 'No high risks currently. All risks are medium or low.';
    return '<strong>'+hr.length+' high risk(s):</strong>'+NL+NL+hr.map(function(r){return '• '+r.name+' — Score: '+(r.likelihood*r.impact)+'/25 | Owner: '+(r.owner||'Unassigned');}).join(NL);
  }

  // All risks
  if(ql.indexOf('risk')>-1&&(ql.indexOf('show')>-1||ql.indexOf('list')>-1||ql.indexOf('all')>-1)){
    if(!risks.length) return 'No risks added yet. Go to Risk Register to add risks.';
    return '<strong>'+risks.length+' risk(s) total:</strong>'+NL+NL+risks.slice(0,6).map(function(r){var s=r.likelihood*r.impact;var lv=s>=15?'High':s>=8?'Medium':'Low';return '• '+r.name+' — '+lv+' ('+s+'/25)';}).join(NL);
  }

  // Frequency based questions
  var freqMap={daily:'daily',weekly:'weekly',monthly:'monthly',quarterly:'quarterly',halfyearly:'half-yearly',yearly:'yearly'};
  for(var f in freqMap){
    if(ql.indexOf(f)>-1||ql.indexOf(freqMap[f])>-1){
      var grp=items.filter(function(it){return it.freq===f;});
      if(!grp.length) return 'No '+freqMap[f]+' items found.';
      var gdone=grp.filter(function(it){return getStatus(it)==='done';}).length;
      var govd=grp.filter(function(it){return getStatus(it)==='overdue';}).length;
      return '<strong>'+freqMap[f].charAt(0).toUpperCase()+freqMap[f].slice(1)+' items ('+grp.length+' total):</strong>'+NL+'Completed: '+gdone+' | Overdue: '+govd+' | Pending: '+(grp.length-gdone-govd)+NL+NL+grp.slice(0,5).map(function(it){return '• '+it.name+' ('+getStatus(it)+')';}).join(NL);
    }
  }

  // Department questions
  if(ql.indexOf('department')>-1||ql.indexOf('dept')>-1){
    var depts={};
    items.forEach(function(it){var d=it.dept||'Unknown';if(!depts[d])depts[d]={total:0,done:0};depts[d].total++;if(getStatus(it)==='done')depts[d].done++;});
    var keys=Object.keys(depts);
    if(!keys.length) return 'No department data found.';
    return '<strong>Compliance by department:</strong>'+NL+NL+keys.map(function(d){var p=Math.round(depts[d].done/depts[d].total*100);return '• '+d+': '+p+'% ('+depts[d].done+'/'+depts[d].total+')';}).join(NL);
  }

  // Follow-up questions
  if(ql.indexOf('follow')>-1){
    var totalFU=logs.length;
    var mostFU=items.slice().sort(function(a,b){return(b.followups||0)-(a.followups||0);}).slice(0,3);
    return '<strong>Follow-up summary:</strong>'+NL+'Total follow-ups sent: '+totalFU+NL+NL+'Items with most follow-ups:'+NL+mostFU.map(function(it){return '• '+it.name+' ('+it.stakeholder+'): '+(it.followups||0)+' follow-ups';}).join(NL);
  }

  // Summary / report
  if(ql.indexOf('summary')>-1||ql.indexOf('report')>-1||ql.indexOf('status')>-1){
    var hr2=risks.filter(function(r){return r.likelihood*r.impact>=15;}).length;
    return '<strong>GRC Status Summary</strong>'+NL+NL+'Compliance: <strong>'+pct+'%</strong> overall'+NL+'• '+done.length+' tasks completed'+NL+'• '+overdue.length+' tasks overdue'+NL+'• '+pending.length+' tasks pending'+NL+NL+'Risks: '+risks.length+' total | <strong>'+hr2+' high risk</strong>'+NL+NL+'Follow-ups: '+logs.length+' sent in total';
  }

  // Stakeholder specific
  var stakeMatch=null;
  items.forEach(function(it){if(it.stakeholder&&ql.indexOf(it.stakeholder.toLowerCase())>-1) stakeMatch=it.stakeholder;});
  if(stakeMatch){
    var stItems=items.filter(function(it){return it.stakeholder===stakeMatch;});
    var stDone=stItems.filter(function(it){return getStatus(it)==='done';}).length;
    var stOvd=stItems.filter(function(it){return getStatus(it)==='overdue';}).length;
    var stPct=stItems.length?Math.round(stDone/stItems.length*100):0;
    return '<strong>'+stakeMatch+'</strong> has '+stItems.length+' task(s):'+NL+'Compliance rate: <strong>'+stPct+'%</strong>'+NL+'Completed: '+stDone+' | Overdue: '+stOvd+' | Pending: '+(stItems.length-stDone-stOvd)+NL+NL+stItems.map(function(it){return '• '+it.name+' → '+getStatus(it);}).join(NL);
  }

  // Help
  if(ql.indexOf('help')>-1||ql.indexOf('what can')>-1){
    return 'I can answer questions like:'+NL+NL+'• "How many items are overdue?"'+NL+'• "What is my overall compliance %?"'+NL+'• "Show all high risks"'+NL+'• "Who has the lowest compliance rate?"'+NL+'• "Show monthly items"'+NL+'• "Show IT department compliance"'+NL+'• "Give me a full summary"'+NL+'• "How many follow-ups sent?"'+NL+NL+'Just type your question!';
  }

  return 'I am not sure about that specific question. Try asking about overdue items, compliance %, risks, a specific stakeholder name, or type "help" to see what I can answer.';
}

// ── STAKEHOLDER SCORECARD ──
function buildScorecardData(){
  var map={};
  items.forEach(function(it){
    var s=it.stakeholder||'Unknown';
    if(!map[s]) map[s]={name:s,total:0,done:0,overdue:0,pending:0,followups:0,dept:it.dept||''};
    map[s].total++;
    var st=getStatus(it);
    if(st==='done') map[s].done++;
    else if(st==='overdue') map[s].overdue++;
    else map[s].pending++;
    map[s].followups+=(it.followups||0);
  });
  return Object.values(map).map(function(s){
    s.pct=s.total?Math.round(s.done/s.total*100):0;
    return s;
  }).sort(function(a,b){return b.pct-a.pct;});
}

function renderScorecard(){
  var data=buildScorecardData();
  var el=document.getElementById('scorecard-content');
  if(!data.length){el.innerHTML='<div class="empty">No data yet. Add compliance items first.</div>';return;}
  var html='<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:16px">';
  var totalItems=items.length;
  var avgPct=data.length?Math.round(data.reduce(function(s,d){return s+d.pct;},0)/data.length):0;
  var totalFU=data.reduce(function(s,d){return s+d.followups;},0);
  html+='<div class="metric m-total"><div class="metric-label">Stakeholders</div><div class="metric-value">'+data.length+'</div></div>';
  html+='<div class="metric m-done"><div class="metric-label">Avg compliance</div><div class="metric-value" style="color:#0d9e7e">'+avgPct+'%</div></div>';
  html+='<div class="metric m-over"><div class="metric-label">Total follow-ups</div><div class="metric-value" style="color:#d93f3f">'+totalFU+'</div></div>';
  html+='</div>';

  html+='<div class="table-wrap"><table><thead><tr>';
  html+='<th style="width:5%">Rank</th>';
  html+='<th style="width:20%">Stakeholder</th>';
  html+='<th style="width:12%">Department</th>';
  html+='<th style="width:22%">Compliance rate</th>';
  html+='<th style="width:8%">Done</th>';
  html+='<th style="width:8%">Overdue</th>';
  html+='<th style="width:8%">Pending</th>';
  html+='<th style="width:9%">Follow-ups</th>';
  html+='<th style="width:8%">Grade</th>';
  html+='</tr></thead><tbody>';

  data.forEach(function(s,i){
    var barColor=s.pct>=80?'#0d9e7e':s.pct>=50?'#e07d1a':'#d93f3f';
    var grade=s.pct>=90?'A':s.pct>=75?'B':s.pct>=50?'C':s.pct>=25?'D':'F';
    var gradeColor=s.pct>=90?'#065f46':s.pct>=75?'#0369a1':s.pct>=50?'#92400e':s.pct>=25?'#a32d2d':'#d93f3f';
    var gradeStyle='background:'+(s.pct>=90?'#e0f7f2':s.pct>=75?'#e0f2fe':s.pct>=50?'#fef3e2':'#fdeaea')+';color:'+gradeColor;
    var rankEmoji=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    html+='<tr>';
    html+='<td style="text-align:center;font-weight:700;color:#7c8298">'+(i+1)+(rankEmoji?' <span style="font-size:14px">'+rankEmoji+'</span>':'')+'</td>';
    html+='<td style="font-weight:600">'+s.name+'</td>';
    html+='<td style="color:#7c8298">'+(s.dept||'—')+'</td>';
    html+='<td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:8px;background:#e2e5f0;border-radius:4px;overflow:hidden"><div style="width:'+s.pct+'%;height:100%;background:'+barColor+';border-radius:4px;transition:width .5s"></div></div><span style="font-size:12px;font-weight:700;color:'+barColor+';min-width:35px">'+s.pct+'%</span></div></td>';
    html+='<td style="text-align:center;font-weight:600;color:#0d9e7e">'+s.done+'</td>';
    html+='<td style="text-align:center;font-weight:600;color:'+(s.overdue>0?'#d93f3f':'#7c8298')+'">'+s.overdue+'</td>';
    html+='<td style="text-align:center;color:#7c8298">'+s.pending+'</td>';
    html+='<td style="text-align:center"><span class="fu-count">'+s.followups+'</span></td>';
    html+='<td style="text-align:center"><span class="badge" style="'+gradeStyle+';cursor:default;font-size:13px;font-weight:700">'+grade+'</span></td>';
    html+='</tr>';
  });
  html+='</tbody></table></div>';

  html+='<div style="margin-top:14px;padding:12px 14px;background:#f5f6fa;border-radius:8px;font-size:12px;color:#7c8298">';
  html+='<strong>Grade key:</strong> A = 90%+ excellent &nbsp;|&nbsp; B = 75%+ good &nbsp;|&nbsp; C = 50%+ average &nbsp;|&nbsp; D = 25%+ poor &nbsp;|&nbsp; F = below 25% critical';
  html+='</div>';
  el.innerHTML=html;
}

// ── SETUP AI AFTER LOGIN ──
var origSetupUI=window.setupUI;
function setupUIWithAI(){
  if(typeof origSetupUI==='function') origSetupUI();
  showAIBtn();
}

// ── DUE DATE AUTO-CALCULATOR ──
function calcNextDueDate(freq, currentDue){
  try{
    var d = currentDue ? new Date(currentDue) : new Date();
    if(isNaN(d.getTime())) d = new Date();
    var freqDays = {daily:1,weekly:7,monthly:30,quarterly:91,halfyearly:182,yearly:365};
    var days = freqDays[freq];
    if(!days) return null;
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }catch(e){ return null; }
}

function showDueDateToast(freq, nextDate){
  var freqLabels={daily:'tomorrow',weekly:'in 7 days',monthly:'next month',quarterly:'in 3 months',halfyearly:'in 6 months',yearly:'next year'};
  var msg = 'Task marked done! Next due date set to ' + nextDate + ' (' + (freqLabels[freq]||freq) + ')';
  var toast = document.getElementById('grc-toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'grc-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function(){ toast.classList.remove('show'); }, 3500);
}

// ── STAKEHOLDER PORTAL ──
function getPortalBase(){
  var loc = window.location.href;
  var base = loc.split('?')[0].split('#')[0];
  return base;
}

function encodeStake(name){
  return btoa(unescape(encodeURIComponent(name))).replace(/=/g,'');
}

function decodeStake(encoded){
  try{
    var padded = encoded + '=='.slice(0,(4-encoded.length%4)%4);
    return decodeURIComponent(escape(atob(padded)));
  }catch(e){ return null; }
}

function genPortalLink(stakeholder){
  var code = encodeStake(stakeholder);
  return getPortalBase() + '?portal=' + code;
}

function copyPortalLink(){
  var link = document.getElementById('portal-link-text').textContent;
  navigator.clipboard.writeText(link).then(function(){
    alert('Link copied! Share it with the stakeholder via WhatsApp or email.');
  }).catch(function(){
    alert('Please manually copy this link: ' + link);
  });
}

document.getElementById('gen-portal-btn').onclick = function(){
  var sel = document.getElementById('portal-stake-select').value;
  var inp = document.getElementById('portal-stake-input').value.trim();
  var name = inp || sel;
  if(!name){ alert('Please select or type a stakeholder name.'); return; }
  var link = genPortalLink(name);
  document.getElementById('portal-stake-name').textContent = name;
  document.getElementById('portal-link-text').textContent = link;
  document.getElementById('portal-link-output').style.display = 'block';
};

function renderPortal(){
  var sel=document.getElementById('portal-stake-select');
  var prev=sel.value;
  while(sel.options.length>1) sel.remove(1);

  var stakes={};
  items.forEach(function(it){
    if(!it.stakeholder) return;
    var k=it.stakeholder;
    if(!stakes[k]) stakes[k]={total:0,done:0,pending:0,dept:it.dept||''};
    stakes[k].total++;
    if(getStatus(it)==='done') stakes[k].done++;
    else stakes[k].pending++;
  });

  var names=Object.keys(stakes).sort();
  names.forEach(function(n){
    var opt=document.createElement('option');
    opt.value=n; opt.textContent=n;
    sel.appendChild(opt);
  });
  if(prev) sel.value=prev;

  var tb=document.getElementById('portal-table-body');
  while(tb.firstChild) tb.removeChild(tb.firstChild);

  if(!names.length){
    var tr=document.createElement('tr');
    var td=document.createElement('td');
    td.colSpan=6; td.className='empty';
    td.textContent='No stakeholders found. Add compliance items first.';
    tr.appendChild(td); tb.appendChild(tr);
    return;
  }

  names.forEach(function(n){
    var s=stakes[n];
    var link=genPortalLink(n);
    var shortLink=link.length>45?link.substring(0,45)+'...':link;

    var tr=document.createElement('tr');

    function makeTd(html,styles){
      var td=document.createElement('td');
      if(html!==undefined) td.innerHTML=html;
      if(styles) td.style.cssText=styles;
      return td;
    }

    var td1=document.createElement('td');
    td1.textContent=n; td1.style.fontWeight='600';

    var td2=document.createElement('td');
    td2.textContent=s.dept;

    var td3=document.createElement('td');
    td3.textContent=s.total; td3.style.textAlign='center';

    var td4=document.createElement('td');
    td4.textContent=s.done; td4.style.cssText='text-align:center;color:#0d9e7e;font-weight:600';

    var td5=document.createElement('td');
    td5.textContent=s.pending; td5.style.cssText='text-align:center;color:#e07d1a';

    var td6=document.createElement('td');
    var wrap=document.createElement('div');
    wrap.style.cssText='display:flex;align-items:center;gap:6px';

    var span=document.createElement('span');
    span.title=link;
    span.textContent=shortLink;
    span.style.cssText='font-size:11px;color:#7c8298;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';

    var btn=document.createElement('button');
    btn.className='copy-link-btn';
    btn.textContent='Copy';
    (function(l){
      btn.onclick=function(){
        navigator.clipboard.writeText(l).then(function(){
          alert('Link copied! Share with the stakeholder via WhatsApp or email.');
        }).catch(function(){
          prompt('Copy this link:',l);
        });
      };
    })(link);

    wrap.appendChild(span);
    wrap.appendChild(btn);
    td6.appendChild(wrap);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tb.appendChild(tr);
  });
}

// ── PORTAL PAGE (runs when ?portal= is in URL) ──
var _portalShown = false; // guard against double-render

function checkPortalMode(){
  var params = new URLSearchParams(window.location.search);
  var portalCode = params.get('portal');
  if(!portalCode) return false;
  if(_portalShown) return true;
  _portalShown = true;
  var stakeName = decodeStake(portalCode);
  if(!stakeName){
    document.body.innerHTML = '<div style="font-family:\'Segoe UI\',sans-serif;max-width:600px;margin:80px auto;text-align:center;padding:40px"><div style="font-size:48px;margin-bottom:16px">⚠️</div><div style="font-size:18px;font-weight:700;color:#d93f3f;margin-bottom:8px">Invalid portal link</div><div style="font-size:14px;color:#7c8298">Please contact your GRC team for a valid link.</div></div>';
    return true;
  }
  showPortalPage(stakeName);
  return true;
}

async function showPortalPage(stakeName){
  // Ensure we only build the page once
  if(document.getElementById('portal-page-root')) return;

  // Hide app chrome
  var loginEl = document.getElementById('login-screen');
  var appEl   = document.getElementById('main-app');
  if(loginEl) loginEl.style.display='none';
  if(appEl)   appEl.style.display='none';
  document.body.style.cssText='margin:0;padding:0;background:#f3f4f8;font-family:"Segoe UI",system-ui,sans-serif;min-height:100vh';

  // Build page shell
  var page = document.createElement('div');
  page.id  = 'portal-page-root';
  page.style.cssText = 'max-width:760px;margin:0 auto;padding:28px 16px 60px';

  var initials = stakeName.trim().split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();

  page.innerHTML =
    // Header card
    '<div style="background:linear-gradient(135deg,#4f52d9,#7c3aed);border-radius:16px;padding:22px 26px;margin-bottom:20px;display:flex;align-items:center;gap:16px;box-shadow:0 4px 20px rgba(79,82,217,.3)">' +
      '<div style="width:48px;height:48px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0">'+initials+'</div>'+
      '<div><div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:2px">Hello, '+escHtmlPortal(stakeName)+'</div>'+
      '<div style="font-size:13px;color:rgba(255,255,255,.75)">Your compliance tasks — Clarix</div></div>'+
    '</div>'+
    // Tasks area
    '<div id="portal-tasks-area">'+
      '<div style="background:#fff;border-radius:14px;border:1px solid #e4e7f0;padding:48px 24px;text-align:center">'+
        '<div style="font-size:32px;margin-bottom:12px">⏳</div>'+
        '<div style="font-size:14px;font-weight:600;color:#0f1117;margin-bottom:4px">Loading your tasks…</div>'+
        '<div style="font-size:12px;color:#9ca3af">Please wait a moment</div>'+
      '</div>'+
    '</div>'+
    '<div style="text-align:center;padding:24px 0 0;font-size:11px;color:#b0b6c8">Powered by <strong>Clarix</strong> — Compliance Intelligence</div>';

  document.body.appendChild(page);

  // Fetch with server-side filter by stakeholder name
  try{
    var headers={
      'apikey':SUPA_KEY,
      'Authorization':'Bearer '+SUPA_KEY,
      'Accept':'application/json'
    };

    // Try exact stakeholder name match first
    var nameEnc = encodeURIComponent(stakeName);
    var url = SUPA_URL+'/rest/v1/grc_items?select=*&order=due_date.asc&stakeholder=eq.'+nameEnc;
    var res  = await fetch(url, {method:'GET', headers:headers, mode:'cors'});

    var myItems = [];
    if(res.ok){
      var data = await res.json();
      myItems = Array.isArray(data) ? data : [];
    }

    // If nothing found, fall back to fetching all and filtering client-side
    // (handles case differences, email-based matching, assignee field)
    if(!myItems.length){
      var res2 = await fetch(SUPA_URL+'/rest/v1/grc_items?select=*&order=due_date.asc', {method:'GET', headers:headers, mode:'cors'});
      if(res2.ok){
        var all = await res2.json();
        var lowerName = stakeName.toLowerCase();
        myItems = (Array.isArray(all)?all:[]).filter(function(it){
          return (it.stakeholder||'').toLowerCase()===lowerName ||
                 (it.email||'').toLowerCase()===lowerName ||
                 (it.assignee||'').toLowerCase()===lowerName ||
                 (it.stakeholder_email||'').toLowerCase()===lowerName;
        });
      }
    }

    renderPortalTasks(myItems, stakeName);

  }catch(err){
    var area = document.getElementById('portal-tasks-area');
    if(area) area.innerHTML =
      '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:24px;color:#dc2626;font-size:14px;text-align:center">'+
        '<div style="font-size:28px;margin-bottom:10px">❌</div>'+
        '<div style="font-weight:600;margin-bottom:4px">Could not load tasks</div>'+
        '<div style="font-size:12px;opacity:.8">'+escHtmlPortal(err.message)+'</div>'+
      '</div>';
  }
}

function escHtmlPortal(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderPortalTasks(myItems, stakeName){
  var area = document.getElementById('portal-tasks-area');
  if(!area) return;

  if(!myItems.length){
    area.innerHTML =
      '<div style="background:#fff;border-radius:14px;border:1px solid #e4e7f0;padding:48px 24px;text-align:center">'+
        '<div style="font-size:36px;margin-bottom:12px">📋</div>'+
        '<div style="font-size:15px;font-weight:700;color:#0f1117;margin-bottom:6px">No tasks assigned to you</div>'+
        '<div style="font-size:13px;color:#9ca3af">Contact your GRC team if you think this is a mistake.</div>'+
      '</div>';
    return;
  }

  var done  = myItems.filter(function(it){return it.done;}).length;
  var overdue = myItems.filter(function(it){
    var today = new Date().toISOString().split('T')[0];
    return !it.done && it.due_date && it.due_date < today;
  }).length;
  var pct   = Math.round(done/myItems.length*100);
  var barClr= pct>=80?'#10b981':pct>=50?'#f59e0b':'#ef4444';
  var freqMap={daily:'Daily',weekly:'Weekly',monthly:'Monthly',quarterly:'Quarterly',halfyearly:'Half-yearly',yearly:'Yearly'};

  var html = [];

  // Progress card
  html.push('<div style="background:#fff;border-radius:14px;border:1px solid #e4e7f0;padding:18px 22px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.05)">');
  html.push('<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">');
  html.push('<div style="font-size:13px;font-weight:700;color:#0f1117">Your compliance progress</div>');
  html.push('<div style="font-size:13px;font-weight:800;color:'+barClr+'">'+pct+'%</div></div>');
  html.push('<div style="height:8px;background:#f1f3f8;border-radius:4px;overflow:hidden;margin-bottom:8px">');
  html.push('<div style="width:'+pct+'%;height:100%;background:'+barClr+';border-radius:4px;transition:width .6s"></div></div>');
  html.push('<div style="display:flex;gap:16px;font-size:12px;color:#6b7280">');
  html.push('<span style="color:#10b981;font-weight:600">✓ '+done+' done</span>');
  if(overdue) html.push('<span style="color:#ef4444;font-weight:600">⚠ '+overdue+' overdue</span>');
  html.push('<span>'+myItems.length+' total</span>');
  html.push('</div></div>');

  // Task cards
  myItems.forEach(function(it){
    var today = new Date().toISOString().split('T')[0];
    var s = it.done?'done':(it.due_date&&it.due_date<today?'overdue':'pending');
    var cfg = {
      done:    {clr:'#10b981', bg:'#ecfdf5', bdr:'#10b981', lbl:'Done'},
      overdue: {clr:'#ef4444', bg:'#fef2f2', bdr:'#ef4444', lbl:'Overdue'},
      pending: {clr:'#f59e0b', bg:'#fffbeb', bdr:'#e4e7f0', lbl:'Pending'}
    }[s];

    html.push('<div style="background:#fff;border-radius:14px;border:1px solid #e4e7f0;border-left:4px solid '+cfg.bdr+';padding:16px 20px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.04)">');
    html.push('<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">');
    // Left: task info
    html.push('<div style="flex:1;min-width:0">');
    html.push('<div style="font-size:14px;font-weight:700;color:#0f1117;margin-bottom:6px;line-height:1.4;word-break:break-word">'+escHtmlPortal(it.name)+'</div>');
    html.push('<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;color:#9ca3af;margin-bottom:6px">');
    if(it.dept)     html.push('<span style="background:#f3f4f6;border-radius:6px;padding:2px 8px;color:#374151;font-weight:600">'+escHtmlPortal(it.dept)+'</span>');
    if(it.freq)     html.push('<span style="background:#f3f4f6;border-radius:6px;padding:2px 8px;color:#374151">'+( freqMap[it.freq]||it.freq)+'</span>');
    if(it.due_date) html.push('<span style="background:'+(s==='overdue'?'#fef2f2':'#f3f4f6')+';border-radius:6px;padding:2px 8px;color:'+(s==='overdue'?'#ef4444':'#374151')+';font-weight:'+(s==='overdue'?'700':'400')+'">Due '+it.due_date+'</span>');
    if(it.priority) html.push('<span style="background:#f3f4f6;border-radius:6px;padding:2px 8px;color:#374151">'+escHtmlPortal(it.priority)+' priority</span>');
    html.push('</div>');
    if(it.notes) html.push('<div style="font-size:12px;color:#6b7280;margin-top:4px;font-style:italic;line-height:1.5">📝 '+escHtmlPortal(it.notes)+'</div>');
    html.push('</div>');
    // Right: status + action
    html.push('<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">');
    html.push('<span style="background:'+cfg.bg+';color:'+cfg.clr+';font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap">'+cfg.lbl+'</span>');
    if(!it.done){
      html.push('<button id="pdone-'+it.id+'" onclick="portalMarkDone('+it.id+',this)" '+
        'style="background:#4f52d9;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:opacity .15s">'+
        'Mark as done</button>');
    } else {
      html.push('<span style="font-size:12px;color:#10b981;font-weight:700">✓ Completed</span>');
    }
    html.push('</div></div></div>');
  });

  area.innerHTML = html.join('');
}

async function portalMarkDone(itemId, btn){
  btn.textContent='Saving…';
  btn.style.opacity='0.6';
  btn.disabled=true;
  try{
    var headers={
      'apikey':SUPA_KEY,
      'Authorization':'Bearer '+SUPA_KEY,
      'Content-Type':'application/json',
      'Prefer':'return=minimal'
    };
    var res = await fetch(SUPA_URL+'/rest/v1/grc_items?id=eq.'+itemId, {
      method:'PATCH', headers:headers,
      body:JSON.stringify({done:true, item_status:'Done'}),
      mode:'cors'
    });
    if(!res.ok) throw new Error('Server error '+res.status);
    // Update UI without reload
    var card = btn.closest('div[style*="border-left"]');
    if(card){
      card.style.borderLeftColor='#10b981';
      var badge = card.querySelector('span[style*="border-radius:20px"]');
      if(badge){badge.textContent='Done';badge.style.background='#ecfdf5';badge.style.color='#10b981';}
      btn.parentElement.innerHTML='<span style="font-size:12px;color:#10b981;font-weight:700">✓ Completed</span>';
    }
    // Recalculate overall progress
    var allCards = document.querySelectorAll('#portal-tasks-area div[style*="border-left"]');
    var total = allCards.length;
    var doneCount = document.querySelectorAll('#portal-tasks-area span').length;
    // Simple re-fetch to update progress bar
    var progBar = document.querySelector('#portal-tasks-area div[style*="height:8px"]');
    if(progBar){
      var filled = progBar.querySelector('div');
      // count completed badges
      var completedSpans = document.querySelectorAll('#portal-tasks-area span[style*="10b981"][style*="border-radius:20px"]');
      var newPct = total>0?Math.round(completedSpans.length/total*100):0;
      if(filled) filled.style.width=newPct+'%';
    }
  }catch(err){
    btn.textContent='Mark as done';
    btn.style.opacity='1';
    btn.disabled=false;
    alert('Could not save: '+err.message);
  }
}

// Run portal check on page load (single call, guarded by _portalShown flag)
if(checkPortalMode()){
  // Portal mode active — normal app hidden
}

// ── RESPONSE MONITOR ──
function calcDeadline(days){
  var d=new Date();
  d.setDate(d.getDate()+parseInt(days||2));
  return d.toISOString().split('T')[0];
}

function daysDiff(dateStr){
  if(!dateStr) return null;
  var diff=(new Date(dateStr)-new Date(today()))/86400000;
  return Math.round(diff);
}

function updateResponseBadge(){
  var pending=logs.filter(function(l){
    if(l.response_received) return false;
    if(!l.response_deadline) return false;
    return l.response_deadline<=today();
  });
  var badge=document.getElementById('response-badge');
  if(badge){
    badge.textContent=pending.length;
    badge.style.display=pending.length>0?'inline-block':'none';
  }
}

function renderResponseMonitor(){
  var alertsEl=document.getElementById('response-alerts-content');
  var tbEl=document.getElementById('response-tbody');
  if(!alertsEl||!tbEl) return;

  var overdue=[],dueSoon=[],waiting=[],received=[];
  logs.forEach(function(l,idx){
    if(!l.response_deadline) return;
    var diff=daysDiff(l.response_deadline);
    var obj={log:l,idx:idx,diff:diff};
    if(l.response_received) received.push(obj);
    else if(diff<0) overdue.push(obj);
    else if(diff<=1) dueSoon.push(obj);
    else waiting.push(obj);
  });

  // ── Alert cards (DOM only) ──
  while(alertsEl.firstChild) alertsEl.removeChild(alertsEl.firstChild);

  if(!overdue.length&&!dueSoon.length){
    var emp=document.createElement('div');
    emp.className='empty';
    emp.textContent='No pending response alerts. All stakeholders have responded or no deadlines set.';
    alertsEl.appendChild(emp);
  }

  function makeAlertCard(item, type){
    var l=item.log;
    var card=document.createElement('div');
    card.className='alert-card'+(type==='warn'?' warn':type==='ok'?' ok':'');

    var info=document.createElement('div');
    info.className='alert-info';

    var title=document.createElement('div');
    title.className='alert-title';
    if(type==='overdue'){
      var daysO=Math.abs(item.diff);
      title.textContent=l.stakeholder+' has NOT responded — '+daysO+' day'+(daysO===1?'':'s')+' overdue!';
    } else {
      title.textContent=l.stakeholder+' — response due in '+item.diff+' day'+(item.diff===1?'':'s')+' (by '+l.response_deadline+')';
    }

    var sub=document.createElement('div');
    sub.className='alert-sub';
    var subText='Task: '+l.item_name+' | Follow-up #'+l.followup_num+' sent on '+l.log_date;
    if(type==='overdue') subText+=' | Expected by: '+l.response_deadline;
    if(l.subject_used) subText+='\nSubject: '+l.subject_used;
    if(l.note) subText+='\nNote: '+l.note;
    sub.textContent=subText;

    info.appendChild(title);
    info.appendChild(sub);

    var actions=document.createElement('div');
    actions.style.cssText='display:flex;flex-direction:column;gap:6px;align-items:flex-end';

    var badge=document.createElement('span');
    badge.className='alert-badge '+(type==='overdue'?'badge-overdue-resp':'badge-due-soon-resp');
    badge.textContent=type==='overdue'?'No response — '+Math.abs(item.diff)+'d overdue':'Response due today/tomorrow';
    actions.appendChild(badge);

    var markBtn=document.createElement('button');
    markBtn.className='btn btn-sm btn-primary';
    markBtn.textContent='Mark response received';
    (function(i){markBtn.onclick=function(){markResponseReceived(i);};})(item.idx);
    actions.appendChild(markBtn);

    if(type==='overdue'){
      var fuBtn=document.createElement('button');
      fuBtn.className='btn btn-sm';
      fuBtn.textContent='Send another follow-up';
      (function(l2){fuBtn.onclick=function(){
        var it=items.find(function(x){return x.name===l2.item_name;});
        if(it) goEmail(it.id);
      };})(l);
      actions.appendChild(fuBtn);
    }

    card.appendChild(info);
    card.appendChild(actions);
    return card;
  }

  overdue.forEach(function(item){alertsEl.appendChild(makeAlertCard(item,'overdue'));});
  dueSoon.forEach(function(item){alertsEl.appendChild(makeAlertCard(item,'warn'));});

  // ── Full table (DOM only) ──
  while(tbEl.firstChild) tbEl.removeChild(tbEl.firstChild);

  var allLogs=overdue.concat(dueSoon).concat(waiting).concat(received);
  if(!allLogs.length){
    var tr0=document.createElement('tr');
    var td0=document.createElement('td');
    td0.colSpan=8; td0.className='empty';
    td0.textContent='No follow-up logs yet. Send follow-up emails to start tracking responses.';
    tr0.appendChild(td0); tbEl.appendChild(tr0);
    return;
  }

  allLogs.forEach(function(item){
    var l=item.log;
    var isReceived=l.response_received;
    var isOverdue=!isReceived&&item.diff!==null&&item.diff<0;
    var isDueSoon=!isReceived&&!isOverdue&&item.diff!==null&&item.diff<=1;

    var tr=document.createElement('tr');

    function cell(text,css){
      var td=document.createElement('td');
      td.textContent=text||'—';
      if(css) td.style.cssText=css;
      return td;
    }

    tr.appendChild(cell(l.item_name,'overflow:hidden;text-overflow:ellipsis;max-width:0'));
    tr.appendChild(cell(l.stakeholder));

    var tdNum=document.createElement('td');
    tdNum.textContent='#'+l.followup_num;
    tdNum.style.cssText='text-align:center;font-weight:700;color:#4f52d9';
    tr.appendChild(tdNum);

    tr.appendChild(cell(l.log_date));

    var tdDead=document.createElement('td');
    tdDead.textContent=l.response_deadline||'—';
    if(isOverdue) tdDead.style.color='#d93f3f';
    else if(isDueSoon) tdDead.style.color='#e07d1a';
    tr.appendChild(tdDead);

    var tdStatus=document.createElement('td');
    var statusSpan=document.createElement('span');
    statusSpan.className='badge';
    statusSpan.style.cursor='default';
    if(isReceived){statusSpan.className+=' badge-received';statusSpan.textContent='Replied';}
    else if(isOverdue){statusSpan.className+=' badge-overdue-resp';statusSpan.textContent='Overdue '+Math.abs(item.diff)+'d';}
    else if(isDueSoon){statusSpan.className+=' badge-due-soon-resp';statusSpan.textContent='Due today/tomorrow';}
    else{statusSpan.className+=' badge-waiting';statusSpan.textContent=item.diff!==null?'Waiting ('+item.diff+'d)':'Waiting';}
    tdStatus.appendChild(statusSpan);
    tr.appendChild(tdStatus);

    var tdResp=document.createElement('td');
    var respSpan=document.createElement('span');
    respSpan.style.cssText='font-size:12px;font-weight:600;color:'+(isReceived?'#0d9e7e':'#b0b6c8');
    respSpan.textContent=isReceived?'Replied':'No reply yet';
    tdResp.appendChild(respSpan);
    tr.appendChild(tdResp);

    var tdAction=document.createElement('td');
    if(!isReceived){
      var btn=document.createElement('button');
      btn.className='btn btn-sm btn-primary';
      btn.textContent='Mark replied';
      (function(i){btn.onclick=function(){markResponseReceived(i);};})(item.idx);
      tdAction.appendChild(btn);
    } else {
      var undoBtn=document.createElement('button');
      undoBtn.className='btn btn-sm';
      undoBtn.textContent='Undo';
      undoBtn.style.fontSize='11px';
      (function(i){undoBtn.onclick=function(){markResponseReceived(i,true);};})(item.idx);
      tdAction.appendChild(undoBtn);
    }
    tr.appendChild(tdAction);
    tbEl.appendChild(tr);
  });

  updateResponseBadge();
}

async function markResponseReceived(logIdx, undo){
  var l=logs[logIdx];
  if(!l) return;
  var newVal=undo?false:true;
  var res=await api('grc_logs?id=eq.'+l.id,{method:'PATCH',body:{response_received:newVal},extra:{'Prefer':'return=minimal'}});
  if(res.ok){
    await loadAll();
    renderResponseMonitor();
    if(newVal){
      showDueDateToast('', l.stakeholder+' response marked as received!');
    }
  }
}

function goEmailByName(itemName){
  var it=items.find(function(x){return x.name===itemName;});
  if(it) goEmail(it.id);
}

function renderDashResponseAlert(){
  var overdue=logs.filter(function(l){
    return !l.response_received&&l.response_deadline&&l.response_deadline<today();
  });
  var dueSoon=logs.filter(function(l){
    if(l.response_received||!l.response_deadline) return false;
    var diff=daysDiff(l.response_deadline);
    return diff!==null&&diff<=1&&diff>=0;
  });

  var existing=document.getElementById('dash-response-alerts');
  if(existing) existing.remove();
  if(!overdue.length&&!dueSoon.length) return;

  var dashEl=document.getElementById('s-dash');
  if(!dashEl||!dashEl.classList.contains('active')) return;

  var alertDiv=document.createElement('div');
  alertDiv.id='dash-response-alerts';
  alertDiv.style.marginBottom='16px';

  if(overdue.length){
    var box=document.createElement('div');
    box.style.cssText='background:#fdeaea;border:1px solid #f5c0c0;border-radius:10px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px';
    var txt=document.createElement('div');
    var names=overdue.map(function(l){return l.stakeholder+' ('+l.item_name+')';}).join(', ');
    txt.innerHTML='<strong style="color:#d93f3f;display:block;margin-bottom:4px">'+overdue.length+' stakeholder'+(overdue.length>1?'s have':' has')+' NOT responded to your follow-up!</strong>'+
      '<span style="font-size:12px;color:#a32d2d">'+names+'</span>';
    var btn=document.createElement('button');
    btn.className='btn btn-sm btn-primary';
    btn.style.marginTop='6px';
    btn.textContent='View response monitor';
    btn.onclick=function(){document.getElementById('nav-response').click();};
    box.appendChild(txt);
    box.appendChild(btn);
    alertDiv.appendChild(box);
  }

  if(dueSoon.length){
    var box2=document.createElement('div');
    box2.style.cssText='background:#fef3e2;border:1px solid #fcd9a0;border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px';
    var txt2=document.createElement('div');
    var names2=dueSoon.map(function(l){return l.stakeholder;}).join(', ');
    txt2.innerHTML='<strong style="color:#e07d1a">Reminder: Response deadline today/tomorrow for '+names2+'</strong>';
    var btn2=document.createElement('button');
    btn2.className='btn btn-sm';
    btn2.textContent='View details';
    btn2.onclick=function(){document.getElementById('nav-response').click();};
    box2.appendChild(txt2);
    box2.appendChild(btn2);
    alertDiv.appendChild(box2);
  }

  var metrics=document.getElementById('dash-metrics');
  if(metrics) metrics.parentNode.insertBefore(alertDiv,metrics);
}

// ── EMAIL TRACKER ──
var trackedEmails=[];

function openCompose(){
  var modal=document.getElementById('compose-modal');
  modal.style.display='flex';
  document.body.classList.add('compose-modal-open');
  document.getElementById('et-date').value=today();
  setTimeout(function(){document.getElementById('et-stakeholder').focus();},100);
}

function closeCompose(){
  var modal=document.getElementById('compose-modal');
  modal.style.display='none';
  document.body.classList.remove('compose-modal-open');
  ['et-stakeholder','et-email','et-subject','et-body'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.value='';
  });
  document.getElementById('et-date').value=today();
}

function openGmail(){
  var subject=document.getElementById('et-subject').value.trim();
  var toEmail=document.getElementById('et-email').value.trim();
  var body=document.getElementById('et-body').value.trim();
  if(!toEmail){alert('Please enter the stakeholder email first.');return;}
  var url='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(toEmail)+
    (subject?'&su='+encodeURIComponent(subject):'')+
    (body?'&body='+encodeURIComponent(body):'');
  window.open(url,'_blank');
}

async function saveTrackedEmail(){
  if(!can('email')){noPermission('Only admin and manager can track emails.');return;}
  var stakeholder=document.getElementById('et-stakeholder').value.trim();
  var email=document.getElementById('et-email').value.trim();
  var subject=document.getElementById('et-subject').value.trim();
  var body=document.getElementById('et-body').value.trim();
  var dateSent=document.getElementById('et-date').value||today();
  var days=parseInt(document.getElementById('et-days').value)||2;
  var category=document.getElementById('et-category').value;
  if(!stakeholder){alert('Please enter stakeholder name.');return;}
  if(!email){alert('Please enter stakeholder email.');return;}
  if(!subject){alert('Please enter email subject.');return;}
  var deadline=new Date(dateSent);
  deadline.setDate(deadline.getDate()+days);
  var deadlineStr=deadline.toISOString().split('T')[0];
  var record={id:Date.now(),stakeholder:stakeholder,email:email,subject:subject,body:body,date_sent:dateSent,response_deadline:deadlineStr,response_days:days,category:category,replied:false,reply_date:null};
  var btn=document.getElementById('save-email-btn');
  btn.textContent='Saving...';btn.disabled=true;
  var res=await api('grc_email_tracker',{method:'POST',body:record,extra:{'Prefer':'return=minimal'}});
  btn.textContent='Save & Track';btn.disabled=false;
  if(!res.ok){var err=await res.json().catch(function(){return{};});alert('Error: '+(err.message||res.status));return;}
  closeCompose();
  await loadTrackedEmails();
  renderEmailTracker();
  showDueDateToast('','Email tracked! Watching for reply from '+stakeholder);
}

async function loadTrackedEmails(){
  try{
    var res=await api('grc_email_tracker?select=*&order=created_at.desc');
    if(!res.ok) return;
    var data=await res.json();
    trackedEmails=Array.isArray(data)?data:[];
    updateEmailTrackerBadge();
  }catch(e){trackedEmails=[];}
}

function updateEmailTrackerBadge(){
  var overdue=trackedEmails.filter(function(e){return !e.replied&&e.response_deadline&&e.response_deadline<today();});
  var badge=document.getElementById('emailtracker-badge');
  if(badge){badge.textContent=overdue.length;badge.style.display=overdue.length>0?'inline-block':'none';}
}

async function markEmailReplied(id,undo){
  var newVal=undo?false:true;
  var updateBody={replied:newVal,reply_date:newVal?today():null};
  var res=await api('grc_email_tracker?id=eq.'+id,{method:'PATCH',body:updateBody,extra:{'Prefer':'return=minimal'}});
  if(res.ok){await loadTrackedEmails();renderEmailTracker();if(newVal)showDueDateToast('','Reply received! Email marked as replied.');}
}

async function deleteTrackedEmail(id){
  if(!confirm('Delete this tracked email?')) return;
  var res=await api('grc_email_tracker?id=eq.'+id,{method:'DELETE',extra:{'Prefer':'return=minimal'}});
  if(res.ok){await loadTrackedEmails();renderEmailTracker();}
}

function renderEmailTracker(){
  var filterEl=document.getElementById('et-filter-status');
  var filter=filterEl?filterEl.value:'';
  var total=trackedEmails.length;
  var replied=trackedEmails.filter(function(e){return e.replied;}).length;
  var overdue=trackedEmails.filter(function(e){return !e.replied&&e.response_deadline&&e.response_deadline<today();}).length;
  var waiting=total-replied-overdue;

  var sumEl=document.getElementById('et-summary');
  if(sumEl){
    sumEl.innerHTML='';
    [{label:'Total emails',val:total,color:'#0f1117'},{label:'Waiting reply',val:waiting,color:'#4f52d9'},{label:'Overdue no reply',val:overdue,color:'#d93f3f'},{label:'Replied',val:replied,color:'#0d9e7e'}].forEach(function(m){
      var div=document.createElement('div');div.className='metric';
      div.innerHTML='<div class="metric-label">'+m.label+'</div><div class="metric-value" style="color:'+m.color+'">'+m.val+'</div>';
      sumEl.appendChild(div);
    });
  }

  var filtered=trackedEmails.filter(function(e){
    if(!filter) return true;
    var ov=!e.replied&&e.response_deadline&&e.response_deadline<today();
    if(filter==='replied') return e.replied;
    if(filter==='overdue') return ov;
    if(filter==='waiting') return !e.replied&&!ov;
    return true;
  });

  var tb=document.getElementById('et-tbody');
  if(!tb) return;
  while(tb.firstChild) tb.removeChild(tb.firstChild);

  if(!filtered.length){
    var tr0=document.createElement('tr');
    var td0=document.createElement('td');
    td0.colSpan=7;td0.className='empty';
    td0.textContent=total===0?'No emails tracked yet. Click Compose & Track to start.':'No emails match this filter.';
    tr0.appendChild(td0);tb.appendChild(tr0);
    return;
  }

  filtered.forEach(function(e){
    var isOverdue=!e.replied&&e.response_deadline&&e.response_deadline<today();
    var isDueSoon=!e.replied&&e.response_deadline&&!isOverdue&&daysDiff(e.response_deadline)<=1;
    var diff=e.response_deadline?daysDiff(e.response_deadline):null;

    var tr=document.createElement('tr');
    if(isOverdue) tr.style.background='#fffafa';

    function cell(text,css){var td=document.createElement('td');td.textContent=text||'—';if(css)td.style.cssText=css;return td;}

    var td1=document.createElement('td');td1.title=e.subject;
    var subDiv=document.createElement('div');subDiv.style.cssText='font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';subDiv.textContent=e.subject;
    var catDiv=document.createElement('div');catDiv.style.cssText='font-size:11px;color:#7c8298;margin-top:2px';catDiv.textContent=e.category||'';
    td1.appendChild(subDiv);td1.appendChild(catDiv);

    var td2=cell(e.stakeholder,'font-weight:600');
    var td3=document.createElement('td');td3.style.cssText='font-size:12px;color:#4f52d9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';td3.title=e.email||'';td3.textContent=e.email||'—';
    var td4=cell(e.date_sent,'font-size:12px');

    var td5=document.createElement('td');td5.style.fontSize='12px';
    if(isOverdue)td5.style.color='#d93f3f';else if(isDueSoon)td5.style.color='#e07d1a';
    td5.textContent=e.response_deadline||'—';
    if(isOverdue&&diff!==null){var db=document.createElement('div');db.style.cssText='font-size:10px;color:#d93f3f;font-weight:600';db.textContent=Math.abs(diff)+'d overdue';td5.appendChild(db);}

    var td6=document.createElement('td');
    var badge=document.createElement('span');badge.className='badge';badge.style.cursor='default';
    if(e.replied){badge.style.cssText='background:#e0f7f2;color:#065f46;cursor:default';badge.textContent='Replied';
      td6.appendChild(badge);
      if(e.reply_date){var rd=document.createElement('div');rd.style.cssText='font-size:10px;color:#0d9e7e;margin-top:2px;font-weight:500';rd.textContent=e.reply_date;td6.appendChild(rd);}
    }else if(isOverdue){badge.style.cssText='background:#fdeaea;color:#d93f3f;cursor:default';badge.textContent='No reply';td6.appendChild(badge);
    }else if(isDueSoon){badge.style.cssText='background:#fef3e2;color:#e07d1a;cursor:default';badge.textContent='Due soon';td6.appendChild(badge);
    }else{badge.style.cssText='background:#eeeffe;color:#4f52d9;cursor:default';badge.textContent='Waiting';td6.appendChild(badge);}

    var td7=document.createElement('td');
    var actWrap=document.createElement('div');actWrap.style.cssText='display:flex;gap:4px;flex-wrap:wrap';

    if(!e.replied){
      var rBtn=document.createElement('button');rBtn.className='btn btn-sm btn-primary';rBtn.textContent='Replied';rBtn.style.fontSize='11px';
      (function(id){rBtn.onclick=function(){markEmailReplied(id,false);};})(e.id);actWrap.appendChild(rBtn);
      var gBtn=document.createElement('button');gBtn.className='btn btn-sm';gBtn.textContent='Gmail';gBtn.style.fontSize='11px';
      (function(em,sub){gBtn.onclick=function(){window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(em)+'&su='+encodeURIComponent('Re: '+sub),'_blank');};})(e.email||'',e.subject||'');
      actWrap.appendChild(gBtn);
    }else{
      var uBtn=document.createElement('button');uBtn.className='btn btn-sm';uBtn.textContent='Undo';uBtn.style.fontSize='11px';
      (function(id){uBtn.onclick=function(){markEmailReplied(id,true);};})(e.id);actWrap.appendChild(uBtn);
    }
    var dBtn=document.createElement('button');dBtn.className='btn btn-sm btn-danger';dBtn.textContent='Del';dBtn.style.fontSize='11px';
    (function(id){dBtn.onclick=function(){deleteTrackedEmail(id);};})(e.id);actWrap.appendChild(dBtn);
    td7.appendChild(actWrap);

    tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);tr.appendChild(td5);tr.appendChild(td6);tr.appendChild(td7);
    tb.appendChild(tr);
  });
  updateEmailTrackerBadge();
}

function renderDashEmailAlert(){
  var overdueEmails=trackedEmails.filter(function(e){return !e.replied&&e.response_deadline&&e.response_deadline<today();});
  var dueSoonEmails=trackedEmails.filter(function(e){if(e.replied||!e.response_deadline)return false;var d=daysDiff(e.response_deadline);return d!==null&&d<=1&&d>=0;});
  var existing=document.getElementById('dash-email-alerts');
  if(existing) existing.remove();
  if(!overdueEmails.length&&!dueSoonEmails.length) return;
  var dashEl=document.getElementById('s-dash');
  if(!dashEl||!dashEl.classList.contains('active')) return;
  var alertDiv=document.createElement('div');alertDiv.id='dash-email-alerts';alertDiv.style.marginBottom='16px';

  if(overdueEmails.length){
    var box=document.createElement('div');
    box.style.cssText='background:#fff8e1;border:1px solid #ffd54f;border-radius:10px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px';
    var txt=document.createElement('div');
    var names=overdueEmails.slice(0,3).map(function(e){return e.stakeholder+' ('+e.subject.substring(0,25)+'...)';}).join(', ');
    txt.innerHTML='<strong style="color:#f57f17;display:block;margin-bottom:4px">'+overdueEmails.length+' email'+(overdueEmails.length>1?'s have':' has')+' no reply yet!</strong><span style="font-size:12px;color:#e65100">'+names+'</span>';
    var btn=document.createElement('button');btn.className='btn btn-sm';btn.style.cssText='background:#f57f17;color:#fff;border-color:#f57f17';
    btn.textContent='View Email Tracker';btn.onclick=function(){document.getElementById('nav-emailtracker').click();};
    box.appendChild(txt);box.appendChild(btn);alertDiv.appendChild(box);
  }

  if(dueSoonEmails.length){
    var box2=document.createElement('div');
    box2.style.cssText='background:#e8f5e9;border:1px solid #a5d6a7;border-radius:10px;padding:10px 14px;font-size:13px;color:#2e7d32';
    var names2=dueSoonEmails.map(function(e){return e.stakeholder;}).join(', ');
    box2.textContent='Reminder: Response expected today/tomorrow from '+names2;
    alertDiv.appendChild(box2);
  }

  var metrics=document.getElementById('dash-metrics');
  if(metrics) metrics.parentNode.insertBefore(alertDiv,metrics);
}

// ── SIDEBAR GROUP TOGGLE ──
function toggleGroup(id){
  var grp=document.getElementById(id);
  var chevId='chev-'+id.replace('grp-','');
  var chev=document.getElementById(chevId);
  if(!grp) return;
  var isOpen=grp.classList.contains('open');
  if(isOpen){
    grp.classList.remove('open');
    if(chev) chev.classList.remove('open');
  } else {
    grp.classList.add('open');
    if(chev) chev.classList.add('open');
  }
}

// Set all chevrons to open state on load
document.addEventListener('DOMContentLoaded',function(){
  ['compliance','comm','risk','stake','admin'].forEach(function(g){
    var chev=document.getElementById('chev-'+g);
    if(chev) chev.classList.add('open');
  });
});

// ── GLOBAL SEARCH ──
var searchTimer = null;

function onSearchInput(val){
  var clearBtn = document.getElementById('search-clear-btn');
  if(clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  clearTimeout(searchTimer);
  if(!val || val.trim().length < 2){
    hideSearchResults();
    return;
  }
  searchTimer = setTimeout(function(){ doSearch(val.trim()); }, 200);
}

function onSearchKey(e){
  if(e.key === 'Escape') clearSearch();
}

function clearSearch(){
  var inp = document.getElementById('global-search');
  if(inp) inp.value = '';
  var clearBtn = document.getElementById('search-clear-btn');
  if(clearBtn) clearBtn.style.display = 'none';
  hideSearchResults();
}

function hideSearchResults(){
  var el = document.getElementById('search-results-panel');
  if(el) el.style.display = 'none';
}

function highlight(text, query){
  if(!text || !query) return String(text || '');
  var safe = String(text);
  var ql = query.toLowerCase();
  var idx = safe.toLowerCase().indexOf(ql);
  if(idx === -1) return safe;
  return safe.substring(0, idx) +
    '<span class="search-highlight">' + safe.substring(idx, idx + query.length) + '</span>' +
    safe.substring(idx + query.length);
}

function doSearch(q){
  var ql = q.toLowerCase();
  var results = [];

  // Search compliance items
  var matchItems = items.filter(function(it){
    return (it.name && it.name.toLowerCase().indexOf(ql) > -1) ||
           (it.stakeholder && it.stakeholder.toLowerCase().indexOf(ql) > -1) ||
           (it.dept && it.dept.toLowerCase().indexOf(ql) > -1) ||
           (it.email && it.email.toLowerCase().indexOf(ql) > -1) ||
           (it.notes && it.notes.toLowerCase().indexOf(ql) > -1) ||
           (it.category && it.category.toLowerCase().indexOf(ql) > -1);
  });

  // Search risks
  var matchRisks = risks.filter(function(r){
    return (r.name && r.name.toLowerCase().indexOf(ql) > -1) ||
           (r.category && r.category.toLowerCase().indexOf(ql) > -1) ||
           (r.owner && r.owner.toLowerCase().indexOf(ql) > -1);
  });

  // Search follow-up logs
  var matchLogs = logs.filter(function(l){
    return (l.item_name && l.item_name.toLowerCase().indexOf(ql) > -1) ||
           (l.stakeholder && l.stakeholder.toLowerCase().indexOf(ql) > -1) ||
           (l.subject_used && l.subject_used.toLowerCase().indexOf(ql) > -1);
  });

  // Search tracked emails
  var matchEmails = trackedEmails.filter(function(e){
    return (e.subject && e.subject.toLowerCase().indexOf(ql) > -1) ||
           (e.stakeholder && e.stakeholder.toLowerCase().indexOf(ql) > -1) ||
           (e.email && e.email.toLowerCase().indexOf(ql) > -1) ||
           (e.category && e.category.toLowerCase().indexOf(ql) > -1);
  });

  var total = matchItems.length + matchRisks.length + matchLogs.length + matchEmails.length;
  var resultEl = document.getElementById('search-results-panel');
  var bodyEl = document.getElementById('search-results-panel');
  var titleEl = document.getElementById('search-results-panel');
  if(!resultEl || !bodyEl) return;

  titleEl.textContent = total + ' result' + (total !== 1 ? 's' : '') + ' for "' + q + '"';
  while(bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);

  if(!total){
    var emp = document.createElement('div');
    emp.className = 'search-empty';
    emp.textContent = 'No results found for "' + q + '"';
    bodyEl.appendChild(emp);
    resultEl.style.display = 'block';
    return;
  }

  function makeGroup(label, icon, iconBg, items2, makeItem){
    if(!items2.length) return;
    var grp = document.createElement('div');
    grp.className = 'search-result-group';
    var lbl = document.createElement('div');
    lbl.className = 'search-group-label';
    lbl.textContent = label + ' (' + items2.length + ')';
    grp.appendChild(lbl);
    items2.slice(0, 5).forEach(function(item){
      var row = document.createElement('div');
      row.className = 'search-result-item';
      var ico = document.createElement('div');
      ico.className = 'sri-icon';
      ico.style.background = iconBg;
      ico.innerHTML = icon;
      var info = document.createElement('div');
      info.style.flex = '1';
      info.style.minWidth = '0';
      var res = makeItem(item, q);
      var title = document.createElement('div');
      title.className = 'sri-title';
      title.innerHTML = res.title;
      var sub = document.createElement('div');
      sub.className = 'sri-sub';
      sub.textContent = res.sub;
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.style.cssText = res.badgeStyle + ';cursor:default;font-size:10px;float:right;margin-top:2px';
      badge.textContent = res.badge;
      info.appendChild(title);
      info.appendChild(sub);
      row.appendChild(ico);
      row.appendChild(info);
      row.appendChild(badge);
      row.onclick = res.onclick;
      grp.appendChild(row);
    });
    if(items2.length > 5){
      var more = document.createElement('div');
      more.style.cssText = 'font-size:11px;color:#7c8298;padding:6px 16px;text-align:center';
      more.textContent = '+ ' + (items2.length - 5) + ' more results';
      grp.appendChild(more);
    }
    bodyEl.appendChild(grp);
  }

  // Compliance items
  makeGroup('Compliance items',
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/></svg>',
    '#4f52d9', matchItems,
    function(it, q){
      var s = getStatus(it);
      var sColor = s==='done'?'#065f46':s==='overdue'?'#d93f3f':'#92400e';
      var sBg = s==='done'?'#e0f7f2':s==='overdue'?'#fdeaea':'#fef3e2';
      return {
        title: highlight(it.name, q),
        sub: (it.stakeholder||'') + (it.dept?' · '+it.dept:'') + (it.due_date?' · Due: '+it.due_date:''),
        badge: s.charAt(0).toUpperCase()+s.slice(1),
        badgeStyle: 'background:'+sBg+';color:'+sColor,
        onclick: function(){
          clearSearch();
          document.getElementById('nav-items').click();
          setTimeout(function(){
            var rows = document.querySelectorAll('#items-body .item-row');
            rows.forEach(function(row){
              if(row.getAttribute('data-id') == it.id) row.click();
            });
          }, 500);
        }
      };
    }
  );

  // Risks
  makeGroup('Risk register',
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
    '#d93f3f', matchRisks,
    function(r, q){
      var score = r.likelihood * r.impact;
      var lv = score>=15?'High':score>=8?'Medium':'Low';
      var lvColor = score>=15?'#d93f3f':score>=8?'#e07d1a':'#0d9e7e';
      var lvBg = score>=15?'#fdeaea':score>=8?'#fef3e2':'#e0f7f2';
      return {
        title: highlight(r.name, q),
        sub: r.category + (r.owner?' · Owner: '+r.owner:'') + ' · Score: '+score+'/25',
        badge: lv,
        badgeStyle: 'background:'+lvBg+';color:'+lvColor,
        onclick: function(){
          clearSearch();
          document.getElementById('nav-risks').click();
        }
      };
    }
  );

  // Follow-up logs
  makeGroup('Follow-up logs',
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>',
    '#0d9e7e', matchLogs,
    function(l, q){
      return {
        title: highlight(l.item_name, q),
        sub: 'To: ' + l.stakeholder + ' · Follow-up #' + l.followup_num + ' · ' + l.log_date + (l.subject_used?' · '+l.subject_used:''),
        badge: l.followup_type || 'Follow-up',
        badgeStyle: 'background:#eeeffe;color:#4f52d9',
        onclick: function(){
          clearSearch();
          document.getElementById('nav-email').click();
        }
      };
    }
  );

  // Tracked emails
  makeGroup('Email tracker',
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,6 12,13 2,6"/></svg>',
    '#e07d1a', matchEmails,
    function(e, q){
      var isOverdue = !e.replied && e.response_deadline && e.response_deadline < today();
      var status = e.replied ? 'Replied' : isOverdue ? 'No reply' : 'Waiting';
      var sColor = e.replied?'#065f46':isOverdue?'#d93f3f':'#4f52d9';
      var sBg = e.replied?'#e0f7f2':isOverdue?'#fdeaea':'#eeeffe';
      return {
        title: highlight(e.subject, q),
        sub: 'To: ' + e.stakeholder + ' (' + (e.email||'') + ') · Sent: ' + e.date_sent,
        badge: status,
        badgeStyle: 'background:'+sBg+';color:'+sColor,
        onclick: function(){
          clearSearch();
          document.getElementById('nav-emailtracker').click();
        }
      };
    }
  );

  resultEl.style.display = 'block';
}

// Close search when clicking outside
document.addEventListener('click', function(e){
  var wrap = document.getElementById('search-results-panel');
  var results = document.getElementById('search-results-panel');
  if(wrap && results && !wrap.contains(e.target) && !results.contains(e.target)){
    hideSearchResults();
  }
});

// ── GLOBAL SEARCH ──
var searchTimeout = null;
var searchVisible = false;

function onGlobalSearch(val){
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(function(){ runSearch(val.trim()); }, 180);
}

function showSearchResults(){
  var q = document.getElementById('global-search').value.trim();
  if(q.length >= 1){
    document.getElementById('search-results-panel').style.display = 'block';
    searchVisible = true;
  }
}

function hideSearchResultsDelay(){
  setTimeout(function(){
    document.getElementById('search-results-panel').style.display = 'none';
    searchVisible = false;
  }, 200);
}

function highlightText(text, query){
  if(!query || !text) return text || '';
  var safe = text.toString();
  var idx = safe.toLowerCase().indexOf(query.toLowerCase());
  if(idx === -1) return safe;
  return safe.substring(0, idx) +
    '<span class="search-highlight">' + safe.substring(idx, idx + query.length) + '</span>' +
    safe.substring(idx + query.length);
}

function runSearch(q){
  var panel = document.getElementById('search-results-panel');
  panel.style.display = 'block';
  searchVisible = true;

  if(!q || q.length < 1){
    panel.innerHTML = '<div class="search-empty">Start typing to search across all sections...</div>';
    return;
  }

  var ql = q.toLowerCase();
  var results = [];

  // Search compliance items
  items.forEach(function(it){
    var match = (it.name && it.name.toLowerCase().indexOf(ql) > -1) ||
      (it.stakeholder && it.stakeholder.toLowerCase().indexOf(ql) > -1) ||
      (it.dept && it.dept.toLowerCase().indexOf(ql) > -1) ||
      (it.category && it.category.toLowerCase().indexOf(ql) > -1) ||
      (it.notes && it.notes.toLowerCase().indexOf(ql) > -1) ||
      (it.email && it.email.toLowerCase().indexOf(ql) > -1);
    if(match){
      var s = getStatus(it);
      results.push({
        type: 'item',
        title: it.name,
        sub: it.stakeholder + (it.dept ? ' · ' + it.dept : '') + ' · ' + s.charAt(0).toUpperCase() + s.slice(1),
        color: s === 'done' ? '#0d9e7e' : s === 'overdue' ? '#d93f3f' : '#e07d1a',
        bg: s === 'done' ? '#e0f7f2' : s === 'overdue' ? '#fdeaea' : '#fef3e2',
        icon: s === 'done' ? '✓' : s === 'overdue' ? '!' : '·',
        action: 'nav-items',
        label: 'Compliance'
      });
    }
  });

  // Search risks
  risks.forEach(function(r){
    var match = (r.name && r.name.toLowerCase().indexOf(ql) > -1) ||
      (r.category && r.category.toLowerCase().indexOf(ql) > -1) ||
      (r.owner && r.owner.toLowerCase().indexOf(ql) > -1);
    if(match){
      var score = r.likelihood * r.impact;
      var lv = score >= 15 ? 'High' : score >= 8 ? 'Medium' : 'Low';
      var lc = score >= 15 ? '#d93f3f' : score >= 8 ? '#e07d1a' : '#0d9e7e';
      results.push({
        type: 'risk',
        title: r.name,
        sub: r.category + ' · Score: ' + score + '/25 · ' + lv + ' risk' + (r.owner ? ' · Owner: ' + r.owner : ''),
        color: lc,
        bg: score >= 15 ? '#fdeaea' : score >= 8 ? '#fef3e2' : '#e0f7f2',
        icon: '⚠',
        action: 'nav-risks',
        label: 'Risk'
      });
    }
  });

  // Search follow-up logs
  logs.forEach(function(l){
    var match = (l.item_name && l.item_name.toLowerCase().indexOf(ql) > -1) ||
      (l.stakeholder && l.stakeholder.toLowerCase().indexOf(ql) > -1) ||
      (l.subject_used && l.subject_used.toLowerCase().indexOf(ql) > -1) ||
      (l.followup_type && l.followup_type.toLowerCase().indexOf(ql) > -1);
    if(match){
      results.push({
        type: 'log',
        title: l.subject_used || ('Follow-up #' + l.followup_num + ' — ' + l.item_name),
        sub: 'To: ' + l.stakeholder + ' · FU #' + l.followup_num + ' · ' + l.log_date + (l.response_received ? ' · Replied' : ' · No reply yet'),
        color: '#4f52d9',
        bg: '#eeeffe',
        icon: '✉',
        action: 'nav-email',
        label: 'Follow-up'
      });
    }
  });

  // Search tracked emails
  trackedEmails.forEach(function(e){
    var match = (e.subject && e.subject.toLowerCase().indexOf(ql) > -1) ||
      (e.stakeholder && e.stakeholder.toLowerCase().indexOf(ql) > -1) ||
      (e.email && e.email.toLowerCase().indexOf(ql) > -1) ||
      (e.category && e.category.toLowerCase().indexOf(ql) > -1) ||
      (e.body && e.body.toLowerCase().indexOf(ql) > -1);
    if(match){
      var st = e.replied ? 'Replied' : (e.response_deadline && e.response_deadline < today() ? 'No reply — overdue' : 'Waiting');
      var sc = e.replied ? '#0d9e7e' : (e.response_deadline && e.response_deadline < today() ? '#d93f3f' : '#4f52d9');
      results.push({
        type: 'email',
        title: e.subject,
        sub: 'To: ' + e.stakeholder + ' · ' + e.date_sent + ' · ' + st,
        color: sc,
        bg: e.replied ? '#e0f7f2' : (e.response_deadline && e.response_deadline < today() ? '#fdeaea' : '#eeeffe'),
        icon: '@',
        action: 'nav-emailtracker',
        label: 'Email'
      });
    }
  });

  // Search users
  users.forEach(function(u){
    var match = (u.name && u.name.toLowerCase().indexOf(ql) > -1) ||
      (u.email && u.email.toLowerCase().indexOf(ql) > -1) ||
      (u.role && u.role.toLowerCase().indexOf(ql) > -1);
    if(match && can('admin')){
      results.push({
        type: 'user',
        title: u.name,
        sub: u.email + ' · Role: ' + u.role.charAt(0).toUpperCase() + u.role.slice(1),
        color: '#7c8298',
        bg: '#f0f2f8',
        icon: 'U',
        action: 'nav-admin',
        label: 'User'
      });
    }
  });

  // Render results
  panel.innerHTML = '';

  if(!results.length){
    var emp = document.createElement('div');
    emp.className = 'search-empty';
    emp.innerHTML = 'No results found for <strong>"' + q + '"</strong>';
    panel.appendChild(emp);
    return;
  }

  // Group by type
  var typeOrder = ['item','risk','log','email','user'];
  var typeLabels = {item:'Compliance Items',risk:'Risks',log:'Follow-up Logs',email:'Tracked Emails',user:'Users'};

  typeOrder.forEach(function(type){
    var group = results.filter(function(r){ return r.type === type; });
    if(!group.length) return;

    var header = document.createElement('div');
    header.className = 'search-section-title';
    header.textContent = typeLabels[type] + ' (' + group.length + ')';
    panel.appendChild(header);

    group.slice(0, 5).forEach(function(r){
      var item = document.createElement('div');
      item.className = 'search-item';

      var iconDiv = document.createElement('div');
      iconDiv.className = 'search-icon';
      iconDiv.style.cssText = 'background:' + r.bg + ';color:' + r.color + ';font-weight:700';
      iconDiv.textContent = r.icon;

      var textDiv = document.createElement('div');
      textDiv.style.minWidth = '0';

      var titleDiv = document.createElement('div');
      titleDiv.className = 'search-item-title';
      titleDiv.innerHTML = highlightText(r.title, q);

      var subDiv = document.createElement('div');
      subDiv.className = 'search-item-sub';
      subDiv.textContent = r.sub;

      textDiv.appendChild(titleDiv);
      textDiv.appendChild(subDiv);
      item.appendChild(iconDiv);
      item.appendChild(textDiv);

      (function(action){
        item.onclick = function(){
          document.getElementById('global-search').value = '';
          panel.style.display = 'none';
          var navBtn = document.getElementById(action);
          if(navBtn) navBtn.click();
        };
      })(r.action);

      panel.appendChild(item);
    });

    if(group.length > 5){
      var more = document.createElement('div');
      more.style.cssText = 'padding:8px 14px;font-size:11px;color:#7c8298;text-align:center;border-bottom:0.5px solid #f0f2f8';
      more.textContent = '+ ' + (group.length - 5) + ' more results in ' + typeLabels[type];
      panel.appendChild(more);
    }
  });

  // Total count footer
  var footer = document.createElement('div');
  footer.style.cssText = 'padding:8px 14px;font-size:11px;color:#b0b6c8;text-align:center;background:#f9fafb;border-top:1px solid #e2e5f0;border-radius:0 0 10px 10px';
  footer.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' found';
  panel.appendChild(footer);
}

// Close search on Escape key
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    document.getElementById('global-search').value = '';
    document.getElementById('search-results-panel').style.display = 'none';
  }
  // Ctrl+K or Cmd+K to focus search
  if((e.ctrlKey || e.metaKey) && e.key === 'k'){
    e.preventDefault();
    var el = document.getElementById('global-search');
    if(el){ el.focus(); el.select(); }
  }
});


// ── SESSION PERSISTENCE ──
async function restoreSession(){
  try{
    var session = await decryptFromStore('grc-session');
    if(!session) return false;
    var user    = session.user || session;
    var expires = session.expires || null;
    if(expires && Date.now() > expires){
      localStorage.removeItem('grc-session');
      return false;
    }
    if(!user||!user.id||!user.email) return false;
    // Verify user still exists in database
    var res = await fetch(SUPA_URL+'/rest/v1/grc_users?id=eq.'+user.id+'&select=id,name,email,role',{
      method:'GET',
      headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Accept':'application/json'},
      mode:'cors'
    });
    if(!res.ok) return false;
    var data = await res.json();
    if(!Array.isArray(data)||!data.length){ localStorage.removeItem('grc-session'); return false; }
    // Refresh session with latest user data (no password field)
    var safeUser=data[0];
    currentUser = safeUser;
    var newSession={user:safeUser,expires:session.expires,loginTime:session.loginTime||Date.now()};
    encryptAndStore('grc-session',newSession);
    setupAppUI();
    startSessionMonitor();
    loadAIKeyFromSupabase();
    await loadAll();
    return true;
  }catch(e){
    console.log('Session restore failed:',e.message);
    return false;
  }
}

function setupAppUI(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-app').style.display='flex';
  var r=currentUser.role;

  // Avatar initials
  var ini=currentUser.name.split(' ').map(function(w){return w[0]||'';}).join('').substring(0,2).toUpperCase();
  document.getElementById('user-av').textContent=ini;
  document.getElementById('user-av').style.background=RC[r]||'#4f52d9';
  document.getElementById('user-nm').textContent=currentUser.name;

  // Role label
  var rlEl=document.getElementById('user-rl');
  if(rlEl){
    var roleLabels={admin:'Admin',manager:'Manager',viewer:'Read only',stakeholder:'Stakeholder'};
    rlEl.textContent=roleLabels[r]||r;
  }

  // Helper: set display on element
  function show(id,visible,flex){
    var el=document.getElementById(id);
    if(!el) return;
    if(!visible){ el.style.display='none'; return; }
    el.style.display=flex?'flex':'';
  }

  // ALL nav buttons - start by showing everything, then hide based on role
  var allNavs=['nav-dash','nav-items','nav-overdue','nav-import','nav-export',
               'nav-email','nav-emailtracker','nav-response','nav-risks',
               'nav-actions','nav-evidence','nav-scorecard','nav-portal','nav-admin'];
  var allGrps=['grp-compliance','grp-comm','grp-risk','grp-actions','grp-stake','grp-admin'];

  // Reset - show all first
  allNavs.forEach(function(id){ show(id,true); });
  allGrps.forEach(function(id){ show(id,true); });
  show('admin-sec',true);
  show('add-item-card',true,true);
  show('add-risk-card',true,true);

  // Role-specific hiding
  var hideNavs=[], hideGrps=[], hideEls=[];

  if(r==='stakeholder'){
    // Stakeholder: ONLY dashboard + their own items
    hideNavs=['nav-overdue','nav-import','nav-export','nav-email','nav-emailtracker',
              'nav-response','nav-risks','nav-scorecard','nav-portal','nav-admin',
              'nav-actions','nav-evidence','nav-frameworks','nav-calendar'];
    hideGrps=['grp-comm','grp-risk','grp-stake','grp-actions','grp-admin','grp-frameworks','grp-calendar'];
    hideEls=['admin-sec','add-item-card','add-risk-card'];
  }
  else if(r==='viewer'){
    // Viewer: sees all data pages but cannot add/edit/import/email
    hideNavs=['nav-import','nav-email','nav-emailtracker','nav-response',
              'nav-actions','nav-evidence','nav-admin'];
    hideGrps=['grp-comm','grp-actions','grp-admin'];
    hideEls=['admin-sec','add-item-card','add-risk-card'];
  }
  else if(r==='manager'){
    // Manager: full access except delete + manage users
    hideNavs=['nav-admin'];
    hideGrps=['grp-admin'];
    hideEls=['admin-sec'];
  }
  else {
    // Admin: full access - show everything
    hideNavs=[];
    hideGrps=[];
    hideEls=[];
  }

  hideNavs.forEach(function(id){ show(id,false); });
  hideGrps.forEach(function(id){ show(id,false); });
  hideEls.forEach(function(id){ show(id,false); });

  // AI assistant button
  var floatBtn=document.getElementById('ai-float-btn');
  if(floatBtn) floatBtn.style.display='flex';

  // Wire export buttons for ALL roles (with permission checks inside)
  setTimeout(wireExportButtons, 150);
}
// Run session restore on page load
window.addEventListener('load', async function(){
  var savedTheme = localStorage.getItem('grc-theme')||'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeBtn(savedTheme);

  // Hide both screens while we figure out auth state
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-app').style.display='none';

  if(checkPortalMode()) return;

  // ── Step 1: Did Google just redirect back? ──
  var hash=window.location.hash||'';
  var search=window.location.search||'';
  var isOAuthReturn = hash.includes('access_token') ||
                      hash.includes('error_description') ||
                      search.includes('code=');

  if(isOAuthReturn){
    document.getElementById('login-screen').style.display='flex';
    var handled = await handleOAuthCallback();
    if(handled) return; // resolveUserAndEnter already called setupAppUI
    document.getElementById('login-screen').style.display='flex';
    return;
  }

  // ── Step 2: Try restoring existing session ──
  var restored = await restoreSession();
  if(!restored){
    document.getElementById('login-screen').style.display='flex';
  }
});

// ── SKELETON LOADING ──
function showSkeleton(tbId, cols, rows){
  var tb=document.getElementById(tbId);
  if(!tb) return;
  var html='';
  for(var i=0;i<(rows||5);i++){
    html+='<tr>';
    for(var j=0;j<cols;j++){
      var w=[60,40,30,25,20,15][j]||20;
      html+='<td style="padding:12px 16px"><div class="skeleton sk-line" style="width:'+w+'%;height:11px"></div></td>';
    }
    html+='</tr>';
  }
  tb.innerHTML=html;
}

function showDashSkeleton(){
  // Metric cards skeleton
  var dm=document.getElementById('dash-metrics');
  if(dm){
    dm.querySelectorAll('.mc-val').forEach(function(el){el.textContent='—';});
    dm.querySelectorAll('.mc-sub').forEach(function(el){el.innerHTML='<div class="skeleton sk-line" style="width:60%;height:9px"></div>';});
  }
  // Chart skeletons
  var dept=document.getElementById('dept-bars');
  if(dept){
    var skHtml='';
    for(var i=0;i<4;i++){
      skHtml+='<div class="dept-bar-row"><div class="dept-bar-top"><div class="skeleton sk-line" style="width:80px;height:10px"></div><div class="skeleton sk-line" style="width:30px;height:10px"></div></div><div class="dept-bar-track"><div class="skeleton" style="width:'+(40+i*15)+'%;height:8px;border-radius:4px"></div></div></div>';
    }
    dept.innerHTML=skHtml;
  }

}

var originalLoadAll = null;

// ── SESSION SECURITY ──
var sessionCheckInterval = null;

function startSessionMonitor(){
  if(sessionCheckInterval) clearInterval(sessionCheckInterval);
  sessionCheckInterval = setInterval(function(){
    var saved = localStorage.getItem('grc-session');
    if(!saved){
      clearInterval(sessionCheckInterval);
      forceLogout('Session ended. Please log in again.');
      return;
    }
    try{
      var session = JSON.parse(saved);
      var expires = session.expires || null;
      if(!expires) return;
      var remaining = expires - Date.now();
      // 5 minutes warning
      if(remaining > 0 && remaining <= 5*60*1000){
        showSessionWarning(Math.ceil(remaining/60000));
      }
      // Expired
      if(remaining <= 0){
        clearInterval(sessionCheckInterval);
        forceLogout('Your session has expired after 8 hours. Please log in again.');
      }
    }catch(e){}
  }, 30000); // check every 30 seconds
}

function showSessionWarning(minsLeft){
  var existing = document.getElementById('session-warning');
  if(existing) return; // already showing
  var warn = document.createElement('div');
  warn.id = 'session-warning';
  warn.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#e07d1a;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:9999;display:flex;align-items:center;gap:12px;box-shadow:0 4px 16px rgba(0,0,0,.2)';
  warn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Session expires in '+minsLeft+' minute'+(minsLeft>1?'s':'')+'. Save your work.<button onclick="extendSession()" style="margin-left:12px;background:rgba(255,255,255,.2);border:none;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px;font-family:inherit">Stay logged in</button><button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:16px;line-height:1;padding:0 4px">×</button>';
  document.body.appendChild(warn);
}

function extendSession(){
  var saved = localStorage.getItem('grc-session');
  if(!saved) return;
  try{
    var session = JSON.parse(saved);
    session.expires = Date.now() + (8*60*60*1000);
    localStorage.setItem('grc-session', JSON.stringify(session));
    var warn = document.getElementById('session-warning');
    if(warn) warn.remove();
    showDueDateToast('','Session extended by 8 hours.');
  }catch(e){}
}

function forceLogout(msg){
  localStorage.removeItem('grc-session');
  currentUser = null;
  var aiPanel = document.getElementById('ai-chat-panel');
  if(aiPanel) aiPanel.style.display = 'none';
  var aiBtn = document.getElementById('ai-float-btn');
  if(aiBtn) aiBtn.style.display = 'none';
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-err').textContent = msg;
  document.getElementById('login-err').style.display = 'block';
}


// ── EMAIL MODULE FUNCTIONS ──
function updateFuNum(){
  var el=document.getElementById('fu-num-display');
  var lbl=document.getElementById('fu-num-label');
  if(el) el.textContent=fuNum;
  if(lbl){var s=fuNum===1?'st':fuNum===2?'nd':fuNum===3?'rd':'th';lbl.textContent=fuNum+s+' reminder';}
}

function autoSubject(it,tone){
  var m={
    gentle:'[Reminder #'+fuNum+'] Action required: '+it.name,
    firm:'[Follow-up #'+fuNum+'] Pending: '+it.name+' — '+it.dept,
    escalation:'[Escalation #'+fuNum+'] URGENT: '+it.name+' — '+it.stakeholder,
    final:'[FINAL NOTICE #'+fuNum+'] Non-compliance: '+it.name
  };
  var el=document.getElementById('fu-subject');
  if(el) el.value=m[tone]||m.gentle;
}

function buildEmail(it,tone,num,sender){
  var NL='\n';
  var ord=num===1?'1st':num===2?'2nd':num===3?'3rd':num+'th';
  var prev=num-1;
  var prevTxt=prev>0?prev+' previous reminder'+(prev>1?'s':''):'our earlier communication';
  var L2s={
    gentle:'I hope this message finds you well. This is our '+ord+' reminder regarding the following compliance task which remains pending.',
    firm:'This is our '+ord+' follow-up. Despite '+prevTxt+', the task below remains incomplete.',
    escalation:'Despite '+prevTxt+', the following task is still incomplete. This matter is now being formally escalated.',
    final:'FINAL NOTICE. After '+prevTxt+' with no action, this is your final opportunity to complete the task.'
  };
  var L3='Task           : '+it.name+NL+'Frequency      : '+(FL[it.freq]||it.freq)+NL+'Due date       : '+(it.due_date||'As discussed')+NL+'Department     : '+(it.dept||'Your team')+NL+'Follow-up no.  : '+num+NL+'Status         : '+(it.done?'Done':'Pending');
  var L4s={
    gentle:'Kindly complete this at your earliest convenience and confirm by reply.',
    firm:'Please treat this as urgent and complete immediately. Confirm by reply.',
    escalation:'Please complete IMMEDIATELY and respond within 24 hours. Non-compliance will be recorded in the audit report.',
    final:'Failure to act will result in formal escalation to senior management. No further reminders will be issued.'
  };
  var sign='Best regards,'+NL+sender+NL+'Compliance Team — Clarix';
  return 'Dear '+it.stakeholder+','+NL+NL+(L2s[tone]||L2s.gentle)+NL+NL+L3+NL+NL+(L4s[tone]||L4s.gentle)+NL+NL+sign;
}

function buildSmartEmail(it,tone,num,sender,extra,ord){
  var NL='\n';
  var prev=num-1;
  var prevTxt=prev>0?prev+' previous reminder'+(prev>1?'s':''):'our earlier communication';
  var opens={
    gentle:'I hope this message finds you well.',
    firm:'I am writing to follow up on our previous reminder(s) regarding an important compliance matter.',
    escalation:'This email is to formally notify you of a serious compliance concern that requires your immediate attention.',
    final:'This is a final and urgent notice regarding a critical compliance obligation.'
  };
  var contexts={
    gentle:'This is a friendly '+ord+' reminder that the following compliance task is currently pending:',
    firm:'Despite '+prevTxt+', the following compliance task remains incomplete:',
    escalation:'After '+prevTxt+' with no response, this matter is now being formally escalated:',
    final:'After '+prevTxt+' and no action, this serves as your final notice:'
  };
  var details='Task Name      : '+it.name+NL+'Frequency      : '+(FL[it.freq]||it.freq)+NL+'Due Date       : '+(it.due_date||'As discussed')+NL+'Department     : '+(it.dept||'Your team')+NL+'Follow-up No.  : '+num;
  var extraBlock='';
  if(extra){
    var el=extra.toLowerCase();
    var msgs={audit:NL+'Please note that our audit is approaching.',penalty:NL+'Non-compliance may result in regulatory penalties.',deadline:NL+'The deadline for this task is firm and cannot be extended.',gdpr:NL+'This task is directly related to our GDPR obligations.',iso:NL+'This task is part of our ISO 27001 compliance program.'};
    var matched=false;
    for(var k in msgs){if(el.indexOf(k)>-1){extraBlock=msgs[k];matched=true;break;}}
    if(!matched) extraBlock=NL+extra.charAt(0).toUpperCase()+extra.slice(1)+'.';
  }
  var closes={
    gentle:'Kindly complete this task and confirm by replying to this email. Thank you for your cooperation.',
    firm:'Please complete this task immediately and confirm completion by reply.',
    escalation:'Please complete this task IMMEDIATELY and respond within 24 hours.',
    final:'You are required to complete this task within 24 hours. No further reminders will be issued.'
  };
  var sign='Best regards,'+NL+sender+NL+'Compliance Team — Clarix';
  return 'Dear '+it.stakeholder+','+NL+NL+(opens[tone]||opens.gentle)+NL+NL+(contexts[tone]||contexts.gentle)+NL+NL+details+extraBlock+NL+NL+(closes[tone]||closes.gentle)+NL+NL+sign;
}

function showEmail(it,tone,subj,body){
  var toneLabels={gentle:'Gentle',firm:'Firm',escalation:'Escalation',final:'Final notice'};
  var cc=document.getElementById('fu-cc')?document.getElementById('fu-cc').value.trim():'';
  currentEmail={itemId:it.id,itemName:it.name,stakeholder:it.stakeholder,email:it.email,num:fuNum,type:toneLabels[tone]||tone,subject:subj,body:body,cc:cc};
  var toEl=document.getElementById('email-to');
  var subEl=document.getElementById('email-subject-edit');
  var bodyEl=document.getElementById('email-body-edit');
  var fuBadge=document.getElementById('email-fu-badge');
  var toneBadge=document.getElementById('email-tone-badge');
  var ccShow=document.getElementById('email-cc-show');
  var ccVal=document.getElementById('email-cc-val');
  var resultEl=document.getElementById('email-result');
  if(toEl) toEl.textContent=(it.email||it.stakeholder);
  if(subEl) subEl.value=subj;
  if(bodyEl) bodyEl.value=body;
  if(fuBadge) fuBadge.textContent='Follow-up #'+fuNum;
  if(toneBadge) toneBadge.textContent=toneLabels[tone]||tone;
  if(ccShow) ccShow.style.display=cc?'inline':'none';
  if(ccVal) ccVal.textContent=cc;
  if(resultEl){resultEl.style.display='block';resultEl.scrollIntoView({behavior:'smooth'});}
}

function renderLog(){
  var tb=document.getElementById('log-body');
  if(!tb) return;
  if(!logs.length){tb.innerHTML='<tr><td colspan="6" class="empty">No follow-ups logged yet.</td></tr>';return;}
  while(tb.firstChild) tb.removeChild(tb.firstChild);
  logs.forEach(function(l,idx){
    var badge=l.followup_type==='Escalation'?'b-overdue':l.followup_type==='Firm'?'b-pending':l.followup_type==='Final notice'?'b-overdue':'b-done';
    var shortSubj=l.subject_used?(l.subject_used.length>35?l.subject_used.substring(0,35)+'...':l.subject_used):'—';
    var scoreColor=l.followup_type==='Escalation'||l.followup_type==='Final notice'?'#d93f3f':l.followup_type==='Firm'?'#e07d1a':'#0d9e7e';
    var tr=document.createElement('tr');
    tr.className='log-row';
    tr.setAttribute('data-idx',idx);
    tr.style.cursor='pointer';
    function cell(text,css){var td=document.createElement('td');td.textContent=text||'—';if(css)td.style.cssText=css;return td;}
    var td1=document.createElement('td');td1.title=l.item_name;td1.innerHTML='<span style="display:flex;align-items:center;gap:6px"><span style="font-size:10px;color:var(--text3)" class="log-arrow" id="log-arrow-'+idx+'">▶</span>'+l.item_name+'</span>';
    tr.appendChild(td1);
    tr.appendChild(cell(l.stakeholder));
    var td3=document.createElement('td');td3.style.cssText='text-align:center;font-weight:700;color:#4f52d9';td3.textContent='#'+l.followup_num;tr.appendChild(td3);
    tr.appendChild(cell(l.log_date,'font-size:12px'));
    var td5=document.createElement('td');td5.innerHTML='<span class="badge '+badge+'" style="cursor:default">'+l.followup_type+'</span>';tr.appendChild(td5);
    var td6=document.createElement('td');td6.title=l.subject_used||'';td6.style.cssText='font-size:12px;color:var(--text2)';td6.textContent=shortSubj;tr.appendChild(td6);
    tb.appendChild(tr);
    tr.addEventListener('click',function(){
      var detail=document.getElementById('log-detail-'+idx);
      var arrow=document.getElementById('log-arrow-'+idx);
      var isOpen=detail&&detail.style.display!=='none';
      tb.querySelectorAll('.log-detail-row').forEach(function(d){d.style.display='none';});
      tb.querySelectorAll('.log-arrow').forEach(function(a){a.textContent='▶';a.style.color='var(--text3)';});
      if(!isOpen&&detail){detail.style.display='table-row';if(arrow){arrow.textContent='▼';arrow.style.color='#4f52d9';}}
      else if(!detail){
        var dtr=document.createElement('tr');dtr.className='log-detail-row';dtr.id='log-detail-'+idx;
        var dtd=document.createElement('td');dtd.colSpan=6;dtd.style.cssText='padding:0;white-space:normal;overflow:visible';
        dtd.innerHTML='<div style="background:var(--hover);border-left:3px solid '+scoreColor+';padding:14px 16px">'+
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:12px">'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Task</div><div style="color:var(--text);font-weight:500">'+l.item_name+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Stakeholder</div><div style="color:var(--text)">'+l.stakeholder+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Follow-up #</div><div style="color:#4f52d9;font-weight:700;font-size:16px">#'+l.followup_num+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Date</div><div style="color:var(--text)">'+l.log_date+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Tone</div><div><span class="badge '+badge+'" style="cursor:default">'+l.followup_type+'</span></div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">Subject</div><div style="color:var(--text);word-break:break-word">'+(l.subject_used||'—')+'</div></div>'+
          '</div></div>';
        dtr.appendChild(dtd);
        tr.parentNode.insertBefore(dtr,tr.nextSibling);
      }
    });
  });
}

function renderEmailTab(){
  var sel=document.getElementById('fu-select');
  if(!sel) return;
  var prev=sel.value;
  sel.innerHTML='<option value="">-- select item --</option>';
  items.forEach(function(it){
    var opt=document.createElement('option');
    opt.value=it.id;opt.textContent=it.name+' — '+it.stakeholder;
    sel.appendChild(opt);
  });
  if(prev) sel.value=prev;
  renderLog();
}

// ── RISKS ──
function riskLevel(s){return s>=15?'high':s>=8?'medium':'low';}

// ── RISK VIEW TOGGLE ──
var riskView = 'heatmap';

function setRiskView(view){
  riskView = view;
  var hmBtn = document.getElementById('risk-view-heatmap');
  var tbBtn = document.getElementById('risk-view-table');
  var hmView = document.getElementById('risk-heatmap-view');
  var tbView = document.getElementById('risk-table-view');
  if(view === 'heatmap'){
    if(hmBtn){hmBtn.style.background='var(--primary)';hmBtn.style.color='#fff';hmBtn.style.fontWeight='600';}
    if(tbBtn){tbBtn.style.background='var(--surface)';tbBtn.style.color='var(--text2)';tbBtn.style.fontWeight='500';}
    if(hmView) hmView.style.display='';
    if(tbView) tbView.style.display='none';
    renderHeatMap();
  } else {
    if(tbBtn){tbBtn.style.background='var(--primary)';tbBtn.style.color='#fff';tbBtn.style.fontWeight='600';}
    if(hmBtn){hmBtn.style.background='var(--surface)';hmBtn.style.color='var(--text2)';hmBtn.style.fontWeight='500';}
    if(hmView) hmView.style.display='none';
    if(tbView) tbView.style.display='';
    renderRiskTable();
  }
}

function renderHeatMap(){
  var grid = document.getElementById('risk-heatmap-grid');
  var sumEl = document.getElementById('risk-summary');
  if(!grid) return;

  // Summary cards
  if(sumEl){
    sumEl.innerHTML = '';
    var critical = risks.filter(function(r){return r.likelihood*r.impact>=15;}).length;
    var high     = risks.filter(function(r){var s=r.likelihood*r.impact;return s>=8&&s<15;}).length;
    var low      = risks.filter(function(r){return r.likelihood*r.impact<8;}).length;
    var open     = risks.filter(function(r){return (r.status||'Open').toLowerCase()!=='closed';}).length;
    [{l:'Total risks',v:risks.length,c:'var(--text)',t:'#5b5ef4'},
     {l:'Critical',   v:critical,    c:'var(--danger)',t:'#ef4444'},
     {l:'High',       v:high,        c:'var(--warning)',t:'#f59e0b'},
     {l:'Open',       v:open,        c:'var(--primary)',t:'#10b981'}
    ].forEach(function(m){
      var card=document.createElement('div');
      card.className='metric-card';
      card.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div>'+
        '<div class="mc-label" style="margin-top:4px">'+m.l+'</div>'+
        '<div class="mc-val" style="color:'+m.c+'">'+m.v+'</div>';
      sumEl.appendChild(card);
    });
  }

  // Build lookup: risks[likelihood][impact] = [risk, ...]
  var cellMap = {};
  risks.forEach(function(r){
    var l = parseInt(r.likelihood)||1;
    var i = parseInt(r.impact)||1;
    var key = l+'-'+i;
    if(!cellMap[key]) cellMap[key] = [];
    cellMap[key].push(r);
  });

  // Cell colour logic
  function cellColor(l, i){
    var score = l * i;
    if(score >= 15) return 'hm-critical';
    if(score >= 8)  return 'hm-high';
    return 'hm-low';
  }
  function cellTextColor(l, i){
    return '#fff';
  }

  // Likelihood labels (5=Almost certain top, 1=Rare bottom)
  var likelihoodLabels = ['Rare','Unlikely','Possible','Likely','Almost certain'];
  var impactLabels     = ['Insignificant','Minor','Moderate','Major','Catastrophic'];

  grid.innerHTML = '';

  // Rows: likelihood 5 (top) to 1 (bottom)
  for(var l = 5; l >= 1; l--){
    // Row label
    var rowLabel = document.createElement('div');
    rowLabel.className = 'hm-row-label';
    rowLabel.innerHTML = '<span style="font-size:10px;text-align:right;line-height:1.3"><strong>'+l+'</strong><br>'+likelihoodLabels[l-1]+'</span>';
    grid.appendChild(rowLabel);

    // 5 cells across (impact 1-5)
    for(var i = 1; i <= 5; i++){
      var score = l * i;
      var key   = l+'-'+i;
      var cellRisks = cellMap[key] || [];
      var colorClass = cellColor(l, i);
      var hasRisks   = cellRisks.length > 0;

      var cell = document.createElement('div');
      cell.className = 'hm-cell ' + (hasRisks ? colorClass : 'hm-empty');
      cell.setAttribute('data-l', l);
      cell.setAttribute('data-i', i);
      cell.setAttribute('data-score', score);
      cell.title = 'L'+l+' × I'+i+' = Score '+score+(cellRisks.length?' ('+cellRisks.length+' risk'+(cellRisks.length>1?'s':'')+')':', no risks here');

      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'hm-cell-score';
      scoreDiv.style.color = hasRisks ? '#fff' : 'var(--text3)';
      scoreDiv.textContent = score;

      cell.appendChild(scoreDiv);

      if(hasRisks){
        // Show count
        var countDiv = document.createElement('div');
        countDiv.className = 'hm-cell-count';
        countDiv.style.color = '#fff';
        countDiv.textContent = cellRisks.length+' risk'+(cellRisks.length>1?'s':'');
        cell.appendChild(countDiv);

        // Show dots for each risk (max 6)
        var dotsDiv = document.createElement('div');
        dotsDiv.className = 'hm-cell-dots';
        var maxDots = Math.min(cellRisks.length, 6);
        for(var d=0; d<maxDots; d++){
          var dot = document.createElement('div');
          dot.className = 'hm-dot';
          dotsDiv.appendChild(dot);
        }
        if(cellRisks.length > 6){
          var moreDot = document.createElement('div');
          moreDot.style.cssText='font-size:9px;color:rgba(255,255,255,.8);align-self:center';
          moreDot.textContent='+';
          dotsDiv.appendChild(moreDot);
        }
        cell.appendChild(dotsDiv);

        // Click handler — show risks in this cell
        (function(cellL, cellI, cellRiskList, cellScore, cColor){
          cell.addEventListener('click', function(){
            // Toggle selection
            var wasSelected = cell.classList.contains('selected');
            document.querySelectorAll('.hm-cell.selected').forEach(function(c){c.classList.remove('selected');});
            var detailEl = document.getElementById('risk-cell-detail');
            if(wasSelected){
              if(detailEl) detailEl.style.display='none';
              return;
            }
            cell.classList.add('selected');
            showCellDetail(cellL, cellI, cellScore, cellRiskList, cColor);
          });
        })(l, i, cellRisks.slice(), score, colorClass);
      }

      grid.appendChild(cell);
    }
  }
}

function showCellDetail(l, i, score, cellRisks, colorClass){
  var el = document.getElementById('risk-cell-detail');
  var titleEl = document.getElementById('risk-cell-title');
  var listEl = document.getElementById('risk-cell-list');
  if(!el||!listEl) return;

  var levelName = score>=15?'Critical':score>=8?'High':'Low';
  var levelColor = score>=15?'var(--danger)':score>=8?'var(--warning)':'var(--success)';
  var bgColor = score>=15?'#ef4444':score>=8?'#f59e0b':'#10b981';

  if(titleEl) titleEl.innerHTML =
    'Likelihood <strong>'+l+'</strong> × Impact <strong>'+i+'</strong> = Score <strong style="color:'+levelColor+'">'+score+'</strong> — '+
    '<span style="color:'+levelColor+'">'+levelName+'</span> zone &nbsp;·&nbsp; '+cellRisks.length+' risk'+(cellRisks.length>1?'s':'');

  listEl.innerHTML = '';
  cellRisks.forEach(function(r){
    var rScore = r.likelihood*r.impact;
    var item = document.createElement('div');
    item.className = 'risk-cell-item';

    var bubble = document.createElement('div');
    bubble.className = 'risk-score-bubble';
    bubble.style.background = bgColor;
    bubble.textContent = rScore;

    var info = document.createElement('div');
    info.style.flex = '1';
    info.style.minWidth = '0';
    var name = document.createElement('div');
    name.style.cssText = 'font-weight:600;color:var(--text);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    name.textContent = r.name;
    var meta = document.createElement('div');
    meta.style.cssText = 'font-size:11px;color:var(--text3);margin-top:2px';
    meta.textContent = (r.category||'')+(r.owner?' · '+r.owner:'')+(r.status?' · '+r.status:'');
    info.appendChild(name);info.appendChild(meta);

    var statusBadge = document.createElement('span');
    statusBadge.className='badge';
    var st=(r.status||'Open').toLowerCase();
    statusBadge.style.cssText='background:'+(st==='closed'?'var(--success-light)':st==='in progress'?'var(--warning-light)':'var(--danger-light)')+
      ';color:'+(st==='closed'?'var(--success)':st==='in progress'?'var(--warning)':'var(--danger)');
    statusBadge.textContent=r.status||'Open';

    item.appendChild(bubble);item.appendChild(info);item.appendChild(statusBadge);

    if(can('add')){
      var editBtn=document.createElement('button');
      editBtn.className='btn btn-sm';editBtn.style.fontSize='11px';editBtn.textContent='Edit';
      editBtn.onclick=function(e){e.stopPropagation();/* open edit panel */ };
      item.appendChild(editBtn);
    }

    listEl.appendChild(item);
  });

  el.style.display='';
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function renderRiskTable(){
  var tb=document.getElementById('risk-body');
  if(!tb) return;
  if(!risks.length){
    tb.innerHTML='<tr><td colspan="9" class="empty" style="padding:48px 20px;text-align:center"><div style="font-size:32px;margin-bottom:10px">🛡️</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">No risks logged yet</div><div style="font-size:13px;color:var(--text3)">Add your first risk to start tracking your organisation risk register</div></td></tr>';
    return;
  }
  while(tb.firstChild) tb.removeChild(tb.firstChild);
  var sorted=risks.slice().sort(function(a,b){return(b.likelihood*b.impact)-(a.likelihood*a.impact);});
  sorted.forEach(function(r){
    var score=r.likelihood*r.impact;
    var lv=riskLevel(score);
    var lvColors={high:['var(--danger-light)','var(--danger)'],medium:['var(--warning-light)','var(--warning)'],low:['var(--success-light)','var(--success)']};
    var lvc=lvColors[lv]||lvColors.low;
    var scoreColor=lv==='high'?'var(--danger)':lv==='medium'?'var(--warning)':'var(--success)';

    var tr=document.createElement('tr');
    tr.className='item-row';
    tr.style.height='52px';

    // Risk name
    var td1=document.createElement('td');
    td1.style.paddingLeft='16px';
    td1.innerHTML='<div style="font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px" title="'+r.name+'">'+r.name+'</div>';

    // Category
    var td2=document.createElement('td');
    td2.innerHTML='<span style="font-size:12px;color:var(--text2)">'+( r.category||'—')+'</span>';

    // Likelihood
    var td3=document.createElement('td');
    td3.style.textAlign='center';
    td3.innerHTML='<div style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:var(--surface2);border:2px solid var(--border);align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text)">'+r.likelihood+'</div>';

    // Impact
    var td4=document.createElement('td');
    td4.style.textAlign='center';
    td4.innerHTML='<div style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:var(--surface2);border:2px solid var(--border);align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text)">'+r.impact+'</div>';

    // Score
    var td5=document.createElement('td');
    td5.style.textAlign='center';
    td5.innerHTML='<div style="display:inline-flex;width:36px;height:36px;border-radius:50%;background:'+scoreColor+';align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff">'+score+'</div>';

    // Level
    var td6=document.createElement('td');
    td6.innerHTML='<span class="badge" style="background:'+lvc[0]+';color:'+lvc[1]+'">'+lv.charAt(0).toUpperCase()+lv.slice(1)+'</span>';

    // Owner
    var td7=document.createElement('td');
    td7.innerHTML='<span style="font-size:12px;color:var(--text)">'+( r.owner||'—')+'</span>';

    // Status - clickable
    var td8=document.createElement('td');
    var stSpan=document.createElement('span');
    stSpan.className='badge';
    var stColors={'Open':['var(--danger-light)','var(--danger)'],'In progress':['var(--warning-light)','var(--warning)'],'Closed':['var(--success-light)','var(--success)']};
    var stc=stColors[r.status||'Open']||stColors['Open'];
    stSpan.style.cssText='background:'+stc[0]+';color:'+stc[1]+';cursor:pointer';
    stSpan.textContent=r.status||'Open';stSpan.title='Click to change status';
    var statusList=['Open','In progress','Closed'];
    (function(rid,curSt){stSpan.onclick=async function(){
      var next=statusList[(statusList.indexOf(curSt)+1)%statusList.length];
      await api('grc_risks?id=eq.'+rid,{method:'PATCH',body:{status:next},extra:{'Prefer':'return=minimal'}});
      await loadAll();
    };})(r.id,r.status||'Open');
    td8.appendChild(stSpan);

    // Actions
    var td9=document.createElement('td');
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:5px;flex-wrap:wrap';
    if(can('delete')){
      var del=document.createElement('button');del.className='btn btn-sm';
      del.style.cssText='font-size:11px;border-color:rgba(239,68,68,.25);color:var(--danger)';del.textContent='Delete';
      (function(rid){del.onclick=async function(){
        if(!confirm('Delete this risk?')) return;
        var riskToDelete=risks.find(function(x){return x.id==rid;});
        await api('grc_risks?id=eq.'+rid,{method:'DELETE',extra:{'Prefer':'return=minimal'}});
        writeAuditLog('DELETE','Risk','Deleted risk: '+(riskToDelete?riskToDelete.name:rid));
        await loadAll();
      };})(r.id);
      wrap.appendChild(del);
    }
    td9.appendChild(wrap);

    tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);
    tr.appendChild(td5);tr.appendChild(td6);tr.appendChild(td7);tr.appendChild(td8);tr.appendChild(td9);
    tb.appendChild(tr);
  });
}

function renderRisks(){
  if(riskView==='heatmap') renderHeatMap();
  else renderRiskTable();
}




// ── RISK ADD/EDIT HANDLER ──
document.addEventListener('DOMContentLoaded', function(){
  var addRiskBtn = document.getElementById('add-risk-btn');
  if(addRiskBtn){
    addRiskBtn.onclick = async function(){
      if(!can('add')){ noPermission(); return; }
      var name  = (document.getElementById('r-name')  || {}).value||'';
      var cat   = (document.getElementById('r-cat')   || {}).value||'Operational';
      var like  = parseInt((document.getElementById('r-like')  || {}).value||3);
      var impact= parseInt((document.getElementById('r-impact')|| {}).value||3);
      var owner = (document.getElementById('r-owner') || {}).value||'';
      var notes = (document.getElementById('r-notes') || {}).value||'';
      if(!name){ alert('Please enter a risk name.'); return; }
      var res = await api('grc_risks', {
        method:'POST',
        body:{ name:name, category:cat, likelihood:like, impact:impact,
               owner:owner, notes:notes, status:'Open' },
        extra:{'Prefer':'return=minimal'}
      });
      if(!res.ok){ var e=await res.json().catch(function(){return{};}); alert('Error: '+(e.message||res.status)); return; }
      ['r-name','r-owner','r-notes'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.value='';
      });
      var rLike=document.getElementById('r-like'); if(rLike) rLike.value='3';
      var rImp=document.getElementById('r-impact'); if(rImp) rImp.value='3';
      closePanel();
      writeAuditLog('CREATE','Risk','Added risk: '+name,{likelihood:like,impact:impact,score:like*impact});
      showDueDateToast('','Risk added!');
      await loadAll();
    };
  }
});



// ════════════════════════════════════════════════
// AUDIT TRAIL — ISO 27001 A.8.15 CHANGE LOG
// ════════════════════════════════════════════════

// ── Core log writer — call after every save/delete ──
async function writeAuditLog(action, module, description, meta){
  // action: CREATE | UPDATE | DELETE | LOGIN | LOGOUT | EXPORT
  // module: Compliance Item | Risk | Action | Evidence | Policy | User | etc.
  if(!currentUser) return;
  var entry = {
    action:      action,
    module:      module,
    description: description,
    performed_by: currentUser.name,
    user_email:  currentUser.email,
    user_role:   currentUser.role,
    meta:        meta ? JSON.stringify(meta) : null,
    ip_hint:     navigator.userAgent.slice(0,80)
  };
  // Fire-and-forget — don't block the main operation
  api('grc_audit_trail', {
    method: 'POST',
    body:   entry,
    extra:  {'Prefer': 'return=minimal'}
  }).catch(function(e){ console.warn('Audit log write failed:', e.message); });
}

// ── Render audit trail page ──
async function renderAuditTrail(){
  // ── 1. Read all filter values ──
  var actionFilter = ((document.getElementById('at-filter-action')||{}).value||'').trim();
  var moduleFilter = ((document.getElementById('at-filter-module')||{}).value||'').trim();
  var userFilter   = ((document.getElementById('at-filter-user')  ||{}).value||'').toLowerCase().trim();
  var dateFrom     = ((document.getElementById('at-filter-date-from')||{}).value||'').trim();
  var dateTo       = ((document.getElementById('at-filter-date-to')||{}).value||'').trim();

  // ── 2. Normalise helpers ──
  // Map dropdown display labels → DB stored action strings (uppercase)
  var actionNorm = {
    'Created':'CREATE','Updated':'UPDATE','Deleted':'DELETE',
    'Login':'LOGIN','Logout':'LOGOUT','Export':'EXPORT',
    'CREATE':'CREATE','UPDATE':'UPDATE','DELETE':'DELETE',
    'LOGIN':'LOGIN','LOGOUT':'LOGOUT','EXPORT':'EXPORT'
  };
  var normAction = actionFilter ? (actionNorm[actionFilter]||actionFilter.toUpperCase()) : '';

  // Module values already match DB — 'Compliance Item','Risk','Action' etc.
  // But tolerate trailing 's' (e.g. 'Risks' → 'Risk')
  var moduleMap = {
    'Compliance Items':'Compliance Item','Risks':'Risk','Actions':'Action',
    'Evidences':'Evidence','Policies':'Policy','Audits':'Audit',
    'Users':'User','Control Mappings':'Control Mapping','Systems':'System'
  };
  var normModule = moduleFilter ? (moduleMap[moduleFilter]||moduleFilter) : '';

  // ── 3. If any filter active, try fresh server-side fetch (max 200) ──
  var anyFilter = normAction||normModule||userFilter||dateFrom||dateTo;
  if(anyFilter){
    try{
      var qs = 'grc_audit_trail?select=*&order=created_at.desc&limit=200';
      if(normAction) qs += '&action=eq.'+encodeURIComponent(normAction);
      if(normModule) qs += '&module=eq.'+encodeURIComponent(normModule);
      var res = await api(qs,{method:'GET'});
      if(res.ok){
        var fresh = await res.json();
        if(Array.isArray(fresh)){
          // Merge into auditLogs (de-dup by id)
          var existingIds = new Set(auditLogs.map(function(l){return l.id;}));
          fresh.forEach(function(l){ if(!existingIds.has(l.id)) auditLogs.push(l); });
        }
      }
    }catch(e){ /* silent — use cached */ }
  }

  // ── 4. Client-side filter on full auditLogs array ──
  var filtered = auditLogs.filter(function(l){
    // Action — normalise both sides to uppercase for comparison
    if(normAction){
      var lAction = (l.action||'').toUpperCase();
      if(lAction !== normAction) return false;
    }
    // Module — exact match after normalisation
    if(normModule){
      var lModule = (l.module||'').trim();
      // Also try without trailing 's' on each side
      if(lModule !== normModule && lModule+'s' !== normModule && lModule !== normModule+'s') return false;
    }
    // User — partial match on name or email
    if(userFilter){
      var byName  = (l.performed_by||'').toLowerCase().includes(userFilter);
      var byEmail = (l.user_email||'').toLowerCase().includes(userFilter);
      if(!byName && !byEmail) return false;
    }
    // Date from
    if(dateFrom && l.created_at && l.created_at.slice(0,10) < dateFrom) return false;
    // Date to
    if(dateTo   && l.created_at && l.created_at.slice(0,10) > dateTo)   return false;
    return true;
  });

  // ── 5. Summary cards (always based on full auditLogs, not filtered) ──
  var sumEl = document.getElementById('at-summary');
  if(sumEl){
    while(sumEl.firstChild) sumEl.removeChild(sumEl.firstChild);
    var today_str  = today();
    var todayCount = auditLogs.filter(function(l){ return l.created_at&&l.created_at.startsWith(today_str); }).length;
    var creates    = auditLogs.filter(function(l){ return (l.action||'').toUpperCase()==='CREATE'; }).length;
    var updates    = auditLogs.filter(function(l){ return (l.action||'').toUpperCase()==='UPDATE'; }).length;
    var deletes    = auditLogs.filter(function(l){ return (l.action||'').toUpperCase()==='DELETE'; }).length;
    var uniqUsers  = new Set(auditLogs.map(function(l){ return l.user_email||l.performed_by; })).size;
    [
      {l:'Total entries', v:auditLogs.length, c:'var(--primary)', t:'#5b5ef4'},
      {l:'Today',         v:todayCount,        c:'var(--text)',   t:'#10b981'},
      {l:'Created',       v:creates,           c:'var(--success)',t:'#10b981'},
      {l:'Updated',       v:updates,           c:'var(--warning)',t:'#f59e0b'},
      {l:'Deleted',       v:deletes,           c:'var(--danger)', t:'#ef4444'},
      {l:'Active users',  v:uniqUsers,         c:'var(--primary)',t:'#7c3aed'}
    ].forEach(function(m){
      var card = document.createElement('div');
      card.className = 'metric-card';
      card.style.cursor = 'default';
      card.innerHTML =
        '<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div>'+
        '<div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:4px">'+m.l+'</div>'+
        '<div style="font-size:24px;font-weight:800;color:'+m.c+';margin-top:4px;line-height:1">'+m.v+'</div>';
      sumEl.appendChild(card);
    });
  }

  // ── 6. Render table ──
  var tb = document.getElementById('audit-trail-body');
  if(!tb) return;
  while(tb.firstChild) tb.removeChild(tb.firstChild);

  if(!filtered.length){
    var tr0 = document.createElement('tr');
    var td0 = document.createElement('td');
    td0.colSpan = 6;
    td0.style.cssText = 'padding:60px 20px;text-align:center';
    if(!auditLogs.length){
      // Table not set up yet
      var ei=document.createElement('div');ei.style.cssText='font-size:36px;margin-bottom:14px';ei.textContent='📜';
      var et=document.createElement('div');et.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px';et.textContent='No audit logs yet';
      var es=document.createElement('div');es.style.cssText='font-size:13px;color:var(--text3);margin-bottom:16px;max-width:480px;margin-left:auto;margin-right:auto';
      es.textContent='Run the SQL below in Supabase to create the audit trail table. Logs will appear automatically after that.';
      var sqlBox=document.createElement('div');
      sqlBox.style.cssText='background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:11px;font-family:monospace;color:var(--text2);text-align:left;margin-top:4px;line-height:1.8;max-width:560px;margin-left:auto;margin-right:auto';
      sqlBox.textContent='CREATE TABLE grc_audit_trail (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  action text NOT NULL,\n  module text NOT NULL,\n  description text NOT NULL,\n  performed_by text, user_email text, user_role text,\n  meta text, ip_hint text,\n  created_at timestamptz DEFAULT now()\n);\nALTER TABLE grc_audit_trail ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "allow_all" ON grc_audit_trail FOR ALL USING (true) WITH CHECK (true);';
      td0.appendChild(ei);td0.appendChild(et);td0.appendChild(es);td0.appendChild(sqlBox);
    } else {
      // Filters active but no match
      var fi=document.createElement('div');fi.style.cssText='font-size:28px;margin-bottom:10px';fi.textContent='🔍';
      var fs=document.createElement('div');fs.style.cssText='font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px';fs.textContent='No logs match this filter';
      var fc=document.createElement('div');fc.style.cssText='font-size:12px;color:var(--text3);margin-bottom:14px';fc.textContent='Try clearing one or more filters to see results.';
      var clrBtn=document.createElement('button');clrBtn.className='btn';clrBtn.textContent='Clear all filters';
      clrBtn.onclick=function(){
        ['at-filter-action','at-filter-module','at-filter-user','at-filter-date-from','at-filter-date-to'].forEach(function(id){
          var el=document.getElementById(id);if(el)el.value='';
        });
        renderAuditTrail();
      };
      td0.appendChild(fi);td0.appendChild(fs);td0.appendChild(fc);td0.appendChild(clrBtn);
    }
    tr0.appendChild(td0); tb.appendChild(tr0);
    return;
  }

  // ── 7. Action badge colour map ──
  var actionColors = {
    'CREATE': ['var(--success-light)','var(--success)',   '+ Created'],
    'UPDATE': ['var(--warning-light)','var(--warning)',   '✎ Updated'],
    'DELETE': ['var(--danger-light)', 'var(--danger)',    '✕ Deleted'],
    'LOGIN':  ['var(--primary-light)','var(--primary)',   '→ Login'],
    'LOGOUT': ['var(--border)',       'var(--text3)',     '← Logout'],
    'EXPORT': ['rgba(124,58,237,.1)','#7c3aed',          '↓ Export']
  };

  // ── 8. Build rows ──
  filtered.forEach(function(log){
    var normA = (log.action||'').toUpperCase();
    var ac = actionColors[normA] || ['var(--border)','var(--text3)', log.action||'—'];

    var tr = document.createElement('tr');
    tr.className = 'item-row';
    tr.style.height = '52px';
    tr.style.cursor = 'pointer';

    // Timestamp
    var td1 = document.createElement('td');
    td1.style.paddingLeft = '16px';
    var ts     = (log.created_at||'—').replace('T',' ').slice(0,19);
    var tsDate = ts.slice(0,10);
    var tsTime = ts.slice(11,19);
    td1.innerHTML = '<div style="font-size:12px;font-weight:600;color:var(--text)">'+tsDate+'</div>'+
                    '<div style="font-size:11px;color:var(--text3)">'+tsTime+'</div>';

    // User
    var td2 = document.createElement('td');
    var initials = (log.performed_by||'?').split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
    var roleColor = {admin:'#5b5ef4',manager:'#0d9e7e',viewer:'#0369a1',stakeholder:'#e07d1a'}[(log.user_role||'').toLowerCase()]||'#888';
    td2.innerHTML = '<div style="display:flex;align-items:center;gap:8px">'+
      '<div style="width:28px;height:28px;border-radius:50%;background:'+roleColor+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">'+initials+'</div>'+
      '<div><div style="font-size:12px;font-weight:600;color:var(--text);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escHtml(log.performed_by||'—')+'</div>'+
      '<div style="font-size:10px;color:var(--text3)">'+escHtml(log.user_role||'')+'</div></div></div>';

    // Action badge
    var td3 = document.createElement('td');
    var badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.cssText = 'background:'+ac[0]+';color:'+ac[1]+';white-space:nowrap;font-weight:700';
    badge.textContent = ac[2];
    td3.appendChild(badge);

    // Module
    var td4 = document.createElement('td');
    td4.innerHTML = '<span style="font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text2);white-space:nowrap">'+escHtml(log.module||'—')+'</span>';

    // Description
    var td5 = document.createElement('td');
    var desc = log.description||'—';
    var descDiv = document.createElement('div');
    descDiv.style.cssText = 'font-size:12px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px';
    descDiv.textContent = desc; descDiv.title = desc;
    td5.appendChild(descDiv);
    if(log.meta){
      var metaDiv = document.createElement('div');
      metaDiv.style.cssText = 'font-size:10px;color:var(--text3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px';
      try{
        var mp = JSON.parse(log.meta);
        metaDiv.textContent = Object.keys(mp).slice(0,2).map(function(k){return k+': '+String(mp[k]).slice(0,20);}).join(' · ');
      }catch(e2){ metaDiv.textContent = String(log.meta).slice(0,40); }
      td5.appendChild(metaDiv);
    }

    // Device
    var td6 = document.createElement('td');
    var ua = log.ip_hint||'';
    var device = ua.indexOf('Mobile')>-1?'📱 Mobile':ua.indexOf('Chrome')>-1?'🌐 Chrome':ua.indexOf('Firefox')>-1?'🦊 Firefox':ua.indexOf('Safari')>-1?'🧭 Safari':'💻 Desktop';
    td6.innerHTML = '<span style="font-size:11px;color:var(--text3)">'+device+'</span>';

    // ── Expand row for full detail ──
    (function(logEntry, acLocal){
      tr.addEventListener('click', function(){
        var isOpen = tr.classList.contains('expanded');
        tb.querySelectorAll('.item-row.expanded').forEach(function(r){r.classList.remove('expanded');});
        tb.querySelectorAll('.at-detail-row').forEach(function(d){d.remove();});
        if(!isOpen){
          tr.classList.add('expanded');
          var dtr = document.createElement('tr'); dtr.className = 'at-detail-row';
          var dtd = document.createElement('td'); dtd.colSpan = 6;
          dtd.style.cssText = 'padding:0;white-space:normal;overflow:visible';
          var bc = acLocal[1];
          var metaHtml = '';
          if(logEntry.meta){
            try{
              var pm = JSON.parse(logEntry.meta);
              metaHtml = '<div style="margin-top:12px">'+
                '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Change details</div>'+
                '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">';
              Object.keys(pm).forEach(function(k){
                metaHtml += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:8px 10px">'+
                  '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:3px">'+escHtml(k)+'</div>'+
                  '<div style="font-size:12px;color:var(--text);word-break:break-all">'+escHtml(String(pm[k]).slice(0,200))+'</div></div>';
              });
              metaHtml += '</div></div>';
            }catch(e2){}
          }
          dtd.innerHTML = '<div style="background:var(--surface2);border-left:3px solid '+bc+';padding:16px 20px">'+
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:12px">'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Performed by</div><div style="font-size:13px;font-weight:600;color:var(--text)">'+escHtml(logEntry.performed_by||'—')+'</div></div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Email</div><div style="font-size:12px;color:var(--text);word-break:break-all">'+escHtml(logEntry.user_email||'—')+'</div></div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Role</div><div style="font-size:13px;color:var(--text)">'+escHtml(logEntry.user_role||'—')+'</div></div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Module</div><div style="font-size:13px;color:var(--text)">'+escHtml(logEntry.module||'—')+'</div></div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Action</div><div style="margin-top:2px"><span class="badge" style="background:'+acLocal[0]+';color:'+acLocal[1]+';font-weight:700">'+acLocal[2]+'</span></div></div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Timestamp</div><div style="font-size:12px;color:var(--text)">'+(logEntry.created_at||'—').replace('T',' ').slice(0,19)+'</div></div>'+
            '</div>'+
            '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Full description</div>'+
            '<div style="font-size:13px;color:var(--text);background:var(--surface);padding:10px 14px;border-radius:8px;border:1px solid var(--border);line-height:1.7;word-break:break-word">'+escHtml(logEntry.description||'—')+'</div></div>'+
            metaHtml+
            (logEntry.ip_hint?'<div style="margin-top:10px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">User agent</div><div style="font-size:11px;color:var(--text3);word-break:break-all">'+escHtml(logEntry.ip_hint)+'</div></div>':'')+
            '</div>';
          dtr.appendChild(dtd);
          tr.parentNode.insertBefore(dtr, tr.nextSibling);
        }
      });
    })(log, ac);

    tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);
    tr.appendChild(td4);tr.appendChild(td5);tr.appendChild(td6);
    tb.appendChild(tr);
  });

  // Load more button visibility
  var loadMoreEl = document.getElementById('at-load-more');
  if(loadMoreEl) loadMoreEl.style.display = (!anyFilter && auditLogs.length >= 50) ? '' : 'none';
}

// ── Load more audit logs ──
async function loadMoreAuditLogs(){
  atPage++;
  var offset = atPage * atPageSize;
  try{
    var res = await api('grc_audit_trail?select=*&order=created_at.desc&limit='+atPageSize+'&offset='+offset, {method:'GET'});
    if(res.ok){
      var more = await res.json();
      if(Array.isArray(more) && more.length){
        auditLogs = auditLogs.concat(more);
        renderAuditTrail();
      } else {
        var btn = document.getElementById('at-load-more');
        if(btn) btn.style.display = 'none';
        showDueDateToast('','All audit logs loaded.');
      }
    }
  }catch(e){ showDueDateToast('','Error loading more logs.'); }
}

// ── Export audit trail to Excel ──
function exportAuditTrail(){
  if(typeof XLSX === 'undefined'){ alert('Excel library loading. Please wait 3 seconds and try again.'); return; }
  var rows = [['Timestamp','Action','Module','Description','Performed By','Email','Role','Device']];
  auditLogs.forEach(function(l){
    var ua = l.ip_hint||'';
    var device = ua.indexOf('Mobile')>-1?'Mobile':ua.indexOf('Chrome')>-1?'Chrome':ua.indexOf('Firefox')>-1?'Firefox':'Desktop';
    rows.push([
      (l.created_at||'').replace('T',' ').slice(0,19),
      l.action||'',
      l.module||'',
      l.description||'',
      l.performed_by||'',
      l.user_email||'',
      l.user_role||'',
      device
    ]);
  });
  exportToXLSX('Clarix_Audit_Trail_'+getDateStr()+'.xlsx', 'Audit Trail', rows);
  writeAuditLog('EXPORT','System','Exported audit trail to Excel',{rows:rows.length-1});
}


// ── DARK / LIGHT MODE ──
function toggleTheme(){
  var isDark=document.documentElement.getAttribute('data-theme')==='dark';
  var newTheme=isDark?'light':'dark';
  document.documentElement.setAttribute('data-theme',newTheme);
  localStorage.setItem('grc-theme',newTheme);
  updateThemeBtn(newTheme);
}
function updateThemeBtn(theme){
  var sun=document.getElementById('theme-icon-sun');
  var moon=document.getElementById('theme-icon-moon');
  var lbl=document.getElementById('theme-label');
  if(!sun||!moon||!lbl) return;
  if(theme==='dark'){sun.style.display='none';moon.style.display='block';lbl.textContent='Light';}
  else{sun.style.display='block';moon.style.display='none';lbl.textContent='Dark';}
}
(function(){
  var saved=localStorage.getItem('grc-theme')||'light';
  document.documentElement.setAttribute('data-theme',saved);
  updateThemeBtn(saved);
})();


// ── OVERDUE / DUE SOON ──
function renderOverdue(){
  var el=document.getElementById('overdue-list');
  if(!el) return;
  var ov=items.filter(function(it){return getStatus(it)==='overdue';});
  var soon=items.filter(function(it){
    if(getStatus(it)!=='pending'||!it.due_date) return false;
    var diff=(new Date(it.due_date)-new Date(today()))/86400000;
    return diff>=0&&diff<=7;
  });
  while(el.firstChild) el.removeChild(el.firstChild);
  if(!ov.length&&!soon.length){
    var emp=document.createElement('div');
    emp.style.cssText='text-align:center;padding:60px 20px';
    var ei=document.createElement('div');ei.style.cssText='font-size:48px;margin-bottom:12px';ei.textContent='🎉';
    var et=document.createElement('div');et.style.cssText='font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px';et.textContent='All items on track!';
    var es=document.createElement('div');es.style.cssText='font-size:13px;color:var(--text3)';es.textContent='No overdue items or items due within 7 days.';
    emp.appendChild(ei);emp.appendChild(et);emp.appendChild(es);el.appendChild(emp);
    return;
  }
  function makeTable(title,data,color){
    var wrap=document.createElement('div');
    wrap.className='page-section';
    wrap.style.cssText='border-left:4px solid '+color+';margin-bottom:14px';
    var hdr=document.createElement('div');
    hdr.style.cssText='font-size:14px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px';
    hdr.innerHTML='<span style="color:'+color+'">●</span>'+title+' <span style="background:'+color+';color:#fff;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:700">'+data.length+'</span>';
    wrap.appendChild(hdr);
    var tWrap=document.createElement('div');tWrap.style.cssText='overflow-x:auto;border:1px solid var(--border);border-radius:10px';
    var tbl=document.createElement('table');tbl.className='items-tbl';tbl.style.width='100%';
    var thead=document.createElement('thead');
    var htr=document.createElement('tr');
    ['Task','Stakeholder','Dept','Frequency','Due date','FU','Action'].forEach(function(h){
      var th=document.createElement('th');th.textContent=h;
      th.style.minWidth=h==='Task'?'200px':h==='Action'?'160px':'90px';
      if(h==='Task') th.style.paddingLeft='16px';
      htr.appendChild(th);
    });
    thead.appendChild(htr);tbl.appendChild(thead);
    var tbody=document.createElement('tbody');
    data.forEach(function(it){
      var daysOv=it.due_date?Math.floor((new Date(today())-new Date(it.due_date))/86400000):0;
      var daysDue=it.due_date?Math.ceil((new Date(it.due_date)-new Date(today()))/86400000):null;
      var tr=document.createElement('tr');tr.className='item-row';tr.style.height='52px';
      function cell(html,css){var td=document.createElement('td');td.innerHTML=html;if(css)td.style.cssText=css;return td;}
      var td1=document.createElement('td');td1.style.paddingLeft='16px';td1.title=it.name;
      td1.innerHTML='<div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px">'+it.name+'</div>';
      tr.appendChild(td1);
      tr.appendChild(cell('<span style="font-weight:500">'+it.stakeholder+'</span>'));
      tr.appendChild(cell('<span style="color:var(--text2)">'+(it.dept||'—')+'</span>'));
      tr.appendChild(cell('<span class="badge b-'+it.freq+'">'+FL[it.freq]+'</span>'));
      var dateHtml=color==='#d93f3f'?
        '<div style="color:#d93f3f;font-weight:700">'+(it.due_date||'—')+'</div><div style="font-size:11px;color:#d93f3f">'+daysOv+'d overdue</div>':
        '<div style="color:#e07d1a;font-weight:600">'+(it.due_date||'—')+'</div>'+(daysDue!==null?'<div style="font-size:11px;color:#e07d1a">'+daysDue+'d left</div>':'');
      tr.appendChild(cell(dateHtml));
      tr.appendChild(cell(it.followups>0?'<span class="fu-pill">'+it.followups+'</span>':'<span style="color:var(--text3)">—</span>','text-align:center'));
      var actTd=document.createElement('td');
      var actWrap=document.createElement('div');actWrap.style.cssText='display:flex;gap:6px;flex-wrap:wrap';
      if(can('email')){
        var eBtn=document.createElement('button');eBtn.className='btn btn-sm btn-primary';eBtn.textContent='Send follow-up';
        (function(id){eBtn.onclick=function(){goEmail(id);};})(it.id);actWrap.appendChild(eBtn);
      }
      if(can('toggle')){
        var dBtn=document.createElement('button');dBtn.className='action-btn';dBtn.textContent='Mark done';
        dBtn.style.cssText='background:rgba(13,158,126,.08);border-color:rgba(13,158,126,.25);color:#0d9e7e';
        (function(it2){dBtn.onclick=async function(){
          var upd={done:true};var nd=calcNextDueDate(it2.freq,it2.due_date);if(nd)upd.due_date=nd;
          await api('grc_items?id=eq.'+it2.id,{method:'PATCH',body:upd,extra:{'Prefer':'return=minimal'}});await loadAll();
        };})(it);actWrap.appendChild(dBtn);
      }
      actTd.appendChild(actWrap);tr.appendChild(actTd);
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);tWrap.appendChild(tbl);wrap.appendChild(tWrap);
    return wrap;
  }
  if(ov.length) el.appendChild(makeTable('Overdue items',ov,'#d93f3f'));
  if(soon.length) el.appendChild(makeTable('Due within 7 days',soon,'#e07d1a'));
}


// ── ACTION & ISSUE TRACKER ──
function getActionStatus(a){
  if(a.status==='Closed') return 'closed';
  if(a.due_date&&a.due_date<today()) return 'overdue';
  if(a.status==='In Progress') return 'inprogress';
  return 'open';
}
function renderActions(){
  var statusFilter=(document.getElementById('action-filter-status')||{}).value||'';
  var priorityFilter=(document.getElementById('action-filter-priority')||{}).value||'';
  var open=0,inprog=0,closed=0,overdue=0;
  actions.forEach(function(a){var s=getActionStatus(a);if(s==='closed')closed++;else if(s==='overdue')overdue++;else if(s==='inprogress')inprog++;else open++;});
  var sumEl=document.getElementById('actions-summary');
  if(sumEl){sumEl.innerHTML='';
    [{l:'Open',v:open,c:'var(--primary)',t:'#5b5ef4'},{l:'In Progress',v:inprog,c:'var(--warning)',t:'#f59e0b'},{l:'Overdue',v:overdue,c:'var(--danger)',t:'#ef4444'},{l:'Closed',v:closed,c:'var(--success)',t:'#10b981'}].forEach(function(m){
      var card=document.createElement('div');card.className='metric-card';
      card.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div><div class="mc-label" style="margin-top:4px">'+m.l+'</div><div class="mc-val" style="color:'+m.c+'">'+m.v+'</div>';
      sumEl.appendChild(card);
    });
  }
  var filtered=actions.filter(function(a){
    var s=getActionStatus(a);
    if(statusFilter==='Overdue'&&s!=='overdue') return false;
    if(statusFilter==='Open'&&s!=='open') return false;
    if(statusFilter==='In Progress'&&s!=='inprogress') return false;
    if(statusFilter==='Closed'&&s!=='closed') return false;
    if(priorityFilter&&a.priority!==priorityFilter) return false;
    return true;
  });
  var tb=document.getElementById('actions-body');
  if(!tb) return;
  while(tb.firstChild) tb.removeChild(tb.firstChild);
  if(!filtered.length){
    var tr0=document.createElement('tr');var td0=document.createElement('td');td0.colSpan=7;td0.style.cssText='padding:48px 20px;text-align:center';
    if(!actions.length){
      var ei=document.createElement('div');ei.style.cssText='font-size:36px;margin-bottom:12px';ei.textContent='✅';
      var et=document.createElement('div');et.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px';et.textContent='No actions or issues logged';
      var es=document.createElement('div');es.style.cssText='font-size:13px;color:var(--text3);margin-bottom:18px';es.textContent='When an audit finding, control failure or incident occurs, log it here and track it to closure.';
      var eb=document.createElement('button');eb.className='btn btn-primary';eb.style.margin='0 auto';eb.textContent='+ Log first action';eb.onclick=function(){openPanel('action-panel');};
      td0.appendChild(ei);td0.appendChild(et);td0.appendChild(es);td0.appendChild(eb);
    } else {
      var fi=document.createElement('div');fi.style.cssText='font-size:28px;margin-bottom:8px';fi.textContent='🔍';
      var fs=document.createElement('div');fs.style.cssText='font-size:13px;color:var(--text3)';fs.textContent='No items match this filter';
      td0.appendChild(fi);td0.appendChild(fs);
    }
    tr0.appendChild(td0);tb.appendChild(tr0);updateActionsBadge();return;
  }
  filtered.forEach(function(a){
    var s=getActionStatus(a);var isOverdue=s==='overdue';var isClosed=s==='closed';
    var tr=document.createElement('tr');tr.className='item-row';tr.style.height='58px';
    if(isOverdue&&!isClosed) tr.style.background='rgba(239,68,68,.03)';
    if(isClosed) tr.style.opacity='0.75';
    var pColors={Critical:['#fee2e2','#dc2626'],High:['#fff7ed','#ea580c'],Medium:['#fef9c3','#ca8a04'],Low:['#f0fdf4','#16a34a']};
    var pc=(a.priority in pColors)?pColors[a.priority]:pColors.Medium;
    var sConfig={open:{bg:'var(--primary-light)',c:'var(--primary)',lbl:'Open'},inprogress:{bg:'var(--warning-light)',c:'var(--warning)',lbl:'In Progress'},overdue:{bg:'var(--danger-light)',c:'var(--danger)',lbl:'Overdue'},closed:{bg:'var(--success-light)',c:'var(--success)',lbl:'✓ Closed'}};
    var sc=sConfig[s]||sConfig.open;
    function makeTd2(html,css){var td=document.createElement('td');td.innerHTML=html;if(css)td.style.cssText=css;return td;}
    var td1=document.createElement('td');td1.style.paddingLeft='16px';
    var tDiv=document.createElement('div');tDiv.style.cssText='font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px'+(isClosed?';text-decoration:line-through;color:var(--text3)':'');tDiv.textContent=a.title||'—';tDiv.title=a.title||'';
    var sDiv=document.createElement('div');sDiv.style.cssText='font-size:11px;color:var(--text3);margin-top:2px';sDiv.textContent=(a.category||'')+(a.source?' · '+a.source:'');
    td1.appendChild(tDiv);td1.appendChild(sDiv);
    tr.appendChild(td1);
    tr.appendChild(makeTd2('<span class="badge" style="background:'+pc[0]+';color:'+pc[1]+'">'+(a.priority||'Medium')+'</span>'));
    var td3=document.createElement('td');var od=document.createElement('div');od.style.cssText='font-weight:500;color:var(--text)';od.textContent=a.owner||'—';td3.appendChild(od);
    if(a.department){var dd=document.createElement('div');dd.style.cssText='font-size:11px;color:var(--text3)';dd.textContent=a.department;td3.appendChild(dd);}
    tr.appendChild(td3);
    var td4=document.createElement('td');
    if(a.due_date){var dL=Math.ceil((new Date(a.due_date)-new Date(today()))/86400000);var dC=isOverdue&&!isClosed?'var(--danger)':!isClosed&&dL<=3?'var(--warning)':'var(--text2)';td4.innerHTML='<div style="font-size:12px;font-weight:'+(isOverdue&&!isClosed?'700':'400')+';color:'+dC+'">'+a.due_date+'</div>'+(isOverdue&&!isClosed?'<div style="font-size:10px;color:var(--danger);font-weight:700">'+Math.abs(dL)+'d overdue</div>':'');}
    else td4.innerHTML='<span style="color:var(--text3)">—</span>';
    tr.appendChild(td4);
    var td5=document.createElement('td');var sBadge=document.createElement('span');sBadge.className='badge';sBadge.style.cssText='background:'+sc.bg+';color:'+sc.c+';cursor:pointer';sBadge.textContent=sc.lbl;sBadge.title='Click to change status';
    var sList=['Open','In Progress','Closed'];
    (function(aid,cs){sBadge.onclick=async function(e){e.stopPropagation();var cur=cs==='overdue'?'Open':cs==='inprogress'?'In Progress':cs==='closed'?'Closed':'Open';var next=sList[(sList.indexOf(cur)+1)%sList.length];var upd={status:next};if(next==='Closed')upd.closed_date=today();await api('grc_actions?id=eq.'+aid,{method:'PATCH',body:upd,extra:{'Prefer':'return=minimal'}});await loadAll();};})(a.id,s);
    td5.appendChild(sBadge);if(isClosed&&a.closed_date){var cd=document.createElement('div');cd.style.cssText='font-size:10px;color:var(--success);margin-top:3px;font-weight:500';cd.textContent='Closed '+a.closed_date;td5.appendChild(cd);}
    tr.appendChild(td5);
    tr.appendChild(makeTd2('<span style="font-size:12px;color:var(--text2)">'+(a.category||'—')+'</span>'));
    var td7=document.createElement('td');var wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:5px;flex-wrap:wrap;align-items:center';
    if(!isClosed&&can('actions')){var cBtn=document.createElement('button');cBtn.className='btn btn-sm';cBtn.style.cssText='background:var(--success-light);border-color:rgba(16,185,129,.3);color:var(--success);font-weight:600;font-size:11px';cBtn.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Close';(function(aid){cBtn.onclick=async function(e){e.stopPropagation();await closeAction(aid);};})(a.id);wrap.appendChild(cBtn);}
    if(can('actions')){var eBtn2=document.createElement('button');eBtn2.className='btn btn-sm';eBtn2.style.fontSize='11px';eBtn2.textContent='Edit';(function(act){eBtn2.onclick=function(e){e.stopPropagation();editAction(act);};})(a);wrap.appendChild(eBtn2);}
    if(can('delete')){var dBtn2=document.createElement('button');dBtn2.className='btn btn-sm';dBtn2.style.cssText='font-size:11px;border-color:rgba(239,68,68,.25);color:var(--danger)';dBtn2.textContent='Del';(function(aid){dBtn2.onclick=async function(e){e.stopPropagation();if(!confirm('Delete this action?'))return;var _adel=actions.find(function(x){return x.id==aid;});await api('grc_actions?id=eq.'+aid,{method:'DELETE',extra:{'Prefer':'return=minimal'}});writeAuditLog('DELETE','Action','Deleted action: '+(_adel?_adel.title:aid));await loadAll();};})(a.id);wrap.appendChild(dBtn2);}
    td7.appendChild(wrap);tr.appendChild(td7);
    tr.addEventListener('click',function(){
      var existing=document.getElementById('action-detail-'+a.id);var isOpen=tr.classList.contains('expanded');
      tb.querySelectorAll('.item-row.expanded').forEach(function(r){r.classList.remove('expanded');});tb.querySelectorAll('.action-detail-row').forEach(function(d){d.remove();});
      if(!isOpen){tr.classList.add('expanded');var bc=s==='overdue'?'var(--danger)':s==='closed'?'var(--success)':s==='inprogress'?'var(--warning)':'var(--primary)';
        var dtr=document.createElement('tr');dtr.className='action-detail-row';var dtd=document.createElement('td');dtd.colSpan=7;dtd.style.cssText='padding:0;white-space:normal;overflow:visible';
        dtd.innerHTML='<div style="background:var(--surface2);border-left:3px solid '+bc+';padding:16px 20px">'+
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:12px">'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Owner</div><div style="font-weight:600;color:var(--text)">'+(a.owner||'—')+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Department</div><div style="color:var(--text)">'+(a.department||'—')+'</div></div>'+
          '<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Source</div><div style="color:var(--text)">'+(a.source||'—')+'</div></div>'+
          '</div>'+
          (a.description?'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Description</div><div style="font-size:13px;color:var(--text);background:var(--surface);padding:10px 12px;border-radius:8px;border:1px solid var(--border);line-height:1.7">'+a.description+'</div></div>':'')+
          (a.action_plan?'<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Action plan</div><div style="font-size:13px;color:var(--text);background:var(--surface);padding:10px 12px;border-radius:8px;border:1px solid var(--border);line-height:1.7">'+a.action_plan+'</div></div>':'')+
          (a.closure_notes?'<div><div style="font-size:10px;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Closure notes</div><div style="font-size:13px;color:var(--text);background:var(--success-light);padding:10px 12px;border-radius:8px;border:1px solid rgba(16,185,129,.2);line-height:1.7">'+a.closure_notes+'</div></div>':'')+
          '</div>';
        dtr.appendChild(dtd);tr.parentNode.insertBefore(dtr,tr.nextSibling);
      }
    });
    tb.appendChild(tr);
  });
  updateActionsBadge();
}
async function closeAction(id){
  if(!can('actions')){noPermission();return;}
  var notes=prompt('Add closure notes (optional):');if(notes===null)return;
  var upd={status:'Closed',closed_date:today()};if(notes)upd.closure_notes=notes;
  await api('grc_actions?id=eq.'+id,{method:'PATCH',body:upd,extra:{'Prefer':'return=minimal'}});
  writeAuditLog('UPDATE','Action','Closed action ID: '+id,{closure_notes:notes||''});
  showDueDateToast('','Action closed!');await loadAll();
}
function editAction(a){
  if(!can('actions')){noPermission();return;}
  document.getElementById('action-panel-title').textContent='Edit action';
  document.getElementById('action-edit-id').value=a.id;
  document.getElementById('action-title').value=a.title||'';
  document.getElementById('action-category').value=a.category||'Audit Finding';
  document.getElementById('action-priority').value=a.priority||'Medium';
  document.getElementById('action-desc').value=a.description||'';
  document.getElementById('action-owner').value=a.owner||'';
  document.getElementById('action-dept').value=a.department||'';
  document.getElementById('action-due').value=a.due_date||'';
  document.getElementById('action-source').value=a.source||'';
  document.getElementById('action-plan').value=a.action_plan||'';
  document.getElementById('action-status').value=a.status||'Open';
  document.getElementById('action-closure').value=a.closure_notes||'';
  var cw=document.getElementById('action-closure-wrap');if(cw)cw.style.display=(a.status==='Closed')?'flex':'none';
  openPanel('action-panel');
}
async function saveAction(){
  if(!can('actions')){noPermission('Only admin and manager can add or edit actions.');return;}
  var editId=document.getElementById('action-edit-id').value;
  var title=document.getElementById('action-title').value.trim();
  var owner=document.getElementById('action-owner').value.trim();
  var due=document.getElementById('action-due').value;
  if(!title){alert('Please enter a title.');return;}if(!owner){alert('Please assign an owner.');return;}if(!due){alert('Please set a due date.');return;}
  var status=document.getElementById('action-status').value;
  var body={title:title,category:document.getElementById('action-category').value,priority:document.getElementById('action-priority').value,description:document.getElementById('action-desc').value.trim(),owner:owner,department:document.getElementById('action-dept').value.trim(),due_date:due,source:document.getElementById('action-source').value.trim(),action_plan:document.getElementById('action-plan').value.trim(),status:status,closure_notes:document.getElementById('action-closure').value.trim()};
  if(status==='Closed'&&!editId)body.closed_date=today();
  var res=editId?await api('grc_actions?id=eq.'+editId,{method:'PATCH',body:body,extra:{'Prefer':'return=minimal'}}):await api('grc_actions',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});
  if(res&&res.ok){closePanel();document.getElementById('action-panel-title').textContent='Add action / issue';document.getElementById('action-edit-id').value='';['action-title','action-desc','action-owner','action-dept','action-due','action-source','action-plan','action-closure'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});document.getElementById('action-status').value='Open';var cw=document.getElementById('action-closure-wrap');if(cw)cw.style.display='none';writeAuditLog(editId?'UPDATE':'CREATE','Action',editId?'Updated action':'Created action',{owner:owner});showDueDateToast('',editId?'Action updated!':'Action logged!');await loadAll();}
  else alert('Error saving. Make sure grc_actions table exists in Supabase.');
}
function updateActionsBadge(){
  var cnt=actions.filter(function(a){var s=getActionStatus(a);return s==='open'||s==='overdue'||s==='inprogress';}).length;
  var b=document.getElementById('actions-badge');if(b){b.textContent=cnt;b.style.display=cnt>0?'inline-block':'none';}
}
safeOn('action-status','change',function(){
  var val=document.getElementById('action-status').value;
  var wrap=document.getElementById('action-closure-wrap');if(wrap)wrap.style.display=val==='Closed'?'flex':'none';
});


// ── EVIDENCE COLLECTION ──
function getEvidenceStatus(e){
  if(e.status==='Approved') return 'approved';
  if(e.status==='Submitted') return 'submitted';
  if(e.status==='Rejected') return 'rejected';
  if(e.deadline&&e.deadline<today()) return 'overdue';
  return 'pending';
}
function renderEvidence(){
  var auditFilter=(document.getElementById('ev-filter-audit')||{}).value||'';
  var statusFilter=(document.getElementById('ev-filter-status')||{}).value||'';
  var auditSel=document.getElementById('ev-filter-audit');
  if(auditSel){var prev=auditSel.value;auditSel.innerHTML='<option value="">All audits</option>';audits.forEach(function(a){var opt=document.createElement('option');opt.value=a.id;opt.textContent=a.name;auditSel.appendChild(opt);});if(prev)auditSel.value=prev;}
  var panelSel=document.getElementById('ev-audit');
  if(panelSel){var pv=panelSel.value;panelSel.innerHTML='<option value="">-- select audit --</option>';audits.forEach(function(a){var opt=document.createElement('option');opt.value=a.id;opt.textContent=a.name+' ('+a.audit_type+')';panelSel.appendChild(opt);});if(pv)panelSel.value=pv;}
  var pending=0,submitted=0,approved=0,overdue=0;
  evidenceItems.forEach(function(e){var s=getEvidenceStatus(e);if(s==='approved')approved++;else if(s==='submitted')submitted++;else if(s==='overdue')overdue++;else pending++;});
  var sumEl=document.getElementById('evidence-summary');
  if(sumEl){sumEl.innerHTML='';[{l:'Pending',v:pending,c:'var(--primary)',t:'#5b5ef4'},{l:'Submitted',v:submitted,c:'var(--warning)',t:'#f59e0b'},{l:'Approved',v:approved,c:'var(--success)',t:'#10b981'},{l:'Overdue',v:overdue,c:'var(--danger)',t:'#ef4444'}].forEach(function(m){var card=document.createElement('div');card.className='metric-card';card.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div><div class="mc-label" style="margin-top:4px">'+m.l+'</div><div class="mc-val" style="color:'+m.c+'">'+m.v+'</div>';sumEl.appendChild(card);});}
  var tabsEl=document.getElementById('ev-audit-tabs');
  if(tabsEl){tabsEl.innerHTML='';var allBtn=document.createElement('button');allBtn.className='filter-tag'+(auditFilter===''?' active':'');allBtn.textContent='All audits';allBtn.onclick=function(){document.getElementById('ev-filter-audit').value='';renderEvidence();};tabsEl.appendChild(allBtn);audits.forEach(function(a){var btn=document.createElement('button');btn.className='filter-tag'+(auditFilter===a.id?' active':'');var cnt=evidenceItems.filter(function(e){return e.audit_id===a.id;}).length;btn.textContent=a.name+' ('+cnt+')';btn.onclick=function(){document.getElementById('ev-filter-audit').value=a.id;renderEvidence();};tabsEl.appendChild(btn);});}
  var filtered=evidenceItems.filter(function(e){var s=getEvidenceStatus(e);if(auditFilter&&e.audit_id!==auditFilter)return false;if(statusFilter==='Pending'&&s!=='pending')return false;if(statusFilter==='Submitted'&&s!=='submitted')return false;if(statusFilter==='Approved'&&s!=='approved')return false;if(statusFilter==='Rejected'&&s!=='rejected')return false;if(statusFilter==='Overdue'&&s!=='overdue')return false;return true;});
  var tb=document.getElementById('evidence-body');if(!tb)return;
  while(tb.firstChild)tb.removeChild(tb.firstChild);
  if(!filtered.length){
    var tr0=document.createElement('tr');var td0=document.createElement('td');td0.colSpan=7;td0.style.cssText='padding:48px 20px;text-align:center';
    if(!evidenceItems.length){var ei=document.createElement('div');ei.style.cssText='font-size:36px;margin-bottom:12px';ei.textContent='📁';var et=document.createElement('div');et.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px';et.textContent='No evidence requests yet';var es=document.createElement('div');es.style.cssText='font-size:13px;color:var(--text3);margin-bottom:6px';es.textContent='First create an audit, then request evidence from your teams.';var eb1=document.createElement('button');eb1.className='btn';eb1.style.cssText='margin:8px 4px 0';eb1.textContent='+ Create audit';eb1.onclick=function(){openPanel('audit-panel');};var eb2=document.createElement('button');eb2.className='btn btn-primary';eb2.style.cssText='margin:8px 4px 0';eb2.textContent='+ Request evidence';eb2.onclick=function(){openPanel('evidence-panel');};td0.appendChild(ei);td0.appendChild(et);td0.appendChild(es);td0.appendChild(eb1);td0.appendChild(eb2);}
    else{var fi=document.createElement('div');fi.style.cssText='font-size:28px;margin-bottom:8px';fi.textContent='🔍';var fs=document.createElement('div');fs.style.cssText='font-size:13px;color:var(--text3)';fs.textContent='No items match this filter';td0.appendChild(fi);td0.appendChild(fs);}
    tr0.appendChild(td0);tb.appendChild(tr0);updateEvidenceBadge();return;
  }
  var auditMap={};audits.forEach(function(a){auditMap[a.id]=a.name;});
  filtered.forEach(function(ev){
    var s=getEvidenceStatus(ev);
    var sConfig={pending:{bg:'var(--primary-light)',c:'var(--primary)',lbl:'Pending'},submitted:{bg:'var(--warning-light)',c:'var(--warning)',lbl:'⬆ Submitted'},approved:{bg:'var(--success-light)',c:'var(--success)',lbl:'✓ Approved'},rejected:{bg:'var(--danger-light)',c:'var(--danger)',lbl:'✗ Rejected'},overdue:{bg:'var(--danger-light)',c:'var(--danger)',lbl:'⚠ Overdue'}};
    var sc=sConfig[s]||sConfig.pending;
    var tr=document.createElement('tr');tr.className='item-row';tr.style.height='58px';
    if(s==='overdue')tr.style.background='rgba(239,68,68,.03)';
    var td1=document.createElement('td');td1.style.paddingLeft='16px';var tDiv=document.createElement('div');tDiv.style.cssText='font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px';tDiv.textContent=ev.title||'—';tDiv.title=ev.title||'';var tyDiv=document.createElement('div');tyDiv.style.cssText='font-size:11px;color:var(--text3);margin-top:2px';tyDiv.textContent=(ev.evidence_type||'')+(ev.control_ref?' · '+ev.control_ref:'');td1.appendChild(tDiv);td1.appendChild(tyDiv);
    var td2=document.createElement('td');var owDiv=document.createElement('div');owDiv.style.cssText='font-weight:500;color:var(--text)';owDiv.textContent=ev.owner||'—';var emDiv=document.createElement('div');emDiv.style.cssText='font-size:11px;color:var(--text3)';emDiv.textContent=ev.email||'';td2.appendChild(owDiv);if(ev.email)td2.appendChild(emDiv);
    var td3=document.createElement('td');td3.innerHTML='<span style="font-size:12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text2)">'+(ev.department||'—')+'</span>';
    var td4=document.createElement('td');td4.style.cssText='font-size:12px;color:var(--text2)';td4.textContent=auditMap[ev.audit_id]||'—';
    var td5=document.createElement('td');
    if(ev.deadline){var dL=Math.ceil((new Date(ev.deadline)-new Date(today()))/86400000);var dColor=(s==='overdue')?'var(--danger)':dL<=3&&s==='pending'?'var(--warning)':'var(--text2)';td5.innerHTML='<div style="font-size:12px;font-weight:'+(s==='overdue'?'700':'400')+';color:'+dColor+'">'+ev.deadline+'</div>'+(s==='overdue'?'<div style="font-size:10px;color:var(--danger);font-weight:700">'+Math.abs(dL)+'d overdue</div>':dL<=3&&dL>=0&&s==='pending'?'<div style="font-size:10px;color:var(--warning);font-weight:600">'+dL+'d left</div>':'');}
    else td5.innerHTML='<span style="color:var(--text3)">—</span>';
    var td6=document.createElement('td');var sBadge=document.createElement('span');sBadge.className='badge';sBadge.style.cssText='background:'+sc.bg+';color:'+sc.c;sBadge.textContent=sc.lbl;td6.appendChild(sBadge);if(ev.submitted_at){var stDiv=document.createElement('div');stDiv.style.cssText='font-size:10px;color:var(--text3);margin-top:3px';stDiv.textContent='on '+ev.submitted_at.split('T')[0];td6.appendChild(stDiv);}
    var td7=document.createElement('td');var wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:4px;flex-wrap:wrap;align-items:center';
    if((s==='pending'||s==='overdue')&&can('actions')){var remBtn=document.createElement('button');remBtn.className='btn btn-sm btn-primary';remBtn.style.fontSize='11px';remBtn.textContent='Remind';(function(itev){remBtn.onclick=function(e){e.stopPropagation();var auditName=auditMap[itev.audit_id]||'Audit';var sub=encodeURIComponent('Evidence required: '+itev.title+' — '+auditName);window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(itev.email||'')+'&su='+sub,'_blank');};})(ev);wrap.appendChild(remBtn);var subBtn=document.createElement('button');subBtn.className='btn btn-sm';subBtn.style.fontSize='11px';subBtn.textContent='Submit';(function(itev){subBtn.onclick=function(e){e.stopPropagation();openEvidenceSubmitPanel(itev);};})(ev);wrap.appendChild(subBtn);}
    if(s==='submitted'&&can('actions')){var appBtn=document.createElement('button');appBtn.className='btn btn-sm';appBtn.style.cssText='font-size:11px;background:var(--success-light);border-color:rgba(16,185,129,.3);color:var(--success);font-weight:700';appBtn.innerHTML='✓ Approve';(function(eid){appBtn.onclick=async function(e){e.stopPropagation();await api('grc_evidence?id=eq.'+eid,{method:'PATCH',body:{status:'Approved',approved_by:currentUser?currentUser.name:'Admin',approved_date:today()},extra:{'Prefer':'return=minimal'}});showDueDateToast('','Evidence approved!');await loadAll();};})(ev.id);wrap.appendChild(appBtn);var rejBtn=document.createElement('button');rejBtn.className='btn btn-sm';rejBtn.style.cssText='font-size:11px;border-color:rgba(239,68,68,.3);color:var(--danger)';rejBtn.textContent='Reject';(function(eid){rejBtn.onclick=async function(e){e.stopPropagation();var reason=prompt('Rejection reason:');if(reason===null)return;await api('grc_evidence?id=eq.'+eid,{method:'PATCH',body:{status:'Rejected',rejection_reason:reason},extra:{'Prefer':'return=minimal'}});await loadAll();};})(ev.id);wrap.appendChild(rejBtn);}
    if(ev.evidence_link){var vBtn=document.createElement('a');vBtn.href=ev.evidence_link;vBtn.target='_blank';vBtn.className='btn btn-sm';vBtn.style.cssText='font-size:11px;text-decoration:none;display:inline-flex;align-items:center';vBtn.textContent='View';wrap.appendChild(vBtn);}
    if(can('actions')){var editBtn=document.createElement('button');editBtn.className='btn btn-sm';editBtn.style.fontSize='11px';editBtn.textContent='Edit';(function(itev){editBtn.onclick=function(e){e.stopPropagation();editEvidence(itev);};})(ev);wrap.appendChild(editBtn);}
    if(can('delete')){var delBtn=document.createElement('button');delBtn.className='btn btn-sm';delBtn.style.cssText='font-size:11px;border-color:rgba(239,68,68,.25);color:var(--danger)';delBtn.textContent='Del';(function(eid){delBtn.onclick=async function(e){e.stopPropagation();if(!confirm('Delete evidence?'))return;var _evdel=evidenceItems.find(function(x){return x.id==eid;});await api('grc_evidence?id=eq.'+eid,{method:'DELETE',extra:{'Prefer':'return=minimal'}});writeAuditLog('DELETE','Evidence','Deleted evidence: '+(_evdel?_evdel.title:eid));await loadAll();};})(ev.id);wrap.appendChild(delBtn);}
    td7.appendChild(wrap);tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);tr.appendChild(td5);tr.appendChild(td6);tr.appendChild(td7);tb.appendChild(tr);
  });
  updateEvidenceBadge();
}
function openEvidenceSubmitPanel(ev){document.getElementById('ev-submit-id').value=ev.id;var subEl=document.getElementById('ev-submit-sub');if(subEl)subEl.textContent='For: '+ev.title+' ('+ev.owner+')';var descBox=document.getElementById('ev-submit-desc-box');if(descBox)descBox.innerHTML='<strong>Required:</strong> '+(ev.description||ev.title||'—')+(ev.deadline?'<br><strong>Deadline:</strong> '+ev.deadline:'');document.getElementById('ev-link').value='';document.getElementById('ev-submit-notes').value='';openPanel('ev-submit-panel');}
async function submitEvidence(){var id=document.getElementById('ev-submit-id').value;var link=document.getElementById('ev-link').value.trim();var notes=document.getElementById('ev-submit-notes').value.trim();if(!link){alert('Please provide the evidence link.');return;}var res=await api('grc_evidence?id=eq.'+id,{method:'PATCH',body:{status:'Submitted',evidence_link:link,submission_notes:notes,submitted_at:new Date().toISOString()},extra:{'Prefer':'return=minimal'}});if(res&&res.ok){closePanel();writeAuditLog('UPDATE','Evidence','Submitted evidence',{id:id});showDueDateToast('','Evidence submitted!');await loadAll();}}
async function saveAudit(){if(!can('actions')){noPermission('Only admin and manager can create audits.');return;}var name=document.getElementById('audit-name').value.trim();if(!name){alert('Please enter an audit name.');return;}var body={name:name,audit_type:document.getElementById('audit-type').value,start_date:document.getElementById('audit-start').value||null,end_date:document.getElementById('audit-end').value||null,auditor:document.getElementById('audit-auditor').value.trim(),description:document.getElementById('audit-desc').value.trim()};var res=await api('grc_audits',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});if(res&&res.ok){closePanel();['audit-name','audit-start','audit-end','audit-auditor','audit-desc'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});writeAuditLog('CREATE','Audit','Created audit: '+name);showDueDateToast('','Audit created!');await loadAll();}else alert('Error. Make sure grc_audits table exists in Supabase.');}
async function saveEvidence(){if(!can('actions')){noPermission('Only admin and manager can manage evidence.');return;}var editId=document.getElementById('ev-edit-id').value;var title=document.getElementById('ev-title').value.trim();var owner=document.getElementById('ev-owner').value.trim();var dept=document.getElementById('ev-dept').value.trim();var deadline=document.getElementById('ev-deadline').value;var auditId=document.getElementById('ev-audit').value;if(!title){alert('Enter a title.');return;}if(!owner){alert('Assign an owner.');return;}if(!dept){alert('Enter team/department.');return;}if(!deadline){alert('Set a deadline.');return;}if(!auditId){alert('Select an audit first.');return;}var body={title:title,description:document.getElementById('ev-desc').value.trim(),audit_id:auditId,evidence_type:document.getElementById('ev-type').value,owner:owner,department:dept,email:document.getElementById('ev-email').value.trim(),deadline:deadline,priority:document.getElementById('ev-priority').value,control_ref:document.getElementById('ev-control').value.trim(),notes:document.getElementById('ev-notes').value.trim(),status:'Pending'};var res=editId?await api('grc_evidence?id=eq.'+editId,{method:'PATCH',body:body,extra:{'Prefer':'return=minimal'}}):await api('grc_evidence',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});if(res&&res.ok){closePanel();document.getElementById('ev-edit-id').value='';['ev-title','ev-desc','ev-owner','ev-dept','ev-email','ev-deadline','ev-control','ev-notes'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});writeAuditLog(editId?'UPDATE':'CREATE','Evidence',editId?'Updated evidence':'Created evidence: '+title,{owner:owner,deadline:deadline});showDueDateToast('',editId?'Updated!':'Evidence request created!');await loadAll();}else alert('Error. Make sure grc_evidence table exists.');}
function editEvidence(ev){document.getElementById('evidence-panel-title').textContent='Edit evidence request';document.getElementById('ev-edit-id').value=ev.id;document.getElementById('ev-title').value=ev.title||'';document.getElementById('ev-desc').value=ev.description||'';document.getElementById('ev-audit').value=ev.audit_id||'';document.getElementById('ev-type').value=ev.evidence_type||'Screenshot';document.getElementById('ev-owner').value=ev.owner||'';document.getElementById('ev-dept').value=ev.department||'';document.getElementById('ev-email').value=ev.email||'';document.getElementById('ev-deadline').value=ev.deadline||'';document.getElementById('ev-priority').value=ev.priority||'Medium';document.getElementById('ev-control').value=ev.control_ref||'';document.getElementById('ev-notes').value=ev.notes||'';openPanel('evidence-panel');}
function updateEvidenceBadge(){var cnt=evidenceItems.filter(function(e){var s=getEvidenceStatus(e);return s==='pending'||s==='overdue'||s==='submitted';}).length;var b=document.getElementById('evidence-badge');if(b){b.textContent=cnt;b.style.display=cnt>0?'inline-block':'none';}}


// ── CONTROL FRAMEWORK MAPPING ──
var FRAMEWORKS={iso27001:{name:'ISO 27001:2022',short:'ISO 27001',domains:[{id:'org',name:'Organisational (37)'},{id:'people',name:'People (8)'},{id:'phys',name:'Physical (14)'},{id:'tech',name:'Technological (34)'}],controls:[
{id:'A.5.1',name:'Policies for information security',domain:'org',desc:'Policies for information security and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties.'},
{id:'A.5.2',name:'Information security roles and responsibilities',domain:'org',desc:'Information security roles and responsibilities shall be defined and allocated according to the organization needs.'},
{id:'A.5.3',name:'Segregation of duties',domain:'org',desc:'Conflicting duties and conflicting areas of responsibility shall be segregated.'},
{id:'A.5.4',name:'Management responsibilities',domain:'org',desc:'Management shall require all personnel to apply information security in accordance with the established information security policy, topic-specific policies and procedures of the organization.'},
{id:'A.5.5',name:'Contact with authorities',domain:'org',desc:'The organization shall establish and maintain contact with relevant authorities.'},
{id:'A.5.6',name:'Contact with special interest groups',domain:'org',desc:'The organization shall establish and maintain contact with special interest groups or other specialist security forums and professional associations.'},
{id:'A.5.7',name:'Threat intelligence',domain:'org',desc:'Information relating to information security threats shall be collected and analysed to produce threat intelligence.'},
{id:'A.5.8',name:'Information security in project management',domain:'org',desc:'Information security shall be integrated into project management.'},
{id:'A.5.9',name:'Inventory of information and other associated assets',domain:'org',desc:'An inventory of information and other associated assets, including owners, shall be developed and maintained.'},
{id:'A.5.10',name:'Acceptable use of information and other associated assets',domain:'org',desc:'Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented and implemented.'},
{id:'A.5.11',name:'Return of assets',domain:'org',desc:'Personnel and other interested parties as appropriate shall return all the organization assets in their possession upon change or termination of their employment, contract or agreement.'},
{id:'A.5.12',name:'Classification of information',domain:'org',desc:'Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.'},
{id:'A.5.13',name:'Labelling of information',domain:'org',desc:'An appropriate set of procedures for information labelling shall be developed and implemented in accordance with the information classification scheme adopted by the organization.'},
{id:'A.5.14',name:'Information transfer',domain:'org',desc:'Information transfer rules, procedures, or agreements shall be in place for all types of transfer facilities within the organization and between the organization and other parties.'},
{id:'A.5.15',name:'Access control',domain:'org',desc:'Rules to control physical and logical access to information and other associated assets shall be established and implemented based on business and information security requirements.'},
{id:'A.5.16',name:'Identity management',domain:'org',desc:'The full life cycle of identities shall be managed.'},
{id:'A.5.17',name:'Authentication information',domain:'org',desc:'Allocation and management of authentication information shall be controlled by a management process, including advising personnel on appropriate handling of authentication information.'},
{id:'A.5.18',name:'Access rights',domain:'org',desc:'Access rights to information and other associated assets shall be provisioned, reviewed, modified and removed in accordance with the organization topic-specific policy on and rules for access control.'},
{id:'A.5.19',name:'Information security in supplier relationships',domain:'org',desc:'Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier products or services.'},
{id:'A.5.20',name:'Addressing security within supplier agreements',domain:'org',desc:'Relevant information security requirements shall be established and agreed with each supplier based on the type of supplier relationship.'},
{id:'A.5.21',name:'Managing security in the ICT supply chain',domain:'org',desc:'Processes and procedures shall be defined and implemented to manage the information security risks associated with the ICT products and services supply chain.'},
{id:'A.5.22',name:'Monitoring, review and change management of supplier services',domain:'org',desc:'The organization shall regularly monitor, review, evaluate and manage change in supplier information security practices and service delivery.'},
{id:'A.5.23',name:'Information security for use of cloud services',domain:'org',desc:'Processes for acquisition, use, management and exit from cloud services shall be established in accordance with the organization information security requirements.'},
{id:'A.5.24',name:'Information security incident management planning and preparation',domain:'org',desc:'The organization shall plan and prepare for managing information security incidents by defining, establishing and communicating information security incident management processes, roles and responsibilities.'},
{id:'A.5.25',name:'Assessment and decision on information security events',domain:'org',desc:'The organization shall be able to assess information security events and decide if they are to be categorized as information security incidents.'},
{id:'A.5.26',name:'Response to information security incidents',domain:'org',desc:'Information security incidents shall be responded to in accordance with the documented procedures.'},
{id:'A.5.27',name:'Learning from information security incidents',domain:'org',desc:'Knowledge gained from information security incidents shall be used to strengthen and improve the information security controls.'},
{id:'A.5.28',name:'Collection of evidence',domain:'org',desc:'The organization shall establish and implement procedures for the identification, collection, acquisition and preservation of evidence related to information security events.'},
{id:'A.5.29',name:'Information security during disruption',domain:'org',desc:'The organization shall plan how to maintain information security at an appropriate level during disruption.'},
{id:'A.5.30',name:'ICT readiness for business continuity',domain:'org',desc:'ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements.'},
{id:'A.5.31',name:'Legal, statutory, regulatory and contractual requirements',domain:'org',desc:'Legal, statutory, regulatory and contractual requirements relevant to information security and the organization approach to meet these requirements shall be identified, documented and kept up to date.'},
{id:'A.5.32',name:'Intellectual property rights',domain:'org',desc:'The organization shall implement appropriate procedures to protect intellectual property rights.'},
{id:'A.5.33',name:'Protection of records',domain:'org',desc:'Records shall be protected from loss, destruction, falsification, unauthorized access and unauthorized release.'},
{id:'A.5.34',name:'Privacy and protection of PII',domain:'org',desc:'The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII according to applicable laws and regulations and contractual requirements.'},
{id:'A.5.35',name:'Independent review of information security',domain:'org',desc:'The organization approach to managing information security and its implementation including people, processes and technologies shall be reviewed independently at planned intervals or when significant changes occur.'},
{id:'A.5.36',name:'Compliance with policies, rules and standards for information security',domain:'org',desc:'Compliance with the organization information security policy, topic-specific policies, rules and standards shall be regularly reviewed.'},
{id:'A.5.37',name:'Documented operating procedures',domain:'org',desc:'Operating procedures for information processing facilities shall be documented and made available to personnel who need them.'},
{id:'A.6.1',name:'Screening',domain:'people',desc:'Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.'},
{id:'A.6.2',name:'Terms and conditions of employment',domain:'people',desc:'The employment contractual agreements shall state the personnel and the organization responsibilities for information security.'},
{id:'A.6.3',name:'Information security awareness, education and training',domain:'people',desc:'Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization information security policy, topic-specific policies and procedures, as relevant for their job function.'},
{id:'A.6.4',name:'Disciplinary process',domain:'people',desc:'A disciplinary process shall be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation.'},
{id:'A.6.5',name:'Responsibilities after termination or change of employment',domain:'people',desc:'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced and communicated to relevant personnel and other interested parties.'},
{id:'A.6.6',name:'Confidentiality or non-disclosure agreements',domain:'people',desc:'Confidentiality or non-disclosure agreements reflecting the organization needs for the protection of information shall be identified, documented, regularly reviewed and signed by personnel and other relevant interested parties.'},
{id:'A.6.7',name:'Remote working',domain:'people',desc:'Security measures shall be implemented when personnel are working remotely to protect information accessed, processed or stored outside the organization premises.'},
{id:'A.6.8',name:'Information security event reporting',domain:'people',desc:'The organization shall provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner.'},
{id:'A.7.1',name:'Physical security perimeters',domain:'phys',desc:'Security perimeters shall be defined and used to protect areas that contain information and other associated assets.'},
{id:'A.7.2',name:'Physical entry',domain:'phys',desc:'Secure areas shall be protected by appropriate entry controls and access points to ensure that only authorized personnel are allowed access.'},
{id:'A.7.3',name:'Securing offices, rooms and facilities',domain:'phys',desc:'Physical security for offices, rooms and facilities shall be designed and implemented.'},
{id:'A.7.4',name:'Physical security monitoring',domain:'phys',desc:'Premises shall be continuously monitored for unauthorized physical access.'},
{id:'A.7.5',name:'Protecting against physical and environmental threats',domain:'phys',desc:'Protection against physical and environmental threats, such as natural disasters and other intentional or unintentional physical threats to infrastructure shall be designed and implemented.'},
{id:'A.7.6',name:'Working in secure areas',domain:'phys',desc:'Security measures for working in secure areas shall be designed and implemented.'},
{id:'A.7.7',name:'Clear desk and clear screen',domain:'phys',desc:'Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities shall be defined and appropriately enforced.'},
{id:'A.7.8',name:'Equipment siting and protection',domain:'phys',desc:'Equipment shall be sited securely and protected.'},
{id:'A.7.9',name:'Security of assets off-premises',domain:'phys',desc:'Off-site assets shall be protected.'},
{id:'A.7.10',name:'Storage media',domain:'phys',desc:'Storage media shall be managed through their life cycle of acquisition, use, transportation and disposal in accordance with the organization classification scheme and handling requirements.'},
{id:'A.7.11',name:'Supporting utilities',domain:'phys',desc:'Information processing facilities shall be protected from power failures and other disruptions caused by failures in supporting utilities.'},
{id:'A.7.12',name:'Cabling security',domain:'phys',desc:'Cables carrying power, data or supporting information services shall be protected from interception, interference or damage.'},
{id:'A.7.13',name:'Equipment maintenance',domain:'phys',desc:'Equipment shall be maintained correctly to ensure availability, integrity and confidentiality of information.'},
{id:'A.7.14',name:'Secure disposal or re-use of equipment',domain:'phys',desc:'Items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been erased or securely overwritten prior to disposal or re-use.'},
{id:'A.8.1',name:'User endpoint devices',domain:'tech',desc:'Information stored on, processed by or accessible via user endpoint devices shall be protected.'},
{id:'A.8.2',name:'Privileged access rights',domain:'tech',desc:'The allocation and use of privileged access rights shall be restricted and managed.'},
{id:'A.8.3',name:'Information access restriction',domain:'tech',desc:'Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.'},
{id:'A.8.4',name:'Access to source code',domain:'tech',desc:'Read and write access to source code, development tools and software libraries shall be appropriately managed.'},
{id:'A.8.5',name:'Secure authentication',domain:'tech',desc:'Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control.'},
{id:'A.8.6',name:'Capacity management',domain:'tech',desc:'The use of resources shall be monitored and adjusted in line with current and expected capacity requirements.'},
{id:'A.8.7',name:'Protection against malware',domain:'tech',desc:'Protection against malware shall be implemented and supported by appropriate user awareness.'},
{id:'A.8.8',name:'Management of technical vulnerabilities',domain:'tech',desc:'Information about technical vulnerabilities of information systems in use shall be obtained, the organization exposure to such vulnerabilities shall be evaluated and appropriate measures shall be taken.'},
{id:'A.8.9',name:'Configuration management',domain:'tech',desc:'Configurations, including security configurations, of hardware, software, services and networks shall be established, documented, implemented, monitored and reviewed.'},
{id:'A.8.10',name:'Information deletion',domain:'tech',desc:'Information stored in information systems, devices or in any other storage media shall be deleted when no longer required.'},
{id:'A.8.11',name:'Data masking',domain:'tech',desc:'Data masking shall be used in accordance with the organization topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration.'},
{id:'A.8.12',name:'Data leakage prevention',domain:'tech',desc:'Data leakage prevention measures shall be applied to systems, networks and any other devices that process, store or transmit sensitive information.'},
{id:'A.8.13',name:'Information backup',domain:'tech',desc:'Backup copies of information, software and systems shall be maintained and regularly tested in accordance with the agreed topic-specific policy on backup.'},
{id:'A.8.14',name:'Redundancy of information processing facilities',domain:'tech',desc:'Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements.'},
{id:'A.8.15',name:'Logging',domain:'tech',desc:'Logs that record activities, exceptions, faults and other relevant events shall be produced, stored, protected and analysed.'},
{id:'A.8.16',name:'Monitoring activities',domain:'tech',desc:'Networks, systems and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents.'},
{id:'A.8.17',name:'Clock synchronization',domain:'tech',desc:'The clocks of information processing systems used by the organization shall be synchronized to approved time sources.'},
{id:'A.8.18',name:'Use of privileged utility programs',domain:'tech',desc:'The use of utility programs that might be capable of overriding system and application controls shall be restricted and tightly controlled.'},
{id:'A.8.19',name:'Installation of software on operational systems',domain:'tech',desc:'Procedures and measures shall be implemented to securely manage software installation on operational systems.'},
{id:'A.8.20',name:'Networks security',domain:'tech',desc:'Networks and network devices shall be secured, managed and controlled to protect information in systems and applications.'},
{id:'A.8.21',name:'Security of network services',domain:'tech',desc:'Security mechanisms, service levels and service requirements of network services shall be identified, implemented and monitored.'},
{id:'A.8.22',name:'Segregation of networks',domain:'tech',desc:'Groups of information services, users and information systems shall be segregated in the organization networks.'},
{id:'A.8.23',name:'Web filtering',domain:'tech',desc:'Access to external websites shall be managed to reduce exposure to malicious content.'},
{id:'A.8.24',name:'Use of cryptography',domain:'tech',desc:'Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented.'},
{id:'A.8.25',name:'Secure development life cycle',domain:'tech',desc:'Rules for the secure development of software and systems shall be established and applied.'},
{id:'A.8.26',name:'Application security requirements',domain:'tech',desc:'Information security requirements shall be identified, specified and approved when developing or acquiring applications.'},
{id:'A.8.27',name:'Secure system architecture and engineering principles',domain:'tech',desc:'Principles for engineering secure systems shall be established, documented, maintained and applied to any information system development activities.'},
{id:'A.8.28',name:'Secure coding',domain:'tech',desc:'Secure coding principles shall be applied to software development.'},
{id:'A.8.29',name:'Security testing in development and acceptance',domain:'tech',desc:'Security testing processes shall be defined and implemented in the development life cycle.'},
{id:'A.8.30',name:'Outsourced development',domain:'tech',desc:'The organization shall direct, monitor and review the activities related to outsourced system development.'},
{id:'A.8.31',name:'Separation of development, test and production environments',domain:'tech',desc:'Development, testing and production environments shall be separated and secured.'},
{id:'A.8.32',name:'Change management',domain:'tech',desc:'Changes to information processing facilities and information systems shall be subject to change management procedures.'},
{id:'A.8.33',name:'Test information',domain:'tech',desc:'Test information shall be appropriately selected, protected and managed.'},
{id:'A.8.34',name:'Protection of information systems during audit testing',domain:'tech',desc:'Audit tests and other assurance activities involving assessment of operational systems shall be planned and agreed between the tester and appropriate management.'}
]},soc2:{name:'SOC 2 Type 2',short:'SOC 2',domains:[{id:'cc',name:'Common Criteria'},{id:'a',name:'Availability'},{id:'c',name:'Confidentiality'},{id:'p',name:'Privacy'}],controls:[{id:'CC1.1',name:'Commitment to integrity',domain:'cc',desc:'The entity demonstrates a commitment to integrity and ethical values.'},{id:'CC1.3',name:'Management structure',domain:'cc',desc:'Management establishes structures, reporting lines, and appropriate authorities.'},{id:'CC2.1',name:'Information and communication',domain:'cc',desc:'The entity obtains and uses relevant, quality information to support internal control.'},{id:'CC3.1',name:'Risk assessment objectives',domain:'cc',desc:'The entity specifies objectives to enable identification and assessment of risks.'},{id:'CC3.2',name:'Risk identification',domain:'cc',desc:'The entity identifies risks to achievement of objectives and analyses them.'},{id:'CC4.1',name:'Control monitoring',domain:'cc',desc:'The entity performs ongoing evaluations to ascertain whether controls are present and functioning.'},{id:'CC5.1',name:'Control selection',domain:'cc',desc:'The entity selects and develops control activities to mitigate risks.'},{id:'CC6.1',name:'Logical access controls',domain:'cc',desc:'The entity implements logical access security over protected information assets.'},{id:'CC6.2',name:'Access provisioning',domain:'cc',desc:'Prior to granting access, the entity registers and authorises new users.'},{id:'CC6.3',name:'Access removal',domain:'cc',desc:'The entity removes access when no longer required.'},{id:'CC6.7',name:'Data transmission security',domain:'cc',desc:'The entity restricts transmission of information to authorised users.'},{id:'CC7.1',name:'Vulnerability detection',domain:'cc',desc:'The entity uses detection procedures to identify configuration changes and vulnerabilities.'},{id:'CC7.2',name:'Anomaly monitoring',domain:'cc',desc:'The entity monitors system components for anomalies indicative of malicious acts.'},{id:'CC7.4',name:'Incident response',domain:'cc',desc:'The entity responds to identified security incidents by executing a defined response program.'},{id:'CC8.1',name:'Change management',domain:'cc',desc:'The entity authorises, designs, tests, approves and implements changes.'},{id:'CC9.2',name:'Vendor risk management',domain:'cc',desc:'The entity assesses and manages risks associated with vendors and business partners.'},{id:'A1.1',name:'Capacity planning',domain:'a',desc:'The entity maintains, monitors and evaluates current processing capacity.'},{id:'A1.3',name:'Recovery testing',domain:'a',desc:'The entity tests recovery plan procedures to determine systems recovery meets objectives.'},{id:'C1.1',name:'Confidential information',domain:'c',desc:'The entity identifies and maintains confidential information to meet objectives.'},{id:'P1.1',name:'Privacy notice',domain:'p',desc:'The entity provides notice to data subjects about its privacy practices.'},{id:'P3.1',name:'Personal information collection',domain:'p',desc:'Personal information is collected consistent with entity objectives.'},{id:'P6.1',name:'Personal information disclosure',domain:'p',desc:'The entity discloses personal information with explicit consent of data subjects.'}]},gdpr:{name:'GDPR',short:'GDPR',domains:[{id:'principles',name:'Principles'},{id:'rights',name:'Data subject rights'},{id:'controller',name:'Controller obligations'},{id:'security',name:'Security'}],controls:[{id:'Art.5',name:'Principles of processing',domain:'principles',desc:'Personal data must be processed lawfully, fairly and transparently for specified purposes.'},{id:'Art.6',name:'Lawfulness of processing',domain:'principles',desc:'Processing shall be lawful only if a valid legal basis applies.'},{id:'Art.7',name:'Conditions for consent',domain:'principles',desc:'Where processing is based on consent, the controller shall demonstrate consent was given.'},{id:'Art.9',name:'Special categories of data',domain:'principles',desc:'Processing of special categories of personal data is prohibited unless an exception applies.'},{id:'Art.13',name:'Information at collection',domain:'rights',desc:'The controller shall provide data subjects with specific information at the time of collection.'},{id:'Art.15',name:'Right of access',domain:'rights',desc:'Data subjects shall have the right to obtain confirmation of whether their data is processed.'},{id:'Art.17',name:'Right to erasure',domain:'rights',desc:'Data subjects shall have the right to obtain erasure of personal data.'},{id:'Art.20',name:'Right to data portability',domain:'rights',desc:'Data subjects shall have the right to receive personal data in a machine-readable format.'},{id:'Art.24',name:'Responsibility of controller',domain:'controller',desc:'The controller shall implement appropriate technical and organisational measures.'},{id:'Art.25',name:'Data protection by design',domain:'controller',desc:'The controller shall implement data protection by design and by default.'},{id:'Art.28',name:'Processor requirements',domain:'controller',desc:'The controller shall only use processors providing sufficient guarantees.'},{id:'Art.30',name:'Records of processing',domain:'controller',desc:'The controller shall maintain records of processing activities.'},{id:'Art.32',name:'Security of processing',domain:'security',desc:'The controller and processor shall implement appropriate technical and organisational security measures.'},{id:'Art.33',name:'Breach notification',domain:'security',desc:'In case of a personal data breach, the controller shall notify the authority within 72 hours.'},{id:'Art.35',name:'Data protection impact assessment',domain:'security',desc:'Where processing is likely to result in high risk, the controller shall carry out a DPIA.'}]},nist:{name:'NIST CSF 2.0',short:'NIST',domains:[{id:'GV',name:'Govern'},{id:'ID',name:'Identify'},{id:'PR',name:'Protect'},{id:'DE',name:'Detect'},{id:'RS',name:'Respond'},{id:'RC',name:'Recover'}],controls:[{id:'GV.OC-1',name:'Organisational context',domain:'GV',desc:'The organisational mission is understood and informs cybersecurity risk management decisions.'},{id:'GV.RM-1',name:'Risk management strategy',domain:'GV',desc:'Risk management objectives are established and agreed to by organizational stakeholders.'},{id:'GV.RM-2',name:'Risk tolerance',domain:'GV',desc:'Risk appetite and risk tolerance statements are established, communicated and maintained.'},{id:'GV.RR-1',name:'Roles and responsibilities',domain:'GV',desc:'Organizational leadership is responsible and accountable for cybersecurity risk.'},{id:'GV.PO-1',name:'Policy established',domain:'GV',desc:'Policy for managing cybersecurity risks is established based on organizational context.'},{id:'ID.AM-1',name:'Asset inventory',domain:'ID',desc:'Assets that enable the organization to achieve business purposes are identified and managed.'},{id:'ID.AM-2',name:'Software inventory',domain:'ID',desc:'Inventories of software, services and systems managed by the organization are maintained.'},{id:'ID.RA-1',name:'Vulnerability identification',domain:'ID',desc:'Vulnerabilities in assets are identified, validated and recorded.'},{id:'ID.RA-3',name:'Threat identification',domain:'ID',desc:'Internal and external threats to the organization are identified and recorded.'},{id:'PR.AA-1',name:'Identity management',domain:'PR',desc:'Identities and credentials for authorised users, services and hardware are managed.'},{id:'PR.AA-4',name:'Access permissions',domain:'PR',desc:'Access permissions, entitlements and authorisations are managed.'},{id:'PR.AA-5',name:'Least privilege',domain:'PR',desc:'Access is based on least privilege and separation of duties principles.'},{id:'PR.AT-1',name:'Awareness and training',domain:'PR',desc:'Personnel are provided with awareness and training to perform tasks with cybersecurity risks in mind.'},{id:'PR.DS-1',name:'Data at rest protection',domain:'PR',desc:'The confidentiality, integrity and availability of data-at-rest are protected.'},{id:'PR.DS-2',name:'Data in transit protection',domain:'PR',desc:'The confidentiality, integrity and availability of data-in-transit are protected.'},{id:'PR.PS-1',name:'Configuration management',domain:'PR',desc:'Configuration management practices are established and applied.'},{id:'PR.PS-4',name:'Log generation',domain:'PR',desc:'Logs of events are generated and retained.'},{id:'DE.CM-1',name:'Networks monitored',domain:'DE',desc:'Networks and network services are monitored to find potentially adverse events.'},{id:'DE.CM-9',name:'Computing hardware monitored',domain:'DE',desc:'Computing hardware and software are monitored to find potentially adverse events.'},{id:'DE.AE-2',name:'Events analysed',domain:'DE',desc:'Potentially adverse events are analysed to better understand associated activities.'},{id:'RS.MA-1',name:'Incident investigation',domain:'RS',desc:'The incident response plan is executed once an incident is declared.'},{id:'RS.MI-1',name:'Incident containment',domain:'RS',desc:'Incidents are contained.'},{id:'RS.CO-2',name:'Internal reporting',domain:'RS',desc:'Internal and external stakeholders are notified of incidents in a timely manner.'},{id:'RC.RP-1',name:'Recovery planning',domain:'RC',desc:'The recovery portion of the incident response plan is executed.'},{id:'RC.RP-5',name:'Restoration completeness',domain:'RC',desc:'The integrity of restored assets is verified and normal operating status is confirmed.'}]}};

var activeFwDomain='';
function getControlMapping(fwId,ctrlId){return controlMappings.find(function(m){return m.framework_id===fwId&&m.control_id===ctrlId;});}
function getCoverageStatus(fwId,ctrlId){var m=getControlMapping(fwId,ctrlId);if(!m)return 'gap';return m.coverage_status||'gap';}
function renderFrameworks(){
  var fwId=(document.getElementById('fw-select')||{}).value||'iso27001';
  var fw=FRAMEWORKS[fwId];if(!fw)return;
  var tabsEl=document.getElementById('fw-domain-tabs');
  if(tabsEl){tabsEl.innerHTML='';var allBtn=document.createElement('button');allBtn.className='filter-tag'+(activeFwDomain===''?' active':'');allBtn.textContent='All domains';allBtn.onclick=function(){activeFwDomain='';renderFrameworks();};tabsEl.appendChild(allBtn);fw.domains.forEach(function(d){var btn=document.createElement('button');btn.className='filter-tag'+(activeFwDomain===d.id?' active':'');var cnt=fw.controls.filter(function(c){return c.domain===d.id;}).length;btn.textContent=d.name+' ('+cnt+')';btn.onclick=function(){activeFwDomain=d.id;renderFrameworks();};tabsEl.appendChild(btn);});}
  var allControls=fw.controls;var filtered=activeFwDomain?allControls.filter(function(c){return c.domain===activeFwDomain;}):allControls;
  var covered=0,partial=0,gap=0,na=0;
  allControls.forEach(function(c){var s=getCoverageStatus(fwId,c.id);if(s==='covered')covered++;else if(s==='partial')partial++;else if(s==='na')na++;else gap++;});
  var applicable=allControls.length-na;var pct=applicable>0?Math.round((covered+partial*0.5)/applicable*100):0;
  var sumEl=document.getElementById('fw-summary');
  if(sumEl){sumEl.innerHTML='';[{l:'Total controls',v:allControls.length,c:'var(--text)',t:'#5b5ef4'},{l:'Covered',v:covered,c:'var(--success)',t:'#10b981'},{l:'Partial',v:partial,c:'var(--warning)',t:'#f59e0b'},{l:'Gaps',v:gap,c:'var(--danger)',t:'#ef4444'}].forEach(function(m){var card=document.createElement('div');card.className='metric-card';card.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div><div class="mc-label" style="margin-top:4px">'+m.l+'</div><div class="mc-val" style="color:'+m.c+'">'+m.v+'</div>';sumEl.appendChild(card);});}
  var bar=document.getElementById('fw-coverage-bar');var txt=document.getElementById('fw-coverage-text');
  if(bar){bar.style.width=pct+'%';bar.style.background=pct>=80?'linear-gradient(90deg,var(--success),#059669)':pct>=50?'linear-gradient(90deg,var(--warning),#d97706)':'linear-gradient(90deg,var(--danger),#dc2626)';}
  if(txt)txt.textContent=pct+'% coverage ('+covered+' covered, '+partial+' partial, '+gap+' gaps) across '+applicable+' applicable controls';
  var tb=document.getElementById('fw-controls-body');if(!tb)return;while(tb.firstChild)tb.removeChild(tb.firstChild);
  if(!filtered.length){var tr0=document.createElement('tr');var td0=document.createElement('td');td0.colSpan=6;td0.className='empty';td0.textContent='No controls in this domain.';tr0.appendChild(td0);tb.appendChild(tr0);return;}
  filtered.forEach(function(ctrl){
    var mapping=getControlMapping(fwId,ctrl.id);var status=getCoverageStatus(fwId,ctrl.id);var domainObj=fw.domains.find(function(d){return d.id===ctrl.domain;})||{name:ctrl.domain};
    var mappedItems=mapping?JSON.parse(mapping.item_ids||'[]'):[];var mappedRisks=mapping?JSON.parse(mapping.risk_ids||'[]'):[];var totalMapped=mappedItems.length+mappedRisks.length;
    var sConfig={covered:{bg:'var(--success-light)',c:'var(--success)',lbl:'✓ Covered'},partial:{bg:'var(--warning-light)',c:'var(--warning)',lbl:'~ Partial'},gap:{bg:'var(--danger-light)',c:'var(--danger)',lbl:'✗ Gap'},na:{bg:'var(--border)',c:'var(--text3)',lbl:'N/A'}};var sc=sConfig[status]||sConfig.gap;
    var tr=document.createElement('tr');tr.className='item-row';tr.style.height='52px';if(status==='gap')tr.style.background='rgba(239,68,68,.02)';
    var td1=document.createElement('td');td1.style.paddingLeft='16px';td1.innerHTML='<div style="font-family:monospace;font-size:12px;font-weight:700;color:var(--primary)">'+ctrl.id+'</div>';
    var td2=document.createElement('td');td2.innerHTML='<div style="font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px" title="'+ctrl.name+'">'+ctrl.name+'</div>';
    var td3=document.createElement('td');td3.innerHTML='<span style="font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text2);white-space:nowrap">'+domainObj.name+'</span>';
    var td4=document.createElement('td');var sBadge=document.createElement('span');sBadge.className='badge';sBadge.style.cssText='background:'+sc.bg+';color:'+sc.c+';cursor:pointer;white-space:nowrap';sBadge.textContent=sc.lbl;
    if(can('add')){sBadge.title='Click to change';var sOrder=['gap','partial','covered','na'];(function(fid,cid){sBadge.onclick=async function(e){e.stopPropagation();var cur=getCoverageStatus(fid,cid);var next=sOrder[(sOrder.indexOf(cur)+1)%sOrder.length];var m2=getControlMapping(fid,cid);if(m2)await api('grc_control_mappings?framework_id=eq.'+fid+'&control_id=eq.'+cid,{method:'PATCH',body:{coverage_status:next},extra:{'Prefer':'return=minimal'}});else await api('grc_control_mappings',{method:'POST',body:{framework_id:fid,control_id:cid,coverage_status:next,item_ids:'[]',risk_ids:'[]'},extra:{'Prefer':'return=representation'}});await loadAll();};})(fwId,ctrl.id);}
    td4.appendChild(sBadge);
    var td5=document.createElement('td');td5.innerHTML=totalMapped>0?'<span style="font-size:12px;color:var(--text2)">'+mappedItems.length+' item'+(mappedItems.length!==1?'s':'')+(mappedRisks.length>0?', '+mappedRisks.length+' risk':'')+'</span>':'<span style="font-size:12px;color:var(--text3)">None mapped</span>';
    var td6=document.createElement('td');var wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:5px;flex-wrap:wrap';
    if(can('add')){var mapBtn=document.createElement('button');mapBtn.className='btn btn-sm btn-primary';mapBtn.style.fontSize='11px';mapBtn.textContent='Map items';(function(c2,fid){mapBtn.onclick=function(e){e.stopPropagation();openMapControlPanel(fid,c2);};})(ctrl,fwId);wrap.appendChild(mapBtn);}
    if(mapping&&mapping.evidence_link){var evL=document.createElement('a');evL.href=mapping.evidence_link;evL.target='_blank';evL.className='btn btn-sm';evL.style.cssText='font-size:11px;text-decoration:none';evL.textContent='Evidence';wrap.appendChild(evL);}
    td6.appendChild(wrap);
    tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);tr.appendChild(td5);tr.appendChild(td6);
    tr.addEventListener('click',function(){
      var isOpen=tr.classList.contains('expanded');tb.querySelectorAll('.item-row.expanded').forEach(function(r){r.classList.remove('expanded');});tb.querySelectorAll('.fw-detail-row').forEach(function(d){d.remove();});
      if(!isOpen){tr.classList.add('expanded');var dtr=document.createElement('tr');dtr.className='fw-detail-row';var dtd=document.createElement('td');dtd.colSpan=6;dtd.style.cssText='padding:0;white-space:normal;overflow:visible';
        dtd.innerHTML='<div style="background:var(--surface2);border-left:3px solid '+sc.c+';padding:16px 20px">'+
          '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Control requirement</div>'+
          '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;padding:10px 14px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">'+ctrl.desc+'</div>'+
          (mapping&&mapping.notes?'<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Notes</div><div style="font-size:13px;color:var(--text);background:var(--info-light);padding:10px 14px;border-radius:8px;border:1px solid rgba(59,130,246,.15);line-height:1.7">'+mapping.notes+'</div></div>':'')+
          '</div>';
        dtr.appendChild(dtd);tr.parentNode.insertBefore(dtr,tr.nextSibling);}
    });
    tb.appendChild(tr);
  });
  updateFrameworksBadge();
}
function openMapControlPanel(fwId,ctrl){
  document.getElementById('map-panel-title').textContent='Map: '+ctrl.id+' — '+ctrl.name;
  document.getElementById('map-panel-sub').textContent=FRAMEWORKS[fwId]?FRAMEWORKS[fwId].name:'';
  document.getElementById('map-control-id').value=ctrl.id;document.getElementById('map-framework-id').value=fwId;document.getElementById('map-control-desc').textContent=ctrl.desc;
  var mapping=getControlMapping(fwId,ctrl.id);var savedItemIds=mapping?JSON.parse(mapping.item_ids||'[]'):[];var savedRiskIds=mapping?JSON.parse(mapping.risk_ids||'[]'):[];
  document.getElementById('map-status').value=mapping?mapping.coverage_status:'gap';document.getElementById('map-notes').value=mapping?mapping.notes||'':'';document.getElementById('map-evidence-link').value=mapping?mapping.evidence_link||'':'';
  var iList=document.getElementById('map-items-list');if(iList){iList.innerHTML='';items.forEach(function(it){var row=document.createElement('label');row.style.cssText='display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;border-bottom:1px solid var(--border2)';var cb=document.createElement('input');cb.type='checkbox';cb.value=it.id;cb.checked=savedItemIds.indexOf(it.id)>-1||savedItemIds.indexOf(String(it.id))>-1;cb.style.cssText='width:16px;height:16px;cursor:pointer;flex-shrink:0;accent-color:var(--primary)';var nd=document.createElement('div');nd.style.cssText='flex:1;min-width:0';var n=document.createElement('div');n.style.cssText='font-size:13px;color:var(--text);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';n.textContent=it.name;var m=document.createElement('div');m.style.cssText='font-size:11px;color:var(--text3);margin-top:1px';m.textContent=it.stakeholder+(it.dept?' · '+it.dept:'');nd.appendChild(n);nd.appendChild(m);var s=document.createElement('span');s.className='badge b-'+(getStatus(it)==='done'?'done':getStatus(it)==='overdue'?'overdue':'pending');s.style.fontSize='10px';s.textContent=getStatus(it);row.appendChild(cb);row.appendChild(nd);row.appendChild(s);iList.appendChild(row);});}
  var rList=document.getElementById('map-risks-list');if(rList){rList.innerHTML='';risks.forEach(function(r){var score=r.likelihood*r.impact;var row=document.createElement('label');row.style.cssText='display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;border-bottom:1px solid var(--border2)';var cb=document.createElement('input');cb.type='checkbox';cb.value=r.id;cb.checked=savedRiskIds.indexOf(r.id)>-1||savedRiskIds.indexOf(String(r.id))>-1;cb.style.cssText='width:16px;height:16px;cursor:pointer;flex-shrink:0;accent-color:var(--primary)';var nd=document.createElement('div');nd.style.cssText='flex:1;min-width:0';var n=document.createElement('div');n.style.cssText='font-size:13px;color:var(--text);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';n.textContent=r.name;var m=document.createElement('div');m.style.cssText='font-size:11px;color:var(--text3);margin-top:1px';m.textContent=r.category+(r.owner?' · '+r.owner:'');nd.appendChild(n);nd.appendChild(m);var s=document.createElement('span');s.style.cssText='font-size:11px;font-weight:700;color:'+(score>=15?'var(--danger)':score>=8?'var(--warning)':'var(--success)');s.textContent=(score>=15?'High':score>=8?'Medium':'Low')+' ('+score+')';row.appendChild(cb);row.appendChild(nd);row.appendChild(s);rList.appendChild(row);});}
  openPanel('map-control-panel');
}
async function saveControlMapping(){
  if(!can('add')){noPermission();return;}
  var fwId=document.getElementById('map-framework-id').value;var ctrlId=document.getElementById('map-control-id').value;var status=document.getElementById('map-status').value;
  var checkedItems=[];document.querySelectorAll('#map-items-list input[type=checkbox]:checked').forEach(function(cb){checkedItems.push(cb.value);});
  var checkedRisks=[];document.querySelectorAll('#map-risks-list input[type=checkbox]:checked').forEach(function(cb){checkedRisks.push(cb.value);});
  if(status==='gap'&&checkedItems.length>0) status='partial';
  var body={framework_id:fwId,control_id:ctrlId,coverage_status:status,item_ids:JSON.stringify(checkedItems),risk_ids:JSON.stringify(checkedRisks),notes:document.getElementById('map-notes').value.trim(),evidence_link:document.getElementById('map-evidence-link').value.trim()};
  var existing=getControlMapping(fwId,ctrlId);var res=existing?await api('grc_control_mappings?framework_id=eq.'+fwId+'&control_id=eq.'+ctrlId,{method:'PATCH',body:body,extra:{'Prefer':'return=minimal'}}):await api('grc_control_mappings',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});
  if(res&&res.ok){closePanel();writeAuditLog(existing?'UPDATE':'CREATE','Control Mapping',(existing?'Updated':'Mapped')+' control '+ctrlId+' ('+fwId+')',{status:status});showDueDateToast('','Control mapping saved!');await loadAll();}
  else alert('Error saving. Make sure grc_control_mappings table exists in Supabase.');
}
function updateFrameworksBadge(){var fwId=(document.getElementById('fw-select')||{}).value||'iso27001';var fw=FRAMEWORKS[fwId];if(!fw)return;var gaps=fw.controls.filter(function(c){return getCoverageStatus(fwId,c.id)==='gap';}).length;var b=document.getElementById('frameworks-badge');if(b){b.textContent=gaps;b.style.display=gaps>0?'inline-block':'none';}}

// ── IMPORT / EXPORT PERMISSION WRAPPERS ──
function guardedImport(){if(!can('import')){noPermission('Only admin and manager can import data.');return;}document.getElementById('import-file-input').click();}
(function(){var cb=document.getElementById('confirm-import-btn');if(cb){cb.addEventListener('click',function(e){if(!can('import')){e.preventDefault();e.stopImmediatePropagation();noPermission('Only admin and manager can import data.');}},true);}})();


// ── EXPORT PAGE STATS — global so loadAll and nav can call it ──
function renderExportPage(){
  var bar = document.getElementById('export-stats-bar');
  if(bar){
    while(bar.firstChild) bar.removeChild(bar.firstChild);
    var overdueCount = (typeof items!=='undefined'?items:[]).filter(function(it){return getStatus(it)==='overdue';}).length;
    var highRiskCount = (typeof risks!=='undefined'?risks:[]).filter(function(r){return (r.likelihood||1)*(r.impact||1)>=15;}).length;
    [
      {l:'Total items',  v:(typeof items!=='undefined'?items:[]).length,  c:'var(--primary)', t:'#5b5ef4'},
      {l:'Overdue',      v:overdueCount,                                  c:'var(--danger)',  t:'#ef4444'},
      {l:'Total risks',  v:(typeof risks!=='undefined'?risks:[]).length,  c:'#7c3aed',        t:'#7c3aed'},
      {l:'High risks',   v:highRiskCount,                                 c:'#f59e0b',        t:'#f59e0b'}
    ].forEach(function(m){
      var card=document.createElement('div');
      card.className='metric-card';
      card.style.cursor='default';
      card.innerHTML='<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div>'+
        '<div class="mc-label" style="margin-top:6px;font-size:10px">'+m.l+'</div>'+
        '<div class="mc-val" style="color:'+m.c+';font-size:26px">'+m.v+'</div>';
      bar.appendChild(card);
    });
  }
  var oc=document.getElementById('exp-overdue-count');
  if(oc){
    var cnt=(typeof items!=='undefined'?items:[]).filter(function(it){return getStatus(it)==='overdue';}).length;
    oc.textContent=cnt>0?cnt+' item'+(cnt!==1?'s':'')+' past their due date — needs immediate attention':'No overdue items currently — all tasks on track ✓';
    oc.style.color=cnt>0?'var(--danger)':'var(--success)';
  }
}

// ── EXPORT BUTTON WIRING ──
function wireExportButtons(){



  window.getDateStr = function(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  };

  window.exportToXLSX = function(filename, sheetName, rows){
    if(typeof XLSX==='undefined'){
      alert('Excel library not loaded yet. Please wait a few seconds and try again.');
      return;
    }
    if(!rows||rows.length<2){
      showDueDateToast('','No data to export.');
      return;
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var colWidths = rows[0].map(function(_,ci){
      return {wch: Math.min(40, Math.max(10, rows.reduce(function(max,row){
        return Math.max(max, String(row[ci]||'').length);
      },0)))};
    });
    ws['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0,31));
    XLSX.writeFile(wb, filename);
    if(typeof writeAuditLog==='function') writeAuditLog('EXPORT','System','Exported '+sheetName+' to Excel',{rows:rows.length-1,filename:filename});
    showDueDateToast('','Downloaded: '+filename);
  };

  window.exportToCSV = function(filename, rows){
    if(!rows||rows.length<2){
      showDueDateToast('','No data to export.');
      return;
    }
    var csv = rows.map(function(row){
      return row.map(function(cell){
        var v = String(cell==null?'':cell);
        return v.indexOf(',')>-1||v.indexOf('"')>-1||v.indexOf('\n')>-1 ? '"'+v.replace(/"/g,'""')+'"' : v;
      }).join(',');
    }).join('\r\n');
    var blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    if(typeof writeAuditLog==='function') writeAuditLog('EXPORT','System','Exported to CSV',{rows:rows.length-1,filename:filename});
    showDueDateToast('','Downloaded: '+filename);
  };

  window.itemsToRows = function(arr){
    var header=['Task','Stakeholder','Email','Department','Frequency','Due Date','Status','Priority','Assignee','Framework','Category','Notes'];
    var rows=[header];
    (arr||[]).forEach(function(it){
      var s=getStatus(it);
      var displayStatus=it.item_status&&it.item_status!=='Pending'?it.item_status:(s.charAt(0).toUpperCase()+s.slice(1));
      rows.push([
        it.name||'',it.stakeholder||'',it.email||'',it.dept||'',
        (FL[it.freq]||it.freq||''),it.due_date||'',displayStatus,
        it.priority||'Medium',it.assignee||'',it.framework_tags||'',
        it.category||'',it.notes||''
      ]);
    });
    return rows;
  };

  window.risksToRows = function(arr){
    var header=['Risk Name','Category','Likelihood','Impact','Score','Level','Owner','Status','Notes'];
    var rows=[header];
    (arr||[]).forEach(function(r){
      var score=(r.likelihood||1)*(r.impact||1);
      var level=score>=20?'Critical':score>=15?'High':score>=8?'Medium':'Low';
      rows.push([r.name||'',r.category||'',r.likelihood||1,r.impact||1,score,level,r.owner||'',r.status||'Open',r.notes||'']);
    });
    return rows;
  };

  window.logsToRows = function(arr){
    var header=['Sent at','To','Email','Department','Tone','Subject','Task','Due date','Status'];
    var rows=[header];
    (arr||[]).forEach(function(l){
      rows.push([
        (l.sent_at||'').replace('T',' ').slice(0,19),
        l.stakeholder||'',l.stakeholder_email||'',l.dept||'',
        l.tone||'',l.subject||'',l.task_name||'',l.due_date||'',
        l.response_received?'Responded':'Pending'
      ]);
    });
    return rows;
  };

  function bindExport(id,fn){
    var el=document.getElementById(id);
    if(!el)return;
    el.onclick=function(){
      if(!can('export')){noPermission('Your role cannot export data.');return;}
      fn();
    };
  }
  bindExport('export-items-xlsx',function(){exportToXLSX('Clarix_Items_'+getDateStr()+'.xlsx','All Items',itemsToRows(items));});
  bindExport('export-items-csv',function(){exportToCSV('Clarix_Items_'+getDateStr()+'.csv',itemsToRows(items));});
  bindExport('export-overdue-xlsx',function(){exportToXLSX('Clarix_Overdue_'+getDateStr()+'.xlsx','Overdue',itemsToRows(items.filter(function(it){return getStatus(it)==='overdue';})));});
  bindExport('export-overdue-csv',function(){exportToCSV('Clarix_Overdue_'+getDateStr()+'.csv',itemsToRows(items.filter(function(it){return getStatus(it)==='overdue';})));});
  bindExport('export-logs-xlsx',function(){exportToXLSX('Clarix_Logs_'+getDateStr()+'.xlsx','Follow-up Log',logsToRows(logs));});
  bindExport('export-logs-csv',function(){exportToCSV('Clarix_Logs_'+getDateStr()+'.csv',logsToRows(logs));});
  bindExport('export-risks-xlsx',function(){exportToXLSX('Clarix_Risks_'+getDateStr()+'.xlsx','Risk Register',risksToRows(risks));});
  bindExport('export-risks-csv',function(){exportToCSV('Clarix_Risks_'+getDateStr()+'.csv',risksToRows(risks));});
  bindExport('export-highrisks-xlsx',function(){exportToXLSX('Clarix_HighRisks_'+getDateStr()+'.xlsx','High Risks',risksToRows(risks.filter(function(r){return r.likelihood*r.impact>=15;})));});
  bindExport('export-highrisks-csv',function(){exportToCSV('Clarix_HighRisks_'+getDateStr()+'.csv',risksToRows(risks.filter(function(r){return r.likelihood*r.impact>=15;})));});
  bindExport('export-full-report',function(){
    if(typeof XLSX==='undefined'){alert('Excel library loading. Please wait a few seconds and try again.');return;}
    var wb=XLSX.utils.book_new();
    var d=new Date();
    var dateStr=getDateStr();
    var completedCount=items.filter(function(it){return getStatus(it)==='done';}).length;
    var overdueCount=items.filter(function(it){return getStatus(it)==='overdue';}).length;
    var highRiskCount=risks.filter(function(r){return (r.likelihood||1)*(r.impact||1)>=15;}).length;
    var summary=[
      ['Clarix GRC Full Report'],
      ['Generated: '+d.toLocaleString()],
      [],
      ['COMPLIANCE SUMMARY',''],
      ['Total items',items.length],
      ['Completed',completedCount],
      ['Overdue',overdueCount],
      ['Pending',items.length-completedCount-overdueCount],
      [],
      ['RISK SUMMARY',''],
      ['Total risks',risks.length],
      ['High risks (score ≥15)',highRiskCount],
      [],
      ['COMMUNICATION',''],
      ['Follow-ups sent',logs.length],
      [],
      ['Generated by','Clarix — Compliance Intelligence']
    ];
    var wsSummary=XLSX.utils.aoa_to_sheet(summary);
    wsSummary['!cols']=[{wch:30},{wch:20}];
    XLSX.utils.book_append_sheet(wb,wsSummary,'Summary');
    var wsItems=XLSX.utils.aoa_to_sheet(itemsToRows(items));
    var itemCols=itemsToRows([]).length>0?itemsToRows(items)[0].map(function(_,ci){return {wch:Math.min(40,Math.max(12,itemsToRows(items).reduce(function(mx,r){return Math.max(mx,String(r[ci]||'').length);},0)))};}):[]; wsItems['!cols']=itemCols;
    XLSX.utils.book_append_sheet(wb,wsItems,'Compliance Items');
    var wsRisks=XLSX.utils.aoa_to_sheet(risksToRows(risks)); XLSX.utils.book_append_sheet(wb,wsRisks,'Risk Register');
    var wsLogs=XLSX.utils.aoa_to_sheet(logsToRows(logs)); XLSX.utils.book_append_sheet(wb,wsLogs,'Follow-up Log');
    // Audit trail sheet
    if(auditLogs&&auditLogs.length){
      var atRows=[['Timestamp','Action','Module','Description','Performed By','Email','Role','Device']];
      auditLogs.forEach(function(l){
        var ua=l.ip_hint||'';
        var device=ua.indexOf('Mobile')>-1?'Mobile':ua.indexOf('Chrome')>-1?'Chrome':ua.indexOf('Firefox')>-1?'Firefox':'Desktop';
        atRows.push([(l.created_at||'').replace('T',' ').slice(0,19),l.action||'',l.module||'',l.description||'',l.performed_by||'',l.user_email||'',l.user_role||'',device]);
      });
      var wsAt=XLSX.utils.aoa_to_sheet(atRows); XLSX.utils.book_append_sheet(wb,wsAt,'Audit Trail');
    }
    XLSX.writeFile(wb,'Clarix_Full_Report_'+dateStr+'.xlsx');
    writeAuditLog('EXPORT','System','Downloaded Full GRC Report',{sheets:'Summary,Compliance Items,Risk Register,Follow-up Log,Audit Trail'});
    showDueDateToast('','Full report downloaded!');
  });
  var tBtn=document.getElementById('download-template-btn');
  if(tBtn)tBtn.onclick=function(){
    if(!can('import')){noPermission('Only admin and manager can download the import template.');return;}
    exportToXLSX('Clarix_Import_Template.xlsx','Template',[['Task name','Stakeholder','Email','Department','Frequency','Due date (YYYY-MM-DD)','Category','Notes']]);
  };
}


// ════════════════════════════════════════════════
// POLICY PDF UPLOAD HELPERS
// ════════════════════════════════════════════════

// Switch between PDF and text tabs in the add/edit panel
function polSwitchTab(tab){
  var pdfArea  = document.getElementById('pol-pdf-area');
  var textArea = document.getElementById('pol-text-area');
  var pdfBtn   = document.getElementById('pol-tab-pdf');
  var textBtn  = document.getElementById('pol-tab-text');
  if(!pdfArea||!textArea) return;
  if(tab==='pdf'){
    pdfArea.style.display  = '';
    textArea.style.display = 'none';
    if(pdfBtn){ pdfBtn.style.background='var(--primary)';pdfBtn.style.color='#fff';pdfBtn.style.fontWeight='600'; }
    if(textBtn){ textBtn.style.background='var(--surface)';textBtn.style.color='var(--text2)';textBtn.style.fontWeight='500'; }
  } else {
    pdfArea.style.display  = 'none';
    textArea.style.display = '';
    if(textBtn){ textBtn.style.background='var(--primary)';textBtn.style.color='#fff';textBtn.style.fontWeight='600'; }
    if(pdfBtn){ pdfBtn.style.background='var(--surface)';pdfBtn.style.color='var(--text2)';pdfBtn.style.fontWeight='500'; }
  }
}

// Handle drag-and-drop
function polHandleDrop(event){
  event.preventDefault();
  var dropZone = document.getElementById('pol-drop-zone');
  if(dropZone) dropZone.style.borderColor = 'var(--border)';
  var file = event.dataTransfer.files[0];
  if(file) polHandleFile(file);
}

// Process the selected/dropped file
function polHandleFile(file){
  if(!file) return;
  if(file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')){
    showDueDateToast('err','Only PDF files are supported.');
    return;
  }
  // 4 MB limit (base64 will be ~33% larger, so raw limit is ~3 MB to stay under Supabase column limits)
  var MB4 = 4 * 1024 * 1024;
  if(file.size > MB4){
    showDueDateToast('err','PDF is too large. Maximum size is 4 MB.');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e){
    var dataUrl = e.target.result;
    // dataUrl is "data:application/pdf;base64,XXXXX" — extract just base64
    var b64 = dataUrl.split(',')[1];
    document.getElementById('policy-pdf-b64').value = b64;
    // Show selected file info
    var nameEl = document.getElementById('pol-pdf-name');
    var sizeEl = document.getElementById('pol-pdf-size');
    var selEl  = document.getElementById('pol-pdf-selected');
    var dropEl = document.getElementById('pol-drop-zone');
    if(nameEl) nameEl.textContent = file.name;
    if(sizeEl) sizeEl.textContent = (file.size/1024).toFixed(0)+' KB · PDF';
    if(selEl)  selEl.style.display = '';
    if(dropEl) dropEl.style.display = 'none';
    showDueDateToast('','PDF loaded — ready to save!');
  };
  reader.readAsDataURL(file);
}

// Clear the selected PDF
function polClearPdf(){
  document.getElementById('policy-pdf-b64').value = '';
  var nameEl = document.getElementById('pol-pdf-name');
  var selEl  = document.getElementById('pol-pdf-selected');
  var dropEl = document.getElementById('pol-drop-zone');
  if(nameEl) nameEl.textContent = '';
  if(selEl)  selEl.style.display  = 'none';
  if(dropEl) dropEl.style.display = '';
}

// Download PDF from the view panel
function downloadPolicyPdf(){
  var embed = document.getElementById('pvp-pdf-embed');
  if(!embed) return;
  var b64      = embed.getAttribute('data-b64');
  var filename = embed.getAttribute('data-filename') || 'policy.pdf';
  if(!b64){ showDueDateToast('err','No PDF found to download.'); return; }
  try{
    var byteChars = atob(b64);
    var byteArr   = new Uint8Array(byteChars.length);
    for(var i=0;i<byteChars.length;i++) byteArr[i]=byteChars.charCodeAt(i);
    var blob = new Blob([byteArr],{type:'application/pdf'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); },1000);
    showDueDateToast('','Downloading '+filename+'...');
  } catch(err){
    showDueDateToast('err','Download failed: '+err.message);
  }
}

// Open PDF in a new tab fullscreen
function openPdfFullscreen(){
  var embed = document.getElementById('pvp-pdf-embed');
  if(!embed) return;
  var b64 = embed.getAttribute('data-b64');
  if(!b64){ showDueDateToast('err','No PDF to open.'); return; }
  try{
    var byteChars = atob(b64);
    var byteArr   = new Uint8Array(byteChars.length);
    for(var i=0;i<byteChars.length;i++) byteArr[i]=byteChars.charCodeAt(i);
    var blob = new Blob([byteArr],{type:'application/pdf'});
    var url  = URL.createObjectURL(blob);
    window.open(url,'_blank');
  } catch(err){
    showDueDateToast('err','Could not open PDF: '+err.message);
  }
}


// ════════════════════════════════════════════════
// AUDIT CALENDAR
// ════════════════════════════════════════════════

var CAL_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Priority & regulator config ──────────────────
var CAL_REG={
  'RBI' :{color:'#dc2626',bg:'#fef2f2',label:'RBI'},
  'NPCI':{color:'#d97706',bg:'#fffbeb',label:'NPCI'},
  'DPDP':{color:'#7c3aed',bg:'#f5f3ff',label:'DPDP'},
  'SEBI':{color:'#dc2626',bg:'#fef2f2',label:'SEBI'},
  'IRDAI':{color:'#dc2626',bg:'#fef2f2',label:'IRDAI'},
  'PCI' :{color:'#0369a1',bg:'#eff6ff',label:'PCI DSS'},
  'ISO' :{color:'#047857',bg:'#f0fdf4',label:'ISO'},
  'SOC' :{color:'#0f766e',bg:'#f0fdfa',label:'SOC 2'},
  'GDPR':{color:'#1d4ed8',bg:'#eff6ff',label:'GDPR'},
  'NIST':{color:'#374151',bg:'#f9fafb',label:'NIST'},
  'VA'  :{color:'#b45309',bg:'#fffbeb',label:'VA/PT'},
  'PT'  :{color:'#b45309',bg:'#fffbeb',label:'VA/PT'}
};

// Lead days before expiry to start audit prep
var CERT_LEAD={
  'PCI DSS'   :{days:60,label:'PCI DSS Annual',     freq:'Annual',   dot:'#0369a1',pri:1},
  'ISO 27001' :{days:60,label:'ISO 27001',           freq:'Annual',   dot:'#047857',pri:2},
  'SOC 2'     :{days:60,label:'SOC 2',               freq:'Annual',   dot:'#0f766e',pri:2},
  'RBI'       :{days:60,label:'RBI Compliance',       freq:'Annual',   dot:'#dc2626',pri:1},
  'NPCI'      :{days:60,label:'NPCI Compliance',      freq:'Annual',   dot:'#d97706',pri:1},
  'DPDP'      :{days:45,label:'DPDP Act',             freq:'Annual',   dot:'#7c3aed',pri:1},
  'SEBI'      :{days:60,label:'SEBI Audit',           freq:'Annual',   dot:'#dc2626',pri:1},
  'IRDAI'     :{days:60,label:'IRDAI Audit',          freq:'Annual',   dot:'#dc2626',pri:1},
  'VA External':{days:30,label:'VA External Scan',   freq:'Quarterly',dot:'#b45309',pri:2},
  'VA Internal':{days:30,label:'VA Internal Scan',   freq:'Quarterly',dot:'#b45309',pri:2},
  'PT Annual' :{days:60,label:'Pen Test',             freq:'Annual',   dot:'#b45309',pri:2},
  'GDPR'      :{days:45,label:'GDPR Review',          freq:'Annual',   dot:'#1d4ed8',pri:2},
  'NIST CSF'  :{days:45,label:'NIST CSF',             freq:'Annual',   dot:'#374151',pri:3},
  'Custom'    :{days:30,label:'Custom',               freq:'Custom',   dot:'#6b7280',pri:3}
};

function certLeadDays(t){return(CERT_LEAD[t]||CERT_LEAD['Custom']).days;}
function certNotifyDate(expiry,t){if(!expiry)return null;var d=new Date(expiry);d.setDate(d.getDate()-certLeadDays(t));return d.toISOString().split('T')[0];}
function getRegStyle(name){var u=(name||'').toUpperCase();for(var k in CAL_REG){if(u.indexOf(k)>-1)return CAL_REG[k];}return null;}

// ── Collect all events ───────────────────────────
function calGetAllEvents(ft){
  var evts=[],tod=today();
  // Compliance items
  if(!ft||ft==='all'||ft==='compliance'){
    items.forEach(function(it){
      if(!it.due_date)return;
      var st=getStatus(it);if(st==='done')return;
      var ov=st==='overdue',reg=getRegStyle(it.name||'');
      evts.push({date:it.due_date,title:it.name||'Task',type:ov?'ev-overdue':'ev-compliance',
        dot:ov?'#ef4444':(reg?reg.color:'#5b5ef4'),badge:ov?'Overdue':'Compliance',
        meta:(it.stakeholder||'')+(it.dept?' · '+it.dept:''),pri:reg?1:3,nav:'nav-items',reg:reg});
    });
  }
  // Evidence
  if(!ft||ft==='all'||ft==='evidence'){
    evidenceItems.forEach(function(ev){
      if(!ev.deadline||ev.status==='Approved')return;
      var ao=audits.find(function(a){return a.id===ev.audit_id;});
      var ov=ev.deadline<tod&&ev.status!=='Submitted';
      evts.push({date:ev.deadline,title:ev.title||'Evidence',type:ov?'ev-overdue':'ev-evidence',
        dot:ov?'#ef4444':'#f59e0b',badge:ev.status==='Submitted'?'Submitted':ov?'Overdue':'Evidence',
        meta:(ev.owner||'')+(ao?' · '+ao.name:''),pri:3,nav:'nav-evidence'});
    });
  }
  // Audits
  if(!ft||ft==='all'||ft==='audit'){
    audits.forEach(function(a){
      var reg=getRegStyle(a.name||'');
      var dot=reg?reg.color:(a.status==='In Progress'?'#10b981':a.status==='On Hold'?'#f59e0b':a.status==='Completed'?'#9ca3af':'#4f52d9');
      var badge=a.status==='In Progress'?'🟢 In Progress':a.status==='Upcoming'?'📅 Upcoming':(a.status||'Audit');
      var durDays=a.end_date?Math.ceil((new Date(a.end_date)-new Date(a.start_date||a.end_date))/86400000):null;
      if(a.start_date) evts.push({date:a.start_date,title:a.name||'Audit',type:'ev-audit',dot:dot,badge:badge,meta:(a.audit_type||'')+(a.auditor?' · '+a.auditor:''),pri:reg?reg.pri||2:3,nav:'nav-evidence',reg:reg,durDays:durDays});
      if(a.end_date&&a.end_date!==a.start_date) evts.push({date:a.end_date,title:(a.name||'Audit')+' ends',type:'ev-audit',dot:dot,badge:'Audit end',meta:(a.audit_type||''),pri:reg?reg.pri||2:3,nav:'nav-evidence',reg:reg});
    });
  }
  // Actions
  if(!ft||ft==='all'||ft==='action'){
    actions.forEach(function(ac){
      if(!ac.due_date||ac.status==='Closed')return;
      var ov=typeof getActionStatus==='function'?getActionStatus(ac)==='overdue':ac.due_date<tod;
      evts.push({date:ac.due_date,title:ac.title||'Action',type:ov?'ev-overdue':'ev-action',dot:ov?'#ef4444':'#7c3aed',badge:ov?'Overdue':'Action',meta:(ac.owner||'')+(ac.priority?' · '+ac.priority:''),pri:3,nav:'nav-actions'});
    });
  }
  // High risks
  if(!ft||ft==='all'||ft==='risk'){
    risks.forEach(function(r){
      var sc=(r.likelihood||1)*(r.impact||1);
      if(sc<15||r.status==='Closed')return;
      evts.push({date:tod,title:r.name||'High risk',type:'ev-risk',dot:'#ef4444',badge:'🔴 High risk ('+sc+')',meta:(r.category||'')+(r.owner?' · '+r.owner:''),pri:2,nav:'nav-risks'});
    });
  }
  // Cert tracker — expiry + prep notifications + quarterly VA
  if(!ft||ft==='all'||ft==='cert'){
    certTrackers.forEach(function(ct){
      if(!ct.cert_expiry)return;
      var cfg=CERT_LEAD[ct.cert_type]||CERT_LEAD['Custom'];
      var reg=getRegStyle(ct.cert_type||ct.cert_name||'');
      var dot=reg?reg.color:cfg.dot;
      var pri=reg?1:cfg.pri;
      var expired=ct.cert_expiry<tod;
      // Expiry event
      evts.push({date:ct.cert_expiry,title:(ct.cert_name||ct.cert_type||'Cert')+' EXPIRES',
        type:expired?'ev-overdue':'ev-cert-expiry',dot:expired?'#ef4444':dot,
        badge:expired?'⛔ EXPIRED':'📋 Cert expiry',
        meta:(ct.cert_type||'')+(ct.owner?' · '+ct.owner:''),pri:expired?0:pri,nav:'nav-calendar',reg:reg,isCert:true});
      // Prep notification
      var nd=certNotifyDate(ct.cert_expiry,ct.cert_type);
      if(nd&&nd>=tod){
        evts.push({date:nd,title:'🔔 Start prep: '+(ct.cert_name||ct.cert_type||'Cert'),
          type:'ev-cert-notify',dot:dot,
          badge:'⏰ Prep reminder ('+certLeadDays(ct.cert_type)+'d lead)',
          meta:(ct.cert_type||'')+(ct.owner?' · '+ct.owner:''),pri:pri,nav:'nav-calendar',reg:reg,isCert:true});
      }
      // Quarterly VA: add Q1/Q2/Q3 reminder + prep dates
      if(ct.cert_type==='VA External'||ct.cert_type==='VA Internal'){
        for(var q=1;q<=3;q++){
          var qd=new Date(ct.cert_expiry);qd.setMonth(qd.getMonth()-(q*3));
          var qs=qd.toISOString().split('T')[0];
          var prd=new Date(qd);prd.setDate(prd.getDate()-30);
          var ps=prd.toISOString().split('T')[0];
          if(qs>=tod) evts.push({date:qs,title:ct.cert_type+' Q'+(4-q)+' due',type:'ev-cert-expiry',dot:dot,badge:'VA Quarterly',meta:ct.cert_type+(ct.owner?' · '+ct.owner:''),pri:pri,nav:'nav-calendar',reg:reg,isCert:true});
          if(ps>=tod) evts.push({date:ps,title:'🔔 Prepare '+ct.cert_type+' Q'+(4-q),type:'ev-cert-notify',dot:dot,badge:'⏰ VA prep (30d)',meta:ct.cert_type+(ct.owner?' · '+ct.owner:''),pri:pri,nav:'nav-calendar',reg:reg,isCert:true});
        }
      }
    });
  }
  return evts;
}

// ── Summary cards ────────────────────────────────
function calBuildSummary(allEvts){
  var el=document.getElementById('cal-summary');if(!el)return;
  while(el.firstChild)el.removeChild(el.firstChild);
  var tod=today(),in7=new Date();in7.setDate(in7.getDate()+7);var in7s=in7.toISOString().split('T')[0];
  var mon=calYear+'-'+String(calMonth+1).padStart(2,'0');
  var overdue=allEvts.filter(function(e){return e.type==='ev-overdue'||(e.isCert&&e.date<tod);}).length;
  var certN=allEvts.filter(function(e){return e.type==='ev-cert-notify';}).length;
  var next7=allEvts.filter(function(e){return e.date&&e.date>=tod&&e.date<=in7s&&e.type!=='ev-overdue';}).length;
  var p1=allEvts.filter(function(e){return e.pri<=1;}).length;
  [{l:'Overdue / Expired',v:overdue,c:'#dc2626',i:'🔴'},{l:'Cert reminders',v:certN,c:'#d97706',i:'🔔'},{l:'Next 7 days',v:next7,c:'#0369a1',i:'📅'},{l:'Critical (P1)',v:p1,c:'#7c3aed',i:'⚠️'}].forEach(function(m){
    var card=document.createElement('div');card.className='metric-card';
    var val=document.createElement('div');val.className='mc-val';val.style.color=m.c;val.textContent=m.v;
    var lbl=document.createElement('div');lbl.className='mc-label';lbl.textContent=m.i+' '+m.l;
    card.appendChild(val);card.appendChild(lbl);el.appendChild(card);
  });
}

// ── Cert notification + audit schedule strip ─────
function renderUpcomingAudits(){
  var el=document.getElementById('cal-upcoming-strip');if(!el)return;
  var tod=today(),in90=new Date();in90.setDate(in90.getDate()+90);var in90s=in90.toISOString().split('T')[0];
  var future=audits.filter(function(a){return a.start_date&&a.start_date>=tod&&a.status!=='Completed';}).sort(function(a,b){return a.start_date>b.start_date?1:-1;});
  var ongoing=audits.filter(function(a){return a.start_date&&a.start_date<=tod&&(!a.end_date||a.end_date>=tod)&&a.status!=='Completed';});
  var certN=certTrackers.filter(function(ct){if(!ct.cert_expiry)return false;var nd=certNotifyDate(ct.cert_expiry,ct.cert_type);return nd&&nd>=tod&&ct.cert_expiry<=in90s;}).sort(function(a,b){return a.cert_expiry>b.cert_expiry?1:-1;});
  if(!future.length&&!ongoing.length&&!certN.length){el.innerHTML='';return;}
  function dU(d){return Math.ceil((new Date(d)-new Date(tod))/86400000);}
  function dL(d){return d===0?'Today':d===1?'Tomorrow':d<0?Math.abs(d)+'d ago':'in '+d+' days';}
  var CM=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var html='<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:4px">';
  // Cert notifications banner
  if(certN.length){
    html+='<div style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:12px 16px">';
    html+='<div style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">🔔 Upcoming certificate & compliance deadlines</div>';
    html+='<div style="display:flex;flex-direction:column;gap:5px">';
    certN.forEach(function(ct){
      var cfg=CERT_LEAD[ct.cert_type]||CERT_LEAD['Custom'];
      var reg=getRegStyle(ct.cert_type||ct.cert_name||'');
      var dot=reg?reg.color:cfg.dot;
      var nd=certNotifyDate(ct.cert_expiry,ct.cert_type);
      var expD=dU(ct.cert_expiry),notD=dU(nd);
      var urgent=expD<=30;
      html+='<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#fff;border:1px solid '+(urgent?'#fca5a5':'#fde68a')+';border-radius:7px">';
      html+='<div style="width:7px;height:7px;border-radius:50%;background:'+dot+';flex-shrink:0"></div>';
      html+='<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#111827">'+(ct.cert_name||ct.cert_type)+'</div>';
      html+='<div style="font-size:11px;color:#6b7280">Expires <strong>'+ct.cert_expiry+'</strong> · Prep starts '+(notD>=0?'in '+notD+'d':Math.abs(notD)+'d ago')+(ct.owner?' · 👤 '+ct.owner:'')+'</div></div>';
      if(reg) html+='<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px;background:'+reg.bg+';color:'+reg.color+'">'+reg.label+'</span>';
      html+='<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px;background:'+(urgent?'#fee2e2':'#fef3c7')+';color:'+(urgent?'#dc2626':'#92400e')+'">'+dL(expD)+'</span>';
      html+='</div>';
    });
    html+='</div></div>';
  }
  // Audit schedule
  if(ongoing.length||future.length){
    html+='<div style="padding:12px 16px">';
    html+='<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📋 Audit schedule';
    if(ongoing.length) html+=' <span style="font-size:10px;padding:1px 6px;background:#f0fdf4;color:#15803d;border-radius:20px">'+ongoing.length+' ongoing</span>';
    if(future.length) html+=' <span style="font-size:10px;padding:1px 6px;background:#eff6ff;color:#1d4ed8;border-radius:20px">'+future.length+' upcoming</span>';
    html+='</div><div style="display:flex;flex-direction:column;gap:5px">';
    ongoing.concat(future).slice(0,5).forEach(function(a){
      var reg=getRegStyle(a.name||'');
      var isOng=a.start_date&&a.start_date<=tod&&(!a.end_date||a.end_date>=tod);
      var du=a.start_date?dU(a.start_date):null;
      var prog='';
      if(isOng&&a.start_date&&a.end_date){var tt=new Date(a.end_date)-new Date(a.start_date),dn=new Date(tod)-new Date(a.start_date),pct=Math.min(100,Math.max(0,Math.round(dn/tt*100)));prog='<div style="margin-top:4px;display:flex;align-items:center;gap:6px"><div style="flex:1;height:3px;background:#e5e7eb;border-radius:4px"><div style="height:100%;width:'+pct+'%;background:#10b981;border-radius:4px"></div></div><span style="font-size:10px;color:#6b7280">'+pct+'%</span></div>';}
      html+='<div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px">';
      html+='<div style="width:34px;text-align:center;flex-shrink:0"><div style="font-size:14px;font-weight:800;color:#1d4ed8;line-height:1">'+(a.start_date?a.start_date.split('-')[2]:'—')+'</div><div style="font-size:8px;color:#9ca3af;text-transform:uppercase">'+(a.start_date?CM[parseInt(a.start_date.split('-')[1])-1]:'')+'</div></div>';
      html+='<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:1px"><span style="font-size:12px;font-weight:600;color:#111827">'+(a.name||'Audit')+'</span>';
      html+='<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:'+(isOng?'#f0fdf4':'#eff6ff')+';color:'+(isOng?'#15803d':'#1d4ed8')+'">'+(isOng?'🟢 In Progress':(a.status||'Upcoming'))+'</span>';
      if(reg) html+='<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:'+reg.bg+';color:'+reg.color+'">'+reg.label+'</span>';
      html+='</div><div style="font-size:11px;color:#6b7280;display:flex;gap:8px;flex-wrap:wrap">'+(a.audit_type?'<span>'+a.audit_type+'</span>':'')+( a.auditor?'<span>👤 '+a.auditor+'</span>':'')+(a.end_date?'<span>Ends '+a.end_date+'</span>':'')+'<span style="font-weight:600;color:'+(isOng?'#15803d':'#1d4ed8')+'">'+(isOng?'Ongoing':(du!==null?dL(du):''))+'</span></div>'+prog+'</div></div>';
    });
    html+='</div></div>';
  }
  html+='</div>';
  el.innerHTML=html;
}

// ── Main render ──────────────────────────────────
function renderCalendar(){
  try{
    var ft=(document.getElementById('cal-filter')||{}).value||'all';
    var allEvts=calGetAllEvents(ft);
    calBuildSummary(allEvts);
    renderUpcomingAudits();
    var titleEl=document.getElementById('cal-month-title');
    if(titleEl)titleEl.textContent=CAL_MONTHS[calMonth]+' '+calYear;
    var evMap={};
    allEvts.forEach(function(ev){if(!ev.date)return;if(!evMap[ev.date])evMap[ev.date]=[];evMap[ev.date].push(ev);});
    Object.keys(evMap).forEach(function(dt){evMap[dt].sort(function(a,b){return(a.pri||9)-(b.pri||9);});});
    var grid=document.getElementById('cal-days-grid');if(!grid)return;
    while(grid.firstChild)grid.removeChild(grid.firstChild);
    var fw=new Date(calYear,calMonth,1).getDay(),dim=new Date(calYear,calMonth+1,0).getDate(),dip=new Date(calYear,calMonth,0).getDate(),ts=today();
    for(var p=fw-1;p>=0;p--) grid.appendChild(buildCalCell(calYear,calMonth-1,dip-p,evMap,ts,true));
    for(var d=1;d<=dim;d++) grid.appendChild(buildCalCell(calYear,calMonth,d,evMap,ts,false));
    var trail=(fw+dim)%7===0?0:7-((fw+dim)%7);
    for(var n=1;n<=trail;n++) grid.appendChild(buildCalCell(calYear,calMonth+1,n,evMap,ts,true));
    if(calSelectedDate){var s=grid.querySelector('[data-date="'+calSelectedDate+'"]');if(s)s.classList.add('selected');}
  }catch(e){console.warn('Calendar error:',e.message);}
}

function buildCalCell(yr,mo,dy,evMap,ts,other){
  var dObj=new Date(yr,mo,dy);
  var ds=dObj.getFullYear()+'-'+String(dObj.getMonth()+1).padStart(2,'0')+'-'+String(dObj.getDate()).padStart(2,'0');
  var isT=ds===ts,isSel=ds===calSelectedDate;
  var cell=document.createElement('div');
  cell.className='cal-day'+(other?' other-month':'')+(isT?' today':'')+(isSel?' selected':'');
  cell.setAttribute('data-date',ds);
  var num=document.createElement('div');num.className='cal-day-num';num.textContent=dObj.getDate();cell.appendChild(num);
  var de=evMap[ds]||[];
  de.slice(0,3).forEach(function(ev){
    var pill=document.createElement('div');pill.className='cal-event '+(ev.type||'ev-compliance');
    pill.textContent=ev.title;pill.title=(ev.badge||'')+' — '+ev.title+(ev.meta?' ('+ev.meta+')':'');
    if(ev.pri===1){var d2=document.createElement('span');d2.style.cssText='display:inline-block;width:5px;height:5px;border-radius:50%;background:#dc2626;margin-right:3px;vertical-align:middle;flex-shrink:0';pill.insertBefore(d2,pill.firstChild);}
    pill.onclick=function(e){e.stopPropagation();calSelectDay(ds,evMap[ds]||[]);};cell.appendChild(pill);
  });
  if(de.length>3){var m=document.createElement('div');m.className='cal-more';m.textContent='+'+(de.length-3)+' more';m.onclick=function(e){e.stopPropagation();calSelectDay(ds,de);};cell.appendChild(m);}
  cell.onclick=function(){calSelectDay(ds,evMap[ds]||[]);};
  return cell;
}

function calSelectDay(ds,de){
  document.querySelectorAll('.cal-day.selected').forEach(function(c){c.classList.remove('selected');});
  var sc=document.querySelector('.cal-day[data-date="'+ds+'"]');if(sc)sc.classList.add('selected');
  calSelectedDate=ds;
  var detEl=document.getElementById('cal-day-detail'),listEl=document.getElementById('cal-detail-list'),tEl=document.getElementById('cal-detail-date-title');
  if(!detEl||!listEl)return;
  var p=ds.split('-'),d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));
  var DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  if(tEl)tEl.textContent=DN[d.getDay()]+', '+CAL_MONTHS[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
  while(listEl.firstChild)listEl.removeChild(listEl.firstChild);
  if(!de.length){
    var emp=document.createElement('div');emp.style.cssText='padding:22px;text-align:center;font-size:13px;color:#9ca3af';
    emp.innerHTML='<div style="font-size:22px;margin-bottom:6px">✅</div>No events — all clear!';listEl.appendChild(emp);
  } else {
    var TS={'ev-compliance':'background:#eff6ff;color:#1d4ed8','ev-evidence':'background:#fefce8;color:#a16207','ev-audit':'background:#f0fdf4;color:#15803d','ev-action':'background:#f5f3ff;color:#6d28d9','ev-risk':'background:#fff1f2;color:#e11d48','ev-overdue':'background:#fff1f2;color:#e11d48','ev-cert-expiry':'background:#fff7ed;color:#c2410c','ev-cert-notify':'background:#fefce8;color:#92400e'};
    de.forEach(function(ev){
      var item=document.createElement('div');
      item.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:9px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;transition:background .12s';
      item.onmouseover=function(){this.style.background='#f3f4f6';};item.onmouseout=function(){this.style.background='#f9fafb';};
      var dot=document.createElement('div');dot.style.cssText='width:9px;height:9px;border-radius:50%;background:'+(ev.dot||'#5b5ef4')+';flex-shrink:0;margin-top:3px';
      var info=document.createElement('div');info.style.cssText='flex:1;min-width:0';
      var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px';
      var nm=document.createElement('span');nm.style.cssText='font-size:12px;font-weight:600;color:#111827';nm.textContent=ev.title;row.appendChild(nm);
      if(ev.pri<=1){var pb=document.createElement('span');pb.style.cssText='font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:#fee2e2;color:#dc2626';pb.textContent='P1 Critical';row.appendChild(pb);}
      if(ev.reg){var rb=document.createElement('span');rb.style.cssText='font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:'+ev.reg.bg+';color:'+ev.reg.color;rb.textContent=ev.reg.label;row.appendChild(rb);}
      info.appendChild(row);
      if(ev.badge||ev.meta){var mt=document.createElement('div');mt.style.cssText='font-size:11px;color:#6b7280';mt.textContent=(ev.badge||'')+(ev.meta?' · '+ev.meta:'');info.appendChild(mt);}
      if(ev.durDays){var dr=document.createElement('div');dr.style.cssText='font-size:10px;color:#9ca3af;margin-top:1px';dr.textContent='Duration: '+ev.durDays+'d';info.appendChild(dr);}
      var badge=document.createElement('span');
      badge.style.cssText=(TS[ev.type]||'background:#f3f4f6;color:#374151')+';font-size:10px;font-weight:600;padding:2px 6px;border-radius:5px;white-space:nowrap;flex-shrink:0;align-self:flex-start';
      badge.textContent=ev.badge||'';
      (function(nav){item.onclick=function(){if(nav==='nav-calendar')return;var nb=document.getElementById(nav);if(nb)nb.click();detEl.style.display='none';calSelectedDate=null;};})(ev.nav||'nav-items');
      item.appendChild(dot);item.appendChild(info);item.appendChild(badge);listEl.appendChild(item);
    });
  }
  detEl.style.display='';
  setTimeout(function(){detEl.scrollIntoView({behavior:'smooth',block:'nearest'});},50);
}

function calNext(){calMonth++;if(calMonth>11){calMonth=0;calYear++;}calSelectedDate=null;var d=document.getElementById('cal-day-detail');if(d)d.style.display='none';renderCalendar();}
function calPrev(){calMonth--;if(calMonth<0){calMonth=11;calYear--;}calSelectedDate=null;var d=document.getElementById('cal-day-detail');if(d)d.style.display='none';renderCalendar();}
function calGoToday(){var n=new Date();calYear=n.getFullYear();calMonth=n.getMonth();calSelectedDate=null;var d=document.getElementById('cal-day-detail');if(d)d.style.display='none';renderCalendar();}

// ════════════════════════════════════════════════
// CERT TRACKER
// ════════════════════════════════════════════════

async function saveCertTracker(){
  if(!can('actions')){noPermission('Only admin and manager can add certificates.');return;}
  var nm=(document.getElementById('ct-name')||{}).value||'';
  var tp=(document.getElementById('ct-type')||{}).value||'Custom';
  var ex=(document.getElementById('ct-expiry')||{}).value||'';
  if(!nm.trim()){alert('Please enter a certificate name.');return;}
  if(!ex){alert('Please select the expiry / renewal date.');return;}
  var btn=document.querySelector('#cert-tracker-panel .btn-primary');
  if(btn){btn.disabled=true;btn.textContent='Saving…';}
  var body={
    cert_name: nm.trim(),
    cert_type: tp,
    cert_expiry:ex,
    owner:(document.getElementById('ct-owner')||{}).value.trim()||'',
    regulator:(document.getElementById('ct-regulator')||{}).value.trim()||'',
    frequency:(document.getElementById('ct-frequency')||{}).value||'Annual',
    notes:(document.getElementById('ct-notes')||{}).value.trim()||''
  };
  var res=await api('grc_cert_tracker',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});
  if(res&&res.ok){
    closePanel();
    ['ct-name','ct-expiry','ct-owner','ct-regulator','ct-notes'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    writeAuditLog('CREATE','CertTracker','Added cert: '+nm+' expires '+ex);
    showDueDateToast('','✅ Certificate added — calendar updated!');
    await loadAll();renderCalendar();
  } else {
    var et=res?await res.text():'Network error';
    alert('Error saving: '+et);
    if(btn){btn.disabled=false;btn.textContent='Save certificate';}
  }
}

async function deleteCertTracker(id,name){
  if(!confirm('Delete "'+name+'" from tracker?'))return;
  var res=await api('grc_cert_tracker?id=eq.'+id,{method:'DELETE',extra:{'Prefer':'return=minimal'}});
  if(res&&res.ok){writeAuditLog('DELETE','CertTracker','Deleted: '+name);await loadAll();renderCalendar();}
  else alert('Delete failed.');
}

function renderCertTrackerList(){
  var el=document.getElementById('cert-tracker-list-wrap');if(!el)return;
  if(!certTrackers.length){
    el.innerHTML='<div style="text-align:center;padding:24px;color:#9ca3af;font-size:13px"><div style="font-size:26px;margin-bottom:6px">📋</div>No certificates tracked yet.<br>Add one below.</div>';
    return;
  }
  var tod=today();
  var html='<div style="display:flex;flex-direction:column;gap:7px">';
  certTrackers.slice().sort(function(a,b){return(a.cert_expiry||'')>(b.cert_expiry||'')?1:-1;}).forEach(function(ct){
    var cfg=CERT_LEAD[ct.cert_type]||CERT_LEAD['Custom'];
    var reg=getRegStyle(ct.cert_type||ct.cert_name||'');
    var dot=reg?reg.color:cfg.dot;
    var nd=certNotifyDate(ct.cert_expiry,ct.cert_type);
    var expD=ct.cert_expiry?Math.ceil((new Date(ct.cert_expiry)-new Date(tod))/86400000):null;
    var exp=expD!==null&&expD<0,urg=expD!==null&&expD<=30,warn=expD!==null&&expD<=60;
    var sc=exp?'#dc2626':urg?'#dc2626':warn?'#d97706':'#15803d';
    var sb=exp?'#fff1f2':urg?'#fff1f2':warn?'#fffbeb':'#f0fdf4';
    var st=exp?'⛔ Expired':urg?'🔴 Urgent':warn?'🟡 Due soon':'🟢 OK';
    html+='<div style="background:#fff;border:1px solid '+(exp?'#fca5a5':warn?'#fde68a':'#e5e7eb')+';border-radius:9px;padding:11px 13px;display:flex;align-items:flex-start;gap:9px">';
    html+='<div style="width:9px;height:9px;border-radius:50%;background:'+dot+';margin-top:4px;flex-shrink:0"></div>';
    html+='<div style="flex:1;min-width:0">';
    html+='<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:3px"><span style="font-size:12px;font-weight:700;color:#111827">'+(ct.cert_name||ct.cert_type)+'</span>';
    if(reg)html+='<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:'+reg.bg+';color:'+reg.color+'">'+reg.label+'</span>';
    html+='<span style="font-size:9px;font-weight:700;padding:1px 5px;border-radius:20px;background:'+sb+';color:'+sc+'">'+st+'</span></div>';
    html+='<div style="font-size:11px;color:#6b7280;display:flex;gap:10px;flex-wrap:wrap">';
    html+='<span>📅 Expires: <strong>'+(ct.cert_expiry||'—')+'</strong></span>';
    if(expD!==null)html+='<span style="color:'+sc+';font-weight:600">'+(exp?Math.abs(expD)+'d ago':expD===0?'Today':expD+'d left')+'</span>';
    html+='<span>⏰ Prep: '+(nd||'—')+'</span>';
    if(ct.frequency)html+='<span>🔄 '+ct.frequency+'</span>';
    if(ct.owner)html+='<span>👤 '+ct.owner+'</span>';
    html+='</div>'+(ct.notes?'<div style="font-size:11px;color:#9ca3af;margin-top:2px">'+ct.notes+'</div>':'');
    html+='</div>';
    html+='<button data-del-id="'+ct.id+'" data-del-name="'+encodeURIComponent(ct.cert_name||ct.cert_type||'')+'" style="background:none;border:none;cursor:pointer;color:#d1d5db;font-size:16px;padding:0;flex-shrink:0;line-height:1" title="Delete">✕</button>';
    html+='</div>';
  });
  html+='</div>';
  el.innerHTML=html;
  // Wire delete buttons safely
  el.querySelectorAll('[data-del-id]').forEach(function(btn){
    btn.onclick=function(e){
      e.stopPropagation();
      deleteCertTracker(btn.getAttribute('data-del-id'),decodeURIComponent(btn.getAttribute('data-del-name')||''));
    };
  });
}

async function saveScheduledAudit(){
  if(!can('actions')){noPermission('Only admin and manager can schedule audits.');return;}
  var name=(document.getElementById('sa-name')||{}).value||'';
  var start=(document.getElementById('sa-start')||{}).value||'';
  if(!name.trim()){alert('Please enter an audit name.');return;}
  if(!start){alert('Please select a start date.');return;}
  var btn=document.querySelector('#schedule-audit-panel .btn-primary');
  if(btn){btn.disabled=true;btn.textContent='Saving…';}
  var fw=(document.getElementById('sa-framework')||{}).value||'';
  var desc=((document.getElementById('sa-desc')||{}).value||'').trim();
  var body={
    name:name.trim(),
    audit_type:(document.getElementById('sa-type')||{}).value||'Internal',
    start_date:start||null,
    end_date:(document.getElementById('sa-end')||{}).value||null,
    auditor:(document.getElementById('sa-auditor')||{}).value.trim()||'',
    description:desc+(fw?(desc?' [Framework: '+fw+']':'[Framework: '+fw+']'):'')
  };
  var res=await api('grc_audits',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});
  if(res&&res.ok){
    closePanel();
    ['sa-name','sa-start','sa-end','sa-auditor','sa-desc'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    writeAuditLog('CREATE','Audit','Scheduled: '+name+' on '+start);
    showDueDateToast('','✅ Audit scheduled!');
    await loadAll();renderCalendar();
  } else {
    var et=res?await res.text():'Network error';alert('Error: '+et);
    if(btn){btn.disabled=false;btn.textContent='Save & add to calendar';}
  }
}

// ════════════════════════════════════════════════
// POLICY MANAGEMENT
// ════════════════════════════════════════════════

function getPolicyStatus(p){
  if(p.status==='Retired') return 'retired';
  if(p.status==='Expired') return 'expired';
  if(p.status==='Draft')   return 'draft';
  if(p.status==='Under review') return 'review';
  if(p.next_review_date && p.next_review_date < today()) return 'expired';
  if(p.next_review_date){
    var dL=Math.ceil((new Date(p.next_review_date)-new Date(today()))/86400000);
    if(dL<=30 && p.status==='Active') return 'due-soon';
  }
  return 'active';
}

// ── Can current user EDIT this policy? ──
function canEditPolicy(p){
  // Rule 1: Not logged in — no
  if(!currentUser) return false;
  // Rule 2: Admin — full access to all policies
  if(currentUser.role==='admin') return true;
  // Rule 3: Assigned owner — matched by email stored in owner_email field
  var ownerEmail = (p.owner_email||'').toLowerCase().trim();
  var myEmail    = (currentUser.email||'').toLowerCase().trim();
  if(ownerEmail && myEmail && ownerEmail===myEmail) return true;
  // Rule 4: Manager / Viewer / Stakeholder — read only, no edit
  return false;
}

// ── Render policy grid ──
// ACCESS RULES:
//   Everyone (all roles) → can see every policy + read full content
//   Admin                → full edit / delete on any policy
//   Manager / Viewer     → only reads; cannot edit
//   Assigned owner       → matched by owner_email == currentUser.email; can edit ONLY their own policy
//   Stakeholder          → can read; cannot edit (nav-policy hidden from sidebar by setupAppUI)

function renderPolicies(){
  var statusFilter   = (document.getElementById('policy-filter-status')   ||{}).value||'';
  var categoryFilter = (document.getElementById('policy-filter-category') ||{}).value||'';
  var searchQ        = ((document.getElementById('policy-search')         ||{}).value||'').toLowerCase().trim();

  // ── Summary cards ──
  var sumEl = document.getElementById('policy-summary');
  if(sumEl){
    while(sumEl.firstChild) sumEl.removeChild(sumEl.firstChild);
    var active  = policies.filter(function(p){ return getPolicyStatus(p)==='active';   }).length;
    var dueSoon = policies.filter(function(p){ return getPolicyStatus(p)==='due-soon'; }).length;
    var expired = policies.filter(function(p){ return getPolicyStatus(p)==='expired';  }).length;
    var drafts  = policies.filter(function(p){ return p.status==='Draft';              }).length;
    [{l:'Total policies', v:policies.length,   c:'var(--text)',    t:'#5b5ef4'},
     {l:'Active',         v:active,            c:'var(--success)', t:'#10b981'},
     {l:'Due for review', v:dueSoon,           c:'var(--warning)', t:'#f59e0b'},
     {l:'Need attention', v:expired+drafts,    c:'var(--danger)',  t:'#ef4444'}
    ].forEach(function(m){
      var card=document.createElement('div');
      card.className='metric-card';
      card.innerHTML=
        '<div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:'+m.t+'"></div>'+
        '<div class="mc-label" style="margin-top:4px">'+m.l+'</div>'+
        '<div class="mc-val" style="color:'+m.c+'">'+m.v+'</div>';
      sumEl.appendChild(card);
    });
  }

  // ── Review alert strip ──
  var strip    = document.getElementById('policy-review-strip');
  var stripTxt = document.getElementById('policy-review-text');
  var reviewDue = policies.filter(function(p){ var s=getPolicyStatus(p); return s==='due-soon'||s==='expired'; });
  if(strip){
    if(reviewDue.length>0){
      strip.style.display='flex';
      if(stripTxt) stripTxt.textContent=
        reviewDue.length+' polic'+(reviewDue.length>1?'ies are':'y is')+
        ' due for review or expired — click to filter';
      strip.style.cursor='pointer';
      strip.onclick=function(){
        var sel=document.getElementById('policy-filter-status');
        if(sel){sel.value='Expired';renderPolicies();}
      };
    } else {
      strip.style.display='none';
    }
  }

  // ── Add policy button visibility ──
  // Visible only to admin and manager
  var addBtnWrap = document.querySelector('#s-policy .btn.btn-primary');
  if(addBtnWrap) addBtnWrap.style.display = can('add') ? '' : 'none';

  // ── Filter ──
  var filtered = policies.filter(function(p){
    if(statusFilter && p.status!==statusFilter) return false;
    if(categoryFilter && p.category!==categoryFilter) return false;
    if(searchQ){
      var hay = ((p.name||'')+(p.description||'')+(p.owner||'')+(p.category||'')+(p.control_refs||'')).toLowerCase();
      if(hay.indexOf(searchQ)<0) return false;
    }
    return true;
  });

  // Sort: expired → due-soon → review → active → draft → retired
  var statusOrder={expired:0,'due-soon':1,review:2,active:3,draft:4,retired:5};
  filtered.sort(function(a,b){
    return (statusOrder[getPolicyStatus(a)]||9)-(statusOrder[getPolicyStatus(b)]||9);
  });

  // ── Grid ──
  var grid=document.getElementById('policy-grid');
  if(!grid) return;
  while(grid.firstChild) grid.removeChild(grid.firstChild);

  if(!filtered.length){
    var empty=document.createElement('div');
    empty.style.cssText='grid-column:1/-1;text-align:center;padding:60px 20px';
    if(!policies.length){
      var ei=document.createElement('div');
      ei.style.cssText='font-size:42px;margin-bottom:12px';
      ei.textContent='📋';
      var et=document.createElement('div');
      et.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px';
      et.textContent='No policies yet';
      var es=document.createElement('div');
      es.style.cssText='font-size:13px;color:var(--text3);margin-bottom:20px';
      es.textContent=can('add')
        ?'Add your Information Security Policy — required for ISO 27001 A.5.1'
        :'No policies created yet. Ask your admin to add policies.';
      empty.appendChild(ei);
      empty.appendChild(et);
      empty.appendChild(es);
      if(can('add')){
        var eb=document.createElement('button');
        eb.className='btn btn-primary';
        eb.textContent='+ Add first policy';
        eb.onclick=function(){ openPanel('policy-panel'); };
        empty.appendChild(eb);
      }
    } else {
      var fi=document.createElement('div');
      fi.style.cssText='font-size:30px;margin-bottom:10px';
      fi.textContent='🔍';
      var fs=document.createElement('div');
      fs.style.cssText='font-size:13px;color:var(--text3)';
      fs.textContent='No policies match this filter';
      empty.appendChild(fi);
      empty.appendChild(fs);
    }
    grid.appendChild(empty);
    updatePolicyBadge();
    return;
  }

  filtered.forEach(function(p){
    var pStatus = getPolicyStatus(p);
    var canEdit = canEditPolicy(p);  // admin OR assigned owner by email

    var statusLabels={
      active:    {label:'Active',          cls:'pol-active'},
      'due-soon':{label:'Due for review',  cls:'pol-review'},
      review:    {label:'Under review',    cls:'pol-review'},
      expired:   {label:'Expired',         cls:'pol-expired'},
      draft:     {label:'Draft',           cls:'pol-draft'},
      retired:   {label:'Retired',         cls:'pol-retired'}
    };
    var sc=statusLabels[pStatus]||statusLabels.active;

    var barColors={
      active:'#10b981','due-soon':'#f59e0b',review:'#f59e0b',
      expired:'#ef4444',draft:'#5b5ef4',retired:'#9ca3af'
    };
    var barColor=barColors[pStatus]||'#10b981';

    // Days until / since review
    var reviewInfo='';
    if(p.next_review_date){
      var dL=Math.ceil((new Date(p.next_review_date)-new Date(today()))/86400000);
      if(dL<0)        reviewInfo='<span style="color:var(--danger);font-weight:700">'+Math.abs(dL)+'d overdue</span>';
      else if(dL<=30) reviewInfo='<span style="color:var(--warning);font-weight:700">'+dL+'d left</span>';
      else            reviewInfo='<span style="color:var(--text3)">'+p.next_review_date+'</span>';
    }

    // Has stored content?
    var hasContent=p.content&&p.content.trim().length>0;

    var card=document.createElement('div');
    card.className='policy-card';
    card.style.cursor='pointer';
    card.title='Click to read this policy';

    // Clicking the card opens the view panel (for everyone)
    (function(pol){ card.onclick=function(e){
      if(e.target.tagName==='BUTTON'||e.target.tagName==='A') return;
      viewPolicy(pol);
    };})(p);

    // Top colour bar
    var bar=document.createElement('div');
    bar.className='policy-review-alert';
    bar.style.background=barColor;
    card.appendChild(bar);

    // Category + status badge row
    var topRow=document.createElement('div');
    topRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-top:6px;margin-bottom:6px';
    var catSpan=document.createElement('span');
    catSpan.style.cssText='font-size:11px;color:var(--text3);font-weight:600';
    catSpan.textContent=p.category||'General';
    var statBadge=document.createElement('span');
    statBadge.className='badge '+sc.cls;
    statBadge.style.fontSize='10px';
    statBadge.textContent=sc.label;
    topRow.appendChild(catSpan);
    topRow.appendChild(statBadge);
    card.appendChild(topRow);

    // Title
    var titleDiv=document.createElement('div');
    titleDiv.className='policy-card-title';
    titleDiv.textContent=p.name||'Untitled';
    card.appendChild(titleDiv);

    // Description snippet
    if(p.description){
      var descDiv=document.createElement('div');
      descDiv.className='policy-card-desc';
      descDiv.style.marginTop='6px';
      descDiv.textContent=p.description;
      card.appendChild(descDiv);
    }

    // Meta grid
    var meta=document.createElement('div');
    meta.className='policy-card-meta';
    meta.innerHTML=
      '<div class="policy-meta-item"><div class="policy-meta-label">Owner</div><div class="policy-meta-val">'+escHtml(p.owner||'—')+'</div></div>'+
      '<div class="policy-meta-item"><div class="policy-meta-label">Version</div><div class="policy-meta-val">'+(p.version||'1.0')+'</div></div>'+
      '<div class="policy-meta-item"><div class="policy-meta-label">Effective</div><div class="policy-meta-val">'+(p.effective_date||'—')+'</div></div>'+
      '<div class="policy-meta-item"><div class="policy-meta-label">Next review</div><div class="policy-meta-val">'+(reviewInfo||'—')+'</div></div>';
    card.appendChild(meta);

    // Control reference pills
    if(p.control_refs){
      var pillRow=document.createElement('div');
      pillRow.style.cssText='display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px';
      p.control_refs.split(',').forEach(function(c){
        var pill=document.createElement('span');
        pill.style.cssText='font-size:10px;font-weight:700;font-family:monospace;background:var(--primary-light);color:var(--primary);border-radius:4px;padding:2px 6px';
        pill.textContent=c.trim();
        pillRow.appendChild(pill);
      });
      card.appendChild(pillRow);
    }

    // Content indicator
    var contentChip=document.createElement('div');
    contentChip.style.cssText='display:flex;align-items:center;gap:5px;margin-bottom:10px;font-size:11px';
    if(hasContent){
      contentChip.innerHTML=
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'+
        '<span style="color:var(--success);font-weight:600">Policy content stored</span>'+
        '<span style="color:var(--text3)">· '+p.content.trim().split(' ').length+' words</span>';
    } else {
      contentChip.innerHTML=
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'+
        '<span style="color:var(--text3)">No content yet</span>';
    }
    card.appendChild(contentChip);

    // ── Footer ──
    var footer=document.createElement('div');
    footer.className='policy-card-footer';
    footer.onclick=function(e){e.stopPropagation();};

    var leftDiv=document.createElement('div');
    leftDiv.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap';

    // "Read policy" button — visible to EVERYONE
    var readBtn=document.createElement('button');
    readBtn.className='btn btn-sm btn-primary';
    readBtn.style.fontSize='11px';
    readBtn.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Read policy';
    (function(pol){ readBtn.onclick=function(){ viewPolicy(pol); }; })(p);
    leftDiv.appendChild(readBtn);

    // External doc link (if set)
    if(p.document_link){
      var docLink=document.createElement('a');
      docLink.href=p.document_link;
      docLink.target='_blank';
      docLink.className='btn btn-sm';
      docLink.style.cssText='font-size:11px;text-decoration:none;display:inline-flex;align-items:center;gap:4px';
      docLink.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Ext. doc';
      docLink.onclick=function(e){e.stopPropagation();};
      leftDiv.appendChild(docLink);
    }

    footer.appendChild(leftDiv);

    var rightDiv=document.createElement('div');
    rightDiv.style.cssText='display:flex;gap:4px;align-items:center';

    // Owner tag — shows whose policy this is
    if(p.owner_email){
      var ownerTag=document.createElement('span');
      ownerTag.style.cssText='font-size:10px;color:var(--text3);max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      ownerTag.title='Assigned owner: '+p.owner_email;
      var isMe=currentUser&&(currentUser.email||'').toLowerCase()===( p.owner_email||'').toLowerCase();
      if(isMe){
        ownerTag.style.color='var(--primary)';
        ownerTag.style.fontWeight='600';
        ownerTag.textContent='You are owner';
      }
      rightDiv.appendChild(ownerTag);
    }

    // "Mark reviewed" — only for owner or admin
    if(canEdit&&(pStatus==='due-soon'||pStatus==='expired')){
      var revBtn=document.createElement('button');
      revBtn.className='btn btn-sm';
      revBtn.style.cssText='font-size:11px;background:var(--success-light);border-color:rgba(16,185,129,.3);color:var(--success);font-weight:700';
      revBtn.textContent='✓ Reviewed';
      (function(pid,freq){
        revBtn.onclick=async function(e){
          e.stopPropagation();
          var nd=calcPolicyNextReview(freq);
          await api('grc_policies?id=eq.'+pid,{method:'PATCH',body:{status:'Active',next_review_date:nd,last_reviewed:today()},extra:{'Prefer':'return=minimal'}});
          showDueDateToast('','Policy marked reviewed! Next: '+nd);
          await loadAll();
        };
      })(p.id,p.review_frequency);
      rightDiv.appendChild(revBtn);
    }

    // Edit — only for admin or assigned owner
    if(canEdit){
      var editBtn2=document.createElement('button');
      editBtn2.className='btn btn-sm';
      editBtn2.style.fontSize='11px';
      editBtn2.textContent='Edit';
      (function(pol){editBtn2.onclick=function(e){e.stopPropagation();editPolicy(pol);};})(p);
      rightDiv.appendChild(editBtn2);
    }

    // Delete — admin only
    if(can('delete')){
      var delBtn=document.createElement('button');
      delBtn.className='btn btn-sm';
      delBtn.style.cssText='font-size:11px;border-color:rgba(239,68,68,.25);color:var(--danger)';
      delBtn.textContent='Del';
      (function(pid){
        delBtn.onclick=async function(e){
          e.stopPropagation();
          if(!confirm('Delete this policy? This cannot be undone.')) return;
          var polDel=policies.find(function(x){return x.id==pid;});
          await api('grc_policies?id=eq.'+pid,{method:'DELETE',extra:{'Prefer':'return=minimal'}});
          writeAuditLog('DELETE','Policy','Deleted policy: '+(polDel?polDel.name:pid));
          showDueDateToast('','Policy deleted.');
          await loadAll();
        };
      })(p.id);
      rightDiv.appendChild(delBtn);
    }

    footer.appendChild(rightDiv);
    card.appendChild(footer);
    grid.appendChild(card);
  });

  updatePolicyBadge();
}

// ── View policy content in slide panel ──
var _viewingPolicyId = null;
function viewPolicy(p){
  _viewingPolicyId = p.id;
  var titleEl=document.getElementById('pvp-title');
  var subEl=document.getElementById('pvp-sub');
  var metaEl=document.getElementById('pvp-meta');
  var contentEl=document.getElementById('pvp-content');
  var notesWrap=document.getElementById('pvp-notes-wrap');
  var notesEl=document.getElementById('pvp-notes');
  var editBtn=document.getElementById('pvp-edit-btn');

  if(titleEl) titleEl.textContent=p.name||'Policy';
  if(subEl) subEl.textContent=(p.category||'')+(p.version?' · v'+p.version:'')+(p.owner?' · Owner: '+p.owner:'');

  // Meta tags row
  if(metaEl){
    metaEl.innerHTML='';
    var statusMap={active:'var(--success-light)|var(--success)',
                   'due-soon':'var(--warning-light)|var(--warning)',
                   review:'var(--warning-light)|var(--warning)',
                   expired:'var(--danger-light)|var(--danger)',
                   draft:'var(--primary-light)|var(--primary)',
                   retired:'var(--border)|var(--text3)'};
    var pst=getPolicyStatus(p);
    var sc=(statusMap[pst]||'var(--border)|var(--text3)').split('|');
    var statusLabels={active:'Active','due-soon':'Due for review',review:'Under review',expired:'Expired',draft:'Draft',retired:'Retired'};
    [
      {t:statusLabels[pst]||'Active', bg:sc[0], c:sc[1]},
      {t:p.category||'General', bg:'var(--surface2)', c:'var(--text2)'},
      {t:'Owner: '+(p.owner||'—'), bg:'var(--surface2)', c:'var(--text2)'},
      {t:'v'+(p.version||'1.0'), bg:'var(--surface2)', c:'var(--text2)'},
      {t:'Review: '+(p.next_review_date||'—'), bg:'var(--surface2)', c:'var(--text2)'},
    ].forEach(function(m){
      var tag=document.createElement('span');
      tag.style.cssText='display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;background:'+m.bg+';color:'+m.c+';border:1px solid var(--border)';
      tag.textContent=m.t;
      metaEl.appendChild(tag);
    });
    if(p.control_refs){
      p.control_refs.split(',').forEach(function(c){
        var tag=document.createElement('span');
        tag.style.cssText='display:inline-flex;align-items:center;font-size:10px;font-weight:700;font-family:monospace;padding:3px 8px;border-radius:4px;background:var(--primary-light);color:var(--primary);border:1px solid rgba(91,94,244,.2)';
        tag.textContent=c.trim();
        metaEl.appendChild(tag);
      });
    }
  }

  // Policy content — PDF or text
  var pdfWrap=document.getElementById('pvp-pdf-wrap');
  if(pdfWrap&&contentEl){
    if(p.pdf_data&&p.pdf_data.trim()){
      // Show PDF inline
      pdfWrap.style.display='';
      contentEl.style.display='none';
      var embed=document.getElementById('pvp-pdf-embed');
      if(embed) embed.src='data:application/pdf;base64,'+p.pdf_data;
      var fnEl=document.getElementById('pvp-pdf-filename');
      if(fnEl) fnEl.textContent=p.pdf_filename||'policy.pdf';
      // Store for download
      embed.setAttribute('data-b64',p.pdf_data);
      embed.setAttribute('data-filename',p.pdf_filename||'policy.pdf');
    } else if(p.content&&p.content.trim()){
      // Show text content
      pdfWrap.style.display='none';
      contentEl.style.display='';
      contentEl.textContent=p.content;
    } else {
      // Nothing uploaded yet
      pdfWrap.style.display='none';
      contentEl.style.display='';
      var noContent=document.createElement('div');
      noContent.style.cssText='text-align:center;padding:40px 20px;color:var(--text3)';
      var ni=document.createElement('div');ni.style.cssText='font-size:30px;margin-bottom:10px';ni.textContent='📄';
      var nt=document.createElement('div');nt.style.cssText='font-size:13px';nt.textContent='No policy document uploaded yet.';
      var ns=document.createElement('div');ns.style.cssText='font-size:12px;margin-top:6px';
      ns.textContent=canEditPolicy(p)?'Click Edit to upload a PDF or write the policy text.':'The policy owner has not uploaded content yet.';
      noContent.appendChild(ni);noContent.appendChild(nt);noContent.appendChild(ns);
      contentEl.innerHTML='';contentEl.appendChild(noContent);
    }
  }

  // Notes / revision history
  if(notesWrap && notesEl){
    if(p.notes&&p.notes.trim()){
      notesWrap.style.display='';
      notesEl.textContent=p.notes;
    } else {
      notesWrap.style.display='none';
    }
  }

  // Show edit button only if current user can edit
  if(editBtn){
    editBtn.style.display=canEditPolicy(p)?'':'none';
    editBtn.setAttribute('data-pid',p.id);
  }

  openPanel('policy-view-panel');
}

// Called from the view panel's Edit button
function openPolicyEdit(){
  var pid=document.getElementById('pvp-edit-btn').getAttribute('data-pid');
  var p=policies.find(function(x){return x.id==pid;});
  if(!p) return;
  closePanel();
  setTimeout(function(){ editPolicy(p); }, 300);
}

// Acknowledge button — just a UI confirmation for now
function acknowledgePolicy(){
  var pid=document.getElementById('pvp-edit-btn').getAttribute('data-pid');
  var p=policies.find(function(x){return x.id==pid;});
  var pname=p?p.name:'this policy';
  showDueDateToast('','✓ You acknowledged reading: '+pname);
}

// ── Calculate next review date ──
function calcPolicyNextReview(freq){
  var d=new Date();
  if(!freq||freq==='Annual')  d.setFullYear(d.getFullYear()+1);
  else if(freq==='6 months')  d.setMonth(d.getMonth()+6);
  else if(freq==='2 years')   d.setFullYear(d.getFullYear()+2);
  else if(freq==='3 years')   d.setFullYear(d.getFullYear()+3);
  else                         d.setFullYear(d.getFullYear()+1);
  return d.toISOString().split('T')[0];
}

// ── escHtml — safe text output ──
function escHtml(str){
  var s=String(str),out='';
  for(var i=0;i<s.length;i++){
    var c=s[i];
    if(c==='&') out+='&amp;';
    else if(c==='<') out+='&lt;';
    else if(c==='>') out+='&gt;';
    else if(c===String.fromCharCode(34)) out+='&quot;';
    else out+=c;
  }
  return out;
}

// ── Save policy ──
async function savePolicy(){
  if(!currentUser){noPermission();return;}
  var editId=document.getElementById('policy-edit-id').value;
  // If editing: only admin or assigned owner can save
  if(editId){
    var existing=policies.find(function(x){return x.id==editId;});
    if(existing&&!canEditPolicy(existing)){noPermission('Only the assigned owner or an admin can edit this policy.');return;}
  } else {
    // Creating new policy — admin or manager
    if(!can('add')){noPermission('Only admin and manager can create policies.');return;}
  }
  var name=document.getElementById('policy-name').value.trim();
  var owner=document.getElementById('policy-owner').value.trim();
  var review=document.getElementById('policy-review-date').value;
  if(!name){alert('Please enter a policy name.');return;}
  if(!owner){alert('Please enter the policy owner name.');return;}
  if(!review){alert('Please set a next review date.');return;}
  var body={
    name:name,
    category:document.getElementById('policy-category').value,
    status:document.getElementById('policy-status').value,
    description:document.getElementById('policy-desc').value.trim(),
    content:document.getElementById('policy-content').value.trim(),
    pdf_data:document.getElementById('policy-pdf-b64').value||null,
    pdf_filename:document.getElementById('pol-pdf-name').textContent||null,
    owner:owner,
    owner_email:document.getElementById('policy-owner-email-input').value.trim().toLowerCase(),
    approver:document.getElementById('policy-approver').value.trim(),
    version:document.getElementById('policy-version').value.trim()||'1.0',
    review_frequency:document.getElementById('policy-review-freq').value,
    effective_date:document.getElementById('policy-effective').value||null,
    next_review_date:review,
    document_link:document.getElementById('policy-link').value.trim(),
    control_refs:document.getElementById('policy-controls').value.trim(),
    notes:document.getElementById('policy-notes').value.trim()
  };
  var res=editId
    ?await api('grc_policies?id=eq.'+editId,{method:'PATCH',body:body,extra:{'Prefer':'return=minimal'}})
    :await api('grc_policies',{method:'POST',body:body,extra:{'Prefer':'return=representation'}});
  if(res&&res.ok){
    closePanel();
    document.getElementById('policy-edit-id').value='';
    document.getElementById('policy-panel-title').textContent='Add policy';
    polClearPdf();
    polSwitchTab('pdf');
    ['policy-name','policy-desc','policy-content','policy-owner','policy-owner-email-input',
     'policy-approver','policy-version','policy-effective','policy-review-date',
     'policy-link','policy-controls','policy-notes'].forEach(function(id){
      var el=document.getElementById(id);if(el)el.value='';
    });
    document.getElementById('policy-status').value='Active';
    document.getElementById('policy-category').value='Information Security';
    document.getElementById('policy-review-freq').value='Annual';
    writeAuditLog(editId?'UPDATE':'CREATE','Policy',editId?'Updated policy: '+name:'Created policy: '+name,{category:body.category,owner:body.owner});
    showDueDateToast('',editId?'Policy updated!':'Policy created!');
    await loadAll();
  } else {
    alert('Error saving. Make sure grc_policies table has the content and owner_email columns. Run the SQL in setup.');
  }
}

// ── Edit — prefill panel ──
function editPolicy(p){
  // Access gate: only admin or assigned owner
  if(!canEditPolicy(p)){
    noPermission('Only the assigned owner ('+( p.owner||'owner')+') or an admin can edit this policy.');
    return;
  }
  document.getElementById('policy-panel-title').textContent='Edit policy';
  document.getElementById('policy-edit-id').value=p.id;
  document.getElementById('policy-name').value=p.name||'';
  document.getElementById('policy-category').value=p.category||'Information Security';
  document.getElementById('policy-status').value=p.status||'Active';
  document.getElementById('policy-desc').value=p.description||'';
  document.getElementById('policy-content').value=p.content||'';
  // Restore PDF state
  if(p.pdf_data&&p.pdf_data.trim()){
    document.getElementById('policy-pdf-b64').value=p.pdf_data;
    var nm=document.getElementById('pol-pdf-name');
    if(nm) nm.textContent=p.pdf_filename||'policy.pdf';
    document.getElementById('pol-pdf-selected').style.display='';
    document.getElementById('pol-drop-zone').style.display='none';
    polSwitchTab('pdf');
  } else {
    polClearPdf();
    if(p.content&&p.content.trim()) polSwitchTab('text');
    else polSwitchTab('pdf');
  }
  document.getElementById('policy-owner').value=p.owner||'';
  document.getElementById('policy-owner-email-input').value=p.owner_email||'';
  document.getElementById('policy-approver').value=p.approver||'';
  document.getElementById('policy-version').value=p.version||'';
  document.getElementById('policy-review-freq').value=p.review_frequency||'Annual';
  document.getElementById('policy-effective').value=p.effective_date||'';
  document.getElementById('policy-review-date').value=p.next_review_date||'';
  document.getElementById('policy-link').value=p.document_link||'';
  document.getElementById('policy-controls').value=p.control_refs||'';
  document.getElementById('policy-notes').value=p.notes||'';
  openPanel('policy-panel');
}

// ── Badge — overdue + due-soon + draft count ──
function updatePolicyBadge(){
  var cnt=policies.filter(function(p){var s=getPolicyStatus(p);return s==='expired'||s==='due-soon'||s==='draft';}).length;
  var b=document.getElementById('policy-badge');
  if(b){b.textContent=cnt;b.style.display=cnt>0?'inline-block':'none';}
}

// ── Mobile bottom nav: highlight active tab ──
(function(){
  var map={
    'mbn-dash':'nav-dash',
    'mbn-items':'nav-items',
    'mbn-risks':'nav-risks',
    'mbn-actions':'nav-actions',
    'mbn-more':'ham-btn'
  };
  function syncMbn(){
    Object.keys(map).forEach(function(mbnId){
      var el=document.getElementById(mbnId);
      if(!el) return;
      var navEl=document.getElementById(map[mbnId]);
      if(mbnId==='mbn-more'){el.classList.remove('mbn-active');return;}
      el.classList.toggle('mbn-active', navEl?navEl.classList.contains('active'):false);
    });
  }
  // Watch for active class changes using MutationObserver
  var navEl=document.getElementById('nav-dash');
  if(navEl){
    var obs=new MutationObserver(syncMbn);
    document.querySelectorAll('.sb-btn').forEach(function(b){
      obs.observe(b,{attributes:true,attributeFilter:['class']});
    });
  }
  document.addEventListener('DOMContentLoaded',syncMbn);
  setTimeout(syncMbn,800);
})();
