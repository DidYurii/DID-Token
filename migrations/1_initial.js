const DIDToken = artifacts.require("DIDToken");

module.exports = async (deployer) => {
  await deployer.deploy(DIDToken);
};
