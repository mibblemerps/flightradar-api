import Flightradar from './Flightradar/Flightradar.js';

let radar = new Flightradar();

// Get ADL arrivals
radar.arrivals('ADL', new Date(2023, 0, 30)).then((flights) => {
    for (let flight of flights) {
        console.log(`Flight ${flight.number} (${flight.status})\t
        STA ${flight.scheduledArrival?.toLocaleTimeString()}\t
        ETA ${flight.estimatedArrival?.toLocaleTimeString()}\t
        ${flight.origin.iata} -> ${flight.destination.iata}`);
    }
});
