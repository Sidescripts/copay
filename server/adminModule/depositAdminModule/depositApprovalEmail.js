const transporter = require("../../utils/nodemailer");


function EmailTemplates() {
    return {
      // DEPOSIT APPROVAL EMAIL
      depositApprovalEmail: async function({email, amount, asset, transactionId, approvalDate}) {
        
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Deposit approval - VitronTrade',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Deposit Approved - VitronTrade/title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            max-width: 600px; 
                            margin: 0 auto; 
                            padding: 20px; 
                            background-color: #f9f9f9; 
                        }
                        .header { 
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                            padding: 30px; 
                            text-align: center; 
                            border-radius: 10px 10px 0 0; 
                        }
                        .logo { 
                            color: white; 
                            font-size: 28px; 
                            font-weight: bold; 
                            margin: 0; 
                        }
                        .content { 
                            background: white; 
                            padding: 30px; 
                            border-radius: 0 0 10px 10px; 
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                        }
                        .approval-badge { 
                            background: #10b981; 
                            color: white; 
                            padding: 12px 24px; 
                            border-radius: 25px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin-bottom: 20px;
                            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                        }
                        .amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #059669; 
                            margin: 15px 0; 
                            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .transaction-details { 
                            background: #f0fdf4; 
                            padding: 25px; 
                            border-radius: 12px; 
                            margin: 25px 0; 
                            border-left: 4px solid #10b981;
                        }
                        .detail-row { 
                            display: flex; 
                            justify-content: space-between; 
                            padding: 12px 0; 
                            border-bottom: 1px solid #dcfce7; 
                        }
                        .detail-row:last-child { 
                            border-bottom: none; 
                        }
                        .detail-label { 
                            font-weight: 600; 
                            color: #374151; 
                        }
                        .detail-value { 
                            font-weight: 500; 
                            color: #059669; 
                            text-align: right;
                        }
                        .admin-section { 
                            background: #eff6ff; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border-left: 4px solid #3b82f6;
                        }
                        .celebrate-emoji { 
                            font-size: 24px; 
                            margin: 0 5px; 
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            padding-top: 20px; 
                            border-top: 1px solid #e2e8f0; 
                            color: #718096; 
                            font-size: 14px;
                        }
                        .security-note {
                            background: #fef3c7;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 20px 0;
                            border-left: 4px solid #f59e0b;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="logo">🎉 Deposit Approved!</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your funds are now available</p>
                    </div>
                    
                    <div class="content">
                        
                        
                        <h2>Great news, ${email}! <span class="celebrate-emoji">🎊</span></h2>
                        <p>Your deposit has been reviewed and approved by our security team. Your funds are now available in your account.</p>
                        
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px;">
                            <div class="amount">${amount} ${asset.toUpperCase()}</div>
                            <p style="font-size: 18px; color: #059669; margin: 5px 0;">has been successfully credited to your wallet</p>
                        </div>
                
                        <div class="transaction-details">
                            <h3 style="margin-top: 0; color: #065f46;">Transaction Details</h3>
                            <div class="detail-row">
                                <span class="detail-label">Transaction ID:</span>
                                <span class="detail-value"><strong>${transactionId}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Asset:</span>
                                <span class="detail-value"><strong>${asset.toUpperCase()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Amount Credited:</span>
                                <span class="detail-value"><strong>${amount} ${asset.toUpperCase()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Approval Date:</span>
                                <span class="detail-value"><strong>${new Date(approvalDate).toLocaleString()}</strong></span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value"><strong style="color: #10b981;">COMPLETED</strong></span>
                            </div>
                        </div>
                
                        
                
                        <div class="security-note">
                            <strong>🔒 Security Confirmation:</strong>
                            <p>This deposit has passed all security checks and has been verified by our team. Your funds are now safe and available for use.</p>
                        </div>
                
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/public/pages/login.html" 
                               style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                      color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                               🚀 View Your Wallet
                            </a>
                        </p>
                
                        <p><strong>Next steps:</strong> You can now use these funds for trading, investments, or withdrawals.</p>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} VitronTrade. All rights reserved.</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>Need assistance? Contact our support team at support@vitrontrade.com</p>
                    </div>
                </body>
                </html>
                      `
            }

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
      }
    };
  }
  
  module.exports = EmailTemplates();