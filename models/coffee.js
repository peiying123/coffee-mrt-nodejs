const db = require('../db');

const coffeeModel = {
  getAll: (cb) => {
    db.query('SELECT * FROM coffee LIMIT 20;', (err, results) => {
      if (err) return cb(err);
      // Convert BLOB to base64
      results.forEach(result => {
        if (result.photo) {
          result.photo = Buffer.from(result.photo).toString('base64');
        }
      });
      cb(null, results);
    });
  },
  getCoffeeWithLocation: (position, cb) => {
    console.log(position);
    db.query(`SELECT * FROM coffee_and_mrt.coffee, coffee_and_mrt.shop_at_mrt 
              WHERE coffee_and_mrt.shop_at_mrt.station_id = (
                SELECT station_id FROM coffee_and_mrt.mrt 
                ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
              ) AND coffee_and_mrt.shop_at_mrt.place_id = coffee_and_mrt.coffee.place_id;

              SELECT name,coffee_and_mrt.mrt.station_id FROM coffee_and_mrt.mrt
              JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
              WHERE coffee_and_mrt.mrt_at_line.line_id = (
                  SELECT line_id 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              )
              AND coffee_and_mrt.mrt.sequence BETWEEN (
                  SELECT sequence 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              ) -2 AND (
                  SELECT sequence 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              ) -1;


              SELECT name,coffee_and_mrt.mrt.station_id FROM coffee_and_mrt.mrt 
              ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1;
              
              SELECT name,coffee_and_mrt.mrt.station_id FROM coffee_and_mrt.mrt
              JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
              WHERE coffee_and_mrt.mrt_at_line.line_id = (
                  SELECT line_id 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              )
              AND coffee_and_mrt.mrt.sequence BETWEEN (
                  SELECT sequence 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              ) +1 AND (
                  SELECT sequence 
                  FROM coffee_and_mrt.mrt
                  JOIN coffee_and_mrt.mrt_at_line ON coffee_and_mrt.mrt.station_id = coffee_and_mrt.mrt_at_line.station_id
                  WHERE coffee_and_mrt.mrt.station_id = (
                      SELECT station_id 
                      FROM coffee_and_mrt.mrt 
                      ORDER BY (ABS(lat - ?) + ABS(lon - ?)) ASC LIMIT 1
                  )
              ) +2;
              `, [position[0],position[1],position[0],position[1],position[0],position[1],position[0],position[1],position[0],position[1],position[0],position[1],position[0],position[1],position[0],position[1]], (err, results,fields) => {
                //[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                if (err) return cb(err);
      // Convert BLOB to base64
      results[0].forEach(result => {
        if (result.photo) {
          result.photo = Buffer.from(result.photo).toString('base64');
        }
      });
      cb(null, results);
    });
  },
  storeStatus: (stationId, cb) => {
    let day = new Date();
    let hours = day.getHours();
    let minutes = day.getMinutes();
    let week = day.getDay();
    let query = "";
    let params = [];
    console.log(stationId.isChecked)
    if (stationId.isChecked === "true" ) {
      query = `SELECT * FROM coffee_and_mrt.coffee, coffee_and_mrt.close, coffee_and_mrt.open, coffee_and_mrt.shop_at_mrt 
               WHERE coffee_and_mrt.shop_at_mrt.station_id = ? AND coffee_and_mrt.shop_at_mrt.place_id = coffee_and_mrt.coffee.place_id 
                 AND coffee_and_mrt.coffee.place_id = coffee_and_mrt.close.place_id 
                 AND coffee_and_mrt.coffee.place_id = coffee_and_mrt.open.place_id 
                 AND coffee_and_mrt.close.day = ? 
                 AND coffee_and_mrt.close.hour > ? 
                 AND coffee_and_mrt.open.day = ? 
                 AND coffee_and_mrt.open.hour < ?;`;
                 params=[stationId.stationId,week,hours,week,hours];
    } else if (stationId.isChecked === "false" ) {
      query = `SELECT * FROM coffee_and_mrt.coffee, coffee_and_mrt.shop_at_mrt 
               WHERE coffee_and_mrt.shop_at_mrt.station_id = ? AND coffee_and_mrt.shop_at_mrt.place_id = coffee_and_mrt.coffee.place_id;`;
               params=[stationId.stationId];
    }

    db.query(query, params, (err, results) => {
      if (err) return cb(err);
      // Convert BLOB to base64
      results.forEach(result => {
        if (result.photo) {
          result.photo = Buffer.from(result.photo).toString('base64');
        }
      });
      cb(null, results);
    });
  },
  getCoffeeWithId: (stationId, cb) => {
   
    console.log(stationId.stationId);
    db.query(`SELECT * FROM coffee_and_mrt.coffee, coffee_and_mrt.shop_at_mrt 
    WHERE coffee_and_mrt.coffee.place_id=coffee_and_mrt.shop_at_mrt.place_id AND  coffee_and_mrt.shop_at_mrt.station_id=?;`, stationId.stationId, (err, results) => {
      if (err) return cb(err);
      // Convert BLOB to base64
      results.forEach(result => {
        if (result.photo) {
          result.photo = Buffer.from(result.photo).toString('base64');
        }
      });
      cb(null, results);
    });
  }
};

module.exports = coffeeModel;
