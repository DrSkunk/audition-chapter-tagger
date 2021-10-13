# Audition Chapter tagger

Add Adobe Audition chaptering tags to ID3 tags of mp3 files

## Usage

You can run this with `node index.js --markers markers.csv --mp3 yourmp3file.mp3`.

Binaries are also avaiable on [the releases page](https://github.com/DrSkunk/audition-chapter-tagger/releases/).

Example of an input CSV from an export from Adobe Audition:

```tsv
Name	Start	Duration	Time Format	Type	Description
Kickstarter om te testen of we in een simulatie leven	1:16.655	0:00.000	decimal	Cue
Perseverance heeft zijn eerste kakske gelegd	10:40.290	0:00.000	decimal	Cue
```

## Options

```
Options:
  --help       Show help                                               [boolean]
  --version    Show version number                                     [boolean]
  --markers    Path to Adobe Audition Markers                [string] [required]
  --mp3        Path to mp3 file that needs chaptering        [string] [required]
  --cover      Path to an image file to be used as cover art, will be
               automatically resized to 600x600                         [string]
  --overwrite  Remove existing tags and overwrite them                 [boolean]
```

## Build as standalone

You can create a standalone binary for each platform with these options:

- Windows: `npm run build:windows`
- MacOS: `npm run build:macos`
- Linux: `npm run build:linux`
