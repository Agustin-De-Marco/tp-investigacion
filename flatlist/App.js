// npx expo start --tunnel

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  StatusBar,
  Modal,
  SafeAreaView
} from 'react-native';

export default function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingNombre, setEditingNombre] = useState('');
  const [editingEdad, setEditingEdad] = useState('');

  const agregarEstudiante = () => {
    if (nombre.trim() === '' || edad.trim() === '') {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(edad) || parseInt(edad) <= 0) {
      Alert.alert('Error', 'La edad debe ser un número válido mayor a 0');
      return;
    }

    const nuevoEstudiante = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      edad: parseInt(edad)
    };

    setEstudiantes(prevEstudiantes => [...prevEstudiantes, nuevoEstudiante]);
    setNombre('');
    setEdad('');
  };

  const eliminarEstudiante = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setEstudiantes(prevEstudiantes => 
              prevEstudiantes.filter(estudiante => estudiante.id !== id)
            );
          }
        }
      ]
    );
  };

  const iniciarEdicion = (estudiante) => {
    setEditingId(estudiante.id);
    setEditingNombre(estudiante.nombre);
    setEditingEdad(estudiante.edad.toString());
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    if (editingNombre.trim() === '' || editingEdad.trim() === '') {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(editingEdad) || parseInt(editingEdad) <= 0) {
      Alert.alert('Error', 'La edad debe ser un número válido mayor a 0');
      return;
    }

    setEstudiantes(prevEstudiantes =>
      prevEstudiantes.map(estudiante =>
        estudiante.id === editingId
          ? { ...estudiante, nombre: editingNombre.trim(), edad: parseInt(editingEdad) }
          : estudiante
      )
    );

    setModalVisible(false);
    setEditingId(null);
    setEditingNombre('');
    setEditingEdad('');
  };

  const cancelarEdicion = () => {
    setModalVisible(false);
    setEditingId(null);
    setEditingNombre('');
    setEditingEdad('');
  };

  const renderEstudiante = ({ item }) => (
    <View style={styles.estudianteCard}>
      <View style={styles.estudianteInfo}>
        <Text style={styles.estudianteNombre}>{item.nombre}</Text>
        <Text style={styles.estudianteEdad}>{item.edad} años</Text>
      </View>
      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, styles.botonEditar]}
          onPress={() => iniciarEdicion(item)}
        >
          <Text style={styles.textoBoton}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => eliminarEstudiante(item.id)}
        >
          <Text style={styles.textoBoton}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>📚</Text>
      <Text style={styles.emptyTitle}>No hay estudiantes</Text>
      <Text style={styles.emptySubtitle}>Agrega tu primer estudiante para comenzar</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TechAcademy Pro</Text>
        <Text style={styles.headerSubtitle}>Gestión de Estudiantes</Text>
      </View>

      {/* Formulario de agregar */}
      <View style={styles.formulario}>
        <Text style={styles.sectionTitle}>Agregar Nuevo Estudiante</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre del estudiante"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#6b7280"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          placeholderTextColor="#6b7280"
        />
        
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarEstudiante}>
          <Text style={styles.textoBotonAgregar}>+ Agregar Estudiante</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de estudiantes */}
      <View style={styles.listaContainer}>
        <Text style={styles.sectionTitle}>
          Estudiantes Registrados ({estudiantes.length})
        </Text>
        
          // FlatList renderiza una lista de estudiantes de forma eficiente.
        <FlatList
          data={estudiantes} // Los datos que se mostrarán (estudiantes).
          keyExtractor={item => item.id} // Se usa el id para identificar cada elemento.
          renderItem={renderEstudiante} // Define cómo se muestra cada estudiante.
          ListEmptyComponent={renderEmptyList} // Muestra un mensaje si no hay estudiantes.
          showsVerticalScrollIndicator={false} // No muestra la barra de desplazamiento.
          style={styles.lista} // Aplica estilos a la lista.
        />

      </View>

      {/* Modal de edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelarEdicion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Estudiante</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del estudiante"
              value={editingNombre}
              onChangeText={setEditingNombre}
              placeholderTextColor="#6b7280"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={editingEdad}
              onChangeText={setEditingEdad}
              keyboardType="numeric"
              placeholderTextColor="#6b7280"
            />
            
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCancelar]}
                onPress={cancelarEdicion}
              >
                <Text style={styles.textoModalBotonCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonGuardar]}
                onPress={guardarEdicion}
              >
                <Text style={styles.textoModalBotonGuardar}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 14,
    marginTop: 2,
  },
  formulario: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  botonAgregar: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotonAgregar: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listaContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
  },
  lista: {
    flex: 1,
  },
  estudianteCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  estudianteInfo: {
    flex: 1,
  },
  estudianteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  estudianteEdad: {
    fontSize: 14,
    color: '#6b7280',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  boton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  botonEditar: {
    backgroundColor: '#f59e0b',
  },
  botonEliminar: {
    backgroundColor: '#ef4444',
  },
  textoBoton: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalBoton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBotonCancelar: {
    backgroundColor: '#e5e7eb',
  },
  modalBotonGuardar: {
    backgroundColor: '#2563eb',
  },
  textoModalBotonCancelar: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  textoModalBotonGuardar: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
