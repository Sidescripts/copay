const transporter = require("../../utils/nodemailer");


function EmailTemplate(){
    return {
     // WITHDRAWAL CONFIRMATION EMAIL
     withdrawalEmail: async function({amount, email, asset, transactionId, status, date}) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Withdrawal transaction - Vitron-trade',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Withdrawal Processing - Copay</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; }
                        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .status-badge { 
                            background: #f59e0b; color: white; padding: 8px 16px; border-radius: 20px; 
                            font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px;
                        }
                        .amount { font-size: 32px; font-weight: bold; color: #d97706; margin: 10px 0; }
                        .transaction-details { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fef3c7; }
                        .detail-row:last-child { border-bottom: none; }
                        .address { font-family: monospace; background: #fef3c7; padding: 8px; border-radius: 4px; word-break: break-all; }
                        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="logo">📤 Withdrawal Processed</h1>
                    </div>
                    
                    <div class="content">
                        <div class="status-badge">🔄 ${status.toUpperCase()}</div>
                        
                        <p>Your withdrawal request has been processed successfully.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div class="amount">${amount} ${asset.toUpperCase()}</div>
                            <p>has been sent to your wallet</p>
                        </div>
                
                        <div class="transaction-details">
                            <h3 style="margin-top: 0;">Withdrawal Details</h3>
                            <div class="detail-row">
                                <span>Transaction ID:</span>
                                <span><strong>${transactionId}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Amount:</span>
                                <span><strong>${amount} ${asset.toUpperCase()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Network Fee:</span>
                                <span><strong>${asset.toUpperCase()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Status:</span>
                                <span><strong style="color: #d97706;">${status}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Processed Date:</span>
                                <span><strong>${new Date(date).toLocaleString()}</strong></span>
                            </div>
                        </div>
                
                        <p><strong>⚠️ Important:</strong> Please allow some time for the transaction to be confirmed on the blockchain.</p>
                        <p>If you didn't initiate this withdrawal, please contact support immediately.</p>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Vitron-trade. All rights reserved.</p>
                        
                        <p>Security Team • support@Vitron-trade.com</p>
                    </div>
                </body>
                </html>
                      `
            }


            await transporter.sendMail(mailOptions);
            console.log(`Withdrawal confirmation email sent to ${email}`);
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
        
        },
    }
}

module.exports = EmailTemplate();