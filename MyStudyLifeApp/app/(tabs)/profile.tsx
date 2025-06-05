import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  schoolName: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  profileCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  editButtonActive: {
    backgroundColor: '#27ae60',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  editButtonTextActive: {
    color: '#fff',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fieldInput: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
    minHeight: 44,
    textAlignVertical: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
    alignSelf: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  contactCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontWeight: 'bold',
    color: '#34495e',
    marginRight: 8,
    fontSize: 16,
  },
  contactValue: {
    color: '#2c3e50',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Memoized ProfileField component to prevent unnecessary re-renders
const ProfileField = memo(({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  keyboardType = 'default',
  isEditing
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  isEditing: boolean;
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        blurOnSubmit={true}
        selectTextOnFocus={true}
      />
    ) : (
      <Text style={styles.fieldValue}>{value || 'Not set'}</Text>
    )}
  </View>
));

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    mobile: '',
    schoolName: '',
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    name: '',
    email: '',
    mobile: '',
    schoolName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [name, email, mobile, schoolName] = await Promise.all([
        AsyncStorage.getItem('studentName'),
        AsyncStorage.getItem('studentEmail'),
        AsyncStorage.getItem('studentMobile'),
        AsyncStorage.getItem('schoolName'),
      ]);

      const data = {
        name: name || '',
        email: email || '',
        mobile: mobile || '',
        schoolName: schoolName || '',
      };

      setProfileData(data);
      setOriginalData(data);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const saveProfileData = async () => {
    try {
      // Validate required fields
      if (!profileData.name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }

      setIsLoading(true);

      await Promise.all([
        AsyncStorage.setItem('studentName', profileData.name.trim()),
        AsyncStorage.setItem('studentEmail', profileData.email.trim()),
        AsyncStorage.setItem('studentMobile', profileData.mobile.trim()),
        AsyncStorage.setItem('schoolName', profileData.schoolName.trim()),
      ]);

      setOriginalData(profileData);
      setIsEditing(false);
      Keyboard.dismiss();
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = useCallback(() => {
    setProfileData(originalData);
    setIsEditing(false);
    Keyboard.dismiss();
  }, [originalData]);

  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account information</Text>
      </View>      <View style={styles.profileCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📝 Personal Information</Text>
          <TouchableOpacity
            style={[styles.editButton, isEditing && styles.editButtonActive]}
            onPress={() => {
              if (isEditing) {
                saveProfileData();
              } else {
                setIsEditing(true);
              }
            }}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={[styles.editButtonText, isEditing && styles.editButtonTextActive]}>
              {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ProfileField
          label="Full Name"
          value={profileData.name}
          onChangeText={useCallback((text) => handleFieldChange('name', text), [handleFieldChange])}
          placeholder="Enter your full name"
          isEditing={isEditing}
        />

        <ProfileField
          label="Email Address"
          value={profileData.email}
          onChangeText={useCallback((text) => handleFieldChange('email', text), [handleFieldChange])}
          placeholder="Enter your email address"
          keyboardType="email-address"
          isEditing={isEditing}
        />

        <ProfileField
          label="Mobile Number"
          value={profileData.mobile}
          onChangeText={useCallback((text) => handleFieldChange('mobile', text), [handleFieldChange])}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          isEditing={isEditing}
        />

        <ProfileField
          label="School Name"
          value={profileData.schoolName}
          onChangeText={useCallback((text) => handleFieldChange('schoolName', text), [handleFieldChange])}
          placeholder="Enter your school name"
          isEditing={isEditing}
        />

        {isEditing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelEdit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>📊 Study Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🎓</Text>
            <Text style={styles.statLabel}>Active Student</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>📚</Text>
            <Text style={styles.statLabel}>Organized Learning</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐</Text>
            <Text style={styles.statLabel}>Excellent Progress</Text>
          </View>
        </View>
      </View>

      {/* Contact Us Section */}
      <View style={styles.contactCard}>
        <Text style={styles.cardTitle}>📞 Contact Us</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue} selectable>yashdate35@gmail.com</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>WhatsApp:</Text>
          <Text style={styles.contactValue} selectable>+91 9527266425</Text>
        </View>
      </View>

      {/* Erase All Data Section */}
      <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={async () => {
            await AsyncStorage.clear();
            alert('All saved data (profile, classes, timetable, exams, assignments, reminders) has been erased! The app is now reset.');
          }}
        >
          <Text style={styles.clearButtonText}>Erase All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MyStudyLife v1.0</Text>
        <Text style={styles.footerSubtext}>Making education organized and efficient</Text>
      </View>
    </ScrollView>
  );
}
