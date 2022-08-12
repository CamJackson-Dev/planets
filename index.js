const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// Readable.pipe(writeable) example:

// Read raw data in file
fs.createReadStream("kepler_data.csv")
  // connects a readbale stream source(kepler_data.csv)
  //to a writeable stream destination (pipe)
  .pipe(
    // parse csv data
    parse({
      // option to set comment Character
      comment: "#",
      // return each row in CSV file as a JS object with key:value pairs
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
