var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_zero = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const account_three = accounts[3];

    describe('match erc721 spec', function() {
        beforeEach(async function() {
            this.contract = await ERC721MintableComplete.new({ from: account_zero });
            await this.contract.mint(account_one, 101, { from: account_zero });
            await this.contract.mint(account_one, 102, { from: account_zero });
            await this.contract.mint(account_two, 103, { from: account_zero });
            await this.contract.mint(account_three, 104, { from: account_zero });
        })

        it('should return total supply', async function() {
            const supply = await this.contract.totalSupply();
            assert.equal(supply.toNumber(), 4, "Invalid supply");
        })

        it('should get token balance', async function() {
            const balance = await this.contract.balanceOf(account_one);
            assert.equal(balance.toNumber(), 2, "Invalid balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function() {
            const tokenURI = await this.contract.tokenURI(102, { from: account_one });
            const expectedURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/102';
            assert.equal(tokenURI, expectedURI);
        })

        it('should transfer token from one owner to another', async function() {
            await this.contract.transferFrom(account_one, account_two, 102, { from: account_one });
            const accountOneBalance = await this.contract.balanceOf.call(account_one);
            const accountTwoBalance = await this.contract.balanceOf.call(account_two);
            const tokenOwner = await this.contract.ownerOf.call(102);
            assert.equal(accountOneBalance.toNumber(), 1, "Invalid sender balance");
            assert.equal(accountTwoBalance.toNumber(), 2, "Invalid receiver balance");
            assert.equal(tokenOwner, account_two, "Invalid owner of token");
        })
    });

    describe('have ownership properties', function() {
        beforeEach(async function() {
            this.contract = await ERC721MintableComplete.new({ from: account_zero });
        })

        it('should fail when minting when address is not contract owner', async function() {
            let mintStatus = false;
            try {
                await this.contract.mint(account_one, 101, { from: account_two });
            } catch (error) {
                mintStatus = true;
            }
            assert.equal(mintStatus, true, "Invalid minting");
        })

        it('should return contract owner', async function() {
            const contractOwner = await this.contract.owner();
            assert.equal(contractOwner, account_zero, 'Invalid contract owner');
        })

    });
})