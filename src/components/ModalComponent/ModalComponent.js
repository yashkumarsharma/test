import React from 'react'
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from 'react-native'
import FileDownload from '../../assets/icons/FileDownload.png'
import RemoveFile from '../../assets/icons/RemoveFile.png'
import { latoFont } from '../../utilities/utilsFunctions'
import PropTypes from 'prop-types'

const ModalComponent = ({ modalVisible, setModalVisible, setSelectMode }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
        setModalVisible(!modalVisible)
      }}>
      <View style={styles.modalView}>
        <Pressable
          style={styles.modalLayer}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={() => {
              setSelectMode('download')
              setModalVisible(!modalVisible)
            }}
            style={styles.actionContainer}>
            <Image source={FileDownload} style={{ height: 16, width: 16 }} />
            <Text style={styles.actionText}>
              Select files to download to device
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectMode('remove')
              setModalVisible(!modalVisible)
            }}
            style={styles.actionContainer}>
            <Image source={RemoveFile} style={{ height: 15, width: 13 }} />
            <Text style={styles.actionText}>
              Select files to remove from device
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalLayer: {
    flex: 1,
    width: '100%',
    textAlign: 'center',
  },
  actionsContainer: {
    height: 152,
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 36,
    backgroundColor: '#25272B',
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 21,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: latoFont(),
    color: '#FFF',
    marginLeft: 6,
  },
})

ModalComponent.propTypes = {
  modalVisible: PropTypes.boolean,
  setModalVisible: PropTypes.func,
  setSelectMode: PropTypes.func,
}

export default ModalComponent
