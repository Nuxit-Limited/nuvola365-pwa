# 🔗 Microsoft Cloud URLs - Quick Reference

## ✅ Correct URLs (Updated)

### Windows 365
| Type | URL |
|------|-----|
| **Main Portal** | `https://windows.cloud.microsoft/` |
| **Direct Launch** | `https://windows.cloud.microsoft/?cloudPcId=<ID>` |

### Azure Virtual Desktop
| Type | URL |
|------|-----|
| **HTML5 Web Client** | `https://client.wvd.microsoft.com/arm/webclient/` |
| **Direct Launch Desktop** | `https://client.wvd.microsoft.com/arm/webclient/?workspaceId=<ID>&resourceId=<ID>` |
| **Direct Launch App** | `https://client.wvd.microsoft.com/arm/webclient/?workspaceId=<ID>&resourceId=<APP-ID>` |

### Microsoft 365 Apps
| App | URL |
|-----|-----|
| **Teams** | `https://teams.microsoft.com` |
| **Outlook** | `https://outlook.office.com` |
| **Word** | `https://www.office.com/launch/word` |
| **Excel** | `https://www.office.com/launch/excel` |
| **PowerPoint** | `https://www.office.com/launch/powerpoint` |
| **OneDrive** | `https://onedrive.live.com` |
| **OneNote** | `https://www.onenote.com/notebooks` |
| **SharePoint** | `https://<tenant>.sharepoint.com` |

## 📋 URL Changes

### ❌ Old (Deprecated)
- ~~`https://windows365.microsoft.com`~~ → Use `windows.cloud.microsoft`
- ~~`https://rdweb.wvd.microsoft.com`~~ → Use `client.wvd.microsoft.com`

### ✅ New (Current)
- `https://windows.cloud.microsoft/` - Windows 365
- `https://client.wvd.microsoft.com/arm/webclient/` - Azure VD (HTML5)

## 🎯 Direct Launch Benefits

| Feature | Without Direct Launch | With Direct Launch |
|---------|---------------------|-------------------|
| **Steps to access** | 3-4 clicks | 1 click |
| **User experience** | Select from list | Instant connection |
| **URL sharing** | Generic portal | Specific resource |
| **Bookmarks** | Connection page | Direct to resource |
| **Kiosk mode** | Manual selection | Auto-connect |

## 🔧 Getting IDs

### Windows 365 Cloud PC ID
```powershell
# Method 1: PowerShell + Microsoft Graph
Connect-MgGraph -Scopes "CloudPC.Read.All"
Get-MgDeviceManagementVirtualEndpointCloudPC | Select Id, DisplayName

# Method 2: Browser Developer Tools
# 1. Visit https://windows.cloud.microsoft/
# 2. Press F12 (Developer Tools)
# 3. Network tab → Click your Cloud PC
# 4. Look for cloudPcId in the request
```

### Azure VD Workspace & Resource IDs
```powershell
# Install module
Install-Module Az.DesktopVirtualization

# Connect
Connect-AzAccount

# Get Workspace ID
Get-AzWvdWorkspace -ResourceGroupName "RG-Name" -Name "Workspace-Name" | Select ObjectId

# Get Desktop Resource ID
Get-AzWvdDesktop -ResourceGroupName "RG-Name" `
  -ApplicationGroupName "AppGroup-Name" | Select ObjectId

# Get RemoteApp Resource ID
Get-AzWvdApplication -ResourceGroupName "RG-Name" `
  -ApplicationGroupName "AppGroup-Name" -Name "App-Name" | Select ObjectId
```

## 📖 Microsoft Documentation

- [Windows 365 Portal](https://learn.microsoft.com/en-us/windows-365/end-user-access-cloud-pc)
- [Azure VD Web Client](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-web)
- [Direct Launch URLs](https://learn.microsoft.com/en-us/windows-app/direct-launch-urls)
- [Windows App Overview](https://learn.microsoft.com/en-us/windows-app/)

## ⚡ Quick Setup in Nuvola365

Edit `apps.js`, scroll to bottom:

```javascript
const CloudConfig = {
  windows365: {
    cloudPcId: "PASTE-YOUR-CLOUD-PC-ID-HERE"
  },
  avd: {
    workspaceId: "PASTE-YOUR-WORKSPACE-ID-HERE",
    resourceId: "PASTE-YOUR-RESOURCE-ID-HERE"
  }
};
```

Save → Reload page → Click icons → Direct launch! 🚀

## 🎯 Use Cases

### 1. Executive Dashboard
- Create desktop shortcut to specific Cloud PC
- One-click access to work environment
- No browsing through connection lists

### 2. Developer Workstations
- Different icons for Dev/Test/Prod environments
- Quick context switching
- Bookmark direct URLs

### 3. Kiosk Deployment
- Auto-launch specific AVD app on startup
- Locked-down user experience
- No manual resource selection

### 4. Help Desk
- Share direct URLs for troubleshooting
- "Click this link to access your desktop"
- Faster support resolution

### 5. Mobile Workers
- Add to home screen on mobile
- One-tap access to Cloud PC
- Works on tablets/phones

## ✅ Browser Support

| Browser | Windows 365 | Azure VD HTML5 |
|---------|-------------|----------------|
| **Chrome** | ✅ | ✅ |
| **Edge** | ✅ | ✅ |
| **Firefox** | ✅ | ✅ |
| **Safari** | ✅ | ✅ |
| **Mobile** | ✅ | ✅ |

All modern browsers support direct launch URLs!

---

**Last Updated**: Compatible with Windows App (February 2025)
