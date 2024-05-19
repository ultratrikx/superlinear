const { parseNearAmount } = require("@near-js/utils");
const { KeyPair } = require("@near-js/crypto")
const { UnencryptedFileSystemKeyStore } = require("@near-js/keystores-node");
const { InMemoryKeyStore } = require("@near-js/keystores")
const { Near } = require("@near-js/wallet-account");
const { Account } = require("@near-js/accounts");
const path = require("path");
const homedir = require("os").homedir();
console.log(homedir)


// creates keyStore from a private key string
// you can define your key here or use an environment variable

// const { keyStores } = nearAPI;


async function fcDropNear(){
	// Initiate connection to the NEAR blockchain.
	const network = "testnet"
	const CREDENTIALS_DIR = ".near-credentials";
	//const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);
	const credentialsPath = path.join(__dirname, '.near-credentials');
	console.log(credentialsPath)
	const YOUR_ACCOUNT = "vendo_super.testnet";
	const NFT_TOKEN_ID = "near-api-token-" + Date.now().toString();
	const NFT_CONTRACT = "vendo.mintspace2.testnet";
	const KEYPOM_CONTRACT = "v2.keypom.testnet"

	const myKeyStore = new InMemoryKeyStore();
	const PRIVATE_KEY =
	  "32P5csXxqbw6rZRDX9wRsHfzCiG86nDN5zXpo8FyAKriCgyB97naSXsZo1Upo5RnXb71ZV3ZSiXggVfB69GWgSaL";
	// creates a public / private key pair using the provided private key

	const keyPair = KeyPair.fromString(PRIVATE_KEY);
	// adds the keyPair you created to keyStore
	// let keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);
	await myKeyStore.setKey("testnet", "vendo_super.testnet", keyPair);

	let nearConfig = {
	    networkId: network,
	    keyStore: myKeyStore,
	    nodeUrl: `https://rpc.${network}.near.org`,
	    walletUrl: `https://wallet.${network}.near.org`,
	    helperUrl: `https://helper.${network}.near.org`,
	    explorerUrl: `https://explorer.${network}.near.org`,
	};

	let near = new Near(nearConfig);
	const fundingAccount = new Account(near.connection, YOUR_ACCOUNT);

	// Keep track of an array of the keyPairs we create and the public keys to pass into the contract
	let keyPairs = [];
	let pubKeys = [];
	// Generate keypairs and store them into the arrays defined above
	let keyPair2 = await KeyPair.fromRandom('ed25519'); 
	keyPairs.push(keyPair2);   
	pubKeys.push(keyPair2.publicKey.toString());   


	// Create FC drop with pubkkeys from above and fc data
	// Note that the user is responsible for error checking when using NEAR-API-JS
	// The SDK automatically does error checking; ensuring valid configurations, enough attached deposit, drop existence etc.
	try {
		// With our function call for this drop, we wish to allow the user to lazy mint an NFT
		await fundingAccount.functionCall({
			contractId: KEYPOM_CONTRACT, 
			methodName: 'create_drop', 
			args: {
				public_keys: pubKeys,
				deposit_per_use: parseNearAmount("0.1"),
				fc: {
					// 2D array of function calls. In this case, there is 1 function call to make for a key use
					// By default, if only one array of methods is present, this array of function calls will be used for all key uses
				    methods: [
				    	// Array of functions for Key use 1. 
				    	[{
				    	    receiver_id: NFT_CONTRACT,
				    	    method_name: "nft_batch_mint",
				    	    args: JSON.stringify({
	                		        // token_id: NFT_TOKEN_ID,
	                		        metadata: {
				    	            title: "Dominos Free Pizza",
				    	            reference: "V32iTwBxcRF6QAjpZuvEpwESbVtx-DapGrkFSF9SxW8",
				    	            media: "https://www.ctvnews.ca/polopoly_fs/1.6021456.1660142637!/httpImage/image.jpg_gen/derivatives/landscape_1020/image.jpg",
				    	        },
								num_to_mint: 1,
								royalty_args: null,
								token_ids_to_mint: null,
								split_owners: null

				    	    }),
							account_id_field: "owner_id",
				    	    // Attached deposit of 1 $NEAR for when the receiver makes this function call
				    	    attached_deposit: parseNearAmount("1"),
				    	}]
				    ]
				}
			}, 
			gas: "300000000000000",
			// Attcned depot of 1.5 $NEAR for creating the drop
			attachedDeposit: parseNearAmount("1.5")
		});
	} catch(e) {
		console.log('error creating drop: ', e);
	}

	var dropInfo = {};
    	// Creating list of pk's and linkdrops; copied from orignal simple-create.js
    	for(var i = 0; i < keyPairs.length; i++) {
		// For keyPairs.length > 1, change URL secret key to keyPair.secretKey[i]
	    let linkdropUrl = `https://testnet.mynearwallet.com/linkdrop/${KEYPOM_CONTRACT}/${keyPairs[i].secretKey}`;
	    dropInfo[pubKeys[i]] = linkdropUrl;
	}
	// Write file of all pk's and their respective linkdrops
	console.log('Public Keys and Linkdrops: ', dropInfo)
	console.log(`Keypom Contract Explorer Link: explorer.${network}.near.org/accounts/${KEYPOM_CONTRACT}.com`)
}
fcDropNear()
