const transporter = require("../../utils/nodemailer");

function EmailTemplates() {
    return {
        // DEPOSIT APPROVAL EMAIL
        depositApprovalEmail: async function({email, amount, asset, transactionId, approvalDate}) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Deposit Approved - VitronTrade',
                    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Deposit Approved - Vitron-trade</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f6f9fc;
            color: #333333;
            line-height: 1.5;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #10b981;
            padding: 25px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .success-badge {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .amount-display {
            text-align: center;
            margin: 25px 0;
            padding: 20px;
            background-color: #f0fdf4;
            border-radius: 8px;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #065f46;
            margin: 0;
        }
        .asset {
            font-size: 18px;
            color: #059669;
            margin: 5px 0 0 0;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }
        .details-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        .details-table .label {
            font-weight: bold;
            color: #4a5568;
        }
        .details-table .value {
            text-align: right;
            color: #2d3748;
        }
        .button {
            display: block;
            width: 100%;
            max-width: 250px;
            margin: 30px auto;
            padding: 15px;
            background-color: #10b981;
            color: white;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .security-note {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            padding: 20px 30px;
            background-color: #f1f5f9;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <table class="container" role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td class="header">
                <h1>🎉 Deposit Approved!</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <div class="success-badge">SUCCESS</div>
                
                <h2>Great news!</h2>
                <p>Your deposit has been reviewed and approved by our security team. Your funds are now available in your account.</p>
                
                <div class="amount-display">
                    <p class="amount">${amount}</p>
                    <p class="asset">${asset.toUpperCase()}</p>
                </div>
                
                <table class="details-table" role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="label">Transaction ID:</td>
                        <td class="value"><strong>${transactionId}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Asset:</td>
                        <td class="value"><strong>${asset.toUpperCase()}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Amount Credited:</td>
                        <td class="value"><strong>${amount} ${asset.toUpperCase()}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Approval Date:</td>
                        <td class="value"><strong>${new Date(approvalDate).toLocaleString()}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Status:</td>
                        <td class="value"><strong style="color: #10b981;">COMPLETED</strong></td>
                    </tr>
                </table>
                
                <div class="security-note">
                    <strong>🔒 Security Confirmation:</strong>
                    <p>This deposit has passed all security checks and has been verified by our team. Your funds are now safe and available for use.</p>
                </div>
                
                <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}/public/pages/login.html" class="button">
                    View Your Wallet
                </a>
                
                <p><strong>Next steps:</strong> You can now use these funds for trading, investments, or withdrawals.</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <p>© ${new Date().getFullYear()} VitronTrade. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>Need assistance? Contact our support team at support@vitrontrade.com</p>
            </td>
        </tr>
    </table>
</body>
</html>
                    `
                };

                await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error('Email sending error:', error);
                throw new Error('Failed to send email');
            }
        }
    };
}

module.exports = EmailTemplates();