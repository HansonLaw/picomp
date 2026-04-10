#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');

const program = new Command();

program
  .name('fileren')
  .description('Batch file rename tool - quickly rename multiple files with patterns')
  .version('1.0.0');

program
  .option('-d, --dir <directory>', 'Directory containing files to rename', './')
  .option('-p, --prefix <string>', 'Add prefix to all files', '')
  .option('-s, --suffix <string>', 'Add suffix to all files before extension', '')
  .option('-l, --lowercase', 'Convert all filenames to lowercase', false)
  .option('-u, --uppercase', 'Convert all filenames to uppercase', false)
  .option('-r, --replace <search> <replace>', 'Replace text in filenames', null, null)
  .option('-n, --numbered <pattern>', 'Numbered rename, e.g., "photo-*.jpg"', '')
  .option('-e, --extensions <ext>', 'Only process files with these extensions (comma separated)', 'jpg,jpeg,png,gif,webp,pdf,docx,txt');

program.parse();
const options = program.opts();

function processFiles() {
  const dir = path.resolve(options.dir);
  if (!fs.existsSync(dir)) {
    console.log(chalk.red(`Directory ${dir} does not exist!`));
    process.exit(1);
  }

  const extensions = options.extensions.split(',').map(ext => ext.trim().toLowerCase());
  const files = fs.readdirSync(dir);
  
  let processedCount = 0;
  let errors = 0;

  console.log(chalk.blue(`Looking for files in ${dir}...`));
  console.log();

  let counter = 1;
  const padding = String(files.length).length;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      continue;
    }

    const ext = path.extname(file).toLowerCase().slice(1);
    if (!extensions.includes(ext) && extensions.length > 0 && extensions[0] !== '') {
      continue;
    }

    let name = path.basename(file, path.extname(file));
    const extension = path.extname(file);

    // Apply transformations
    if (options.prefix) {
      name = options.prefix + name;
    }

    if (options.suffix) {
      name = name + options.suffix;
    }

    if (options.lowercase) {
      name = name.toLowerCase();
    }

    if (options.uppercase) {
      name = name.toUpperCase();
    }

    if (options.replace && options.replace[0]) {
      name = name.replace(new RegExp(options.replace[0], 'g'), options.replace[1]);
    }

    if (options.numbered) {
      const num = String(counter).padStart(padding, '0');
      name = options.numbered.replace('*', num);
      counter++;
    }

    const newName = name + extension;
    const newPath = path.join(dir, newName);

    if (file === newName) {
      continue;
    }

    try {
      fs.renameSync(fullPath, newPath);
      console.log(chalk.green(`✓ ${file} → ${newName}`));
      processedCount++;
    } catch (error) {
      console.log(chalk.red(`✗ Failed to rename ${file}: ${error.message}`));
      errors++;
    }
  }

  console.log();
  console.log(chalk.bold.blue('='.repeat(50)));
  console.log(chalk.bold.green(`Completed! ${processedCount} files renamed, ${errors} errors.`));
  console.log(chalk.bold.blue('='.repeat(50)));
}

processFiles();
