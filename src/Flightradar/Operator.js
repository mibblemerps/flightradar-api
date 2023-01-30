export default class Operator {
    static _logoCache = {};

    constructor() {
        /**
         * @type {string}
         */
        this.name = null;

        /**
         * @type {string}
         */
        this.iata = null;

        /**
         * @type {string}
         */
        this.icao = null;

        /**
         * @type {string}
         */
        this.logo = null;
    }

    logoUrl() {
        if (!this.logo || !this.logo.startsWith('s3:')) return null;
        return 'https://cdn.flightradar24.com/assets/airlines/logotypes/' + this.logo.substr(3);
    }

    tryGetLogoFromCache() {
        if (this.logo) {
            if (this.iata) Operator._logoCache[this.iata] = this.logo;
        } else if (Operator._logoCache[this.iata]) {
            this.logo = Operator._logoCache[this.iata];
        }
    }

    /**
     * @param data
     * @return {Operator|null}
     */
    static fromData(data) {
        if (!data) return null;

        let airline = new Operator();
        airline.name = data.name;
        airline.iata = data.code?.iata ?? null;
        airline.icao = data.code?.icao ?? null;
        airline.logo = data.logo ?? null;

        // Save/load airline logo from the logo cache if possible
        airline.tryGetLogoFromCache();

        return airline;
    }
}