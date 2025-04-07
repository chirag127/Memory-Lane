# Memory Lane

Memory Lane is a browser extension that brings context and nostalgia to your web browsing by surfacing notes, thoughts, and snapshots you saved when you originally bookmarked a page.

## Features

-   **Enhanced Bookmarking**: Save pages with notes, tags, and visual snapshots
-   **Contextual Recall**: When revisiting a page, see your original notes and thoughts
-   **Timeline View**: Browse your saved memories chronologically
-   **Tag Organization**: Categorize and filter your memories with tags
-   **Wayback Machine Integration**: Save snapshots to the Internet Archive

## Installation

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

## Usage

1. **Saving a page**: Click the Memory Lane icon in your browser toolbar, add notes and tags, then click "Save Memory"
2. **Revisiting a page**: When you visit a previously saved page, a popup will appear with your notes and the date you saved it
3. **Viewing all memories**: Click "View All Memories" in the popup to see a timeline of all your saved pages

## Development

### Project Structure

```
memory-lane/
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── memories.html
│   ├── onboarding.html
│   ├── css/
│   │   ├── popup.css
│   │   ├── memories.css
│   │   ├── content.css
│   │   └── onboarding.css
│   ├── js/
│   │   ├── popup.js
│   │   ├── content.js
│   │   ├── background.js
│   │   ├── memories.js
│   │   └── onboarding.js
│   └── images/
│       ├── icon16.png
│       ├── icon48.png
│       ├── icon128.png
│       └── ...
```

### Building

This extension is built using vanilla JavaScript, HTML, and CSS. No build process is required.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
