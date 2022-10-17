# Blergs V2 Proof of Concept

Contract work for @blergsDAO

**TraitsNFT** - Multi-use NFT item system that facilitates third party projects to build with. e.g A shared *game inventory.* 

**Blergs V2** - PFP character creator using the traits system. Artwork does not necessarily reflect that of traits. TraitsNFT is used as an *inventory* where individual traits can be  selected then represented by Bergs (or another third party project) in a unique way.

- *Web (Uses a sign transaction flow to update traits)*
- *Direct (Registers and calls a function in third party contract)*
- *Staking (Stake/Unstake on Traits contract - check staked status from third-paty contract)*

Interface deployed to Vercel - [https://blerg-v2-mvp.vercel.app](https://blerg-v2-mvp.vercel.app)

## Contracts 
These contracts are for research/ideation purposes only and should not be considerd production ready. Not gas optimised. No permissions. 

Contracts are deployed on Goerli
- Blergs - 0x065dCEA8d4B7C6337802d293bEFA79020be64fF4
- Blergs Staking - 0x5f007Ae68b2D456f9eaa7d51431D48514F230ec2
- Blergs Web - 0x3C1fFa7FbFAbefA76528B8669bC9004ce569A708
- Traits - 0x816d9a9e7D384b5fa6F47e82b62cBFB051CBf71a
- Traits Staking - 0x08E281361FD34aF8Af4BfBd3C81B871C5C4178B7


### Blergs (Direct)

```function onTraitTransfer(address from, uint256[] memory traitIds)```

Purpose is to restrict sending of Blergs with traits but functionality could be extended within this function

    - Called from Traits contract directly within `onSafeTransfer`
    - Checks if traits on in use on senders blergs 
    - Resets blerg to default artwork reference if resulting balance of send would be zero
    - Loop is inefficient and should be reconsidered 

```function setTraits(uint256 tokenId, uint256[] calldata traits)```
Stores a reference for each trait used on each Blerg within the contract. 
Builds an Artwork reference which should match a URI stored on IPFS. e.g uri://ipfshash/1_2_3_4_5 
`registerAddress` - stores this contract for the sender to later call the `onTraitTransfer`


```function mintWithTraits(uint256[] calldata traits)```
    Mints Token and calls `setTraits`

#### Notes 
*Override* ```_beforeTokenTransfer```


### Blergs Staking
```tokenURI(uint256 tokenId) public view virtual override returns (string memory) ```
Token URI Override - checks the owner of token has the required tokens staked (incase they have been unstaked since building the blerg) 
Creates the Artwork reference on read, shows a default uri if tokens ar enot staked

```function setTraits(uint256 tokenId, uint256[5] calldata traits)```
Calls the traits contract checking for `staked` traits


### Blergs Web
```mintBlank()``` 
Only mints a blank blerg - Traits are sent via the switch Trait signed message functionality (vercel api)


### Traits 
Barebones 1155 for testing idea for linking ontract. Traits uses a direct link. Third Party contract call `registerAddress`. `onTraitTransfer` calls `onTraitTransfer` in the registed contract.

```function registerAddress(address contractAddress, address user)```
Sets a third party contract to call `onTraitTransfer` - each user maintains their own list of linked contracts. Gas issues need to be considered on large lists of linked projects calling unknown functions in other contracts. 


### Traits Staking
```function stake(uint256 id) function unstake(uint256 id)```
Non-Escrow Stake/Unstake functionality - restricts transfer while 'staked'. Does not directly link to external contracts.
    

## Front-end

React/Next.js App

/Rainbow Kit
/Wagmi 

Contains a minimal interface for three versions 
    - Web (Uses a sign transaction for to update traits)
    - Direct (Registers and calls a function in third party contract)
    - Staking (Stake/Unstake on Traits contract - check staked status from third-paty contract)

Flow is described on each interface page - [https://blerg-v2-mvp.vercel.app](https://blerg-v2-mvp.vercel.app). There is no error handling - see console for errors


## API
- Metadata Endpoint `/api/blerg/[id]`
Returns Json Metadata used by Wallet/Marketplace. Stored on an external databse.
```
{
    "name": `Blerg #${id}`,
    id: id
    "description": `Friendly Blerg Information `, 
    "external_url": `https://blergaversev2.io/${id}`, 
    "image": `https://blerg-v2-mvp.vercel.app/api/svg/${id}`, 
    attributes: [...]
  }
```

#### Database schema

| ID (Unique)| Traits | blergId|
| ----------- | ----------- | ----------- |
| int8      | Varchar       |int8 |

- dnyamic SVG Enpoint `/api/svg/[id]`
Returns an example Image that represents the Traits used to build the blerg