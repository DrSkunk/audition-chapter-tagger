# Audition Chapter Tagger

A Node.js CLI tool that processes Adobe Audition markers CSV files and adds chapter tags to MP3 files using ID3 tags.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Initial Setup
- Install dependencies: `npm install` - takes 1-25 seconds (depending on cache), may show vulnerabilities (normal for this project)
- Run tests: `npm test` - takes 1 second, should pass all 3 tests
- NEVER CANCEL: All build and test commands complete quickly, but always wait for completion

### Build Process
- Clean build directory: `npm run build:clean`
- Build for all platforms: `npm run build` - takes 7-11 seconds. NEVER CANCEL. Set timeout to 30+ seconds
- Build individual platforms:
  - Windows: `npm run build:windows` - creates `.exe` file
  - macOS: `npm run build:macos` - creates macOS binary  
  - Linux: `npm run build:linux` - creates Linux binary
- All builds output to `build/` directory with version numbers in filenames

### Testing and Validation
- Run unit tests: `npm test` - takes 1 second. NEVER CANCEL. Set timeout to 30+ seconds
- Test CLI functionality: `node index.js --help` shows all available options
- ALWAYS manually validate CLI changes by running:
  ```bash
  node index.js --markers test/example_markers.csv --mp3 test/file_example_MP3_700KB.mp3 --title "Test Title" --artist "Test Artist"
  ```
- This should create a file named `test/file_example_MP3_700KB-chapters.mp3` and show chapter processing output
- Test built binaries: `./build/audition-chapter-tagger_v[VERSION]_linux --help`

### Publishing and Distribution
- Tool is published to npm as `audition-chapter-tagger`
- Users can run via: `npx audition-chapter-tagger`
- GitHub Actions automatically builds and releases binaries on git tags

## Validation Scenarios

**CRITICAL**: After making any changes, ALWAYS run these validation scenarios:

1. **Basic CLI Test**: Run the help command and verify all options are displayed
2. **Full Processing Test**: Process the example markers file with the test MP3:
   ```bash
   node index.js --markers test/example_markers.csv --mp3 test/file_example_MP3_700KB.mp3 --title "Validation Test" --artist "Test Artist"
   ```
   - Should output: "Writing to test/file_example_MP3_700KB-chapters.mp3"
   - Should show: "Read 2 chapters from csv", "Adding intro chapter", chapter listings, "Writing 3 chapters to mp3"
   - Should end with: "Successfully wrote ID3 tags"
   - Should create output file with chapters embedded
3. **Build Test**: Run `npm run build:linux` and test the resulting binary
4. **Test Suite**: Run `npm test` and ensure all tests pass

## Repository Structure

### Key Files
- `index.js` - Main CLI entry point with yargs argument parsing
- `package.json` - Dependencies and build scripts, published to npm
- `lib/` - Core functionality modules:
  - `createTags.js` - Main tag creation logic, handles ID3 tag generation
  - `parseMarkers.js` - Parses Adobe Audition CSV format
  - `parseTime.js` - Time string parsing utilities
  - `formatTime.js` - Time formatting utilities  
  - `formatStartTime.js` - Converts time to milliseconds
- `test/` - Test files and example data:
  - `createTags.test.js` - Main functionality tests
  - `parseTime.test.js` - Time parsing tests
  - `example_markers.csv` - Sample Adobe Audition markers export
  - `file_example_MP3_700KB.mp3` - Test MP3 file for validation

### Build and CI
- `.github/workflows/release-on-tag.yml` - Automated release pipeline
- `build/` - Created during build, contains platform-specific binaries
- Uses `pkg` to create standalone Node.js executables

## Common Commands Reference

### Repository Root Contents
```
.
├── .github/          # GitHub workflows and configurations
├── .gitignore       # Excludes node_modules, build artifacts, examples
├── README.md        # User documentation with usage examples
├── index.js         # Main CLI entry point (executable)
├── lib/             # Core functionality modules
├── package.json     # Dependencies and npm scripts
├── package-lock.json # Dependency lock file
└── test/            # Test files and example data
```

### package.json Scripts
```json
{
  "start": "node index.js",
  "test": "jest",
  "build": "npm run build:clean && npm run build:windows && npm run build:macos && npm run build:linux", 
  "build:clean": "rimraf build",
  "build:windows": "pkg index.js -t node14-win-x64 -o build/audition-chapter-tagger_v$(project-version)_win.exe",
  "build:macos": "pkg index.js -t node14-macos-x64 -o build/audition-chapter-tagger_v$(project-version)_macos",
  "build:linux": "pkg index.js -t node14-linux-x64 -o build/audition-chapter-tagger_v$(project-version)_linux"
}
```

### CLI Options
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
  -l, --language             Language of the chapters. Defaults to nld. Must be
                             iso639-2                                   [string]
```

## Technical Notes

- **No linting configuration** - No ESLint, Prettier, or other linting tools configured
- **Dependencies**: Uses Node.js packages for ID3 manipulation (`node-id3`), image processing (`sharp`), CSV parsing (`csv-parse`), and CLI (`yargs`)
- **Binary warnings**: pkg build shows warnings about Sharp native modules - these are expected and don't affect functionality
- **Output files**: Tool creates new files with `-chapters.mp3` suffix, preserving originals
- **Chapter format**: Automatically adds "Intro" chapter if first marker isn't at 0:00.000
- **Image processing**: Cover art automatically resized to 600x600 PNG format

## Troubleshooting

- If builds fail, ensure all dependencies are installed with `npm install`
- Sharp module warnings during pkg build are normal and expected
- Test files are included in repository for validation but output files should not be committed
- Uses older Node.js 14 target for broader compatibility in binaries