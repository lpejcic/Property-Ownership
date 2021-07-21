const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const { proof, inputs } = require('../../zokrates/code/square/proof.json');
const truffleAssert = require('truffle-assertions');

contract('TestSolnSquareVerifier', accounts => {
    const owner = accounts[0];
    const account_one = accounts[1];

    // Test if a new solution can be added for contract - SolnSquareVerifier
    describe('Test if a new solution can be added for contract', () => {
        beforeEach(async() => {
            const verifier = await Verifier.new({ from: owner });
            this.contract = await SolnSquareVerifier.new(verifier.address, { from: owner });
        })

        it('should mint token for contract', async() => {
            const mintTransaction = await this.contract.mintNFT(account_one, 101, proof.a, proof.b, proof.c, inputs, { from: owner });
            truffleAssert.eventEmitted(mintTransaction, 'Transfer', (event) => {
                return event.from == owner &&
                    event.to == account_one &&
                    event.tokenId == 101;
            })
        })
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    describe('Test if an ERC721 token can be minted for contract', () => {
        beforeEach(async() => {
            const verifier = await Verifier.new({ from: owner });
            this.contract = await SolnSquareVerifier.new(verifier.address, { from: owner });
        })

        it('should mint for contract', async() => {
            let shouldBeTrue = true;
            try {
                await this.contract.mintNFT(account_one, 101, proof.a, proof.b, proof.c, inputs, { from: owner });
            } catch (error) {
                shouldBeTrue = false;
            }

            let shouldBeFalse = true;
            try {
                await this.contract.mintNFT(account_one, 102, proof.a, proof.b, proof.c, inputs, { from: owner });
            } catch (error) {
                shouldBeFalse = false;
            }

            assert.equal(shouldBeTrue, true, "Adding new solution failed");
            assert.equal(shouldBeFalse, false, "Existing solution failed");
        })
    })

})