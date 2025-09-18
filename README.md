# Audition Chapter tagger

Add Adobe Audition chaptering tags to ID3 tags of mp3 files

## Usage

This is available as an exectuable package with

```
npx audition-chapter-tagger
```

or

```
npm install --global audition-chapter-tagger
```

If cloned, you can run this with

```
node index.js --markers markers.csv --mp3 yourmp3file.mp3
```

Binaries for Linux-x64, MacOS-x64 (Intel) and Windows-x64 are also available on [the releases page](https://github.com/DrSkunk/audition-chapter-tagger/releases/).

Example of an input CSV from an export from Adobe Audition:

```tsv
Name	Start	Duration	Time Format	Type	Description
Kickstarter om te testen of we in een simulatie leven	1:16.655	0:00.000	decimal	Cue
Perseverance heeft zijn eerste kakske gelegd	10:40.290	0:00.000	decimal	Cue
```

## Options

```
Options:
      --help                 Show help                                 [boolean]
      --version              Show version number                       [boolean]
  -m, --markers, --chapters  Path to Adobe Audition Markers  [string] [required]
  -i, --mp3                  Path to mp3 file that needs chaptering
                                                             [string] [required]
  -c, --cover                Path to an image file to be used as cover art, will
                             be automatically resized to 600x600        [string]
      --overwrite            Remove existing tags and overwrite them   [boolean]
  -t, --title                Add title                                  [string]
  -a, --artist               Add artist                                 [string]
  -y, --year                 Add recording year                         [string]
  -l, --language             Language of the chapters. Defaults to nld. Must be
                             iso639-2                                   [string]
```

## Build as standalone

You can create a standalone binary for each platform with these options:

- Windows: `npm run build:windows`
- MacOS: `npm run build:macos`
- Linux: `npm run build:linux`
