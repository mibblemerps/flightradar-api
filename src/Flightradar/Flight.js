import Aircraft from './Aircraft.js';
import Operator from './Operator.js';
import Status from './Status.js';
import Airport from './Airport.js';
import Gate from './Gate.js';

export default class Flight {
    /**
     * @param {object} data
     * @param {string} defaultIata
     */
    constructor(data = null, defaultIata = null) {
        /**
         * Flightradar's ID for this flight.
         *
         * @type {string}
         */
        this.id = undefined;

        /**
         * Flight number for this flight.
         *
         * @type {string|null}
         */
        this.number = null;

        /**
         * Alternate flight number for this flight.
         *
         * @type {string|null}
         */
        this.numberAlt = null;

        /**
         * Aircraft callsign.
         *
         * @type {string|null}
         */
        this.callsign = null;

        /**
         * Flight code shares.
         *
         * @type {string[]}
         */
        this.codeshare = [];

        /**
         * Departing airport. If this is a departure, the origin airport will have limited information.
         *
         * @type {Airport|null}
         */
        this.origin = null;

        /**
         * Destination airport. If this is an arrival, the destination airport will have limited information.
         *
         * @type {Airport|null}
         */
        this.destination = null;

        /**
         * Gate the plane will/has departed from.
         *
         * @type {Gate}
         */
        this.departGate = null;

        /**
         * Gate the plane will/has arrived to.
         *
         * @type {Gate}
         */
        this.arrivalGate = null;

        /**
         * Aircraft details.
         *
         * @type {Aircraft}
         */
        this.aircraft = null;

        /**
         * @type {Operator}
         */
        this.airline = null;

        /**
         * @type {Operator}
         */
        this.owner = null;

        /**
         * Flight status information.
         *
         * @type {Status}
         */
        this.status = null;

        /**
         * Schedule time of arrival in local (our) time.
         *
         * @type {Date|null}
         */
        this.scheduledArrival = null;

        /**
         * Scheduled time of departure in local (our) time.
         * @type {Date|null}
         */
        this.scheduledDeparture = null;

        /**
         * Actual time of arrival in local (our) time.
         *
         * @type {Date|null}
         */
        this.actualArrival = null;

        /**
         * Actual time of departure in local (our) time.
         *
         * @type {Date|null}
         */
        this.actualDeparture = null;

        /**
         * Estimated time of arrival in local (our) time.
         *
         * @type {Date|null}
         */
        this.estimatedArrival = null;

        /**
         * Estimated time of departure in local (our) time.
         *
         * @type {null}
         */
        this.estimatedDeparture = null;

        if (data) {
            this.id = data.identification.id;
            this.number = data.identification.number?.default;
            this.numberAlt = data.identification.number?.alternative;
            this.callsign = data.identification.callsign;
            this.codeshare = data.identification.codeshare ?? [];

            this.status = Status.fromData(data.status);

            this.origin = Airport.fromData(data.airport.origin);
            this.destination = Airport.fromData(data.airport.destination);

            this.departGate = Gate.fromData(data.airport?.origin?.info);
            this.arrivalGate = Gate.fromData(data.airport?.destination?.info);

            if (data.aircraft) this.aircraft = Aircraft.fromData(data.aircraft);
            if (data.airline) this.airline = Operator.fromData(data.airline);
            if (data.owner) this.owner = Operator.fromData(data.owner);

            this.scheduledDeparture = Flight._parseTimestamp(data.time.scheduled?.departure);
            this.scheduledArrival = Flight._parseTimestamp(data.time.scheduled?.arrival);
            this.actualDeparture = Flight._parseTimestamp(data.time.real?.departure);
            this.actualArrival = Flight._parseTimestamp(data.time.real?.arrival);
            this.estimatedDeparture = Flight._parseTimestamp(data.time?.estimated.departure);
            this.estimatedArrival = Flight._parseTimestamp(data.time?.estimated.arrival);

            if (defaultIata) {
                // Fix from/to airport
                if (this.origin.iata && !this.destination.iata) {
                    // Arrival
                    this.destination.iata = defaultIata;
                } else if (this.destination.iata && !this.origin.iata) {
                    // Departure
                    this.origin.iata = defaultIata;
                }
            }
        }
    }

    logoUrl() {
        return this.owner?.logoUrl();
    }

    /**
     * @param {string|number|null} timestamp
     * @return {Date|null}
     * @private
     */
    static _parseTimestamp(timestamp) {
        if (!timestamp) return null;
        return new Date(parseInt(timestamp) * 1000);
    }
}