# piComp - Batch Image Compression CLI Tool

A powerful and easy-to-use command-line tool for batch image compression. Reduce multiple images in one go with automatic resizing and quality optimization.

## Features

- 🚀 **Batch Processing**: Compress all images in a directory at once
- 📏 **Smart Resizing**: Automatically resize images to fit within max dimensions
- 🎨 **Quality Control**: Adjustable quality settings (1-100)
- 🖼️ **Supports**: JPG, JPEG, PNG, WebP, GIF
- 📊 **Clear Statistics**: Shows compression ratio and space saved
- 💨 **Fast**: Built on sharp for high performance

## Installation

```bash
npm install -g picomp
```

Or use directly with npx:

```bash
npx picomp --input ./my-images --output ./compressed
```

## Usage

Basic usage (uses defaults):

```bash
picomp
```

Custom options:

```bash
picomp -i ./photos -o ./compressed -q 75 -w 1280
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input <directory>` | Input directory containing images | `./images` |
| `-o, --output <directory>` | Output directory for compressed images | `./compressed` |
| `-q, --quality <number>` | Quality (1-100) | `80` |
| `-w, --maxWidth <number>` | Maximum width in pixels | `1920` |
| `-m, --maxHeight <number>` | Maximum height in pixels | `1080` |
| `-h, --help` | Display help | |
| `-V, --version` | Show version number | |

## Example Output

```
Found 3 image(s) to compress...

✓ photo1.jpg
  Original: 2456.78 KB
  Compressed: 456.23 KB
  Reduction: 81.43%

✓ banner.png
  Original: 1823.45 KB
  Compressed: 312.89 KB
  Reduction: 82.84%

==================================================
Completed! 3/3 images compressed.
Total original: 4.52 MB
Total compressed: 0.82 MB
Total reduction: 81.86% saved!
==================================================
```

## License

MIT
