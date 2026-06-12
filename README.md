# Zen Homepage

A clean, minimal new tab page built around a liquid glass clock.

![License](https://img.shields.io/badge/license-GPL--2.0-blue)
![Version](https://img.shields.io/badge/version-1.2.0-green)

## Features

- 🕐 Liquid glass clock centered on screen
- 🎨 20+ fonts — Inter, Orbitron, JetBrains Mono, Playfair Display, and more
- 🖼️ Custom wallpaper — PNG, JPG, GIF, AVIF, WEBP
- ⚡ Instant wallpaper load via local storage caching
- 🔲 Toggle glass background on/off
- 🎚️ Adjustable clock size, color, and background opacity
- 💾 All settings saved automatically
- 🚫 No accounts, no tracking, no cloud sync

## Installation

### From AMO (recommended)
Install directly from 

### Manual
1. Download the latest `.xpi` from [Releases](../../releases)
2. Drag and drop into `about:addons`

## Development

```
git clone https://github.com/truetaroimo/zen-homepage-extension
cd zen-homepage-extension
```

No build step needed — pure HTML, CSS, and JS.

To test locally:
1. Open `about:debugging` in Firefox/Zen
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

## File Structure

```
zen-homepage/
├── manifest.json     # Extension manifest (MV2)
├── index.html        # New tab page
├── style.css         # Styles
├── app.js            # Main logic
├── background.js     # New window handling
└── icons/            # Extension icons
```

## License

[GNU General Public License v2.0](LICENSE)
