// Simple ESLint fixer script
const fs = require('fs');

// Fix lib/index.js
try {
  const libPath = './functions/lib/index.js';
  console.log('Fixing ' + libPath);
  
  if (fs.existsSync(libPath)) {
    let content = fs.readFileSync(libPath, 'utf8');
    // Apply fixes
    content = content.replace(/\r\n/g, '\n'); // Fix linebreaks
    content = content.replace(/\bvar\b/g, 'const'); // Fix var to const
    content = content.replace(/function \(/g, 'function('); // Fix function spacing
    
    // Fix indentation
    const lines = content.split('\n');
    content = lines.map(line => {
      if (line.match(/^    /)) {
        return line.replace(/^    /, '  ');
      } else if (line.match(/^      /)) {
        return line.replace(/^      /, '    ');
      }
      return line;
    }).join('\n');
    
    // Ensure file ends with newline
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    
    fs.writeFileSync(libPath, content, 'utf8');
    console.log('Fixed ' + libPath);
  } else {
    console.log('File not found: ' + libPath);
  }
} catch (error) {
  console.error('Error fixing lib file:', error.message);
}

// Fix src/index.ts
try {
  const srcPath = './functions/src/index.ts';
  console.log('Fixing ' + srcPath);
  
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    // Apply fixes
    content = content.replace(/\r\n/g, '\n'); // Fix linebreaks
    content = content.replace(/'/g, '"'); // Fix quotes
    
    // Fix object curly spacing
    content = content
      .replace(/{(\w)/g, '{ $1')
      .replace(/(\w)}/g, '$1 }');
    
    fs.writeFileSync(srcPath, content, 'utf8');
    console.log('Fixed ' + srcPath);
  } else {
    console.log('File not found: ' + srcPath);
  }
} catch (error) {
  console.error('Error fixing src file:', error.message);
}

console.log('Done! Please run ESLint again to check remaining issues.');