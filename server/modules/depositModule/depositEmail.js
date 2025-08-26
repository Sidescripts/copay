const transporter = require("../../utils/nodemailer");


function EmailTemplate(){

    return {
        // DEPOSIT CONFIRMATION EMAIL
      depositEmail: async function({username, email,amount, asset, transactionId, status, date}) {
        
        
        try {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Deposit request - VitronTrade',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Deposit Confirmation - VitronTrade</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; }
                        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .status-badge { 
                            background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; 
                            font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px;
                        }
                        .amount { font-size: 32px; font-weight: bold; color: #059669; margin: 10px 0; }
                        .transaction-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dcfce7; }
                        .detail-row:last-child { border-bottom: none; }
                        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="logo">💎 Deposit Received</h1>
                    </div>
                    
                    <div class="content">
                        <div class="status-badge">✅ ${status.toUpperCase()}</div>
                        <h2>Hello ${username},</h2>
                        <p>Your deposit has been successfully received and processed.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div class="amount">${amount} ${asset.toUpperCase()}</div>
                            <p>has been added to your wallet</p>
                        </div>
                
                        <div class="transaction-details">
                            <h3 style="margin-top: 0;">Transaction Details</h3>
                            <div class="detail-row">
                                <span>Transaction ID:</span>
                                <span><strong>${transactionId}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Asset:</span>
                                <span><strong>${asset.toUpperCase()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Date & Time:</span>
                                <span><strong>${new Date(date).toLocaleString()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Status:</span>
                                <span><strong style="color: #059669;">${status}</strong></span>
                            </div>
                        </div>
                
                        <p>Your funds are now available for trading, investments, or withdrawals.</p>
                        <p><strong>Note:</strong> This is an automated message. Please do not reply to this email.</p>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} VitronTrade. All rights reserved.</p>
                        
                        <p>Need help? Contact support@VitronTrade.com</p>
                    </div>
                </body>
                </html>
                      `
            };

            await transporter.sendMail(mailOptions);
            console.log(`deposit email sent to ${email}`);
            
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }       
      },

    }
}

module.exports = EmailTemplate();