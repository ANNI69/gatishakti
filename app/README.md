# Railway Track Fittings QR Code Management System 🚂

A mobile application prototype for Smart India Hackathon 2025 - Problem Statement ID 25021, addressing AI-based development of Laser-based QR Code marking on track fittings for Indian Railways.

## 🎯 Problem Statement

**Title:** AI based development of Laser based QR Code marking on 'track fittings on Indian Railways'

**Organization:** Ministry of Railways

**Background:** Indian Railways procures about 10 crore Elastic Rail Clips, 5 crore liners, and 8.5 crore rail pads annually. There is currently no system for identification of these track fittings with integration to the UDM portal enabling mobile-based scanning for vendor lot number, date of supply, warranty period, inspection dates, etc.

## 🚀 Solution Overview

This prototype demonstrates a unified system for laser-based QR code marking on track fittings with mobile scanning capabilities and AI-based reporting integration.

### Key Features

- **Multi-Role Authentication** - Worker, Inspector, Admin roles
- **QR Code Scanning** - Camera-based QR code scanning with mock data
- **Component Details** - Comprehensive component information display
- **Inspection Forms** - Digital inspection form with rating system
- **Offline Sync** - Data synchronization manager for offline operations
- **History Tracking** - Scan history with search and filtering
- **Smart Notifications** - Priority-based alerts and notifications
- **AI Integration** - Mock AI-based analysis and reporting

## 📱 App Screens

1. **Login Screen** - Role-based authentication (Worker/Inspector/Admin)
2. **Home/Scan Screen** - QR code scanning interface
3. **Component Detail** - Detailed component information and history
4. **Inspection Form** - Digital inspection with ratings and notes
5. **History** - Scan history with search and filters
6. **Sync Manager** - Offline data synchronization
7. **Notifications** - Priority-based alerts and notifications
8. **Profile** - User profile and app settings

## 🛠️ Technology Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router
- **UI Components:** React Native with Ionicons
- **State Management:** React Context API
- **Storage:** AsyncStorage for local data
- **Camera:** Expo BarCode Scanner
- **Notifications:** Expo Notifications

## 📋 Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🔐 Demo Credentials

- **Username:** `user`
- **Password:** `1234`
- **Roles:** Worker, Inspector, Admin

## 📊 Mock QR Codes

Try scanning these demo QR codes:
- **QR001** - Elastic Rail Clip (Active)
- **QR002** - Rail Pad (Active)
- **QR003** - Liner (Needs Inspection)

## 🎨 UI/UX Design Principles

- **Clean & Intuitive** - Simple interface for non-technical users
- **Role-Based Access** - Different features based on user roles
- **Offline-First** - Works without internet connectivity
- **Responsive Design** - Optimized for mobile devices
- **Accessibility** - Clear icons and readable text

## 🔮 Future Enhancements

- **Real QR Code Integration** - Connect with actual laser-marked QR codes
- **API Integration** - Connect with UDM and TMS portals
- **AI Analysis** - Real AI-based component analysis
- **Advanced Reporting** - Comprehensive reporting dashboard
- **Multi-language Support** - Support for regional languages
- **Biometric Authentication** - Enhanced security features

## 📈 Expected Impact

- **Improved Tracking** - Complete lifecycle tracking of railway components
- **Quality Assurance** - Systematic inspection and maintenance scheduling
- **Cost Reduction** - Reduced manual processes and improved efficiency
- **Safety Enhancement** - Proactive maintenance and quality monitoring
- **Data-Driven Decisions** - AI-powered insights for better decision making

## 🏆 Smart India Hackathon 2025

This prototype demonstrates the potential of digital transformation in railway infrastructure management, showcasing how modern mobile technology can enhance safety, efficiency, and quality control in Indian Railways.

**Team:** Railway Innovation Team  
**Category:** Transportation & Logistics  
**Theme:** Hardware & Software Solution

## 📞 Support

For technical support or questions about this prototype, please contact the development team.

---

*Built with ❤️ for Smart India Hackathon 2025*
