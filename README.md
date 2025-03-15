FinanceGenie
![image](https://github.com/user-attachments/assets/323aedee-eecb-41d0-93e4-6d5889a06d92)

Overview
FinanceGenie is an AI-powered financial assistant that provides real-time stock data, market insights, and investment advice. The application combines conversational AI with live financial data to help users make informed investment decisions.
Features

AI Chat Interface: Ask questions about stocks, financial markets, or investment strategies and get intelligent responses.
Real-time Stock Data: View current stock prices, performance metrics, and charts for any publicly traded company.
Stock History Tracking: Easily access your recently viewed stocks.
Market Overview: Get a snapshot of current market conditions.
Responsive Design: Works seamlessly on desktop and mobile devices.

Technical Implementation
1. AI Model Integration

Powered by the Deep Seek AI model via the Deep Seek API
Model trained on financial data and conversational patterns
Optimized for financial terminology and stock market knowledge
Handles context-aware conversations about investments and market trends

2. Chat Interface
The core of the application is a conversational interface that can:

Answer general financial questions
Recognize stock ticker symbols in user queries
Provide real-time stock data when requested
Maintain context throughout the conversation

3. Yahoo Finance API Integration

Real-time stock data is fetched using the Yahoo Finance API
Implemented rate limiting (max 40 requests per minute) and caching to avoid API throttling
Stock data includes current price, percentage change, and historical performance

4. Data Visualization

Interactive stock charts display historical price data
Data visualization components are built using Recharts

5. Local Storage

Chat history is preserved between sessions using localStorage
Recently viewed stocks are tracked and easily accessible

6. Firebase Integration

The application is deployed using Firebase Hosting
Configuration is set up for continuous deployment

Technologies Used

React: Frontend UI library
TypeScript: For type-safe code
Deep Seek API: AI model integration for financial intelligence
Tailwind CSS: Utility-first CSS framework
shadcn/ui: Component library for consistent UI
Recharts: Data visualization library
Lucide React: Icon library
Firebase: Hosting and deployment
localStorage: Client-side storage

Firebase Deployment
The application is configured for Firebase deployment with:

Proper Firebase configuration in firebase.json
Project linking in .firebaserc
Firebase initialization in the application code

Project Structure

/src/components: UI components
/src/services: API service integrations (including Deep Seek AI)
/src/lib: Utilities and configuration
/src/hooks: Custom React hooks
/src/pages: Application pages

Local Development

Clone the repository
Install dependencies: npm install
Set up environment variables for API keys (Deep Seek API, Yahoo Finance)
Start the development server: npm run dev
Build for production: npm run build
Deploy to Firebase: firebase deploy

Future Enhancements

User authentication and personalized portfolios
Additional financial data sources
Portfolio tracking and analysis
News integration for relevant financial updates
Customizable watchlists and alerts
Enhanced AI model training with user feedback

Contact
S.GOKUL RAJ
gokulrajs2004@gmail.com
8072537612
