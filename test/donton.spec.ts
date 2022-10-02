import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import {Cell, Slice, toNano} from "ton";
import { SmartContract } from "ton-contract-executor";
import * as donton from "../contracts/donton";
import {internalMessage, randomAddress, setBalance} from "./helpers";

import { hex } from "../build/donton.compiled.json";

describe("Donton tests", () => {
  let contract: SmartContract;

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0], // code cell from build output
      donton.data({
        ownerAddress: randomAddress("owner"),
        player_counter: 0,
        playing: 0,
        charityAddress: randomAddress("charity")
      }),
    );
  });

  it("Should return balance of contract", async () => {
    const call = await contract.invokeGetMethod("balance", []);
    expect(call.result[0]).to.be.bignumber.equal(new BN(1000));
  });

  it("Should return owner of contract", async() => {
    const call = await contract.invokeGetMethod("owner_address", []);
    const address = (call.result[0] as Slice).readAddress();
    expect(address?.equals(randomAddress("owner"))).to.equal(true);
  });

  it("Should return player counter", async() => {
    const call = await contract.invokeGetMethod("player_counter", []);
    expect(call.result[0]).to.be.bignumber.equal(new BN(0));
  });

  it("Should return whether game is started", async() => {
    const call = await contract.invokeGetMethod("playing", []);
    expect(call.result[0]).to.be.bignumber.equal(new BN(0));
  });

  it("Should return charity address", async() => {
    const call = await contract.invokeGetMethod("charity_address", []);
    const address = (call.result[0] as Slice).readAddress();
    expect(address?.equals(randomAddress("charity"))).to.equal(true);
  });

  it("Should register user", async () => {
    const send_success = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: donton.register(),
        value: toNano(1),
      })
    );
    expect(send_success.type).to.equal("success");
    const call2 = await contract.invokeGetMethod("player_counter", []);
    expect(call2.result[0]).to.be.bignumber.equal(new BN(1));

    const send_failed_105 = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: donton.register(),
        value: toNano(0.5),
      })
    );
    expect(send_failed_105.type).to.equal("failed");
    expect(send_failed_105.exit_code).to.equal(105);
  });

  it("Should start game", async () => {
    const send_failed_102 = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: donton.start(),
      })
    );
    expect(send_failed_102.type).to.equal("failed");
    expect(send_failed_102.exit_code).to.equal(102)

    const send_failed_106 = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("owner"),
        body: donton.start(),
      })
    );
    expect(send_failed_106.type).to.equal("failed");
    expect(send_failed_106.exit_code).to.equal(106)

    await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: donton.register(),
        value: toNano(1),
      })
    );
    await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner2"),
        body: donton.register(),
        value: toNano(1),
      })
    );

    const send_success = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("owner"),
        body: donton.start(),
      })
    );
    expect(send_success.type).to.equal("success");
    const call = await contract.invokeGetMethod("playing", []);
    expect(call.result[0]).to.be.bignumber.equal(new BN(1));

    const send_failed_104 = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("owner"),
        body: donton.start(),
      })
    );
    expect(send_failed_104.type).to.equal("failed");
    expect(send_failed_104.exit_code).to.equal(104)
  });

  it("Should glory to winner and send 30% to charity", async () => {
    await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: donton.register(),
        value: toNano(1),
      })
    );
    await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner2"),
        body: donton.register(),
        value: toNano(1),
      })
    );
    await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("owner"),
        body: donton.start(),
      })
    );

    const send_success = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("owner"),
        body: donton.winner({winnerAddress: randomAddress("winner")}),
      })
    );
    expect(send_success.type).to.equal("success");
  });

});
