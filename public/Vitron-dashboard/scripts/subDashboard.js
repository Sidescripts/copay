
    const notifications = [
        {
            icon: "fa-shield",
            message: "Security Alert: KYC Verification is highly recommended for account protection.",
            action: "Enable Kyc"
        },
        {
            icon: "fa-piggy-bank",
            message: "New Investment Plan Available: Gold Vault now offers an outstanding monthly return.",
            action: "View Plans"
        },
        {
            icon: "fa-bell",
            message: "Weekly Summary: Your portfolio might gain 3.2% this week. View detailed performance.",
            action: "See Details"
        },
        {
            icon: "fa-gift",
            message: "Special Offer: Deposit $500+ this week and receive 8% bonus on your investment.",
            action: "Learn More"
        },
        {
            icon: "fa-exclamation-triangle",
            message: "Security Recommendation: Strengthen your account protection with a stronger password.",
            action: "See Suggestions"
        }
    ];

    // Function to display a random notification
    function showRandomNotification() {
        const alertWrapper = document.getElementById('alertWrapper');
        if (!alertWrapper) return;
        
        const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
        
        // Update notification content
        const iconElement = alertWrapper.querySelector('.cyber-icon i');
        const messageElement = alertWrapper.querySelector('.cyber-message');
        
        if (iconElement) iconElement.className = `fa-solid ${randomNotif.icon}`;
        if (messageElement) {
            messageElement.innerHTML = `
                ${randomNotif.message}
                <div class="cyber-action">${randomNotif.action}</div>
            `;
        }
        
        // Show the alert with animation
        alertWrapper.style.display = 'block';
        setTimeout(() => {
            alertWrapper.classList.add('visible');
        }, 10);
        
        // Add click handler for close button
        const closeBtn = alertWrapper.querySelector('.cyber-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                alertWrapper.classList.remove('visible');
                setTimeout(() => {
                    alertWrapper.style.display = 'none';
                }, 500);
            };
        }
        
        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            if (alertWrapper.classList.contains('visible')) {
                alertWrapper.classList.remove('visible');
                setTimeout(() => {
                    alertWrapper.style.display = 'none';
                }, 500);
            }
        }, 8000);
    }

    // Rotate notifications every 30 seconds (optional)
    setInterval(showRandomNotification, 120000);


// fetching crypto market price
                const coins = [
                    { id: "bitcoin", symbol: "btc" },
                    { id: "ethereum", symbol: "eth" },
                    { id: "litecoin", symbol: "ltc" },
                    { id: "tether", symbol: "usdt" },
                    { id: "bitcoin-cash", symbol: "bch" },
                    { id: "dash", symbol: "dash" },
                    { id: "binancecoin", symbol: "bnb" },
                    { id: "dogecoin", symbol: "doge" }
                ];

                async function getCryptoData() {
                    try {
                        const ids = coins.map(c => c.id).join(",");
                        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
                        const res = await fetch(url);
                        const data = await res.json();

                        coins.forEach(coin => {
                            const price = data[coin.id].usd;
                            const change = data[coin.id].usd_24h_change;

                            // Price
                            const priceEl = document.getElementById(`${coin.symbol}Price`);
                            if (priceEl) priceEl.textContent = `$${price.toLocaleString()}`;

                            // Change + icon
                            const changeEl = document.getElementById(`${coin.symbol}Change`);
                            const iconEl = document.getElementById(`${coin.symbol}Icon`);
                            if (changeEl && iconEl) {
                                changeEl.textContent = change.toFixed(2) + "%";
                                const color = change >= 0 ? "green" : "red";
                                iconEl.className = change >= 0 ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down";
                                iconEl.style.color = color;
                                changeEl.style.color = color;
                                priceEl.style.color = color;
                            }
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }

                // run once when page loads
                getCryptoData();

                // auto-update every 30 seconds
                setInterval(getCryptoData, 60000);



                // ---------------Withdraw modal triggers ----------------------

