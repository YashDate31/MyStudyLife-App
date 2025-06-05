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

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export default function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const priorityColors = {
    low: '#27ae60',
    medium: '#f39c12',
    high: '#e74c3c',
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const savedAssignments = await AsyncStorage.getItem('assignments');
      if (savedAssignments) {
        // Ensure status is always 'pending' | 'completed'
        const parsed: any[] = JSON.parse(savedAssignments);
        const migrated: Assignment[] = parsed.map(a => ({
          ...a,
          status: a.status === 'completed' ? 'completed' : 'pending',
        }));
        setAssignments(migrated);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const saveAssignments = async (updatedAssignments: Assignment[]) => {
    try {
      await AsyncStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  };

  function toAssignment(a: any): Assignment {
    return {
      ...a,
      status: a.status === 'completed' ? 'completed' : 'pending',
    };
  }

  const addOrUpdateAssignment = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter an assignment title');
      return;
    }

    const newAssignment: Assignment = {
      id: editingAssignment?.id || Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      dueDate: formData.dueDate,
      description: formData.description,
      priority: formData.priority,
      status: (editingAssignment?.status === 'completed' ? 'completed' : 'pending'),
    };

    let updatedAssignments: Assignment[];
    if (editingAssignment) {
      updatedAssignments = assignments.map(a => a.id === editingAssignment.id ? newAssignment : a);
    } else {
      updatedAssignments = [...assignments, newAssignment];
    }

    // Use type guard to ensure status is correct
    saveAssignments(updatedAssignments.map(toAssignment));
    setModalVisible(false);
    resetForm();
  };

  const toggleStatus = (id: string) => {
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === id
        ? { ...assignment, status: assignment.status === 'pending' ? 'completed' : 'pending' }
        : assignment
    );
    saveAssignments(updatedAssignments.map(toAssignment));
  };

  const deleteAssignment = (id: string) => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAssignments = assignments.filter(a => a.id !== id);
            saveAssignments(updatedAssignments.map(toAssignment));
          },
        },
      ]
    );
  };

  const editAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      description: assignment.description,
      priority: assignment.priority,
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ title: '', subject: '', dueDate: '', description: '', priority: 'medium' });
    setEditingAssignment(null);
  };

  const renderAssignment = ({ item }: { item: Assignment }) => (
    <View style={[styles.assignmentCard, { opacity: item.status === 'completed' ? 0.7 : 1 }]}> 
      <View style={styles.assignmentHeader}>
        <Text style={[styles.assignmentTitle, item.status === 'completed' && styles.completed]}>
          {item.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] }]}> 
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuVisibleId(item.id)}>
            <MaterialIcons name="more-vert" size={22} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      </View>
      {item.subject && <Text style={styles.assignmentSubject}>📚 {item.subject}</Text>}
      {item.dueDate && <Text style={styles.assignmentDue}>📅 Due: {item.dueDate}</Text>}
      {item.description && <Text style={styles.assignmentDesc}>{item.description}</Text>}
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: item.status === 'completed' ? '#27ae60' : '#95a5a6' }]}
        onPress={() => toggleStatus(item.id)}
      >
        <Text style={styles.statusText}>
          {item.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
      {menuVisibleId === item.id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); editAssignment(item); }} style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setMenuVisibleId(null); setTimeout(() => deleteAssignment(item.id), 100); }} style={styles.menuItem}>
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Assignment</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={assignments}
        renderItem={renderAssignment}
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
                {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Assignment Title *"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Subject"
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Due Date (e.g., June 15, 2025)"
                value={formData.dueDate}
                onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.labelText}>Priority:</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: priorityColors[priority] },
                      formData.priority === priority && styles.selectedPriority
                    ]}
                    onPress={() => setFormData({ ...formData, priority })}
                  >
                    <Text style={styles.priorityOptionText}>{priority.toUpperCase()}</Text>
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
                  onPress={addOrUpdateAssignment}
                >
                  <Text style={styles.saveButtonText}>
                    {editingAssignment ? 'Update' : 'Save'}
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
    backgroundColor: '#e74c3c',
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
  assignmentCard: {
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  assignmentSubject: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  assignmentDue: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 4,
  },
  assignmentDesc: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
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
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.7,
  },
  selectedPriority: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  priorityOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
    backgroundColor: '#e74c3c',
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
