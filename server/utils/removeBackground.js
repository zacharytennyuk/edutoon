const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const removeBackground = (imageUrl) => {
    console.log('Removing background');
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, '..', 'python', 'output.png');
        console.log('Running python');

        exec(`python3 ${path.join(__dirname, '..', 'python', 'remove_background.py')} "${imageUrl}" "${outputPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python script error: ${error}`);
                reject(`Error processing image: ${stderr}`);
            } else {
                console.log(`Python script output: ${stdout}`);
                fs.readFile(outputPath, (err, data) => {
                    if (err) {
                        reject(`Error reading output file: ${err}`);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    });
};

module.exports = removeBackground;
