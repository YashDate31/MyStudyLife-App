import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  notes: string;
  studyProgress: number;
}

export default function ExamsScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    location: '',
    duration: '',
    notes: '',
  });
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const savedExams = await AsyncStorage.getItem('exams');
      if (savedExams) {
        setExams(JSON.parse(savedExams));
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    }
  };
  const saveExams = async (updatedExams: Exam[]) => {
    try {
      console.log('saveExams called with:', updatedExams);
      await AsyncStorage.setItem('exams', JSON.stringify(updatedExams));
      console.log('Successfully saved to AsyncStorage');
      setExams(updatedExams);
      console.log('Updated state with:', updatedExams);
    } catch (error) {
      console.error('Error saving exams:', error);
      Alert.alert('Error', 'Failed to save exam. Please try again.');
    }
  };
  const addOrUpdateExam = () => {
    console.log('addOrUpdateExam called with formData:', formData);
    
    if (!formData.subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    const newExam: Exam = {
      id: editingExam?.id || Date.now().toString(),
      subject: formData.subject,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      duration: formData.duration,
      notes: formData.notes,
      studyProgress: editingExam?.studyProgress || 0,
    };

    console.log('Created newExam:', newExam);

    let updatedExams;
    if (editingExam) {
      updatedExams = exams.map(e => e.id === editingExam.id ? newExam : e);
      console.log('Updating existing exam');
    } else {
      updatedExams = [...exams, newExam];
      console.log('Adding new exam');
    }

    console.log('About to save exams:', updatedExams);
    saveExams(updatedExams);
    setModalVisible(false);
    resetForm();
  };

  const updateStudyProgress = (id: string, progress: number) => {
    const updatedExams = exams.map(exam =>
      exam.id === id ? { ...exam, studyProgress: progress } : exam
    );
    saveExams(updatedExams);
  };

  const deleteExam = (id: string) => {
    Alert.alert(
      'Delete Exam',
      'Are you sure you want to delete this exam?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedExams = exams.filter(e => e.id !== id);
            saveExams(updatedExams);
          },
        },
      ]
    );
  };

  const editExam = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject,
      date: exam.date,
      time: exam.time,
      location: exam.location,
      duration: exam.duration,
      notes: exam.notes,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ subject: '', date: '', time: '', location: '', duration: '', notes: '' });
    setEditingExam(null);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return '#e74c3c';
    if (progress < 70) return '#f39c12';
    return '#27ae60';
  };

  const renderExam = ({ item }: { item: Exam }) => (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <Text style={styles.examSubject}>{item.subject}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{item.studyProgress}%</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.studyProgress}%`,
                    backgroundColor: getProgressColor(item.studyProgress),
                  }
                ]}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => setMenuVisibleId(item.id)}>
            <MaterialIcons name="more-vert" size={22} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      </View>
      {item.date && <Text style={styles.examDetail}>📅 {item.date}</Text>}
      {item.time && <Text style={styles.examDetail}>🕐 {item.time}</Text>}
      {item.location && <Text style={styles.examDetail}>📍 {item.location}</Text>}
      {item.duration && <Text style={styles.examDetail}>⏱️ Duration: {item.duration}</Text>}
      {item.notes && <Text style={styles.examNotes}>📝 {item.notes}</Text>}
      <View style={styles.progressButtons}>
        <TouchableOpacity
          style={[styles.progressBtn, { backgroundColor: '#e74c3c' }]}
          onPress={() => updateStudyProgress(item.id, Math.max(0, item.studyProgress - 25))}
        >
          <Text style={styles.progressBtnText}>-25%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.progressBtn, { backgroundColor: '#27ae60' }]}
          onPress={() => updateStudyProgress(item.id, Math.min(100, item.studyProgress + 25))}
        >
          <Text style={styles.progressBtnText}>+25%</Text>
        </TouchableOpacity>
      </View>
      {menuVisibleId === item.id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); editExam(item); }} style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); setTimeout(() => deleteExam(item.id), 100); }} style={styles.menuItem}>
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exams</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Exam</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={exams}
        renderItem={renderExam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {editingExam ? 'Edit Exam' : 'Add New Exam'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Subject *"
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Date (e.g., June 20, 2025)"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 2:00 PM)"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Location (e.g., Room 101)"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Duration (e.g., 2 hours)"
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    console.log('Save button pressed');
                    addOrUpdateExam();
                  }}
                >
                  <Text style={styles.saveButtonText}>
                    {editingExam ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  examCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  examSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  examDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  examNotes: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 8,
    fontStyle: 'italic',
  },
  progressButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  progressBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
  },
  progressBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#9b59b6',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: 36,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  menuItem: {
    padding: 12,
    minWidth: 80,
  },
  menuText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'left',
  },
});
