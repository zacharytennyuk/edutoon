const os = require('os');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const tempDir = path.join(os.tmpdir(), 'edutoon');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const cleanupTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) return console.error("Error reading temp directory:", err);

        files.forEach(file => {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) console.error("Error deleting temp file:", err);
            });
        });
    });
};

const removeBackground = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const outputFilename = `clipped_${uuidv4()}.png`;
        const outputPath = path.join(tempDir, outputFilename);

        exec(`python3 ${path.join(__dirname, '..', 'python', 'remove_background.py')} "${imageUrl}" "${outputPath}"`, 
        (error, stdout, stderr) => {
            if (error) {
                return reject(`Error processing image: ${stderr}`);
            }
            resolve(outputFilename);
        });
    });
};


module.exports = {
    removeBackground,
    cleanupTempDir
};
