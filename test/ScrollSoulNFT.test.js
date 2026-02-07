import { expect } from "chai";
import { ethers } from "hardhat";

describe("ScrollSoulNFT", function () {
  let scrollSoulNFT;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  const BASE_URI = "ipfs://QmScrollSoulMetadata/";
  const THOTH_SIGIL_TOKEN_ID = 1;
  const PIONEER_LEGION_SUPPLY = 144000;
  const GRB_250314A_TIMESTAMP = 1741910400; // March 14, 2025

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const ScrollSoulNFT = await ethers.getContractFactory("ScrollSoulNFT");
    scrollSoulNFT = await ScrollSoulNFT.deploy(BASE_URI);
    await scrollSoulNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await scrollSoulNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct Pioneer Legion supply", async function () {
      expect(await scrollSoulNFT.PIONEER_LEGION_SUPPLY()).to.equal(PIONEER_LEGION_SUPPLY);
    });

    it("Should have correct GRB 250314A timestamp", async function () {
      expect(await scrollSoulNFT.GRB_250314A_TIMESTAMP()).to.equal(GRB_250314A_TIMESTAMP);
    });

    it("Should have minting enabled by default", async function () {
      expect(await scrollSoulNFT.mintingEnabled()).to.equal(true);
    });

    it("Should start with zero total minted", async function () {
      expect(await scrollSoulNFT.totalMinted()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to an address", async function () {
      await scrollSoulNFT.mint(addr1.address, 10);
      expect(await scrollSoulNFT.balanceOf(addr1.address, THOTH_SIGIL_TOKEN_ID)).to.equal(10);
    });

    it("Should update total minted after minting", async function () {
      await scrollSoulNFT.mint(addr1.address, 100);
      expect(await scrollSoulNFT.totalMinted()).to.equal(100);
    });

    it("Should record sovereign proof on first mint", async function () {
      await scrollSoulNFT.mint(addr1.address, 5);
      const proof = await scrollSoulNFT.sovereignProof(addr1.address);
      expect(proof).to.be.gt(0);
    });

    it("Should emit SovereignValidation event", async function () {
      await expect(scrollSoulNFT.mint(addr1.address, 1))
        .to.emit(scrollSoulNFT, "SovereignValidation")
        .withArgs(addr1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1), THOTH_SIGIL_TOKEN_ID);
    });

    it("Should not allow minting beyond Pioneer Legion supply", async function () {
      await expect(
        scrollSoulNFT.mint(addr1.address, PIONEER_LEGION_SUPPLY + 1)
      ).to.be.revertedWith("Exceeds Pioneer Legion supply");
    });

    it("Should not allow minting to zero address", async function () {
      await expect(
        scrollSoulNFT.mint(ethers.ZeroAddress, 1)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        scrollSoulNFT.connect(addr1).mint(addr2.address, 1)
      ).to.be.revertedWithCustomError(scrollSoulNFT, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting when disabled", async function () {
      await scrollSoulNFT.setMintingEnabled(false);
      await expect(
        scrollSoulNFT.mint(addr1.address, 1)
      ).to.be.revertedWith("Minting is currently disabled");
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint to multiple addresses", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address];
      const amounts = [10, 20, 30];

      await scrollSoulNFT.batchMintToAddresses(recipients, amounts);

      expect(await scrollSoulNFT.balanceOf(addr1.address, THOTH_SIGIL_TOKEN_ID)).to.equal(10);
      expect(await scrollSoulNFT.balanceOf(addr2.address, THOTH_SIGIL_TOKEN_ID)).to.equal(20);
      expect(await scrollSoulNFT.balanceOf(addr3.address, THOTH_SIGIL_TOKEN_ID)).to.equal(30);
    });

    it("Should update total minted correctly after batch mint", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [100, 200];

      await scrollSoulNFT.batchMintToAddresses(recipients, amounts);
      expect(await scrollSoulNFT.totalMinted()).to.equal(300);
    });

    it("Should not allow batch mint with mismatched arrays", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [10];

      await expect(
        scrollSoulNFT.batchMintToAddresses(recipients, amounts)
      ).to.be.revertedWith("Arrays length mismatch");
    });

    it("Should not allow batch mint exceeding supply", async function () {
      const recipients = [addr1.address];
      const amounts = [PIONEER_LEGION_SUPPLY + 1];

      await expect(
        scrollSoulNFT.batchMintToAddresses(recipients, amounts)
      ).to.be.revertedWith("Exceeds Pioneer Legion supply");
    });

    it("Should record sovereign proof for all batch recipients", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [5, 5];

      await scrollSoulNFT.batchMintToAddresses(recipients, amounts);

      const proof1 = await scrollSoulNFT.sovereignProof(addr1.address);
      const proof2 = await scrollSoulNFT.sovereignProof(addr2.address);

      expect(proof1).to.be.gt(0);
      expect(proof2).to.be.gt(0);
    });
  });

  describe("Metadata", function () {
    it("Should return correct URI for token", async function () {
      const uri = await scrollSoulNFT.uri(THOTH_SIGIL_TOKEN_ID);
      expect(uri).to.equal(BASE_URI + "1.json");
    });

    it("Should allow owner to update base URI", async function () {
      const newURI = "ipfs://QmNewMetadata/";
      await scrollSoulNFT.setBaseURI(newURI);
      
      const uri = await scrollSoulNFT.uri(THOTH_SIGIL_TOKEN_ID);
      expect(uri).to.equal(newURI + "1.json");
    });

    it("Should emit MetadataUpdated event", async function () {
      const newURI = "ipfs://QmNewMetadata/";
      await expect(scrollSoulNFT.setBaseURI(newURI))
        .to.emit(scrollSoulNFT, "MetadataUpdated")
        .withArgs(newURI);
    });

    it("Should allow owner to set contract URI", async function () {
      const contractURI = "ipfs://QmContractMetadata/contract.json";
      await scrollSoulNFT.setContractURI(contractURI);
      expect(await scrollSoulNFT.contractURI()).to.equal(contractURI);
    });
  });

  describe("Sovereign Proof System", function () {
    it("Should return sovereign proof details", async function () {
      await scrollSoulNFT.mint(addr1.address, 5);
      
      const proof = await scrollSoulNFT.getSovereignProof(addr1.address);
      expect(proof.timestamp).to.be.gt(0);
      expect(proof.balance).to.equal(5);
    });

    it("Should calculate anchor to GRB 250314A correctly", async function () {
      await scrollSoulNFT.mint(addr1.address, 1);
      
      const proof = await scrollSoulNFT.getSovereignProof(addr1.address);
      // anchoredToGRB should be positive if minted after GRB event
      expect(proof.anchoredToGRB).to.not.equal(0);
    });

    it("Should verify sovereign validation status", async function () {
      expect(await scrollSoulNFT.isSovereignValidated(addr1.address)).to.equal(false);
      
      await scrollSoulNFT.mint(addr1.address, 1);
      
      expect(await scrollSoulNFT.isSovereignValidated(addr1.address)).to.equal(true);
    });

    it("Should not update sovereign proof timestamp on subsequent mints", async function () {
      await scrollSoulNFT.mint(addr1.address, 1);
      const firstProof = await scrollSoulNFT.sovereignProof(addr1.address);
      
      // Wait a bit and mint again
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine");
      
      await scrollSoulNFT.mint(addr1.address, 1);
      const secondProof = await scrollSoulNFT.sovereignProof(addr1.address);
      
      expect(firstProof).to.equal(secondProof);
    });
  });

  describe("Minting Progress", function () {
    it("Should return correct minting progress", async function () {
      await scrollSoulNFT.mint(addr1.address, 1000);
      
      const progress = await scrollSoulNFT.getMintingProgress();
      expect(progress.minted).to.equal(1000);
      expect(progress.remaining).to.equal(PIONEER_LEGION_SUPPLY - 1000);
      expect(progress.totalSupply).to.equal(PIONEER_LEGION_SUPPLY);
    });
  });

  describe("Minting Control", function () {
    it("Should allow owner to disable minting", async function () {
      await scrollSoulNFT.setMintingEnabled(false);
      expect(await scrollSoulNFT.mintingEnabled()).to.equal(false);
    });

    it("Should allow owner to re-enable minting", async function () {
      await scrollSoulNFT.setMintingEnabled(false);
      await scrollSoulNFT.setMintingEnabled(true);
      expect(await scrollSoulNFT.mintingEnabled()).to.equal(true);
    });

    it("Should emit MintingStatusChanged event", async function () {
      await expect(scrollSoulNFT.setMintingEnabled(false))
        .to.emit(scrollSoulNFT, "MintingStatusChanged")
        .withArgs(false);
    });

    it("Should not allow non-owner to change minting status", async function () {
      await expect(
        scrollSoulNFT.connect(addr1).setMintingEnabled(false)
      ).to.be.revertedWithCustomError(scrollSoulNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to set base URI", async function () {
      await expect(
        scrollSoulNFT.connect(addr1).setBaseURI("ipfs://invalid/")
      ).to.be.revertedWithCustomError(scrollSoulNFT, "OwnableUnauthorizedAccount");
    });

    it("Should not allow non-owner to set contract URI", async function () {
      await expect(
        scrollSoulNFT.connect(addr1).setContractURI("ipfs://invalid/")
      ).to.be.revertedWithCustomError(scrollSoulNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("ERC1155 Standard", function () {
    it("Should support ERC1155 interface", async function () {
      // ERC1155 interface ID
      expect(await scrollSoulNFT.supportsInterface("0xd9b67a26")).to.equal(true);
    });

    it("Should allow token transfers", async function () {
      await scrollSoulNFT.mint(addr1.address, 10);
      
      await scrollSoulNFT.connect(addr1).safeTransferFrom(
        addr1.address,
        addr2.address,
        THOTH_SIGIL_TOKEN_ID,
        5,
        "0x"
      );
      
      expect(await scrollSoulNFT.balanceOf(addr1.address, THOTH_SIGIL_TOKEN_ID)).to.equal(5);
      expect(await scrollSoulNFT.balanceOf(addr2.address, THOTH_SIGIL_TOKEN_ID)).to.equal(5);
    });

    it("Should allow batch transfers", async function () {
      await scrollSoulNFT.mint(addr1.address, 20);
      
      await scrollSoulNFT.connect(addr1).safeBatchTransferFrom(
        addr1.address,
        addr2.address,
        [THOTH_SIGIL_TOKEN_ID],
        [10],
        "0x"
      );
      
      expect(await scrollSoulNFT.balanceOf(addr1.address, THOTH_SIGIL_TOKEN_ID)).to.equal(10);
      expect(await scrollSoulNFT.balanceOf(addr2.address, THOTH_SIGIL_TOKEN_ID)).to.equal(10);
    });
  });
});
