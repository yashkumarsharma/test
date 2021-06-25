import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Image, Pressable } from 'react-native'
import { latoFont, getPrettySize } from '../../utilities/utilsFunctions'
import RemoveFile from '../../assets/icons/RemoveFileBrand.png'
import DownloadFile from '../../assets/icons/FileDownloadBrand.png'

function ResourceFooter({
  selectMode,
  selectedOptions,
  downloadFiles,
  removeFiles,
  selectedSize = 0,
}) {
  if (selectedOptions?.length > 0) {
    return (
      <View style={styles.selectedContainer}>
        <Text style={styles.selectedText}>
          Selected: {getPrettySize(selectedSize)}
        </Text>
        <Pressable
          onPress={() =>
            selectMode === 'remove' ? removeFiles() : downloadFiles()
          }>
          <Image
            source={selectMode === 'remove' ? RemoveFile : DownloadFile}
            style={{ height: 24 }}
          />
        </Pressable>
      </View>
    )
  }
  return null
}

const styles = StyleSheet.create({
  selectedText: {
    fontFamily: latoFont(),
    fontSize: 16,
    color: 'white',
  },
  selectedContainer: {
    height: 70,
    width: '100%',
    backgroundColor: 'black',
    paddingVertical: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#292929',
    borderBottomWidth: 1,
  },
})

ResourceFooter.propTypes = {
  selectMode: PropTypes.string,
  downloadFiles: PropTypes.func,
  removeFiles: PropTypes.func,
  selectedOptions: PropTypes.arrayOf(PropTypes.object),
  selectedSize: PropTypes.number,
}

export default ResourceFooter
