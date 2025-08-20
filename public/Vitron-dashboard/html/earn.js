function confirmInvestment() {
  const amount = document.getElementById("investmentAmount").value;
  const method = document.getElementById("paymentMethod").value;

  if (!amount || !method) {
    alert("Please enter an amount and select a payment method.");
    return;
  }

  // Example wallet addresses per method
  const wallets = {
    btc: "1BitcoinExampleWallet12345",
    usdt: "TZCLHR32bRFu5qcYsKdrjfvfrrt76YJz5b",
    eth: "0xEthereumExampleWallet67890",
    bnb: "bnb1ExampleWalletabc123",
    bch: "bitcoincash:qExampleWallet0000",
    ltc: "ltc1ExampleWalletxyz",
    dash: "XdashExampleWallet11111"
  };

  // Save to localStorage
  localStorage.setItem("investmentAmount", amount);
  localStorage.setItem("paymentMethod", method);
  localStorage.setItem("walletAddress", wallets[method]);

  // Redirect
  window.location.href = "confirmation.html";
}
