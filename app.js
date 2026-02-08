const apps = {
  'cloud-pc': 'https://windows365.microsoft.com',
  'remote-app': 'https://client.wvd.microsoft.com/arm/webclient/'
};

function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleString([], {
    hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric'
  });
}
setInterval(updateClock, 60000);
updateClock();

function togglePanel() {
  document.getElementById('start-panel').classList.toggle('hidden');
}

function launchApp(key) {
  if (apps[key]) {
    window.open(apps[key], '_blank', 'width=1280,height=800,menubar=no,toolbar=no');
  }
}

// signIn() placeholder – add your MSAL code when ready
function signIn() {
  alert('Sign-in setup coming soon – for now, launches work without auth!');
  // Your MSAL loginRedirect or loginPopup here later
}

// Hide welcome overlay after "sign in" (simulate for now)
window.addEventListener('load', () => {
  // If using auth later: check msalInstance.getActiveAccount() and hide overlay if signed in
  setTimeout(() => {
    document.getElementById('welcome-overlay').style.display = 'none'; // Temp auto-hide for demo
  }, 3000); // Remove this timeout in real version
});