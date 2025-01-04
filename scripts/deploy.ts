import { ethers, run, network } from "hardhat";

async function main() {
    const simpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage");
    console.log("Deploying contract...");
    const simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();

    const address = await simpleStorage.getAddress();
    console.log(`Deployed contract to: ${address}`);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        const deployTx = await simpleStorage.deploymentTransaction();
        await deployTx?.wait(6);
        await verify(address, []);
        console.log("Contract verified");
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value: ${currentValue.toString()}`);

    const transactionResponse = await simpleStorage.store(42);
    await transactionResponse.wait(1);
    console.log("Transaction sent");

    const newValue = await simpleStorage.retrieve();
    console.log(`New value: ${newValue.toString()}`);
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified");
        } else {
            console.log(e);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
