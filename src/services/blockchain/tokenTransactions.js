import {
	jsonFileToKeys,
} from './utils/jsonFileToKeys.js'
import {
	validateAddress
} from './validators/base-validators';
import {
	validateLocBalance
} from './validators/token-validators';
import {
	LOCTokenContract
} from './config/contracts-config.js'
import {
	signTransaction
} from './utils/signTransaction.js'
import {
	web3
} from './config/contracts-config.js';
const gasConfig = require('./config/gas-config.json');
const errors = require('./config/errors.json');

export class TokenTransactions {

	static async sendTokens(jsonObj, password, recipient, amount) {
		validateAddress(recipient, errors.INVALID_ADDRESS);
		
		let result = jsonFileToKeys(jsonObj, password);

		let callOptions = {
			from: result.address,
			gas: gasConfig.transferTokens,
		}

		// TODO: Future implementation for the fund transactions
		// 	result.FundTransactionAmountTxn =
		// 	await exchangeController.fundTransactionAmountIfNeeded(
		// 		body.JSONPassPublicKey,
		// 		body.JSONPassPrivateKey
		// 	);

		// validateReceiptStatus(result.FundTransactionAmountTxn);

		await validateLocBalance(result.address, amount);

		const transferLOCMethod = LOCTokenContract.methods.transfer(recipient, amount);
		const funcData = transferLOCMethod.encodeABI(callOptions);
		const signedData = await signTransaction(
			LOCTokenContract._address,
			result.address,
			result.privateKey,
			gasConfig.transferTokens,
			funcData,
		);

		return new Promise(function (resolve, reject) {
			web3.eth.sendSignedTransaction(signedData)
				.once(
						'transactionHash', 
						transactionHash => {
							resolve({
								transactionHash
							});
						}
				)
				.once(
						'error',
						err => {
							reject({
								err
							});
						}	
				);
		});    
	};

	static async getBalances(tokenContractAddress, recipientAddress) {

		let tokenContractBalance = await LOCTokenContract.methods.balanceOf(tokenContractAddress).call()
		let recipientBalance = await LOCTokenContract.methods.balanceOf(recipientAddress).call()
		let balances = {}
		balances.tokenContractBalance = tokenContractBalance;
		balances.recipientBalance = recipientBalance;

		return balances
	}


};