Port = 2000 (localhost:2000)

Authentication 
register: (method: post),  "/api/v1/auth/signup"
login: (method: post), "/api/v1/auth/login"
forgetPassword: (method: post), "/api/v1/auth/forget-password"
newPassword: (method: post), "/api/v1/auth/new-password"

User 
dashboard: (method: get),  "/api/v1/user/dashboard"
userdetails: (method: get), "/api/v1/user/get-user"
changePAssword: (method: post), "/api/v1/user/change-password"
updateDetails: (method: post), "/api/v1/user/update-details"

Deposit 
createDeposit: (method: post), "/api/v1/deposit/deposit"
allDeposit: (method: get), "/api/v1/deposit/deposit-history"
getDeposit: (method: get), "/api/v1/deposit/deposit/:id"

Withdrawal
createWithdrawal: (method: post), "/api/v1/withdrawal/withdrawal"
allWithdrawal: (method: get), "/api/v1/withdrawal/withdrawal-history"
getWithdrawal: (method: get), "/api/v1/withdrawal/withdrawal/:id"

Investment
createInvest: (method: post), "/api/v1/invest/invest-now"
allInvestment: (mthod:get), "/api/v1/invest/invest-history"
getInvestment: (method: get), "/api/v1/invest/:id"

// Admin base route
app.use("/api/v1/admin", adminRoutes);
