
document.addEventListener("DOMContentLoaded", () => {
  const amount = localStorage.getItem("investmentAmount");
  const method = localStorage.getItem("paymentMethod");
  const wallet = localStorage.getItem("walletAddress");

  if (amount && method && wallet) {
    // Update amounts
    if (document.getElementById("creditAmount")) {
      document.getElementById("creditAmount").textContent = amount;
    }
    if (document.getElementById("debitAmount")) {
      document.getElementById("debitAmount").textContent = amount;
    }

    // Update wallet address
    if (document.getElementById("walletAddress")) {
      const walletEl = document.getElementById("walletAddress");
      walletEl.textContent = wallet;
      walletEl.href = wallet;
    }

    // Update selected method
    if (document.getElementById("selectedMethod")) {
      document.getElementById("selectedMethod").textContent = method.toUpperCase();
    }

    let network = (method === "usdt") ? " TRC20" : "";
    if (document.getElementById("paymentInstruction")) {
      document.getElementById("paymentInstruction").innerHTML =
        `Please send <b>${amount} ${method.toUpperCase()}${network}</b> to the wallet above.`;
    }
  }
});

// Copy button function
function copyWallet() {
  const wallet = localStorage.getItem("walletAddress");
  if (wallet) {
    navigator.clipboard.writeText(wallet).then(() => {
      alert("✅ Wallet address copied!");
    });
  }
}


  function copyWallet() {
    const wallet = localStorage.getItem("walletAddress");
    navigator.clipboard.writeText(wallet).then(() => {
      alert("Wallet address copied!");
    });
  }

  function openPaymentModal() {
    const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
    modal.show();

    setTimeout(() => {
      document.getElementById("paymentModalLabel").innerText = "Payment Under Review";
    }, 3000);
  }
