const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Function to recursively obfuscate all JS files in a directory
function obfuscateDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            obfuscateDirectory(fullPath);
        } else if (path.extname(fullPath) === '.js') {
            const src = fs.readFileSync(fullPath, 'utf-8');
            const obfuscated = JavaScriptObfuscator.obfuscate(src, {
                // Obfuscation options
                compact: true,
                controlFlowFlattening: true,
            });
            fs.writeFileSync(fullPath, obfuscated.getObfuscatedCode());
        }
    });
}

// Specify the directory containing your JS files
obfuscateDirectory('public');
