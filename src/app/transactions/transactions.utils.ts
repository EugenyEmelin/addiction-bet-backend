import { DepositContractABI } from '../../config';
import { ethers, Wallet } from 'ethers';
import { Web3 } from 'web3';
import { DEFAULT_PROVIDER } from '../../constants/resources.const';

export function getDepositContractInstance(contractAddress: string) {
  const provider = ethers.getDefaultProvider();
  console.log(provider, 'ethers.getDefaultProvider()');
  const web3 = new Web3(DEFAULT_PROVIDER);
  const mnemonicWallet = web3.eth.accounts.create();
  console.log(mnemonicWallet, 'mnemonicWallet');
  const signer = new Wallet(mnemonicWallet.privateKey, provider);
  return new web3.eth.Contract(DepositContractABI, contractAddress, {
    from: signer.address,
  });
}

// async function depositTokens(amount) {
//   const contractInstance = getDepositContractInstance(DepositContract);
//   const tx = await contractInstance.populateTransaction.depositToken(amount);
//
//   let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//
//   window.ethereum
//     .request({
//       method: 'eth_sendTransaction',
//       params: [
//         {
//           from: accounts[0],
//           to: tx.to,
//           data:  tx.data,
//           value: "0x0"
//         },
//       ],
//     })
//     .then((txHash) => {
//       console.log("txHash", txHash)
//     });
// }
