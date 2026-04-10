#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Command } = require('commander');
const chalk = require('chalk');

const program = new Command();

program
  .name('picomp')
  .description('Batch image compression tool - quickly compress all images in a folder')
  .version('1.0.0');

program
  .option('-i, --input <directory>', 'Input directory containing images', './images')
  .option('-o, --output <directory>', 'Output directory for compressed images', './compressed')
  .option('-q, --quality <number>', 'Quality 1-100', '80')
  .option('-w, --maxWidth <number>', 'Maximum width in pixels', '1920')
  .option('-m, --maxHeight <number>', 'Maximum height in pixels', '1080');

program.parse();

const options = program.opts();
const quality = parseInt(options.quality);
const maxWidth = parseInt(options.maxWidth);
const maxHeight = parseInt(options.maxHeight);

const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

async function compressImage(inputPath, outputPath) {
  try {
    let image = sharp(inputPath);
    const metadata = await image.metadata();
    
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      image = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    const ext = path.extname(inputPath).toLowerCase();
    if (['.jpg', '.jpeg'].includes(ext)) {
      image = image.jpeg({ quality });
    } else if (ext === '.png') {
      image = image.png({ quality });
    } else if (ext === '.webp') {
      image = image.webp({ quality });
    }
    
    await image.toFile(outputPath);
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log(chalk.green(`✓ ${path.basename(inputPath)}`));
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%`);
    console.log();
    
    return { originalSize, compressedSize, reduction };
  } catch (error) {
    console.log(chalk.red(`✗ Failed to compress ${inputPath}: ${error.message}`));
    console.log();
    return null;
  }
}

async function processDirectory() {
  const inputDir = path.resolve(options.input);
  const outputDir = path.resolve(options.output);
  
  if (!fs.existsSync(inputDir)) {
    console.log(chalk.red(`Input directory ${inputDir} does not exist!`));
    process.exit(1);
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return supportedFormats.includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log(chalk.yellow('No image files found in input directory.'));
    return;
  }
  
  console.log(chalk.blue(`Found ${imageFiles.length} image(s) to compress...`));
  console.log();
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  let successCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    const result = await compressImage(inputPath, outputPath);
    if (result) {
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
      successCount++;
    }
  }
  
  console.log(chalk.bold.blue('='.repeat(50)));
  console.log(chalk.bold.green(`Completed! ${successCount}/${imageFiles.length} images compressed.`));
  if (successCount > 0) {
    const totalReduction = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(2);
    console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total compressed: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
    console.log(chalk.green(`Total reduction: ${totalReduction}% saved!`));
  }
  console.log(chalk.bold.blue('='.repeat(50)));
}

processDirectory();
