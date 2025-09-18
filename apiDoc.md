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
/signup - post
/login - post
/profile - get
/all-admin -get

admin/users
/users -get
/users-details - get
/users/:userId/verify - post
/users/:userId/withdrawal - patch
/users/:userId/balance - patch
/dashboard/stats - get
/dashboard/pending-actions - get

admin/deposit
/deposit/all-deposit -get
/deposit/:userId - patch
/deposit/stat - get

admin/investment
/invest/create-plan - post
/invest/all -get
/invest/update/:id -patch
/invest/deactivate/:id - patch
/invest/delete/:id - delete
/investment/update/:id -patch

admin/withdrawal
/withdrawal - get
/withdrawal-stat - get
/withdrawal/:id - patch