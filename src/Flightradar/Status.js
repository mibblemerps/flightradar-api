export default class Status {
    static LANDED = 'landed';
    static SCHEDULED = 'scheduled';
    static ESTIMATED  = 'estimated';
    static DELAYED = 'delayed';
    static DEPARTED = 'departed';
    static CANCELED = 'canceled';
    static UNKNOWN = 'unknown';

    constructor(json) {
        /**
         * Flight status. Eg.  "landed", "scheduled", "estimated", "delayed", "departed", "canceled"
         *
         * @type {string}
         */
        this.status = undefined;

        /**
         * Flight type: "arrival", "departure"
         *
         * @type {string}
         */
        this.type = undefined;

        /**
         * Status text given by Flightradar
         *
         * @type {string}
         */
        this.text = undefined;

        /**
         * Is this flight's position currently being tracked by flightradar. This is not required for arrival estimates to be accurate.
         *
         * @type {boolean}
         */
        this.live = false;

        /**
         * Time this status was issued.
         *
         * @type {Date}
         */
        this.time = undefined;

        /**
         * Color Flightradar has given this status.
         *
         * @type {string}
         */
        this.color = undefined;

        if (json) {

        }

    }

    static fromData(data) {
        if (!data) return null;

        let status = new Status();

        status.status = data.generic?.status?.text;
        status.type = data.generic?.status?.type;
        status.color = data.generic?.status?.color;
        status.text = data.text;
        status.live = data.live;
        if (data.generic?.eventTime?.local) status.time = new Date(data.generic?.eventTime?.local * 1000);

        return status;
    }

    toString() {
        return this.status;
    }
}