const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const utils = require("ethereum-cryptography/utils");
const keccak = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "0x8b6a4005690ebe5405691db2086b82868e9659e2": 100,
  "0x4a16196eabea035e67744fdf2bb46c0073093f38": 50,
  "0x2360e75490334a097b724e88fd7201de025f7bc4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

app.post("/send", (req, res) => {
  try {
    const { sender, recipient, amount, signature, recoveryBit, publicKey } =
      req.body;

    // console.log({
    //   sender,
    //   recipient,
    //   amount,
    //   signature,
    //   recoveryBit,
    //   publicKey,
    // });

    const message = {
      from: sender,
      to: recipient,
      amount: Number(amount),
    };

    const hash = keccak.keccak256(utils.utf8ToBytes(JSON.stringify(message)));

    const recoverKey = secp.recoverPublicKey(
      hash,
      utils.hexToBytes(signature),
      Number(recoveryBit),
      true
    );

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (utils.toHex(recoverKey) === publicKey) {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;

        res.send({ balance: balances[sender] });
      }
    } else {
      res.status(401).send({ message: "Jeez! Wrong signature." });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
