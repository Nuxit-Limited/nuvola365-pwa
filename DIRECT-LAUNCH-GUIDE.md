# 🚀 Direct Launch URLs Guide - Windows 365 & Azure Virtual Desktop

## ✅ Nuvola365 Already Configured!

Good news! Your Nuvola365 deployment **already has the correct URLs**:

### Windows 365
```javascript
✅ Base URL: https://windows.cloud.microsoft/
✅ Direct launch support: Built-in
✅ Get launch URL: Applications['cloud-pc'].getDirectLaunchUrl(cloudPcId)
```

### Azure Virtual Desktop  
```javascript
✅ HTML5 Client: https://client.wvd.microsoft.com/arm/webclient/
✅ Direct launch support: Built-in
✅ Get launch URL: Applications['avd'].getDirectLaunchUrl(workspaceId, resourceId)
```

---

## 🎯 How to Use Direct Launch

### Windows 365 - Launch Specific Cloud PC

**1. Get your Cloud PC ID:**
- Visit https://windows.cloud.microsoft/
- Sign in
- Right-click your Cloud PC → Properties
- Copy the Cloud PC ID

**2. Create desktop icon in Nuvola365:**

Edit `index.html` - add to desktop-icons section:
```html
<div class="desktop-icon" data-app="my-cloudpc">
  <div class="desktop-icon-img">
    <i class="fas fa-desktop"></i>
  </div>
  <span>My Work PC</span>
</div>
```

**3. Add app definition to `apps.js`:**
```javascript
Applications['my-cloudpc'] = {
  name: 'My Work PC',
  icon: 'fas fa-desktop',
  color: '#0078d4',
  isCloudApp: true,
  openInTab: true,
  url: 'https://windows.cloud.microsoft/?cloudPcId=YOUR-CLOUDPC-ID-HERE'
};
```

**4. Done!** Double-click the icon to launch directly.

---

### Azure Virtual Desktop - Launch Specific App

**1. Get your IDs:**

**Option A - From Web Client:**
- Visit https://client.wvd.microsoft.com/arm/webclient/
- Sign in
- Open browser DevTools (F12)
- Click on an app
- Check Network tab for API calls containing workspaceId and resourceId

**Option B - From Azure Portal:**
- Azure Portal → Azure Virtual Desktop
- Application Groups → Your group
- Applications → Select app
- Copy IDs from properties

**2. Create app launcher:**

Edit `apps.js`:
```javascript
Applications['avd-excel'] = {
  name: 'Excel (AVD)',
  icon: 'fas fa-file-excel',
  color: '#217346',
  isCloudApp: true,
  openInTab: true,
  url: 'https://client.wvd.microsoft.com/arm/webclient/?workspaceId=YOUR-WORKSPACE-ID&resourceId=YOUR-RESOURCE-ID'
};
```

**3. Add to desktop or launcher:**

```html
<div class="desktop-icon" data-app="avd-excel">
  <div class="desktop-icon-img">
    <i class="fas fa-file-excel"></i>
  </div>
  <span>Excel</span>
</div>
```

---

## 📋 Quick Examples

### Example 1: Direct Cloud PC Access
```javascript
// Replace the generic cloud-pc app
Applications['cloud-pc'] = {
  name: 'My Cloud PC',
  icon: 'fas fa-desktop',
  color: '#0078d4',
  isCloudApp: true,
  openInTab: true,
  // Replace with your actual Cloud PC ID
  url: 'https://windows.cloud.microsoft/?cloudPcId=12345678-abcd-1234-abcd-123456789abc'
};
```

### Example 2: Department AVD Workspaces
```javascript
// Finance workspace
Applications['finance-apps'] = {
  name: 'Finance Apps',
  icon: 'fas fa-dollar-sign',
  color: '#2ecc71',
  isCloudApp: true,
  openInTab: true,
  url: 'https://client.wvd.microsoft.com/arm/webclient/?workspaceId=finance-workspace-id'
};

// Engineering workspace
Applications['eng-apps'] = {
  name: 'Engineering',
  icon: 'fas fa-code',
  color: '#e74c3c',
  isCloudApp: true,
  openInTab: true,
  url: 'https://client.wvd.microsoft.com/arm/webclient/?workspaceId=eng-workspace-id'
};
```

### Example 3: Specific AVD Applications
```javascript
// SAP from AVD
Applications['sap'] = {
  name: 'SAP',
  icon: 'fas fa-chart-line',
  color: '#0a6ed1',
  isCloudApp: true,
  openInTab: true,
  url: 'https://client.wvd.microsoft.com/arm/webclient/?workspaceId=ws-123&resourceId=sap-456'
};

// AutoCAD from AVD
Applications['autocad'] = {
  name: 'AutoCAD',
  icon: 'fas fa-drafting-compass',
  color: '#ff4444',
  isCloudApp: true,
  openInTab: true,
  url: 'https://client.wvd.microsoft.com/arm/webclient/?workspaceId=ws-123&resourceId=autocad-789'
};
```

---

## 🔗 URL Formats Reference

### Windows 365

**Main portal:**
```
https://windows.cloud.microsoft/
```

**Direct to Cloud PC:**
```
https://windows.cloud.microsoft/?cloudPcId=<CLOUD_PC_ID>
```

**Direct to app on Cloud PC (requires Windows App):**
```
ms-avd:connect?uri=<BASE64_ENCODED_URL>
```

### Azure Virtual Desktop

**HTML5 Web Client:**
```
https://client.wvd.microsoft.com/arm/webclient/
```

**Direct to workspace:**
```
https://client.wvd.microsoft.com/arm/webclient/?workspaceId=<WORKSPACE_ID>
```

**Direct to specific app/desktop:**
```
https://client.wvd.microsoft.com/arm/webclient/?workspaceId=<WORKSPACE_ID>&resourceId=<RESOURCE_ID>
```

---

## ⚡ Pro Tips

### For IT Admins

1. **Create pre-configured Nuvola365** with all direct launch URLs
2. **Deploy to users** via GitHub Pages or internal web server
3. **Users get one-click access** to their Cloud PCs and AVD apps
4. **No training needed** - familiar desktop interface

### For Users

1. **Bookmark direct URLs** for frequently used Cloud PCs
2. **Add to mobile home screen** for quick access
3. **Share URLs with colleagues** (they still need permissions)

### For Developers

1. **IDs are safe to expose** - authentication still required
2. **URLs work across devices** - desktop, mobile, tablet
3. **Can be used in HTML, emails, Slack** messages, etc.

---

## 🐛 Troubleshooting

**Problem:** "Resource not found" error
- ✅ Check IDs are correct (case-sensitive!)
- ✅ Verify user has permissions
- ✅ Try accessing resource through portal first

**Problem:** Redirected to login
- ✅ User not signed in
- ✅ Session expired
- ✅ Use incognito to test with different account

**Problem:** App doesn't launch
- ✅ Resource ID might be wrong
- ✅ Check workspace ID is correct
- ✅ Verify app is published in AVD

**Problem:** ms-avd:// URLs don't work
- ✅ Requires Windows App installed
- ✅ Use https:// URLs for browser access
- ✅ Mobile users should use web client

---

## 📚 Official Microsoft Documentation

- **Windows App Direct Launch:**  
  https://learn.microsoft.com/en-us/windows-app/direct-launch

- **AVD Web Client:**  
  https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-web

- **Windows 365:**  
  https://learn.microsoft.com/en-us/windows-365/

---

## 🎯 Summary

✅ Nuvola365 **already has correct URLs** for Windows 365 and AVD  
✅ HTML5 web client for AVD - **no download needed**  
✅ Direct launch **skips portal navigation**  
✅ **Easy to customize** with your specific IDs  
✅ Works on **any device** with a web browser  

Just add your Cloud PC IDs and resource IDs to make it even more powerful! 🚀
