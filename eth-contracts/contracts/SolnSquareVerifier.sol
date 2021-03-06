pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is CustomERC721Token {
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address provider;
    }

    // TODO define an array of the above struct
    Solution[] public solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) public uniqueSolutions;

    Verifier verifierContract;

    constructor(address _verifierContract) public {
        verifierContract = Verifier(_verifierContract);
    }

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address provider);

    // TODO Create a function to add the solutions to the array and emit the event
    function submitSolution(bytes32 key) public {
        uint256 _index = solutions.length.add(1);
        Solution memory newSolution = Solution(_index, msg.sender);
        solutions.push(newSolution);
        uniqueSolutions[key] = newSolution;
        emit SolutionAdded(_index, msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintNFT(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) 
    public 
    returns(bool) 
    {
        bytes32 solutionKey = getKey(a, b, c, input);
        require(verifierContract.verifyTx(a, b, c, input), "Proof is not valid");
        require(uniqueSolutions[solutionKey].index == 0, "Solution exists");

        submitSolution(solutionKey);

        return mint(to, tokenId);
    }

    function getKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}


  


























