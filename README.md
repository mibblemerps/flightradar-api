Unofficial Flightradar24 API
============================

> Use at your own risk. For official Flightradar24 data channels, see their [commercial data services](https://www.flightradar24.com/commercial-services/data-services).

This API provides detailed information on arrivals and departures at a given airport.

## Information Provided
- Flight number (including alternate and codeshares)
- Callsign
- Status (landed, departed, canceled, delayed, etc.)
- Origin/destination details
  - IATA/ICAO codes
  - Name
  - Location (lat/long, country, city)
  - Timezone
- Depart/arrival gate and terminal information
- Aircraft details
  - Model designation
  - Model name
  - Registration
- Airline/owner details
  - Name
  - IATA/ICAO codes
  - Logo
- Scheduled arrival/departure times
- Estimated arrival/departure times
- Actual arrival/departure times

## Example

This following code snippet will list all arrivals with their scheduled/estimated arrival times, and their origin IATA codes. 

```js
import Flightradar from './Flightradar/Flightradar.js';

let radar = new Flightradar();

radar.arrivals('ADL').then((flights) => {
    for (let flight of flights) {
        console.log(`Flight ${flight.number}\t
        STA ${flight.scheduledArrival?.toLocaleTimeString()}\t
        ETA ${flight.estimatedArrival?.toLocaleTimeString()}\t
        ${flight.origin.iata} -> ${flight.destination.iata}`);
    }
});
```

*(Alternatively you can use async/await)*

## Usage

### `arrivals(iata, from, to)` & `departures(iata, from, to)`

- `iata`: IATA code of the airport you are seeking arrivals/departures for.
- `from`: Only return flights that are scheduled to depart/arrive after this time.
- `to`: Only return flights that are scheduled to depart/arrive before this time.

**Returns:** Array of flights in order of scheduled depart/arrival time.



