export default class Gate {
    constructor() {
        /**
         * @type {string|null}
         */
        this.gate = null;

        /**
         * @type {string|null}
         */
        this.terminal = null;

        /**
         * @type {string|null}
         */
        this.baggage = null;
    }

    /**
     * @param data
     * @return {Gate}
     */
    static fromData(data) {
        if (!data || !data.gate) return null;

        let gate = new Gate();
        gate.gate = data.gate;
        gate.terminal = data.terminal;
        gate.baggage = data.baggage;
        return gate;
    }
}