export default class Airport {
    constructor() {
        /**
         * IATA code (eg. "ADL")
         *
         * @type {string|null}
         */
        this.iata = null;

        /**
         * ICAO code (eg. "YPAD")
         *
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {string|null}
         */
        this.icao = null;

        /**
         * Timezone (eg. "Australia/Adelaide")
         *
         * @type {string}
         */
        this.timezone = undefined;

        /**
         * Airport name.
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {string|null}
         */
        this.name = null;

        /**
         * Latitude.
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {number|null}
         */
        this.latitude = null;

        /**
         * Longitude.
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {string|null}
         */
        this.longitude = null;

        /**
         * Country name.
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {string|null}
         */
        this.country = null;

        /**
         * City name.
         *
         * **Warning:** *Not available on origin for departing flights, or destination on arriving flights.*
         *
         * @type {string|null}
         */
        this.city = null;
    }

    static fromData(data) {
        if (!data) return null;

        let airport = new Airport();

        airport.iata = data.code?.iata;
        airport.icao = data.code?.icao;
        airport.timezone = data.timezone?.name;
        airport.name = data.name;
        airport.latitude = data.position?.latitude;
        airport.longitude = data.position?.longitude;
        airport.country = data.position?.country?.name;
        airport.city = data.position?.region?.city;

        return airport;
    }

    toString() {
        return this.iata;
    }
}