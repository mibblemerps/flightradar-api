import axios from 'axios';
import Flight from './Flight.js';

export default class Flightradar {
    constructor() {
        this.axios = axios.create({
            baseURL: 'https://api.flightradar24.com/',
            timeout: 4000,
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.flightradar24.com',
                'Referer': 'https://www.flightradar24.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.77'
            }
        });
    }

    /**
     * Get arrivals for a given airport within a timeframe.
     *
     * @param {string} iata Airport IATA code (eg. ADL)
     * @param {Date} from Only show flights arriving after this date/time. Defaults to start of today.
     * @param {Date} to Only show flights arriving before this date/time. Defaults to end of today.
     * @return {Promise<Flight[]>}
     */
    async arrivals(iata, from = null, to = null) {
        return await this._schedule(iata, from, to, true);
    }

    /**
     * Get departures for a given airport within a timeframe.
     *
     * @param {string} iata Airport IATA code (eg. ADL)
     * @param {Date} from Only show flights departing after this date/time. Defaults to start of today.
     * @param {Date} to Only show flights departing before this date/time. Defaults to end of today.
     * @return {Promise<Flight[]>}
     */
    async departures(iata, from = null, to = null) {
        return await this._schedule(iata, from, to, false);
    }

    /**
     * @param {string} iata
     * @param {Date} from
     * @param {Date} to
     * @param {boolean} arrivals True for arrivals, false for departures
     * @return {Promise<Flight[]>}
     */
    async _schedule(iata, from = null, to = null, arrivals = true) {
        if (!from) {
            from = new Date();
            from.setHours(0, 0, 0);
        }
        if (!to) {
            to = new Date();
            to.setHours(23, 59, 59);
        }

        if (from > to) {
            throw new Error('From date is after to date');
        }

        /** @type {Flight[]} */
        let flights = [];

        let toFromAttrib = arrivals ? 'scheduledArrival' : 'scheduledDeparture';

        let page = -1;
        let prevPage = null;
        while (true) {
            let schedule = await this._schedulePage(iata, page, arrivals);
            if (schedule.flights.length === 0) break; // no more flights
            if (prevPage && schedule.flights[0].id === prevPage[0].id) break; // duplicate page, no more flights
            prevPage = schedule.flights;
            for (let flight of schedule.flights) {
                if (flight[toFromAttrib] >= from) {
                    flights.push(flight);
                } else {
                    page = null; // no more api requests needed
                    break; // gone back far enough
                }
            }

            if (!page) break;
            page--; // previous page
        }

        page = 1;
        while (true) {
            let schedule = await this._schedulePage(iata, page, arrivals);
            if (schedule.flights.length === 0) break; // no more flights

            for (let flight of schedule.flights) {
                if (flight[toFromAttrib] <= to) {
                    flights.push(flight);
                } else {
                    page = null; // no more api requests needed
                    break; // gone back far enough
                }
            }

            if (!page) break;
            if (schedule.page === schedule.totalPages) break; // no more pages
            page++; // next page
        }

        // Try to fix logos using cache
        for (let flight of flights) {
            flight.owner?.tryGetLogoFromCache();
            flight.airline?.tryGetLogoFromCache();
        }

        return flights.sort((a, b) => {
            if (a[toFromAttrib] < b[toFromAttrib]) return -1;
            if (a[toFromAttrib] > b[toFromAttrib]) return 1;
            return 0;
        });
    }

    /**
     * Get arrivals for a given airport.
     *
     * @param {string} iata Airport IATA code (eg. ADL)
     * @param {number} page
     * @param {boolean} arrivals True for arrivals, false for departures
     * @return {Promise<{}>}
     */
    async _schedulePage(iata, page, arrivals) {
        let timestamp = Math.floor(Date.now() / 1000);
        let resp = await this.axios.get(`/common/v1/airport.json?code=${iata.toLowerCase()}&plugin[]=schedule&plugin-setting[schedule][mode]=${(arrivals ? 'arrivals' : 'departures')}&plugin-setting[schedule][timestamp]=${timestamp}&page=${page}&limit=100&token=`);
        let scheduleObj = resp.data.result.response.airport.pluginData.schedule[arrivals ? 'arrivals' : 'departures'];

        let flights = [];
        for (let flightJson of scheduleObj['data']) {
            flights.push(new Flight(flightJson['flight'], iata));
        }

        return {
            flights: flights,
            page: scheduleObj.page.current,
            totalPages: scheduleObj.page.total
        };
    }
}