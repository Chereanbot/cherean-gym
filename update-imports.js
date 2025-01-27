const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'src', 'app', 'api');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace different import variations
    content = content.replace(
        /import\s+(?:{\s*)?connectToDB(?:\s*})?\s+from\s+['"]@\/database['"]/g,
        `import { connectDB } from '@/lib/database'`
    );
    content = content.replace(
        /import\s+connectDB\s+from\s+['"]@\/database['"]/g,
        `import { connectDB } from '@/lib/database'`
    );
    
    // Replace function calls
    content = content.replace(/await\s+connectToDB/g, 'await connectDB');
    
    fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.js')) {
            updateFile(fullPath);
        }
    }
}

processDirectory(apiDir); 