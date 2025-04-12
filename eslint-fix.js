// eslint-fix.js
const fs = require('fs');
const path = require('path');

// Define paths to the files
const libPath = path.join(__dirname, 'functions', 'lib', 'index.js');
const srcPath = path.join(__dirname, 'functions', 'src', 'index.ts');

console.log('Looking for files at:');
console.log('Lib path:', libPath);
console.log('Src path:', srcPath);

// Helper function to read file, apply fixes, and write it back
function fixFile(filePath, fixers) {
  console.log(\nProcessing ...);
  
  // Check if file exists before trying to fix it
  if (!fs.existsSync(filePath)) {
    console.error(File not found: );
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(Read  characters from file);
    
    // Apply each fixer
    fixers.forEach(fixer => {
      const oldContent = content;
      content = fixer(content);
      
      // Report what changed
      if (oldContent !== content) {
        console.log(Applied fix: );
      }
    });
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(Fixed );
  } catch (error) {
    console.error(Error processing :, error.message);
  }
}

// Define fixers as functions that take content and return fixed content
const commonFixers = [
  // Fix linebreak style (CRLF -> LF)
  function fixLinebreaks(content) {
    return content.replace(/\r\n/g, '\n');
  },
  
  // Fix indentation (4 spaces -> 2 spaces)
  function fixIndentation(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      if (line.match(/^    /)) {
        return line.replace(/^    /, '  ');
      } else if (line.match(/^      /)) {
        return line.replace(/^      /, '    ');
      }
      return line;
    }).join('\n');
  }
];

const libFixers = [
  ...commonFixers,
  
  // Replace var with const/let
  function fixVarToConst(content) {
    return content.replace(/\bvar\b/g, 'const');
  },
  
  // Fix space before function parentheses
  function fixFunctionSpacing(content) {
    return content.replace(/function \(/g, 'function(');
  },
  
  // Fix block spacing
  function fixBlockSpacing(content) {
    return content.replace(/{\s+/g, '{ ').replace(/\s+}/g, ' }');
  },
  
  // Ensure file ends with newline
  function fixEOL(content) {
    return content.endsWith('\n') ? content : content + '\n';
  }
];

const srcFixers = [
  ...commonFixers,
  
  // Fix quotes (single -> double)
  function fixQuotes(content) {
    return content.replace(/'/g, '"');
  },
  
  // Fix object curly spacing
  function fixObjectCurlySpacing(content) {
    return content
      .replace(/{(\w)/g, '{ ')
      .replace(/(\w)}/g, ' }');
  }
];

// Process files
fixFile(libPath, libFixers);
fixFile(srcPath, srcFixers);

console.log('\nDone! Please run ESLint again to check remaining issues.');
