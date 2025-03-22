// Frontend React code for the inheritance smart contract interface
// Features: Upload encrypted will, display encrypted CID, add beneficiaries, trigger distribution

import React, { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere";
const ABI = [
  "function setEncryptedWill(string _ipfsHash) external",
  "function getEncryptedWill() view returns (string)",
  "function addTokenBeneficiary(address _recipient, uint256 _share) external",
  "function approveIdentity(address _beneficiary) external",
  "function confirmDeceased() external",
  "function distributeToken() external"
];

export default function InheritanceDApp() {
  const [account, setAccount] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [newHash, setNewHash] = useState("");
  const [recipient, setRecipient] = useState("");
  const [share, setShare] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);
    }
  };

  const getContract = () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  };

  const uploadIPFSHash = async () => {
    const contract = getContract();
    const tx = await contract.setEncryptedWill(newHash);
    await tx.wait();
    alert("Encrypted will hash saved on-chain!");
  };

  const fetchEncryptedWill = async () => {
    const contract = getContract();
    const hash = await contract.getEncryptedWill();
    setIpfsHash(hash);
  };

  const addBeneficiary = async () => {
    const contract = getContract();
    const tx = await contract.addTokenBeneficiary(recipient, ethers.parseUnits(share, 0));
    await tx.wait();
    alert("Beneficiary added!");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <Button onClick={connectWallet}>{account ? account : "Connect MetaMask"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="text-xl font-bold">Upload Encrypted Will Hash (IPFS CID)</h2>
          <Input value={newHash} onChange={(e) => setNewHash(e.target.value)} placeholder="Qm..." />
          <Button onClick={uploadIPFSHash}>Upload</Button>
          <Button variant="outline" onClick={fetchEncryptedWill}>View Current Hash</Button>
          {ipfsHash && <p className="text-sm">Stored: {ipfsHash}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="text-xl font-bold">Add ERC20 Beneficiary</h2>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0xRecipientAddress" />
          <Input value={share} onChange={(e) => setShare(e.target.value)} placeholder="Share (e.g. 50)" />
          <Button onClick={addBeneficiary}>Add Beneficiary</Button>
        </CardContent>
      </Card>
    </div>
  );
}
