function confirmInvestment() {
  const amount = document.getElementById("investmentAmount").value;
  const method = document.getElementById("paymentMethod").value;

  if (!amount || !method) {
    alert("Please enter an amount and select a payment method.");
    return;
  }

  // Wallets
  const wallets = {
    btc: "bc1qprkyhjwhyccmjgawe77tllgnqjugn8y4aweupl",
    usdt: "TMRyQ2GdPkJvTAPEnYsJQc5Bqrwjf4tv3G",
    eth: "0x5983609884040B91b0Fe1dEd471193165fD65B82",
    bnb: "bnb1ExampleWalletabc123",
    bch: "bitcoincash:qExampleWallet0000",
    ltc: "ltc1ExampleWalletxyz",
    dash: "XdashExampleWallet11111"
  };

  // Save to localStorage
  localStorage.setItem("investmentAmount", amount);
  localStorage.setItem("paymentMethod", method);
  localStorage.setItem("walletAddress", wallets[method]);

  // Redirect to confirmDeposit page
  window.location.href = "../Vitron-dashboard/html/confirmDeposit.html";
}
