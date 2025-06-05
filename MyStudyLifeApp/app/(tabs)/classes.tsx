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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

interface Class {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
  time: string;
}

export default function App() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    room: '',
    time: '',
  });
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const savedClasses = await AsyncStorage.getItem('classes');
      if (savedClasses) {
        setClasses(JSON.parse(savedClasses));
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const saveClasses = async (updatedClasses: Class[]) => {
    try {
      await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error saving classes:', error);
    }
  };

  const addOrUpdateClass = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a class name');
      return;
    }

    const newClass: Class = {
      id: editingClass?.id || Date.now().toString(),
      name: formData.name,
      teacher: formData.teacher,
      room: formData.room,
      time: formData.time,
      color: editingClass?.color || colors[Math.floor(Math.random() * colors.length)],
    };

    let updatedClasses;
    if (editingClass) {
      updatedClasses = classes.map(c => c.id === editingClass.id ? newClass : c);
    } else {
      updatedClasses = [...classes, newClass];
    }

    saveClasses(updatedClasses);
    setModalVisible(false);
    resetForm();
  };

  const deleteClass = (id: string) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedClasses = classes.filter(c => c.id !== id);
            saveClasses(updatedClasses);
          },
        },
      ]
    );
  };

  const editClass = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      teacher: classItem.teacher,
      room: classItem.room,
      time: classItem.time,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ name: '', teacher: '', room: '', time: '' });
    setEditingClass(null);
  };

  const renderClass = ({ item }: { item: Class }) => (
    <View style={[styles.classCard, { backgroundColor: item.color }]}> 
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.className}>{item.name}</Text>
        <TouchableOpacity onPress={() => setMenuVisibleId(item.id)}>
          <MaterialIcons name="more-vert" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {item.teacher && <Text style={styles.classDetail}>👨‍🏫 {item.teacher}</Text>}
      {item.room && <Text style={styles.classDetail}>🏫 {item.room}</Text>}
      {item.time && <Text style={styles.classDetail}>🕐 {item.time}</Text>}
      {menuVisibleId === item.id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); editClass(item); }} style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); setTimeout(() => deleteClass(item.id), 100); }} style={styles.menuItem}>
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
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

      <FlatList
        data={classes}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Class Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Teacher Name"
              value={formData.teacher}
              onChangeText={(text) => setFormData({ ...formData, teacher: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Room Number"
              value={formData.room}
              onChangeText={(text) => setFormData({ ...formData, room: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g., Mon 9:00 AM)"
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
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
                onPress={addOrUpdateClass}
              >
                <Text style={styles.saveButtonText}>
                  {editingClass ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#3498db',
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
  classCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  classDetail: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#e74c3c',
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
