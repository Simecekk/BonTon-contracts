import * as donton from "../contracts/donton";
import { Address, toNano, TupleSlice, WalletContract } from "ton";
import { sendInternalMessageWithWallet } from "../test/helpers";

// return the init Cell of the contract storage (according to load_data() contract method)
export function initData() {
  return donton.data({
    ownerAddress: Address.parseFriendly("EQBXQukWKQhNhK80-Sdp0mEpGuqWfDTLuUo7VijeV92iHp37").address,
    player_counter: 0,
    playing: 0
  });
}

// return the op that should be sent to the contract on deployment, can be "null" to send an empty message
export function initMessage() {
  return donton.register();
}

// optional end-to-end sanity test for the actual on-chain contract to see it is actually working on-chain
export async function postDeployTest(walletContract: WalletContract, secretKey: Buffer, contractAddress: Address) {
  const call = await walletContract.client.callGetMethod(contractAddress, "player_counter");
  const counter = new TupleSlice(call.stack).readBigNumber();

  const message = donton.register();
  await sendInternalMessageWithWallet({ walletContract, secretKey, to: contractAddress, value: toNano(1), body: message });

  const call2 = await walletContract.client.callGetMethod(contractAddress, "player_counter");
  const counter2 = new TupleSlice(call2.stack).readBigNumber();
}
