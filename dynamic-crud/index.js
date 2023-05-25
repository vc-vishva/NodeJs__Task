const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
const data = [];
   
app.post('/data', (req, res) => {
  const { newData, uniqueColumns } = req.body;
  console.log(`data:::`, newData);

  if (newData && Array.isArray(newData) && newData.length > 0) {
    const sheetName = newData[0].sheetName;

    if (sheetName && typeof sheetName === 'string' && sheetName.startsWith('sheet')) {
      for (let i = 0; i < newData.length; i++) {
        const currentItem = newData[i];

        const isDuplicate = newData.some((existingItem, index) => {
          if (index !== i && existingItem.sheetName === currentItem.sheetName) {
            return uniqueColumns.some((column) => existingItem[column] === currentItem[column]);
          }
          return false;
        });

        if (isDuplicate) {
          return res.status(400).json({
            error: 'Duplicate data found.', 
            
          });
        }
      }

      // Add the data
      data.push(...newData);

      return res.status(201).json({
        message: 'Data added successfully.',
        data: newData,
      });
    } else {
      return res.status(404).json({
        error: 'Invalid sheetName.',
      });
    }
  } else {
    return res.status(400).json({
      error: 'Invalid data format.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
