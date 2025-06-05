import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

export default function TimetableScreen() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: '',
    room: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F7DC6F', '#BB8FCE'];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const savedTimetable = await AsyncStorage.getItem('timetable');
      if (savedTimetable) {
        setTimeSlots(JSON.parse(savedTimetable));
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const saveTimetable = async (updatedSlots: TimeSlot[]) => {
    try {
      await AsyncStorage.setItem('timetable', JSON.stringify(updatedSlots));
      setTimeSlots(updatedSlots);
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const addOrUpdateSlot = () => {
    console.log('addOrUpdateSlot called with:', formData);
    if (!formData.subject.trim() || !formData.day || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newSlot: TimeSlot = {
      id: editingSlot?.id || Date.now().toString(),
      day: formData.day,
      time: formData.time,
      subject: formData.subject,
      teacher: formData.teacher,
      room: formData.room,
      color: editingSlot?.color || colors[Math.floor(Math.random() * colors.length)],
    };

    let updatedSlots;
    if (editingSlot) {
      updatedSlots = timeSlots.map(slot => slot.id === editingSlot.id ? newSlot : slot);
    } else {
      updatedSlots = [...timeSlots, newSlot];
    }

    console.log('Updated slots:', updatedSlots);
    saveTimetable(updatedSlots);
    setModalVisible(false);
    resetForm();
  };

  const deleteSlot = (id: string) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class from timetable?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedSlots = timeSlots.filter(slot => slot.id !== id);
            saveTimetable(updatedSlots);
          },
        },
      ]
    );
  };

  const editSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      time: slot.time,
      subject: slot.subject,
      teacher: slot.teacher,
      room: slot.room,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    console.log('resetForm called');
    setFormData({ day: '', time: '', subject: '', teacher: '', room: '' });
    setEditingSlot(null);
    setModalVisible(false); // Ensure modal closes on cancel
  };

  const getSlotsForDay = (day: string) => {
    return timeSlots
      .filter(slot => slot.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const renderTimeSlot = (slot: TimeSlot) => (
    <TouchableOpacity
      key={slot.id}
      style={[styles.timeSlot, { backgroundColor: slot.color }]}
      onPress={() => editSlot(slot)}
      onLongPress={() => deleteSlot(slot.id)}
    >
      <Text style={styles.slotTime}>{slot.time}</Text>
      <Text style={styles.slotSubject}>{slot.subject}</Text>
      {slot.teacher && <Text style={styles.slotDetail}>👨‍🏫 {slot.teacher}</Text>}
      {slot.room && <Text style={styles.slotDetail}>🏫 {slot.room}</Text>}
    </TouchableOpacity>
  );

  const renderDay = (day: string) => {
    const daySlots = getSlotsForDay(day);
    
    return (
      <View key={day} style={styles.dayContainer}>
        <Text style={styles.dayTitle}>{day}</Text>
        <View style={styles.slotsContainer}>
          {daySlots.length > 0 ? (
            daySlots.map(renderTimeSlot)
          ) : (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyText}>No classes scheduled</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timetable</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {days.map(renderDay)}
      </ScrollView>

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
                {editingSlot ? 'Edit Class' : 'Add New Class'}
              </Text>

              <Text style={styles.labelText}>Day:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayOption,
                      formData.day === day && styles.selectedDay
                    ]}
                    onPress={() => setFormData({ ...formData, day })}
                  >
                    <Text style={[
                      styles.dayOptionText,
                      formData.day === day && styles.selectedDayText
                    ]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 9:00 AM - 10:00 AM) *"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Subject *"
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Teacher"
                value={formData.teacher}
                onChangeText={(text) => setFormData({ ...formData, teacher: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Room"
                value={formData.room}
                onChangeText={(text) => setFormData({ ...formData, room: text })}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addOrUpdateSlot}
                >
                  <Text style={styles.saveButtonText}>
                    {editingSlot ? 'Update' : 'Save'}
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
    backgroundColor: '#f39c12',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    paddingLeft: 4,
  },
  slotsContainer: {
    gap: 8,
  },
  timeSlot: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  slotSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  slotDetail: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  emptyDay: {
    padding: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#95a5a6',
    fontStyle: 'italic',
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
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  daySelector: {
    marginBottom: 16,
  },
  dayOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  selectedDay: {
    backgroundColor: '#f39c12',
  },
  dayOptionText: {
    color: '#7f8c8d',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff',
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
    backgroundColor: '#f39c12',
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
});
