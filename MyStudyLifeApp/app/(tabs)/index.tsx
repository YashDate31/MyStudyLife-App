import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AppLogo from '../../components/AppLogo';

interface DashboardData {
  totalClasses: number;
  pendingAssignments: number;
  activeReminders: number;
  todaysClasses: any[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalClasses: 0,
    pendingAssignments: 0,
    activeReminders: 0,
    todaysClasses: [],
  });

  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadDashboardData();
    loadStudentName();
    setGreeting(getGreeting());
    setCurrentDate(getCurrentDate());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
      loadStudentName(); // <-- Add this line to reload student name on focus
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! 🌅';
    if (hour < 17) return 'Good Afternoon! ☀️';
    return 'Good Evening! 🌙';
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const loadStudentName = async () => {
    try {
      const name = await AsyncStorage.getItem('studentName');
      setStudentName(name || 'Student');
    } catch (error) {
      console.error('Error loading student name:', error);
      setStudentName('Student');
    }
  };

  const loadDashboardData = async () => {
    const [classes, assignments, reminders] = await Promise.all([
      AsyncStorage.getItem('classes'),
      AsyncStorage.getItem('assignments'),
      AsyncStorage.getItem('reminders'),
    ]);

    const classesData = classes ? JSON.parse(classes) : [];
    const assignmentsData = assignments ? JSON.parse(assignments) : [];
    const remindersData = reminders ? JSON.parse(reminders) : [];

    setDashboardData({
      totalClasses: classesData.length,
      pendingAssignments: assignmentsData.length,
      activeReminders: remindersData.length,
      todaysClasses: [],
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: string; 
    color: string; 
  }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const QuickAction = ({ 
    title, 
    icon, 
    color, 
    onPress 
  }: { 
    title: string; 
    icon: string; 
    color: string; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <AppLogo size={80} showText={false} />
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.studentName}>👨‍🎓 {studentName}</Text>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>📚 MyStudyLife</Text>
        <Text style={styles.welcomeSubtitle}>Your ultimate study companion</Text>
        <Text style={styles.welcomeDescription}>
          Organize your classes, track assignments, schedule exams, and set reminders all in one place!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Quick Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Classes"
            value={dashboardData.totalClasses}
            icon="🎓"
            color="#3498db"
          />
          <StatCard
            title="Assignments"
            value={dashboardData.pendingAssignments}
            icon="📝"
            color="#e74c3c"
          />
          <StatCard
            title="Reminders"
            value={dashboardData.activeReminders}
            icon="🔔"
            color="#27ae60"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="Classes"
            icon="🎓"
            color="#3498db"
            onPress={() => router.push('/classes')}
          />
          <QuickAction
            title="Assignments"
            icon="📝"
            color="#e74c3c"
            onPress={() => router.push('/assignments')}
          />
          <QuickAction
            title="Reminders"
            icon="🔔"
            color="#27ae60"
            onPress={() => router.push('/reminders')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Study Tips</Text>
        <View style={styles.tipsCard}>
          <Text style={styles.tipText}>
            "Success is the sum of small efforts repeated day in and day out." 💪
          </Text>
          <Text style={styles.tipAuthor}>- Robert Collier</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for students</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    textAlign: 'left',
  },
  date: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  welcomeCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    color: '#2c3e50',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  tipAuthor: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});
