import BN from "bn.js";
import { Cell, beginCell, Address } from "ton";

// encode contract storage according to save_data() contract method
export function data(params: { ownerAddress: Address; player_counter: number; playing: number; charityAddress: Address}): Cell {
  return beginCell().storeAddress(
      params.ownerAddress
  ).storeUint(
      params.player_counter, 64
  ).storeUint(
      params.playing, 64
  ).storeAddress(
      params.charityAddress
  ).endCell();
}

// message encoders for all ops (see contracts/imports/constants.fc for consts)

export function register(): Cell {
  return beginCell().storeUint(0x4dcbb5a8, 32).storeUint(0, 64).endCell();
}

export function start(): Cell {
  return beginCell().storeUint(0x4349f57a, 32).storeUint(0, 64).endCell();
}

export function invest(params: { withdrawAmount: BN }): Cell {
  return beginCell().storeUint(0x165389ea, 32).storeUint(0, 64).storeCoins(params.withdrawAmount).endCell();
}

export function winner(params: { winnerAddress: Address }): Cell {
  return beginCell().storeUint(0x586578f4, 32).storeUint(0, 64).storeAddress(params.winnerAddress).endCell();
}

export function transferOwnership(params: { newOwnerAddress: Address }): Cell {
  return beginCell().storeUint(0x2da38aaf, 32).storeUint(0, 64).storeAddress(params.newOwnerAddress).endCell();
}
