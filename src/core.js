const { CircomJS } = require("@zefi/circomjs");

class CircuitSDK {
    constructor(circuitId) {
        this.circomjs = new CircomJS();
        this.circuitId = circuitId;
        this.circuit = this.circomjs.getCircuit(circuitId);
        this.compiled = false;
    }

    /**
     * Compile the circuit and prepare it for proofs
     */
    async compile() {
        await this.circuit.compile();
        this.compiled = true;
        return {
            success: true,
            outputDir: this.circuit.getOutputDIR(),
        };
    }

    /**
     * Generate a proof from dynamic inputs
     * @param {Object} inputs - input signals as { [signalName]: number }
     */
    async generateProof(inputs) {
        if (!this.compiled) throw new Error("Circuit not compiled yet. Call compile() first.");

        const proof = await this.circuit.genProof(inputs);
        return proof;
    }

    /**
     * Verify a generated proof
     * @param {Object} proof - proof object returned from generateProof
     */
    async verifyProof(proof) {
        if (!this.compiled) throw new Error("Circuit not compiled yet. Call compile() first.");

        const verified = await this.circuit.verifyProof(proof);
        return verified;
    }

    /**
     * Calculate witness for the circuit
     */
    async calculateWitness(inputs) {
        if (!this.compiled) throw new Error("Circuit not compiled yet. Call compile() first.");

        const witness = await this.circuit.calculateWitness(inputs);
        return witness;
    }

    /**
     * Check constraints for a given witness
     */
    async checkConstraints(witness) {
        if (!this.compiled) throw new Error("Circuit not compiled yet. Call compile() first.");

        const valid = await this.circuit.checkConstraints(witness);
        return valid;
    }

    /**
     * Return total constraints of the circuit
     */
    getTotalConstraints() {
        return this.circuit.getTotatlConstraints();
    }

    /**
     * Get output directory of compiled artifacts
     */
    getOutputDir() {
        return this.circuit.getOutputDIR();
    }
}

module.exports = CircuitSDK;
