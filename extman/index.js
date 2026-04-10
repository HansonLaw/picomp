#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');

const program = new Command();

program
  .name('extman')
  .description('File extension conversion tool - bulk change file extensions')
  .version('1.0.0');

program
  .option('-d, --dir <directory>', 'Directory containing files', './')
  .option('-f, --from <ext>', 'Original extension to convert (e.g., js)', null)
  .option('-t, --to <ext>', 'New extension (e.g., ts)', null)
  .option('-r, --recursive', 'Search recursively', false);

program.parse();
const options = program.opts();

if (!options.from || !options.to) {
  console.log(chalk.red('Error: --from and --to are required!'));
  console.log('Example: extman --from js --to ts');
  process.exit(1);
}

// Clean extensions - remove leading dot if present
const fromExt = options.from.replace(/^\./, '').toLowerCase();
const toExt = options.to.replace(/^\./, '');

function processFiles() {
  const dir = path.resolve(options.dir);
  if (!fs.existsSync(dir)) {
    console.log(chalk.red(`Directory ${dir} does not exist!`));
    process.exit(1);
  }

  let files = [];
  if (options.recursive) {
    files = findFilesRecursive(dir);
  } else {
    files = fs.readdirSync(dir)
      .map(file => path.join(dir, file))
      .filter(file => fs.statSync(file).isFile());
  }

  let processedCount = 0;
  let errors = 0;

  console.log(chalk.blue(`Converting .${fromExt} to .${toExt}...`));
  console.log();

  function findFilesRecursive(dir) {
    const results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (item === 'node_modules' || item === '.git') continue;
        results.push(...findFilesRecursive(fullPath));
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase().slice(1);
    if (ext !== fromExt) continue;

    const dirname = path.dirname(filePath);
    const basename = path.basename(filePath, `.${fromExt}`);
    const newPath = path.join(dirname, `${basename}.${toExt}`);

    try {
      fs.renameSync(filePath, newPath);
      console.log(chalk.green(`✓ ${path.basename(filePath)} → ${path.basename(newPath)}`));
      processedCount++;
    } catch (error) {
      console.log(chalk.red(`✗ Failed to rename ${filePath}: ${error.message}`));
      errors++;
    }
  }

  console.log();
  console.log(chalk.bold.blue('='.repeat(50)));
  console.log(chalk.bold.green(`Completed! ${processedCount} files converted, ${errors} errors.`));
  console.log(chalk.bold.blue('='.repeat(50)));
}

processFiles();
