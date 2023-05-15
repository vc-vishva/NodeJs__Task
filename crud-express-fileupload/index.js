const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Define storage for the profile picture using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

// profile picture
const fileFilter = (req, file, cb) => {
  //extensions
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extension = allowedTypes.test(path.extname(file.originalname));
  const mimetype = allowedTypes.test(file.mimetype);

  if (extension && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF file types are accepted.'));
  }
}

// Multer 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: fileFilter
});

//
app.use(express.json());

// GET all 
app.get('/employees', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

// GET single ID
app.get('/employees/:id', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const employees = JSON.parse(data);
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if (!employee) return res.status(404).send('Employee not found.');
    res.send(employee);
  });
});

// POST 
app.post('/employees', upload.single('profile'), (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      // Parse the JSON data from the file
      let employees = [];
      // try {
      //   employees = JSON.parse(data);
      // } catch (err) {
      //   console.error('Error parsing JSON data:', err);
      // }
  
      // Check is an array
      if (!Array.isArray(employees)) {
        res.status(500).send('Invalid database format');
        return;
      }
  
      // Generate a new ID for the employee
      const newId = employees.length ? employees[employees.length - 1].id + 1 : 1;
  
      // Create a new emp
      const newEmployee = {
        id: newId,
        name: req.body.name,
        email: req.body.email,
        profile: req.file ? req.file.path : '',
        department: req.body.department,
        joining_date: req.body.joining_date
      };
  
      // Add  database
      employees.push(newEmployee);
      fs.writeFile('./db.json', JSON.stringify(employees), (err) => {
        if (err) throw err;
        res.send(newEmployee);
      });
    });
  });
  
// Update 
app.put('/employees/:id', upload.single('profile'), (req, res) => {
    const id = parseInt(req.params.id);
  
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      // Parse the JSON data from the file
      let employees = [];
      try {
        employees = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
  
      // Find ID
      const employeeIndex = employees.findIndex(emp => emp.id === id);
  
      if (employeeIndex >= 0) {
        // Update with the new data...
        const { name, email, department, joining_date } = req.body;
        const profile = req.file ? req.file.path : employees[employeeIndex].profile;
        const updatedEmployee = { ...employees[employeeIndex], name, email, department, joining_date, profile };
  
        // Replace 
        employees[employeeIndex] = updatedEmployee;
  
        // Write the datain  file
        fs.writeFile('./db.json', JSON.stringify(employees), (err) => {
          if (err) throw err;
          res.json(updatedEmployee);
        });
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    });
  });
  
// Delete employee by ID
app.delete('/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
  
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      // Parse the JSON file
      let employees = [];
      try {
        employees = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
  
      // Find id..
      const employeeIndex = employees.findIndex(emp => emp.id === id);
  
      if (employeeIndex >= 0) {
        // Remove 
        const deletedEmployee = employees.splice(employeeIndex, 1)[0];
  
        // Write
        fs.writeFile('./db.json', JSON.stringify(employees), (err) => {
          if (err) throw err;
          res.status(200).json({ success: 'Employee data deleted', deletedEmployee });
        });
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    });
  });
  
  

app.listen(3000,()=>{
    console.log(`connected ${3000}`);
})

