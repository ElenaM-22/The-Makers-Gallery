# Firebase Setup Instructions

Your website now uses Firebase for authentication and data storage, which means accounts will persist across browsers, devices, and even after clearing browsing history.

## 🔥 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `the-makers-gallery` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this project)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## 🌐 Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `The Maker's Gallery`
3. **DO NOT** check "Also set up Firebase Hosting" (you're using GitHub Pages)
4. Click **Register app**
5. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **Copy this configuration** - you'll need it in Step 4
7. Click **Continue to console**

## 🔐 Step 3: Enable Authentication

1. In the Firebase Console, click **Authentication** in the left sidebar
2. Click **Get started**
3. Click on the **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

## 📊 Step 4: Enable Firestore Database

1. In the Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll set custom rules)
4. Click **Next**
5. Choose your Cloud Firestore location (choose closest to your users, e.g., `us-central` for USA)
6. Click **Enable**
7. Wait for database creation

### Set Firestore Security Rules (CRITICAL STEP!)

1. Once Firestore is created, click on the **Rules** tab
2. Replace the default rules with these **EXACT** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - allow authenticated users to create/read/update their own document
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      
      // Saved makers subcollection - allow users to manage their own saved makers
      match /savedMakers/{makerId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Usernames collection - allow anyone to read (for checking duplicates)
    // Allow authenticated users to create username documents
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
}
```

3. Click **Publish**

## ⚙️ Step 5: Update firebase-config.js

1. Open the file `firebase-config.js` in your project root
2. Replace the placeholder values with your actual Firebase configuration from Step 2:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",  // Replace this
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace this
    projectId: "YOUR_PROJECT_ID",  // Replace this
    storageBucket: "YOUR_PROJECT_ID.appspot.com",  // Replace this
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace this
    appId: "YOUR_APP_ID"  // Replace this
};
```

3. Save the file

## 🚀 Step 6: Deploy to GitHub Pages

1. Commit all changes to your GitHub repository:
```bash
git add .
git commit -m "Add Firebase authentication"
git push origin main
```

2. Make sure GitHub Pages is enabled:
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Source should be set to your main branch
   - Your site URL will be shown at the top

3. Wait a few minutes for GitHub Pages to deploy

## ✅ Step 7: Test Your Website

### Option A: Use the Test Page (RECOMMENDED)

1. Open `firebase-test.html` in your browser (directly from your local files or after deploying)
2. Click each test button in order:
   - **Test Firebase Connection** - Should show ✅
   - **Create Test Account** - Should show ✅
   - **Login with Test Account** - Should show ✅
   - **Test Database Write** - Should show ✅
3. If all tests pass, Firebase is working correctly!
4. If any test fails, check the console output and see troubleshooting section below

### Option B: Test the Actual Login

1. Visit your GitHub Pages URL
2. Click **Profile** button (will redirect to login)
3. Click **Sign up** and create a new account
4. Login with your credentials
5. Open the site in a different browser or incognito mode
6. Login with the same credentials - it should work!

## 🎉 What's Changed?

### Before (localStorage):
- ❌ Accounts stored only in browser
- ❌ Lost when clearing browsing history
- ❌ Not accessible from other browsers/devices
- ❌ Data not synchronized

### After (Firebase):
- ✅ Accounts stored in cloud database
- ✅ Persist even after clearing browsing history
- ✅ Accessible from any browser/device
- ✅ Data synchronized across devices
- ✅ Saved makers persist across sessions

## 🔧 Troubleshooting

### ⚠️ "Account not found" when logging in from different browser

**Most Common Cause:** Firestore security rules not set correctly or not published

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Make sure the rules match exactly what's in Step 4
3. Click **Publish** (very important!)
4. Wait 1-2 minutes for rules to propagate
5. Try the `firebase-test.html` page to verify
6. Open browser console (F12) and look for "permission-denied" errors

**If still not working:**
- Delete any existing test accounts in Firebase Console → Authentication
- Clear your browser cache completely
- Try creating a new account
- Check that Email/Password authentication is **enabled** in Firebase Console

### "Firebase not defined" error
- Make sure all HTML files have the Firebase scripts loaded before `auth.js`
- Check browser console for any script loading errors
- Verify `firebase-config.js` is being loaded correctly

### "Permission denied" error in console
- **This is the most common issue!**
- Go to Firebase Console → Firestore Database → Rules tab
- Copy/paste the EXACT rules from Step 4
- Click **Publish** button
- Wait 1-2 minutes
- Try again

### Login works locally but not after deploying to GitHub Pages
- Clear your browser cache
- Make sure `firebase-config.js` is committed to GitHub
- Check that all Firebase script URLs are using HTTPS
- Wait a few minutes for GitHub Pages to fully deploy

### Account creation succeeds but data not saved
- Check Firestore security rules (Step 4)
- Open Firebase Console → Firestore Database → Data tab
- Look for `users` and `usernames` collections
- If they don't exist, rules are blocking writes
- Use `firebase-test.html` to diagnose the exact issue

### Saved makers not showing up
- Check Firestore security rules allow reading savedMakers subcollection
- Verify you're logged in when trying to view saved makers
- Check browser console for any errors
- Use firebase-test.html to test database writes

## 🐛 Advanced Debugging

If you're still having issues:

1. **Open firebase-test.html** in your browser
2. Open browser console (F12)
3. Run through all tests
4. Screenshot any error messages
5. Check the "Console Output" section on the test page

Common error codes:
- `permission-denied` = Security rules issue
- `auth/user-not-found` = Account doesn't exist in Firebase
- `auth/wrong-password` = Incorrect password
- `auth/network-request-failed` = Internet connection issue

## 📝 Notes

- The system uses a clever workaround: usernames are converted to email format (`username@makergallery.local`) for Firebase Authentication
- User data (username, userType) is stored in Firestore
- Saved makers are stored as subcollections under each user
- Firebase is completely free for small projects (plenty for this website)

## 🆘 Need Help?

If you encounter issues:
1. **Use firebase-test.html first!** It will tell you exactly what's wrong
2. Check the browser console (F12) for error messages
3. Verify Firestore security rules are published (not just saved)
4. Make sure Email/Password auth is enabled in Firebase Console
5. Wait 1-2 minutes after changing security rules before testing

---

**Your accounts are now saved in the cloud and will work across all browsers and devices! 🎊**
