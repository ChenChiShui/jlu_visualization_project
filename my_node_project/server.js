const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const dataRoutes = require('./routes/dataRoutes');
app.use('/api', dataRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});