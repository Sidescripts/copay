const transporter = require("../../utils/nodemailer");


function EmailTemplate(){
    return {
        // INVESTMENT CONFIRMATION EMAIL
      investmentEmail: async function({ amount, planName, duration, expectedROI, endDate, investmentId, status,  email}) {

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Investment confirmation - VitronTrade',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Investment Confirmation - Copay</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; }
                        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .status-badge { 
                            background: #8b5cf6; color: white; padding: 8px 16px; border-radius: 20px; 
                            font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px;
                        }
                        .amount { font-size: 32px; font-weight: bold; color: #7c3aed; margin: 10px 0; }
                        .investment-details { background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ede9fe; }
                        .detail-row:last-child { border-bottom: none; }
                        .roi-badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
                        .progress-bar { background: #ede9fe; height: 8px; border-radius: 4px; margin: 15px 0; overflow: hidden; }
                        .progress-fill { background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); height: 100%; width: 0%; transition: width 2s; }
                        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="logo">📈 Investment Activated</h1>
                    </div>
                    
                    <div class="content">
                        <div class="status-badge">🚀 ${status.toUpperCase()}</div>
                        
                        <p>Your investment has been successfully activated and is now earning returns.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div class="amount">${amount} USDT</div>
                            <p>invested in <strong>${planName}</strong></p>
                        </div>
                
                        <div class="investment-details">
                            <h3 style="margin-top: 0;">Investment Overview</h3>
                            <div class="detail-row">
                                <span>Investment ID:</span>
                                <span><strong>${investmentId}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Plan Name:</span>
                                <span><strong>${planName}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Investment Amount:</span>
                                <span><strong>${amount} USDT</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Duration:</span>
                                <span><strong>${duration} days</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Expected ROI:</span>
                                <span><strong>${expectedROI} USDT <span class="roi-badge">+${((expectedROI/amount)*100).toFixed(2)}%</span></strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Maturity Date:</span>
                                <span><strong>${new Date(endDate).toLocaleDateString()}</strong></span>
                            </div>
                            <div class="detail-row">
                                <span>Status:</span>
                                <span><strong style="color: #7c3aed;">${status}</strong></span>
                            </div>
                        </div>
                
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p style="text-align: center; color: #6b7280;">Your investment is now active and growing</p>
                
                        <p><strong>💡 Tip:</strong> You can monitor your investment performance in your dashboard anytime.</p>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} VitronTrade. All rights reserved.</p>
                        <p>Happy investing! 📊</p>
                    </div>
                
                    <script>
                        setTimeout(() => {
                            document.querySelector('.progress-fill').style.width = '100%';
                        }, 1000);
                    </script>
                </body>
                </html>
                      `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Investment confirmation email sent to ${email}`);
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
      }
    }
}


module.exports = EmailTemplate();