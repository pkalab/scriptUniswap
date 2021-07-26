const { ChainId, Pair, Router, Fetcher, Trade, TradeType, WETH, Percent } = require('@uniswap/sdk');
const { ethers } = require('ethers');
const Web3 = require('web3')
const dotenv = require('dotenv');
dotenv.config();
const address = "wss://rinkeby.infura.io/ws/v3/b376ce5cfc87460399b1971368001a97";
const web3 = new Web3(address);
const provider = web3.currentProvider;
provider.on("connect", function () {
  console.log("Websocket Provider connection established!");
});
web3.eth.net.isListening(function(error, result) {
  if(error) {
      console.error(error);
  } else {
      console.log("Websocket Provider connection is listening. Status: " + result);
  }
});

var Contract = require('web3-eth-contract');

const mToken1 = process.argv[2];
console.log(mToken1)
const chainId = ChainId.RINKEBY;
const mToken2 = process.argv[3];
console.log(mToken2)
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GAS = process.argv[4];
const GAS_LIMIT = process.argv[5];
const MAX_BUY = process.env.MAX_BUY;
console.log(MAX_BUY)
const PUBLIC_ADDRESS =process.argv[6];
const SlIPPAGE = new Percent('50', '10000');
console.log(SlIPPAGE + "Is Slippage")
const weth = WETH[chainId];
const abi = '[ {  "inputs": [{ "internalType": "uint256",   "name": "amountIn",   "type": "uint256"  },  {      "internalType": "address[]",      "name": "path",      "type": "address[]"  }  ],   "name": "getAmountsOut",  "outputs": [    { "internalType": "uint256[]",  "name": "amounts",  "type": "uint256[]"  }  ], "stateMutability": "view", "type": "function"}, { "inputs": [  {      "internalType": "uint256",      "name": "amountIn",     "type": "uint256"  },  {     "internalType": "uint256",     "name": "amountOutMin",     "type": "uint256" },  {     "internalType": "address[]",  "name": "path","type": "address[]" }, {"internalType": "address", "name": "to","type": "address"}, {"internalType": "uint256",  "name": "deadline", "type": "uint256" }],"name": "swapExactTokensForTokens","outputs": [   {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],"stateMutability": "nonpayable","type": "function"}]'
var contractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const uniswap = new web3.eth.Contract(JSON.parse(abi), contractAddress);


const abiLiq = '[{"inputs": [ { "internalType": "address",  "name": "tokenA", "type": "address"},{ "internalType": "address", "name": "tokenB", "type": "address" },  {"internalType": "uint256","name": "amountADesired",  "type": "uint256" }, { "internalType": "uint256","name": "amountBDesired", "type": "uint256" }, {"internalType": "uint256",  "name": "amountAMin",  "type": "uint256"}, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, {  "internalType": "uint256",  "name": "deadline",  "type": "uint256" }],"name": "addLiquidity", "outputs": [ { "internalType": "uint256","name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256"},{ "internalType": "uint256","name": "liquidity", "type": "uint256"}],"stateMutability": "nonpayable", "type": "function"}]'
const uniswapLiq = new web3.eth.Contract(JSON.parse(abiLiq), contractAddress);


async function init() {
  try{
    const amountsOut = await (uniswap.methods.getAmountsOut('1000000000000', [mToken1, mToken2]).call());
    console.log(amountsOut[1])
    
    const amountOutMin = await (amountsOut[1]*(web3.utils.toBN('90')))/(web3.utils.toBN('100'));
    console.log(amountOutMin);
   
    const amountInMax = ethers.utils.parseUnits(MAX_BUY, 18);
    console.log(amountInMax + "Is amount")
  
    
    const swap = await (uniswap.methods.swapExactTokensForTokens(
    '0',
    '0',
    [mToken1, mToken2], 
    '0x7c46E201212dde685e1cDC8f0aFDe7567Aa3DAEd',
    Math.floor((Date.now() / 1000)) + 60 * 10
    ).call())


console.log(swap);
console.log(`Tx-hash: ${tx.hash}`)

const receipt = await tx.wait();

console.log(`Tx was mined in block: ${receipt.blockNumber}`);
    }
    catch(e)
    {
        console.log(e);
   
    }

  };
  init();
