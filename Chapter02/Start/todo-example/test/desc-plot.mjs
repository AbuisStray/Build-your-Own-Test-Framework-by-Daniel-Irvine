#!/usr/bin/env node
import path from "path";
import fs from "fs";

const TEST_FILE_EXTENSIONS = ['tests.mjs'];
const BAR_CHAR = '█'; 

function getTestFiles(dir = path.join(process.cwd(), 'test')) { // Start from 'test' folder
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(getTestFiles(fullPath));
        } else if (TEST_FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
            files.push(fullPath);
        }
    });
    return files;
}

function extractTestDescriptions(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /(?:describe|it|test)\s*\(\s*['"`]([^'"`]+)/g;
    let match;
    let descriptions = [];

    while ((match = regex.exec(content)) !== null) {
        descriptions.push(match[1]);
    }

    return descriptions;
}

function countStartingVerbs(descriptions) {
    const counts = {};
    descriptions.forEach(desc => {
        const firstWord = desc.split(/\s+/)[0].toLowerCase();
        if (firstWord) {
            counts[firstWord] = (counts[firstWord] || 0) + 1;
        }
    });
    return counts;
}

function drawBarChart(counts) {
    console.log("\nTest Description Verb Frequency:\n");

    // Find max count for scaling
    const maxCount = Math.max(...Object.values(counts));
    const maxBarWidth = 30; // Maximum width of bars in terminal

    for (const [word, count] of Object.entries(counts)) {
        const barLength = Math.round((count / maxCount) * maxBarWidth);
        console.log(`${word.padEnd(12)} | ${BAR_CHAR.repeat(barLength)} (${count})`);
    }

    console.log("\n");
}

function main() {
    const testFiles = getTestFiles(process.cwd());
    let allDescriptions = [];

    testFiles.forEach(file => {
        allDescriptions = allDescriptions.concat(extractTestDescriptions(file));
    });

    const verbCounts = countStartingVerbs(allDescriptions);

    if (Object.keys(verbCounts).length === 0) {
        console.log("No test descriptions found.");
        return;
    }

    drawBarChart(verbCounts);
}

main();