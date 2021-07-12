const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('common'));

app.get('/update/channel/:channel/:platform/:version', (req, res) => {
  res.json({
    // we serve the exact same version
    url: `http://localhost:4444/download/${req.params.version}`,
    name: 'Dummy',
    notes: 'Whatever',
    pub_date: '2017-10-20T13:33:10.000Z'
  });
});

app.get('/download/:version', (req, res) => {
  const version = req.params.version;
  const filePath = path.join(__dirname, `../../release/Station QA-${version}-mac.zip`);
  console.log(filePath);

  res.header('Content-Type', 'application/zip')
  res.sendFile(filePath);
});
app.listen(4444);
