import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import * as utils from "ethereum-cryptography/utils";
import * as keccak from "ethereum-cryptography/keccak";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    if (!secp.secp256k1.utils.isValidPrivateKey(privateKey)) {
      setAddress("");
      setBalance(0);
      return;
    }

    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    const address =
      "0x" + utils.toHex(keccak.keccak256(publicKey.slice(1)).slice(-20));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function truncate(address) {
    return `${address.slice(0, 4)}...${address.slice(-4, address.length)}`;
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Enter the private key"
          value={privateKey}
          onChange={onChange}
        ></input>
        {address && <small>Address: {truncate(address)}</small>}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
