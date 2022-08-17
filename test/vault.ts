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
  describe("unit test", () => {
    let owner: SignerWithAddress;
    let users: SignerWithAddress[];
    let Vault: Vault__factory;
    let vault: Vault;
    let MockToken: MockToken__factory;
    let mockToken: MockToken;

    beforeEach(async () => {
      [owner, ...users] = await ethers.getSigners();

      MockToken = await ethers.getContractFactory("MockToken");
      mockToken = await MockToken.deploy();
      await mockToken.deployed();

      Vault = await ethers.getContractFactory("Vault");
      vault = await Vault.deploy(mockToken.address);
      await vault.deployed();

      // mint some tokens for testing
      const [user1, user2] = users;
      const amountToMint = "1000";
      const tx1 = await mockToken.mint(user1.address, amountToMint);
      const tx2 = await mockToken.mint(user2.address, amountToMint);
    });
  });
});
