#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');

const program = new Command();

program
  .name('textrepl')
  .description('Batch text replacement tool - replace text in multiple files at once')
  .version('1.0.0');

program
  .option('-d, --dir <directory>', 'Directory containing files to process', './')
  .option('-s, --search <string>', 'Search text or regex pattern', null)
  .option('-r, --replace <string>', 'Replacement text', '')
  .option('-e, --extensions <ext>', 'Only process files with these extensions (comma separated)', 'js,ts,jsx,tsx,html,css,txt,md,json')
  .option('-g, --regex', 'Use regular expression mode', false)
  .option('-i, --ignore-case', 'Case insensitive search', false);

program.parse();
const options = program.opts();

if (!options.search) {
  console.log(chalk.red('Error: --search pattern is required!'));
  console.log('Example: textrepl --search "oldtext" --replace "newtext"');
  process.exit(1);
}

function processFiles() {
  const dir = path.resolve(options.dir);
  if (!fs.existsSync(dir)) {
    console.log(chalk.red(`Directory ${dir} does not exist!`));
    process.exit(1);
  }

  const extensions = options.extensions.split(',').map(ext => ext.trim().toLowerCase());
  const files = findFiles(dir);
  
  let processedCount = 0;
  let replacedCount = 0;
  let errors = 0;

  console.log(chalk.blue(`Looking for files in ${dir}...`));
  console.log();

  const flags = options.ignoreCase ? 'gi' : 'g';
  const searchPattern = options.regex 
    ? new RegExp(options.search, flags) 
    : new RegExp(escapeRegExp(options.search), flags);

  function findFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (item === 'node_modules' || item === '.git') continue;
        results.push(...findFiles(fullPath));
      } else {
        const ext = path.extname(item).toLowerCase().slice(1);
        if (extensions.includes(ext) || extensions.length === 0 || extensions[0] === '') {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      content = content.replace(searchPattern, options.replace);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        const matches = (content.match(searchPattern) || []).length;
        console.log(chalk.green(`✓ ${path.relative(dir, filePath)}`));
        console.log(`  ${matches} replacement(s) made`);
        console.log();
        replacedCount += matches;
        processedCount++;
      } else {
        // No changes, skip
      }
    } catch (error) {
      console.log(chalk.red(`✗ Failed to process ${filePath}: ${error.message}`));
      console.log();
      errors++;
    }
  }

  console.log(chalk.bold.blue('='.repeat(50)));
  console.log(chalk.bold.green(`Completed! ${processedCount} files processed, ${replacedCount} replacements made, ${errors} errors.`));
  console.log(chalk.bold.blue('='.repeat(50)));
}

processFiles();
