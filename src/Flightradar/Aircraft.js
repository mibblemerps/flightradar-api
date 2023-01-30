export default class Aircraft {
    constructor() {
        /**
         * Aircraft model code. (Eg. "73H", "B738", "A359")
         *
         * @type {string|null}
         */
        this.code = null;

        /**
         * Aircraft model name.
         *
         * @type {string|null}
         */
        this.name = null;

        /**
         * Aircraft registration.
         *
         * @type {string|null}
         */
        this.registration = null;

        /**
         * Specific use unknown.
         *
         * @type {boolean|null}
         */
        this.restricted = null;

        // this.serialNumber = null;
        // this.age = null;
    }

    /**
     * @param data
     * @return {null|Aircraft}
     */
    static fromData(data) {
        if (!data || !data.registration) return null;

        let aircraft = new Aircraft();

        if (data) {
            aircraft.code = data.model.code;
            aircraft.name = data.model.text;
            aircraft.registration = data.registration;
            aircraft.restricted = data.restricted;

            // Premium features
            /*aircraft.serialNumber = data.serialNo;
            if (data.age && data.age.years) {
                aircraft.age = new Date();
                aircraft.age.setUTCFullYear(aircraft.age.getFullYear() - data.age.years);
                if (data.age.months) aircraft.age.setUTCMonth(aircraft.age.getUTCMonth() - data.age.months);
                if (data.age.days) aircraft.age.setUTCDate(aircraft.age.getUTCDate() - data.age.days);
            }*/
        }

        return aircraft;
    }

    toString() {
        return this.registration;
    }
}