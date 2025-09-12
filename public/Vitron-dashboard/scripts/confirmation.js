document.addEventListener("DOMContentLoaded", () => {
  const amount = localStorage.getItem("investmentAmount");
  const method = localStorage.getItem("paymentMethod");
  const wallet = localStorage.getItem("walletAddress");

  if (amount && method && wallet) {
    // ✅ Update deposit amount
    if (document.getElementById("depositAmount")) {
      document.getElementById("depositAmount").textContent = `$${amount}`;
    }

    // ✅ Update selected method
    if (document.getElementById("selectedMethod")) {
      document.getElementById("selectedMethod").textContent = method.toUpperCase();
    }

    // ✅ Update wallet address
    if (document.getElementById("walletAddress")) {
      document.getElementById("walletAddress").textContent = wallet;
    }

    // ✅ Update instructions
    let network = (method === "usdt") ? " TRC20" : "";
    if (document.getElementById("paymentInstruction")) {
      document.getElementById("paymentInstruction").innerHTML =
        `Please send <b>${amount} ${method.toUpperCase()}${network}</b> to the wallet above.`;
    }
  }
});

function copyWallet() {
  const wallet = localStorage.getItem("walletAddress");
  if (wallet) {
    navigator.clipboard.writeText(wallet).then(() => {
      alert("Wallet address copied!");
    });
  }
}


  function openPaymentModal() {
  const modalElement = document.getElementById("paymentModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // After 3s update text + color
  setTimeout(() => {
    const label = document.getElementById("paymentModalLabel");
    label.innerText = "Payment Under Review";

    // Example color change (Bootstrap text-warning = yellow/orange)
    label.classList.remove("text-primary");
    label.classList.add("text-warning");
  }, 3000);

  // Redirect after modal closes
  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      window.location.href = "../Dashboard.html";
    },
    { once: true }
  );
}
