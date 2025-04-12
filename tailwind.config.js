# Navigate to your project directory
cd C:\Users\kiwi1\Desktop\fresh-tailwind

# Create the tailwind.config.js file manually
@'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
'@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# Create the postcss.config.js file manually
@'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -FilePath "postcss.config.js" -Encoding utf8

# Create the styles directory if it doesn't exist
if (!(Test-Path "styles")) {
    New-Item -ItemType Directory -Path "styles"
}

# Create the globals.css file
@'
@tailwind base;
@tailwind components;
@tailwind utilities;
'@ | Out-File -FilePath "styles\globals.css" -Encoding utf8

# Verify that the files were created
Write-Host "Files created successfully:" -ForegroundColor Green
Get-ChildItem tailwind.config.js
Get-ChildItem postcss.config.js
Get-ChildItem styles\globals.css