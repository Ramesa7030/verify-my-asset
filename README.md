# Physical Asset Verification App

A mobile-friendly React application for conducting physical asset verification with form-based data entry and spreadsheet import/export capabilities.

## Project info

**URL**: https://lovable.dev/projects/681d4283-efb3-49c1-b9fa-d2ade2935a14

## Features

- Mobile-optimized form interface
- Asset data sheet management  
- Photo upload functionality
- Spreadsheet import/export (Excel/CSV)
- Editable field titles
- Interactive buttons and dropdowns
- Download to device's default folder

## Building Mobile App Bundles

This app uses Capacitor to create native mobile applications:

### Prerequisites
- Node.js and npm installed
- For iOS: Mac with Xcode
- For Android: Android Studio

### Steps to Create App Bundles

1. **Export to GitHub** (button in Lovable top-right)
2. **Clone and Setup**
   ```bash
   git clone [your-github-repo]
   cd [project-folder]  
   npm install
   ```
3. **Add Mobile Platforms**
   ```bash
   npx cap add ios     # For iOS
   npx cap add android # For Android
   npx cap update ios  # or android
   ```
4. **Build and Generate Bundles**
   ```bash
   npm run build
   npx cap sync
   npx cap run android  # Creates APK
   npx cap run ios      # Opens Xcode for iOS
   ```

### Additional Resources
- [Mobile Development Guide](https://lovable.dev/blogs/TODO)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/681d4283-efb3-49c1-b9fa-d2ade2935a14) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/681d4283-efb3-49c1-b9fa-d2ade2935a14) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
