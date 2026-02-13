# 🧪 PROVISIONING TESTING GUIDE

## ✅ PWA Updates Complete

The following files have been updated with the provisioning workflow:

1. ✅ **index.html** - Added 4 new screens (Form, Progress, Complete, Failed)
2. ✅ **style.css** - Added comprehensive provisioning styles
3. ✅ **system.js** - Added complete provisioning logic with mock support
4. ✅ **config.js** - NEW file for backend configuration
5. ✅ **sw.js** - Updated to cache config.js

---

## 🎯 HOW TO TEST (MOCK MODE)

### Step 1: Deploy PWA

Upload these files to your web server:
- index.html
- style.css
- apps.js
- config.js
- system.js
- manifest.json
- sw.js

### Step 2: Open PWA

Visit your site (e.g., nuvola365.com)

### Step 3: Test Flow

1. **Welcome Screen**:
   - You'll see 2 buttons now:
     - "Sign In" (existing)
     - "Create Nuvola365 Instance" (NEW)

2. **Click "Create Nuvola365 Instance"**:
   - Provisioning form appears
   - Fill in:
     - Organization Name: "Test Company"
     - Admin Email: "admin@test.com"
     - Desired Domain: "testco" (optional)

3. **Click "Create Workspace"**:
   - Form submits
   - Progress screen appears
   - Progress bar animates 0% → 100%
   - Steps update in real-time:
     - ✓ Validation (completed)
     - ✓ Create Tenant (completed)
     - ⏳ Order Licenses (running)
     - ⊚ Assign Licenses (pending)
     - ⊚ Configure (pending)

4. **Wait ~30 seconds** (mock simulation):
   - Progress reaches 100%
   - Success screen appears

5. **Success Screen Shows**:
   - Domain: demo-workspace.onmicrosoft.com
   - Username: admin@demo-workspace.onmicrosoft.com
   - Password: ••••••••• (click eye icon to reveal)
   - "Open Workspace" button
   - "Email Login Details" button

---

## 🎨 WHAT YOU'LL SEE

### Screen 1: Welcome (Updated)
```
┌─────────────────────────────────┐
│         [Nuvola365 Logo]        │
│                                 │
│   Your Phone is Your Desktop    │
│                                 │
│   ┌─────────────────────────┐   │
│   │      Sign In            │   │ ← Existing
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ + Create Nuvola365      │   │ ← NEW
│   │   Instance              │   │
│   └─────────────────────────┘   │
│                                 │
│   Don't have an account yet?    │
│   Get started in 5 minutes!     │
└─────────────────────────────────┘
```

### Screen 2: Provisioning Form (NEW)
```
┌─────────────────────────────────┐
│ ← Back                          │
│                                 │
│    Create Your Workspace        │
│                                 │
│   Organization Name:            │
│   [Test Company____________]    │
│                                 │
│   Admin Email:                  │
│   [admin@test.com__________]    │
│                                 │
│   Desired Domain:               │
│   [testco__].onmicrosoft.com    │
│                                 │
│   ┌─────────────────────────┐   │
│   │  🚀 Create Workspace    │   │
│   └─────────────────────────┘   │
│                                 │
│   ℹ️ Setup takes 3-5 minutes    │
└─────────────────────────────────┘
```

### Screen 3: Progress (NEW)
```
┌─────────────────────────────────┐
│   Setting Up Your Workspace     │
│                                 │
│   [████████████░░░░] 60%        │
│                                 │
│   ⏳ Order Licenses             │
│   Ordering your workspace       │
│   licenses...                   │
│                                 │
│   ✓ Validation                  │
│   ✓ Create Tenant               │
│   ⏳ Order Licenses             │
│   ⊚ Assign Licenses             │
│   ⊚ Configure                   │
│                                 │
│   ⏰ Estimated: 2 minutes       │
│                                 │
│   [Cancel Setup]                │
└─────────────────────────────────┘
```

### Screen 4: Success (NEW)
```
┌─────────────────────────────────┐
│        ✅ Workspace Ready!       │
│                                 │
│   Domain:                       │
│   demo-workspace.onmicr... [📋] │
│                                 │
│   Username:                     │
│   admin@demo-workspace.... [📋] │
│                                 │
│   Password:                     │
│   •••••••••••• [👁️] [📋]       │
│                                 │
│   ⚠️ Change password on login   │
│                                 │
│   ┌─────────────────────────┐   │
│   │  🔗 Open Workspace      │   │
│   └─────────────────────────┘   │
│                                 │
│   [📧 Email Login Details]      │
└─────────────────────────────────┘
```

### Screen 5: Failed (NEW)
```
┌─────────────────────────────────┐
│        ❌ Setup Failed           │
│                                 │
│   Failed at: Order Licenses     │
│                                 │
│   Error: Insufficient credit    │
│                                 │
│   We couldn't complete your     │
│   order due to credit limit.    │
│                                 │
│   ┌─────────────────────────┐   │
│   │  🔄 Try Again           │   │
│   └─────────────────────────┘   │
│                                 │
│   [🆘 Contact Support]          │
│   [🏠 Go Back]                  │
│                                 │
│   Reference: PRV-1234-5678      │
└─────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION

### Mock vs Real Backend

Edit `config.js`:

```javascript
const Config = {
  // MOCK MODE (for testing)
  apiBaseUrl: 'http://localhost:3000/api/v1',
  features: {
    mockProvisioning: true,  // ← Set to false for real API
  }
};
```

### Real Backend Mode

When your Node.js backend is ready:

1. Set `mockProvisioning: false`
2. Update `apiBaseUrl` to your Azure App Service URL
3. Backend must implement these endpoints:
   - `POST /api/v1/provisioning/initiate`
   - `GET /api/v1/provisioning/:id/status`
   - `POST /api/v1/provisioning/:id/cancel`

---

## 🔧 CUSTOMIZATION

### Change Provisioning Speed (Mock)

Edit `system.js`:

```javascript
// Faster for testing (10 seconds total)
let mockProgress = 0;
const mockSteps = [
  { name: 'Validation', duration: 1000 },
  { name: 'Create Tenant', duration: 2000 },
  { name: 'Order Licenses', duration: 3000 },
  { name: 'Assign Licenses', duration: 2000 },
  { name: 'Configure', duration: 2000 }
];

// In getMockProvisioningStatus function
mockProgress += 10; // ← Change increment speed
```

### Test Failed State

In `getMockProvisioningStatus`, add random failure:

```javascript
// Simulate 30% failure rate
if (Math.random() < 0.3 && mockProgress > 40) {
  return {
    provisioningId: provisioningId,
    status: 'failed',
    progress: mockProgress,
    failedStep: 'Order Licenses',
    errorMessage: 'Insufficient credit with reseller',
    errorCode: 'GIACOM_CREDIT_LIMIT',
    canRetry: false,
    supportMessage: 'Please contact support to increase credit limit'
  };
}
```

---

## 📱 MOBILE TESTING

### iOS (Safari)
1. Open site on iPhone/iPad
2. Tap "Create Nuvola365 Instance"
3. Form should be fully responsive
4. Progress animations should be smooth

### Android (Chrome)
1. Open site on Android phone
2. Test in portrait and landscape
3. Progress bar should animate smoothly

### Samsung DeX
1. Connect phone to display
2. Desktop interface should show
3. Provisioning flow should work in desktop mode

---

## 🐛 TROUBLESHOOTING

### "Create Instance" button doesn't work
- Check browser console for errors
- Ensure config.js is loaded
- Check `Config.features.mockProvisioning` is `true`

### Progress doesn't update
- Check polling interval in config.js
- Verify `getMockProvisioningStatus` is being called
- Check browser console for errors

### Styles look broken
- Clear browser cache
- Check style.css loaded properly
- Verify all CSS added correctly

### Back button doesn't work
- Check JavaScript console errors
- Verify event listeners attached
- Try hard refresh (Ctrl+Shift+R)

---

## ✅ TESTING CHECKLIST

### Happy Path
- [ ] Welcome screen shows 2 buttons
- [ ] "Create Instance" opens form
- [ ] Form validates required fields
- [ ] Form submits successfully
- [ ] Progress screen appears
- [ ] Progress bar animates
- [ ] Steps update (completed → running → pending)
- [ ] Success screen appears after ~30s
- [ ] Domain/username/password displayed
- [ ] Password toggle works (eye icon)
- [ ] Copy buttons work
- [ ] "Open Workspace" opens new tab

### Error Path
- [ ] Back button returns to welcome
- [ ] Empty form shows validation error
- [ ] Invalid email shows error
- [ ] Cancel button stops provisioning
- [ ] Failed screen shows error details
- [ ] "Try Again" returns to form
- [ ] "Contact Support" opens email

### UI/UX
- [ ] All animations smooth
- [ ] No layout shifts
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Loading states clear
- [ ] Error messages helpful

---

## 🚀 NEXT STEPS

Once PWA testing is complete:

1. **Build Node.js Backend** (next document)
2. **Deploy to Azure** (App Service + SQL)
3. **Integrate Giacom API** (when credentials obtained)
4. **Add authentication** (Azure AD B2C or custom)
5. **Production hardening** (monitoring, alerts, etc.)

---

## 📞 NEED HELP?

If you encounter issues:

1. Check browser console (F12 → Console)
2. Verify all files uploaded correctly
3. Hard refresh (Ctrl+Shift+R)
4. Test in incognito mode
5. Try different browser

**All files are ready to test! Upload and try the flow now.** 🎉
