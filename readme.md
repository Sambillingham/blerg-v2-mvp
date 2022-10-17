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

## Integrating with Traits Contract (Examples)

### Blergs (Direct)

```function onTraitTransfer(address from, uint256[] memory traitIds)```
Include this function in a third Party contract as with Blergs to integrate directly with Traits and action callbacks on Trait Transfers. Within Traits/Blergs this sets artwork to default when selling/sending Traits that are in use. Functionality can be extended within this function as needed.

- Called from Traits contract directly within `onSafeTransfer`
- Checks if trait is in use on senders blergs 
- Resets blerg to default artwork reference if resulting balance of send would be too low

*Loop is inefficient and could cause issues at scale *

```function setTraits(uint256 tokenId, uint256[] calldata traits)```
Stores a reference for each trait used on each Blerg within the contract. 
Builds an Artwork reference which should match a URI stored on IPFS. e.g uri://ipfshash/1_2_3_4_5 
`registerAddress` - stores this contract for the sender to later call the `onTraitTransfer`


```function mintWithTraits(uint256[] calldata traits)```
    Mints Token and calls `setTraits`

#### Notes 
*Override* ```_beforeTokenTransfer``` - to reset the artwork on Transfer.


### Blergs Staking
```tokenURI(uint256 tokenId) public view virtual override returns (string memory) ```
Token URI Override - checks the owner of token has the required tokens staked (incase they have been unstaked since building the blerg) 
Creates the Artwork reference on read, shows a default uri if tokens ar enot staked

```function setTraits(uint256 tokenId, uint256[5] calldata traits)```
Calls the traits contract checking for `staked` traits


### Blergs Web
```mintBlank()``` 
Only mints a blank blerg - Traits are sent via the switch Trait signed message functionality (see front-end interface)


### Traits Direct Interface
Barebones 1155 for testing idea for linking ontract. Traits uses a direct link. Third Party contract call `registerAddress`. `onTraitTransfer` calls `onTraitTransfer` in the registed contract.

```function registerAddress(address contractAddress, address user)```
Sets a third party contract to call `onTraitTransfer` - each user maintains their own list of linked contracts. Gas issues need to be considered on large lists of linked projects calling unknown functions in other contracts. 


### Traits Staking
```function stake(uint256 id) function unstake(uint256 id)```
Non-Escrow Stake/Unstake functionality - restricts transfer while 'staked'. Does not directly link to external contracts. Thirs party contracts are expected to call `staked(unint256 id)` as needed.

## Contract Tests
```
run hardhat test
```
*Expected Output*
```
 Blergs
    ✓ Should return uri with 0000 for a new blank blergs
    ✓ Should return uri with relevant traits
    ✓ Should swap 5 traits
    ✓ Transfer Blergs (without Traits) - Should be a blank Blerg after Transfer 
    ✓ Transfer Blergs (with Traits) - Should be a blank Blerg after Transfer 
    ✓ Transfer Trait (used on Blerg) - Should disable/default any blergs with trait transfered
    ✓ Transfer Trait (NOT used on Blerg) - Should not change blergs

  Blergs Staking
    ✓ Should mint 10 traits
    ✓ Should stake 1 trait
    ✓ Should unstake 1 traits
    ✓ Should fail to transfer a staked Trait
    ✓ Should transfer a  Trait
    ✓ Should switch 3 Traits from staked
    ✓ Should mint a blerg with 3 Traits from staked
    ✓ Unstaking used traits should return blank uri URI 
    ✓ Transfer Blergs (with Traits) - Should be a blank Blerg after Transfer 
```

    
## Front-end

React/Next.js App
/Rainbow Kit -  [http://rainbowkit.com](http://rainbowkit.com)
/Wagmi React Hooks - [http://wagmi.sh](http://wagmi.sh)

Contains a minimal interface for three versions 
    - Web (Uses a sign transaction for to update traits)
    - Direct (Registers and calls a function in third party contract)
    - Staking (Stake/Unstake on Traits contract - check staked status from third-paty contract)

Flow is described on each interface page - [https://blerg-v2-mvp.vercel.app](https://blerg-v2-mvp.vercel.app). There is no error handling - see console for errors

```
.env.local
// Local
NEXT_PUBLIC_URL="http://localhost:3000"

```

```
npm run dev
```

## API
- Metadata Endpoint `/api/blerg/[id]`
Returns Json Metadata used by Wallet/Marketplace. Stored on an external supabase databse.
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


```
.env
SUPABASE_SERVICE_API_KEY=
DATABASE_URL=
```


- dnyamic SVG Enpoint `/api/svg/[id]`
Returns an example Image that represents the Traits used to build the blerg

![svg](https://blerg-v2-mvp.vercel.app/api/svg/0)



## Gas Ouputs
Should be considereds as an estimate only. Likely to be higher as final versions will include addition features and checks for permissions etc.

```
·--------------------------------------|---------------------------|--------------|-----------------------------·
         Solc version: 0.8.17         ·  Optimizer enabled: true  ·  Runs: 1000  ·  Block limit: 30000000 gas  │
·······································|···························|··············|······························
|  Methods                             ·               51 gwei/gas                ·       1325.79 usd/eth       │
··················|····················|·············|·············|··············|···············|··············
|  Contract       ·  Method            ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
··················|····················|·············|·············|··············|···············|··············
|  Blergs         ·  mint              ·          -  ·          -  ·      148186  ·            8  ·      10.02  │
··················|····················|·············|·············|··············|···············|··············
|  Blergs         ·  mintWithTraits    ·          -  ·          -  ·      383511  ·            6  ·      25.93  │
··················|····················|·············|·············|··············|···············|··············
|  Blergs         ·  safeTransferFrom  ·      73413  ·      76213  ·       74813  ·            2  ·       5.06  │
··················|····················|·············|·············|··············|···············|··············
|  Blergs         ·  setTraits         ·          -  ·          -  ·      264458  ·            2  ·      17.88  │
··················|····················|·············|·············|··············|···············|··············
|  Blergs         ·  setTraitsAddress  ·          -  ·          -  ·       43946  ·            5  ·       2.97  │
··················|····················|·············|·············|··············|···············|··············
|  BlergsStaking  ·  mintWithTraits    ·          -  ·          -  ·      283309  ·            8  ·      19.16  │
··················|····················|·············|·············|··············|···············|··············
|  BlergsStaking  ·  safeTransferFrom  ·          -  ·          -  ·       73435  ·            1  ·       4.97  │
··················|····················|·············|·············|··············|···············|··············
|  BlergsStaking  ·  setTraits         ·          -  ·          -  ·       86351  ·            2  ·       5.84  │
··················|····················|·············|·············|··············|···············|··············
|  BlergsStaking  ·  setTraitsAddress  ·      43912  ·      43924  ·       43921  ·            4  ·       2.97  │
··················|····················|·············|·············|··············|···············|··············
|  Traits         ·  mintBatch         ·          -  ·          -  ·      263641  ·            5  ·      17.83  │
··················|····················|·············|·············|··············|···············|··············
|  Traits         ·  safeTransferFrom  ·      81907  ·      92999  ·       87453  ·            2  ·       5.91  │
··················|····················|·············|·············|··············|···············|··············
|  TraitsStaking  ·  mintBatch         ·          -  ·          -  ·      288500  ·            8  ·      19.51  │
··················|····················|·············|·············|··············|···············|··············
|  TraitsStaking  ·  safeTransferFrom  ·          -  ·          -  ·       54493  ·            1  ·       3.68  │
··················|····················|·············|·············|··············|···············|··············
|  TraitsStaking  ·  stake             ·      45067  ·      45079  ·       45076  ·           26  ·       3.05  │
··················|····················|·············|·············|··············|···············|··············
|  TraitsStaking  ·  unstake           ·          -  ·          -  ·       23173  ·            2  ·       1.57  │
```