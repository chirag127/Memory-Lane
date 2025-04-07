# 📘 Memory Lane

## ✨ Description

Memory Lane is a browser extension that brings context and nostalgia to your web browsing by surfacing notes, thoughts, and snapshots you saved when you originally bookmarked a page. Never forget why you saved a page again!

## 🚀 Live Demo

Visit our [Memory Lane Website](https://chirag127.github.io/Memory-Lane/) to learn more about the extension and see it in action.

## 🛠️ Tech Stack / Tools Used

-   JavaScript (ES6+)
-   HTML5 & CSS3
-   Chrome Extension APIs
-   Manifest V3
-   Internet Archive's Wayback Machine API
-   Local Storage for data persistence

## 📦 Installation Instructions

### Chrome/Edge

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension` folder

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select any file in the `extension` folder

## 🔧 Usage

1. **Saving a page**: Click the Memory Lane icon in your browser toolbar, add notes and tags, then click "Save Memory"
2. **Revisiting a page**: When you visit a previously saved page, a popup will appear with your notes and the date you saved it
3. **Viewing all memories**: Click "View All Memories" in the popup to see a timeline of all your saved pages
4. **Managing memories**: Edit, delete, or update your saved memories through the timeline view

## 🧪 Features

-   **Enhanced Bookmarking**: Save pages with notes, tags, and visual snapshots
-   **Contextual Recall**: When revisiting a page, see your original notes and thoughts
-   **Timeline View**: Browse your saved memories chronologically
-   **Tag Organization**: Categorize and filter your memories with tags
-   **Wayback Machine Integration**: Save snapshots to the Internet Archive
-   **Search & Filter**: Find specific memories by content, tags, or date
-   **Privacy-Focused**: All data stored locally on your device
-   **Customizable Settings**: Configure the extension to match your workflow

## 📸 Screenshots

![Memory Lane Popup](extension/images/step1.png)
_The Memory Lane popup for saving a page with notes and tags_

![Memory Lane Revisit](extension/images/step2.png)
_How Memory Lane appears when you revisit a saved page_

![Memory Lane Timeline](extension/images/step3.png)
_The timeline view showing all your saved memories_

## 🙌 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## 🪪 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
memory-lane/
├── extension/           # The browser extension code
│   ├── manifest.json    # Extension manifest
│   ├── popup.html      # Popup UI for saving pages
│   ├── memories.html   # Timeline view of all memories
│   ├── onboarding.html # First-run experience
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Icons and images
├── index.html          # Landing page
└── privacy-policy.html # Privacy policy
```
