const transporter = require("../../utils/nodemailer");

function EmailTemplates() {
    return {
      welcomeEmail: async function({username, email,loginLink}) {

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to VitronTrade',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to VitronoTrade</title>
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
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
                        .tagline {
                            color: rgba(255, 255, 255, 0.9);
                            font-size: 16px;
                            margin: 5px 0 0 0;
                        }
                        .content {
                            background: white;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .greeting {
                            color: #2d3748;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .features {
                            margin: 25px 0;
                        }
                        .feature-item {
                            display: flex;
                            align-items: center;
                            margin-bottom: 15px;
                            padding: 15px;
                            background: #f7fafc;
                            border-radius: 8px;
                            border-left: 4px solid #667eea;
                        }
                        .feature-icon {
                            font-size: 20px;
                            margin-right: 15px;
                            color: #667eea;
                        }
                        .feature-text {
                            flex: 1;
                        }
                        .cta-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .security-note {
                            background: #e6fffa;
                            padding: 15px;
                            border-radius: 5px;
                            border-left: 4px solid #38b2ac;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e2e8f0;
                            color: #718096;
                            font-size: 14px;
                        }
                        .social-links {
                            margin: 15px 0;
                        }
                        .social-link {
                            color: #667eea;
                            text-decoration: none;
                            margin: 0 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="logo">💎 VitronTrade/h1>
                        <p class="tagline">Trading Made Simple</p>
                    </div>
                    
                    <div class="content">
                        <h2 class="greeting">Welcome to VitronTrades, ${username}! 👋</h2>
                        
                        <p>We're thrilled to have you join our community of crypto enthusiasts and businesses. Get ready to experience seamless trading opportunities and investments.</p>
                        
                        <div class="features">
                            <div class="feature-item">
                                <span class="feature-icon">💰</span>
                                <div class="feature-text">
                                    <strong>Instant Payments</strong>
                                    <p>Send and receive crypto payments in seconds</p>
                                </div>
                            </div>
                            
                            <div class="feature-item">
                                <span class="feature-icon">📈</span>
                                <div class="feature-text">
                                    <strong>Smart Investments</strong>
                                    <p>Grow your crypto with our investment plans</p>
                                </div>
                            </div>
                            
                            <div class="feature-item">
                                <span class="feature-icon">🔒</span>
                                <div class="feature-text">
                                    <strong>Bank-Grade Security</strong>
                                    <p>Your funds are protected with enterprise security</p>
                                </div>
                            </div>
                        </div>
                
                        <div style="text-align: center;">
                            <a href="${loginLink}" class="cta-button">Get Started with VitronTrade</a>
                        </div>
                
                        <div class="security-note">
                            <strong>🔐 Security First:</strong> 
                            <ul>
                                
                                <li>Never share your password or API keys</li>
                                <li>Bookmark our official website: ${process.env.FRONTEND_URL}</li>
                            </ul>
                        </div>
                
                        <p><strong>Need Help?</strong> Our support team is available 24/7 at support@Vitrontrade.com or through our live chat.</p>
                    </div>
                    
                    <div class="footer">
                        <div class="social-links">
                            <a href="#" class="social-link">Twitter</a> • 
                            <a href="#" class="social-link">Telegram</a> • 
                            <a href="#" class="social-link">Discord</a>
                        </div>
                        <p>© ${new Date().getFullYear()} VitronTrade. All rights reserved.</p>
                        
                        
                        <p>You're receiving this email because you created an account on VitronTrade.</p>
                        
                        <p style="font-size: 12px; color: #a0aec0;">
                            VitronTrade Technologies Ltd.
                        </p>
                    </div>
                </body>
                </html>
                      `

            }


            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');

        }

        
      }
    };
}
  
module.exports = EmailTemplates();