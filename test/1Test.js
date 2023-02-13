const DIDToken = artifacts.require("DIDToken");
//npm install --save-dev @openzeppelin/test-helpers (for reverts)
// it("should fail", async () => {
//   await expectRevert(contractInstance.failingFunction(), "failingStatement");
// })
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("DID Token", async () => {
  it("should be the right name", async () => {
    DIDTokenInstance = await DIDToken.deployed();
    let _name = await DIDTokenInstance.name();
    assert.equal(_name, "DID Token", "it is not correct");
  });
  it("should be the right Symbol", async () => {
    let _symbol = await DIDTokenInstance.symbol();
    assert.equal(_symbol, "DID", "it is not correct");
  });
  it("desimals should be equal to table value", async () => {
    let decimal = await DIDTokenInstance.decimals();
    assert.equal(decimal, 8, "it is not correct");
  });
  it("initial totalSupply quantity should be equal to zero", async () => {
    let totalSupply = await DIDTokenInstance.totalSupply();
    assert.equal(totalSupply, 0, "it is not correct");
  });
  it("function transfer works correctly", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1] = accounts;
    await DIDTokenInstance.mint(owner, 10000);
    let accBalanceStart = (
      await DIDTokenInstance.balanceOf(account1)
    ).toNumber();
    let ownBalanceStart = (await DIDTokenInstance.balanceOf(owner)).toNumber();
    await DIDTokenInstance.transfer(account1, 100);
    let accBalanceEnd = (await DIDTokenInstance.balanceOf(account1)).toNumber();
    let ownBalanceEnd = (await DIDTokenInstance.balanceOf(owner)).toNumber();
    assert.equal(ownBalanceStart - 100, ownBalanceEnd, "it is not correct");
    assert.equal(accBalanceStart + 100, accBalanceEnd, "not correct");
  });
  it("function approve() correctly change allowance", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1] = accounts;
    await DIDTokenInstance.approve(account1, 100);
    let allowance = (
      await DIDTokenInstance.allowance(owner, account1)
    ).toNumber();
    assert.equal(allowance, 100, "not correct");
  });
  it("function transferFrom() correctly change balances of accounts", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1, account2] = accounts;
    await DIDTokenInstance.approve(account2, 200, {
      from: account1,
    });
    let acc1BalanceStart = (
      await DIDTokenInstance.balanceOf(account1)
    ).toNumber();
    let acc2BalanceStart = (
      await DIDTokenInstance.balanceOf(account2)
    ).toNumber();
    await DIDTokenInstance.transferFrom(account1, account2, 100, {
      from: account2,
    });
    let acc1BalanceEnd = (
      await DIDTokenInstance.balanceOf(account1)
    ).toNumber();
    let acc2BalanceEnd = (
      await DIDTokenInstance.balanceOf(account2)
    ).toNumber();
    assert.equal(acc1BalanceStart - 100, acc1BalanceEnd, "it is not correct");
    assert.equal(acc2BalanceStart + 100, acc2BalanceEnd, "not correct");
  });
  it("function transferFrom() can't change balances of accounts above allowance", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1, account2] = accounts;
    await expectRevert(
      DIDTokenInstance.transferFrom(account1, account2, 200),
      "ERC20: insufficient allowance"
    );
  });
  it("function burn() correctly change balance ", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1] = accounts;
    let ownBalanceStart = (await DIDTokenInstance.balanceOf(owner)).toNumber();
    await DIDTokenInstance.burn(10);
    let ownBalanceEnd = (await DIDTokenInstance.balanceOf(owner)).toNumber();
    assert.equal(ownBalanceStart - 10, ownBalanceEnd, "not correct");
  });
  it("_owner should be the same as msg.sender", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner] = accounts;
    let _owner = await DIDTokenInstance.owner();
    assert.equal(owner, _owner, "not the same");
  });
  it("owner of the token can mint tokens", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1] = accounts;
    let totSupStart = (await DIDTokenInstance.totalSupply()).toNumber();
    await DIDTokenInstance.mint(owner, 200);
    let totSupEnd = (await DIDTokenInstance.totalSupply()).toNumber();
    assert.equal(20000000000, totSupEnd - totSupStart, "mint is not succes");
  });
  it("not owner of the token can't mint tokens", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner, account1] = accounts;
    await expectRevert(
      DIDTokenInstance.mint(account1, 20000000000, { from: account1 }),
      "Ownable: caller is not the owner"
    );
  });
  it("it is not possible to increase _totalSupply more than _cap", async () => {
    let accounts = await web3.eth.getAccounts();
    [owner] = accounts;
    await expectRevert(
      DIDTokenInstance.mint(owner, 5600001),
      "ERC20Capped: cap exceeded"
    );
  });
});
