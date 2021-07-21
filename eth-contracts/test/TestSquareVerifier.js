const Verifier = artifacts.require('Verifier');
const { proof, inputs } = require('../../zokrates/code/square/proof.json');

contract('TestSquareVerifier', accounts => {
    const owner = accounts[0];
    describe('Test verification with correct proof', () => {
        beforeEach(async() => {
            this.contract = await Verifier.new({ from: owner });
        })

        // Test verification with correct proof
        it('Verificatons with correct proof succeeds', async() => {
            expect(await this.contract.verifyTx.call(proof.a, proof.b, proof.c, inputs)).to.be.true;
        })

        // Test verification with incorrect proof
        it('Verificatons with incorrect proof succeeds', async() => {
            expect(await this.contract.verifyTx.call(proof.a, proof.b, proof.c, [555, 666])).to.be.false;
        })
    })
})