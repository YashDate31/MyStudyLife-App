# MyStudyLife App

A comprehensive study management application to help students organize their academic life efficiently. Built with React Native/Expo for mobile and Node.js/TypeScript for the backend API.

## 🎯 Features

### Mobile App (React Native/Expo)
- **📚 Assignment Management**: Track homework and project deadlines
- **📅 Class Scheduling**: Organize your daily class timetable
- **🎓 Exam Planning**: Manage exam dates and study schedules
- **⏰ Reminders**: Never miss important deadlines
- **📊 Progress Tracking**: Monitor your academic progress
- **👤 Profile Management**: Personalize your study experience

### Backend API (Node.js/TypeScript)
- **RESTful API**: Clean endpoints for data management
- **Task Management**: CRUD operations for assignments
- **Schedule Management**: Class and exam scheduling
- **Data Models**: Structured data for subjects, tasks, and exams

## 🏗️ Project Structure

```
MyStudyLife-App/
├── my-study-life-app/          # Backend API (Node.js/TypeScript)
│   ├── src/
│   │   ├── app.ts              # Main server file
│   │   ├── components/         # Business logic components
│   │   ├── models/            # Data models
│   │   └── services/          # Data services
│   └── package.json
├── MyStudyLifeApp/            # Mobile App (React Native/Expo)
│   ├── app/                   # App screens and navigation
│   ├── components/            # Reusable UI components
│   ├── assets/               # Images, fonts, and icons
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for mobile development)
- Android Studio or Xcode (for device simulation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashDate31/MyStudyLife-App.git
   cd MyStudyLife-App
   ```

2. **Set up the Backend API**
   ```bash
   cd my-study-life-app
   npm install
   npm start
   ```
   The API will be available at `http://localhost:3000`

3. **Set up the Mobile App**
   ```bash
   cd ../MyStudyLifeApp
   npm install
   npm start
   ```

### Running the Applications

#### Backend API
```bash
cd my-study-life-app
npm start                 # Start the development server
npm run build            # Build for production
```

#### Mobile App
```bash
cd MyStudyLifeApp
npm start                # Start Expo development server
npm run android          # Run on Android device/emulator
npm run ios             # Run on iOS device/simulator
npm run web             # Run in web browser
```

## 📱 Mobile App Features

| Screen | Description |
|--------|-------------|
| **Assignments** | Manage homework and project deadlines |
| **Classes** | View and organize class schedules |
| **Exams** | Track exam dates and preparation |
| **Timetable** | Weekly schedule overview |
| **Reminders** | Important notifications and alerts |
| **Profile** | User settings and preferences |

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Get dashboard overview |
| `GET` | `/schedule` | Retrieve schedule items |
| `GET` | `/tasks` | Get all tasks |

## 🛠️ Tech Stack

### Mobile App
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library

### Backend API
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **ts-node** - TypeScript execution environment

## 📦 Dependencies

### Backend
- `express` - Web framework
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `@types/express` - Express type definitions

### Mobile App
- `expo` - Expo SDK
- `react-native` - React Native framework
- `@react-navigation/*` - Navigation components
- `@expo/vector-icons` - Icon library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Roadmap

- [ ] Database integration (SQLite/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Push notifications for reminders
- [ ] Data synchronization between devices
- [ ] Offline mode support
- [ ] Calendar integration
- [ ] Study analytics and insights
- [ ] Dark mode theme
- [ ] Export/import functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Yash Date** - [YashDate31](https://github.com/YashDate31)

## 🙏 Acknowledgments

- Expo team for the excellent development platform
- React Native community for continuous support
- All contributors who help improve this project

---

⭐ If you find this project helpful, please give it a star on GitHub!
