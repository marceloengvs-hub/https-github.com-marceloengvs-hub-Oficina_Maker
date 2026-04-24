const fs = require('fs');

const files = ['slide1.png', 'slide2.png', 'slide3.png', 'slide4.png', 'slide5.png', 'tubo-laser.png'];

files.forEach(file => {
  try {
    const data = fs.readFileSync('../public/' + file);
    const hex = data.slice(0, 4).toString('hex');
    console.log(`${file}: ${hex} (${hex === '89504e47' ? 'OK' : 'CORRUPTED'})`);
  } catch (e) {
    console.log(`${file}: Error reading file`);
  }
});
