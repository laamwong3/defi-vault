import { MockToken__factory } from "./../typechain-types/factories/contracts/MockToken__factory";
import { Vault__factory } from "./../typechain-types/factories/contracts/Vault__factory";
import { Vault } from "./../typechain-types/contracts/Vault";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MockToken } from "../typechain-types";

const toWei = (num: string) => ethers.utils.parseEther(num.toString());
const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);

describe("Vault.sol", () => {
  let owner: SignerWithAddress;
  // let users: SignerWithAddress[];
  let user1: SignerWithAddress, user2: SignerWithAddress;
  let Vault: Vault__factory;
  let vault: Vault;
  let MockToken: MockToken__factory;
  let mockToken: MockToken;
  const amountToMint = 5000;
  const depositAmount = 1000;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy();
    await mockToken.deployed();

    Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(mockToken.address);
    await vault.deployed();

    // mint some tokens for testing
    // const [user1, user2] = users;

    const tx1 = await mockToken.mint(user1.address, amountToMint);
    await tx1.wait(1);
    const tx2 = await mockToken.mint(user2.address, amountToMint);
    await tx2.wait(1);
  });

  describe("unit test", () => {
    describe("deposit", () => {
      it("Should deposit to the vault contract", async () => {
        await mockToken.connect(user1).approve(vault.address, depositAmount);

        const tx = await vault.connect(user1).deposit(depositAmount);
        await tx.wait(1);

        expect(await vault.balanceOf(user1.address)).to.equal(depositAmount);
      });
    });

    describe("withdraw", () => {
      it("Should withdraw the token back to the user", async () => {
        //make some deposit first
        await mockToken.connect(user1).approve(vault.address, depositAmount);
        let tx = await vault.connect(user1).deposit(depositAmount);
        await tx.wait(1);

        // make sure it has deposited to the vault
        expect(
          await mockToken.connect(user1).balanceOf(user1.address)
        ).to.equal((amountToMint - depositAmount).toString());

        // now withdraw
        tx = await vault.connect(user1).withdraw(depositAmount);
        tx.wait(1);

        expect(
          await mockToken.connect(user1).balanceOf(user1.address)
        ).to.equal(amountToMint);
      });
    });
  });
  describe("Stage test", () => {
    describe("Check if allocate a correct value for multi-users", () => {
      it("Should get the same money back", async () => {});
    });
  });
});
