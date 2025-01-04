import { beforeEach, describe, it } from "mocha";
import { ethers, run, network } from "hardhat";
import { expect, assert } from "chai";

describe("SimpleStorage", function ()  {

    let simpleStorage: any, simpleStorageFactory: any;

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it ("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0"; 

        assert(currentValue.toString() === expectedValue); 
    });

    it ("Should update when we call store", async function () {
        const expectedValue = "7";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const currentValue = await simpleStorage.retrieve();

        assert(currentValue.toString() === expectedValue);
    });

});
