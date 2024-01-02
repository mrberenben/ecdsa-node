const keccak = require("ethereum-cryptography/keccak");
const utils = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

void (async function () {
  const PRIVATE_KEY =
    "8acfca7988082a41501e0d3d95594e0c6d94db20d7485499529c80c5904bddb5";
  let message = {
    from: "0x8b6a4005690ebe5405691db2086b82868e9659e2",
    to: "0x4a16196eabea035e67744fdf2bb46c0073093f38",
    amount: 10,
  };

  console.log({ message });

  const hash = utils.toHex(
    keccak.keccak256(utils.utf8ToBytes(JSON.stringify(message)))
  );
  console.log({ hash });

  const [signature, bit] = await secp.sign(hash, PRIVATE_KEY, {
    recovered: true,
  });

  console.log({ signature: utils.toHex(signature), recovery_bit: bit });
})();
