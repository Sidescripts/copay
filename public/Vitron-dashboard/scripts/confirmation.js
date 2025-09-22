function copyWallet() {
  const walletElement = document.getElementById("walletAddress");
  const wallet = walletElement ? walletElement.textContent : null;
  if (wallet && wallet !== 'Unknown Wallet') {
    navigator.clipboard.writeText(wallet).then(() => {
      alert("Wallet address copied!");
    }).catch((err) => {
      console.error('Failed to copy wallet address:', err);
      alert("Failed to copy wallet address. Please try again.");
    });
  } else {
    alert("No wallet address available to copy.");
  }
}