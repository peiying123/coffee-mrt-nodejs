const coffeeModel = require('../models/coffee');

const coffeeController = {
    get: (req, res) => {   
            res.render('coffee');  
    },
    getCoffeeWithLocation: (req, res) => {
        const { latitude, longitude } = req.body;
        coffeeModel.getCoffeeWithLocation([latitude, longitude], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results); 
        });
    },
    storeStatus: (req, res) => {
      const stationId = req.body;
      coffeeModel.storeStatus(stationId, (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(results); 
      });
    },
    getCoffeeWithId: (req, res) => {
        const stationId = req.body;
        coffeeModel.getCoffeeWithId(stationId, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results); 
        });
    }
};

module.exports = coffeeController;
