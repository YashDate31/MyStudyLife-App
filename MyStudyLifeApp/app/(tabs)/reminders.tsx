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

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: 'assignment' | 'exam' | 'class' | 'personal';
  isCompleted: boolean;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'personal' as 'assignment' | 'exam' | 'class' | 'personal',
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
  });
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const categoryColors = {
    assignment: '#e74c3c',
    exam: '#9b59b6',
    class: '#3498db',
    personal: '#27ae60',
  };

  const categoryIcons = {
    assignment: '📝',
    exam: '📚',
    class: '🎓',
    personal: '⭐',
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };
  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      console.log('Saving reminders to AsyncStorage:', updatedReminders.length);
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      console.log('Setting reminders state:', updatedReminders.length);
      setReminders(updatedReminders);
      console.log('Reminders state updated successfully');
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addOrUpdateReminder = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }

    const newReminder: Reminder = {
      id: editingReminder?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      repeat: formData.repeat,
      isCompleted: editingReminder?.isCompleted || false,
    };

    let updatedReminders;
    if (editingReminder) {
      updatedReminders = reminders.map(r => r.id === editingReminder.id ? newReminder : r);
    } else {
      updatedReminders = [...reminders, newReminder];
    }

    saveReminders(updatedReminders);
    setModalVisible(false);
    resetForm();
  };

  const toggleCompletion = (id: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, isCompleted: !reminder.isCompleted }
        : reminder
    );
    saveReminders(updatedReminders);
  };  const deleteReminder = (id: string) => {
    console.log('Delete reminder called for ID:', id);
    setMenuVisibleId(null);
    setTimeout(() => {
      Alert.alert(
        'Delete Reminder',
        'Are you sure you want to delete this reminder?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              console.log('User confirmed deletion for ID:', id);
              console.log('Current reminders before delete:', reminders.length);
              const updatedReminders = reminders.filter(r => r.id !== id);
              console.log('Updated reminders after filter:', updatedReminders.length);
              saveReminders(updatedReminders);
            },
          },
        ]
      );
    }, 100);
  };

  const editReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      category: reminder.category,
      repeat: reminder.repeat,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      date: '', 
      time: '', 
      category: 'personal', 
      repeat: 'none' 
    });
    setEditingReminder(null);
  };  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[
      styles.reminderCard,
      { borderLeftColor: categoryColors[item.category] },
      item.isCompleted && styles.completedCard
    ]}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderTitleRow}>
          <Text style={styles.categoryIcon}>{categoryIcons[item.category]}</Text>
          <Text style={[
            styles.reminderTitle,
            item.isCompleted && styles.completedText
          ]}>
            {item.title}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: categoryColors[item.category] }
          ]}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuVisibleId(menuVisibleId === item.id ? null : item.id)}>
            <MaterialIcons name="more-vert" size={22} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      </View>
      {item.description && (
        <Text style={[
          styles.reminderDescription,
          item.isCompleted && styles.completedText
        ]}>
          {item.description}
        </Text>
      )}
      <View style={styles.reminderDetails}>
        {item.date && (
          <Text style={styles.reminderDetail}>📅 {item.date}</Text>
        )}
        {item.time && (
          <Text style={styles.reminderDetail}>🕐 {item.time}</Text>
        )}
        {item.repeat !== 'none' && (
          <Text style={styles.reminderDetail}>🔄 {item.repeat}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.completionButton,
          { backgroundColor: item.isCompleted ? '#27ae60' : '#95a5a6' }
        ]}
        onPress={() => toggleCompletion(item.id)}
      >
        <Text style={styles.completionButtonText}>
          {item.isCompleted ? '✓ Completed' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
      {menuVisibleId === item.id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); editReminder(item); }} style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.menuItem}>
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
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
                {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Reminder Title *"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />

              <TextInput
                style={styles.input}
                placeholder="Date (e.g., June 15, 2025)"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 2:00 PM)"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
              />

              <Text style={styles.labelText}>Category:</Text>
              <View style={styles.categoryContainer}>
                {(['assignment', 'exam', 'class', 'personal'] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: categoryColors[category] },
                      formData.category === category && styles.selectedCategory
                    ]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text style={styles.categoryOptionText}>
                      {categoryIcons[category]} {category.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.labelText}>Repeat:</Text>
              <View style={styles.repeatContainer}>
                {(['none', 'daily', 'weekly', 'monthly'] as const).map((repeat) => (
                  <TouchableOpacity
                    key={repeat}
                    style={[
                      styles.repeatOption,
                      formData.repeat === repeat && styles.selectedRepeat
                    ]}
                    onPress={() => setFormData({ ...formData, repeat })}
                  >
                    <Text style={[
                      styles.repeatOptionText,
                      formData.repeat === repeat && styles.selectedRepeatText
                    ]}>
                      {repeat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addOrUpdateReminder}
                >
                  <Text style={styles.saveButtonText}>
                    {editingReminder ? 'Update' : 'Save'}
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
    backgroundColor: '#27ae60',
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
  reminderCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reminderDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  reminderDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  reminderDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 16,
    marginBottom: 4,
  },
  completionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  completionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
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
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    opacity: 0.7,
    minWidth: '48%',
  },
  selectedCategory: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  categoryOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  repeatOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  selectedRepeat: {
    backgroundColor: '#27ae60',
  },
  repeatOptionText: {
    color: '#7f8c8d',
    fontWeight: '600',
    fontSize: 12,
  },
  selectedRepeatText: {
    color: '#fff',
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
    backgroundColor: '#27ae60',
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
