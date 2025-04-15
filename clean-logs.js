// clean-logs.js
import fs from 'fs';
import path from 'path';

const logDir = path.resolve('server/src/logs');

fs.readdir(logDir, (err, files) => {
  if (err) {
    console.error('❌ Failed to read log directory:', err.message);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(logDir, file);
    if (file.endsWith('.log')) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`❌ Failed to delete ${file}:`, err.message);
        else console.log(`🧹 Deleted: ${file}`);
      });
    }
  });
});
