const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");

const private = secp.utils.randomPrivateKey();
const public = secp.getPublicKey(private);

const hexs = [utils.toHex(private), utils.toHex(public)];

console.log({
  private: hexs[0],
  public: hexs[1],
});
