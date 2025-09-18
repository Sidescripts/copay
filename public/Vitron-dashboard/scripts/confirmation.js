function copyWallet() {
  const wallet = localStorage.getItem("walletAddress");
  if (wallet) {
    navigator.clipboard.writeText(wallet).then(() => {
      alert("Wallet address copied!");
    });
  }
}
