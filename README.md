# Mood App 📱

A beautiful mobile mood tracking app built with React Native and Expo. Track your daily moods, add notes, and view your mood history with analytics.

## Features ✨

- **Mood Selection**: Choose from 8 predefined moods with descriptions and tips
- **Custom Moods**: Add your own moods with descriptions and tips
- **Favorites**: Star your favorite moods for quick access
- **Search**: Find moods quickly with the search feature
- **Mood History**: View all your past mood entries with timestamps
- **Analytics**: See your most selected moods and total entries
- **Dark Mode**: Automatic dark/light mode support
- **Daily Reminders**: Get reminded to log your mood each day
- **Streak Counter**: Track your mood logging streak
- **Confetti Animation**: Celebrate when you save your mood!
- **Text Notes**: Add personal notes to your mood entries

## Screenshots 📸

*Add screenshots here when you have them*

## Prerequisites 📋

Before running this app, make sure you have:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Expo CLI**
   - Install globally: `npm install -g @expo/cli`
   - Verify installation: `expo --version`

3. **Expo Go App** (for mobile testing)
   - iOS: Download from App Store
   - Android: Download from Google Play Store

## Installation & Setup 🚀

### Step 1: Clone the Repository
```bash
git clone https://github.com/harlvilleta/tom.git
cd tom/mood-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Run on Your Device
1. Open **Expo Go** app on your phone
2. Scan the QR code that appears in your terminal
3. The app will load on your device!

## Alternative Commands 🔧

```bash
# Start with Expo
expo start

# Start with tunnel (if local network doesn't work)
expo start --tunnel

# Start on web browser (limited functionality)
expo start --web
```

## Project Structure 📁

```
mood-app/
├── App.js              # Main application component
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## How to Use 📖

1. **Select a Mood**: Tap on any mood to select it
2. **View Details**: Selected moods show description and tips
3. **Add Notes**: Write personal notes about your mood
4. **Save**: Tap "Save Mood & Note" to record your entry
5. **Search**: Use the search bar to find specific moods
6. **Favorites**: Tap the star to mark favorite moods
7. **Custom Moods**: Add your own moods at the bottom
8. **View History**: Scroll down to see your mood history
9. **Analytics**: Check your mood statistics

## Troubleshooting 🔧

### Common Issues:

**QR Code Not Working:**
- Make sure your phone and computer are on the same WiFi network
- Try using `expo start --tunnel` for a tunnel connection

**App Not Loading:**
- Check if Expo Go is up to date
- Restart the development server: `expo start --clear`

**Dependencies Issues:**
- Delete `node_modules` folder and run `npm install` again
- Clear npm cache: `npm cache clean --force`

**Metro Bundler Issues:**
- Reset Metro cache: `expo start --clear`
- Check your internet connection

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Support 💬

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the [Expo documentation](https://docs.expo.dev/)
- Visit the [React Native documentation](https://reactnative.dev/)

---

Made with ❤️ using React Native and Expo 