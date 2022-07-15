import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ULMARK', function () {
  it('Should mint and transfer the ULMARK to someone', async function () {
    const ULMark = await ethers.getContractFactory('ULMark');
    const ulMark = await ULMark.deploy();
    await ulMark.deployed();

    const recepient = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
    const metaDataUri = 'cid/ulmark.txt';

    let balance = await ulMark.balanceOf(recepient);
    expect(balance).to.equal(0);

    const newlyMintedULMark = await ulMark.payToMint(recepient, metaDataUri, {
      value: ethers.utils.parseEther('0.05'),
    });

    await newlyMintedULMark.wait();

    balance = await ulMark.balanceOf(recepient);
    expect(balance).to.equal(1);

    expect(await ulMark.isContentOwned(metaDataUri)).to.equal(true);
  });
});
