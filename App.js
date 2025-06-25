import React, { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Animated, Dimensions, TextInput, ScrollView, Appearance, useColorScheme, Keyboard } from 'react-native';

const INITIAL_MOODS = [
  { mood: '😊 Happy', description: 'Feeling or showing pleasure or contentment.', favorite: false, custom: false, tip: 'Share your happiness with someone today!' },
  { mood: '😢 Sad', description: 'Feeling or showing sorrow; unhappy.', favorite: false, custom: false, tip: 'Talk to a friend or write down your feelings.' },
  { mood: '😡 Angry', description: 'Feeling or showing strong annoyance, displeasure, or hostility.', favorite: false, custom: false, tip: 'Take deep breaths or go for a walk to cool down.' },
  { mood: '😱 Surprised', description: 'Feeling or showing surprise because of something unexpected.', favorite: false, custom: false, tip: 'Embrace the unexpected and stay open-minded.' },
  { mood: '😴 Tired', description: 'In need of sleep or rest; weary.', favorite: false, custom: false, tip: 'Take a short nap or get some fresh air.' },
  { mood: '😌 Calm', description: 'Not showing or feeling nervousness, anger, or other strong emotions.', favorite: false, custom: false, tip: 'Enjoy the peace and do something you love.' },
  { mood: '🤔 Thoughtful', description: 'Absorbed in or involving thought.', favorite: false, custom: false, tip: 'Write down your thoughts or share them with someone.' },
  { mood: '😇 Grateful', description: 'Feeling or showing an appreciation of kindness; thankful.', favorite: false, custom: false, tip: 'Express your gratitude to someone today.' },
];

const windowWidth = Dimensions.get('window').width;

function getTodayDateString() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function Confetti({ show }) {
  const [anim] = useState(new Animated.Value(0));
  React.useEffect(() => {
    if (show) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => anim.setValue(0));
    }
  }, [show]);
  if (!show) return null;
  return (
    <Animated.View style={{
      position: 'absolute',
      top: 80,
      left: 0,
      right: 0,
      alignItems: 'center',
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) }],
      zIndex: 100,
    }}>
      <Text style={{ fontSize: 40 }}>🎉✨🎊🥳🎈</Text>
    </Animated.View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [moods, setMoods] = useState(INITIAL_MOODS);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [streak, setStreak] = useState(1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [customMood, setCustomMood] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customTip, setCustomTip] = useState('');
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Mood analytics
  const moodCounts = useMemo(() => {
    const counts = {};
    history.forEach(h => {
      counts[h.mood] = (counts[h.mood] || 0) + 1;
    });
    return counts;
  }, [history]);
  const mostSelectedMood = useMemo(() => {
    let max = 0, mood = null;
    Object.entries(moodCounts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        mood = k;
      }
    });
    return mood;
  }, [moodCounts]);

  // Daily mood reminder
  const today = getTodayDateString();
  const hasTodayMood = history.some(h => h.date === today);

  const handleSelect = (index) => {
    if (selected !== index) {
      setSelected(index);
      setToast(`You are feeling ${moods[index].mood.split(' ')[1]}!`);
      setStreak(streak + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setToast(''), 2000);
      setSearch(''); // Clear search after clicking a mood
    } else {
      setSelected(null);
    }
  };

  const handleAddMood = () => {
    if (!customMood.trim() || !customDesc.trim()) {
      setToast('Please fill in both Mood and Description!');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    setMoods([
      ...moods,
      { mood: customMood, description: customDesc, favorite: false, custom: true, tip: customTip || 'No tip yet.' },
    ]);
    setCustomMood('');
    setCustomDesc('');
    setCustomTip('');
    setSearch(''); // Clear search after adding
    setSelected(null); // Clear selection after adding
    setToast('Mood added!');
    setTimeout(() => setToast(''), 2000);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setSelected(null);
    setStreak(1);
    setToast('Selection and streak reset!');
    setTimeout(() => setToast(''), 2000);
  };

  const handleToggleFavorite = (index) => {
    setMoods(moods.map((m, i) => i === index ? { ...m, favorite: !m.favorite } : m));
  };

  const handleDeleteMood = (index) => {
    setMoods(moods.filter((_, i) => i !== index));
    if (selected === index) setSelected(null);
    setSearch(''); // Clear search after deleting
  };

  const handleSaveNote = () => {
    if (selected !== null) {
      setHistory([
        {
          mood: moods[selected].mood,
          time: new Date().toLocaleTimeString(),
          date: today,
          note: note.trim(),
        },
        ...history,
      ]);
      setNote('');
      setSelected(null);
      setToast('Mood and note saved!');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      setTimeout(() => setToast(''), 2000);
      setSearch(''); // Clear search after saving note
      Keyboard.dismiss();
    }
  };

  // Show favorites first, then filter by search
  const sortedMoods = useMemo(() => {
    let filtered = moods;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = moods.filter(m => m.mood.toLowerCase().includes(s) || m.description.toLowerCase().includes(s));
    }
    return [
      ...filtered.filter(m => m.favorite),
      ...filtered.filter(m => !m.favorite),
    ];
  }, [moods, search]);

  const renderItem = ({ item }) => {
    const realIndex = moods.findIndex(m => m.mood === item.mood && m.description === item.description);
    return (
      <View style={styles.moodRow}>
        <TouchableOpacity
          style={[
            styles.moodItem,
            selected === realIndex && styles.selectedMoodItem,
            isDark && styles.moodItemDark,
            isDark && selected === realIndex && styles.selectedMoodItemDark,
          ]}
          onPress={() => handleSelect(realIndex)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[
            styles.moodText,
            selected === realIndex && styles.selectedMoodText,
            isDark && styles.moodTextDark,
            isDark && selected === realIndex && styles.selectedMoodTextDark,
          ]}>{item.mood}</Text>
          {selected === realIndex && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={[styles.description, isDark && styles.descriptionDark]}>{item.description}</Text>
              {item.tip && (
                <Text style={[styles.tip, isDark && styles.tipDark]}>Tip: {item.tip}</Text>
              )}
            </Animated.View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleToggleFavorite(realIndex)} style={styles.starButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 28 }}>{item.favorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
        {item.custom && (
          <TouchableOpacity onPress={() => handleDeleteMood(realIndex)} style={styles.deleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const styles = getStyles(isDark);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#f0f4f8' }} contentContainerStyle={{ alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}>
      <Confetti show={showConfetti} />
      {!hasTodayMood && (
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderText}>Don't forget to log your mood today!</Text>
        </View>
      )}
      <Text style={styles.title}>How are you feeling today?</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search moods..."
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedMoods}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
      {selected !== null && (
        <View style={styles.noteContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a note or journal entry..."
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            value={note}
            onChangeText={setNote}
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={handleSaveNote}>
            <Text style={styles.addButtonText}>Save Mood & Note</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.addMoodContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mood (e.g. 😍 Excited)"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={customMood}
          onChangeText={setCustomMood}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={customDesc}
          onChangeText={setCustomDesc}
        />
        <TextInput
          style={styles.input}
          placeholder="Sample Solution/Tip (optional)"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={customTip}
          onChangeText={setCustomTip}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMood}>
          <Text style={styles.addButtonText}>Add Mood</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.analyticsTitle}>Mood Analytics</Text>
      <View style={styles.analyticsContainer}>
        <Text style={styles.analyticsText}>Total moods logged: {history.length}</Text>
        <Text style={styles.analyticsText}>Most selected mood: {mostSelectedMood || 'N/A'}</Text>
      </View>
      <Text style={styles.historyTitle}>Mood History</Text>
      {history.length === 0 ? (
        <Text style={styles.noHistory}>No moods selected yet.</Text>
      ) : (
        <View style={styles.historyContainer}>
          {history.map((h, i) => (
            <View key={i} style={styles.historyItemRow}>
              <Text style={styles.historyItem}>{h.date} {h.time}: {h.mood}</Text>
              {h.note ? <Text style={styles.historyNote}>Note: {h.note}</Text> : null}
            </View>
          ))}
        </View>
      )}
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
      <StatusBar style={isDark ? 'light' : 'auto'} />
    </ScrollView>
  );
}

function getStyles(isDark) {
  return StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#333',
    },
    streakContainer: {
      marginBottom: 10,
      backgroundColor: isDark ? '#23242a' : '#fffbe6',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#ffe066',
      flexDirection: 'row',
      alignItems: 'center',
    },
    streakText: {
      color: '#ff8800',
      fontWeight: 'bold',
      fontSize: 16,
      marginRight: 12,
    },
    clearButton: {
      backgroundColor: '#ff5252',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    clearButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    list: {
      paddingBottom: 20,
    },
    moodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    moodItem: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 18,
      marginVertical: 8,
      width: windowWidth * 0.65,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    moodItemDark: {
      backgroundColor: '#23242a',
      borderColor: '#333',
      shadowColor: '#000',
    },
    selectedMoodItem: {
      backgroundColor: '#e0f7fa',
      borderColor: '#00bcd4',
      shadowOpacity: 0.25,
      elevation: 4,
    },
    selectedMoodItemDark: {
      backgroundColor: '#1e293b',
      borderColor: '#00bcd4',
    },
    moodText: {
      fontSize: 20,
      fontWeight: '500',
      color: '#444',
    },
    moodTextDark: {
      color: '#fff',
    },
    selectedMoodText: {
      color: '#00bcd4',
      fontWeight: 'bold',
    },
    selectedMoodTextDark: {
      color: '#00bcd4',
    },
    description: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    descriptionDark: {
      color: '#ccc',
    },
    tip: {
      marginTop: 6,
      fontSize: 15,
      color: '#00796b',
      fontStyle: 'italic',
    },
    tipDark: {
      color: '#80cbc4',
    },
    starButton: {
      marginLeft: 8,
      marginRight: 2,
      padding: 4,
    },
    deleteButton: {
      backgroundColor: '#ff5252',
      borderRadius: 8,
      padding: 4,
      marginLeft: 4,
    },
    addMoodContainer: {
      marginTop: 20,
      width: windowWidth * 0.85,
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 1,
    },
    input: {
      backgroundColor: isDark ? '#181a20' : '#f7f7f7',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      color: isDark ? '#fff' : '#222',
    },
    addButton: {
      backgroundColor: '#00bcd4',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    noteContainer: {
      marginTop: 10,
      width: windowWidth * 0.85,
      backgroundColor: isDark ? '#23242a' : '#e3f2fd',
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
    },
    analyticsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 8,
      color: isDark ? '#fff' : '#333',
    },
    analyticsContainer: {
      width: windowWidth * 0.85,
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    analyticsText: {
      fontSize: 15,
      color: isDark ? '#eee' : '#444',
      marginBottom: 4,
    },
    historyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 8,
      color: isDark ? '#fff' : '#333',
    },
    noHistory: {
      color: isDark ? '#aaa' : '#888',
      fontStyle: 'italic',
      marginBottom: 20,
    },
    historyContainer: {
      width: windowWidth * 0.85,
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    historyItemRow: {
      marginBottom: 8,
    },
    historyItem: {
      fontSize: 15,
      color: isDark ? '#fff' : '#444',
    },
    historyNote: {
      fontSize: 14,
      color: '#00796b',
      fontStyle: 'italic',
      marginLeft: 8,
    },
    toast: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    toastText: {
      backgroundColor: '#00bcd4',
      color: '#fff',
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 24,
      fontSize: 16,
      overflow: 'hidden',
      elevation: 2,
    },
    reminderBanner: {
      backgroundColor: '#ffe066',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      width: windowWidth * 0.85,
      alignItems: 'center',
    },
    reminderText: {
      color: '#b26a00',
      fontWeight: 'bold',
      fontSize: 16,
    },
    searchBar: {
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#e0e0e0',
      width: windowWidth * 0.85,
      color: isDark ? '#fff' : '#222',
    },
  });
}
