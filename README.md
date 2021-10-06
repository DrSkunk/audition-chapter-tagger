# Audition Chapter tagger

Add Adobe Audition chaptering tags to ID3 tags of mp3 files

## Usage

You can run this with `node index.js --markers markers.csv --mp3 yourmp3file.mp3`.

Binaries are also avaiable on [the releases page](https://github.com/DrSkunk/audition-chapter-tagger/releases/).

## Options

```
Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --markers  Path to Adobe Audition Markers                  [string] [required]
  --mp3      Path to mp3 file that needs chaptering          [string] [required]
```

## Build as standalone

You can create a standalone binary for each platform with these options:

- Windows: `npm run build:windows`
- MacOS: `npm run build:macos`
- Linux: `npm run build:linux`
