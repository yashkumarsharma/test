import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Pressable } from 'react-native'
import CheckBox from 'react-native-check-box'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'

function ResourceHeader({
  selectMode,
  isAllSelected,
  title,
  checkboxPress,
  onPress,
}) {
  return (
    <View style={styles.headerContainer}>
      {selectMode ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox
            style={{ marginRight: 12 }}
            onClick={checkboxPress}
            isChecked={isAllSelected}
            checkBoxColor={colors.brand}
          />
          <Text style={styles.title}>Select All</Text>
        </View>
      ) : (
        <Text style={styles.courseTitle}>{title}</Text>
      )}
      <Pressable onPress={onPress}>
        <Text style={styles.selectButton}>
          {selectMode ? 'CANCEL' : 'SELECT'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingBottom: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 25,
  },
  courseTitle: {
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    color: '#B1BFC5',
    // This will prevent line jostling due to checkbox
    lineHeight: 25,
  },
  selectButton: {
    fontFamily: latoFont('Bold'),
    fontSize: 14,
    color: colors.brand,
  },
})

ResourceHeader.propTypes = {
  selectMode: PropTypes.string,
  title: PropTypes.string,
  isAllSelected: PropTypes.bool,
  checkboxPress: PropTypes.func,
  onPress: PropTypes.func,
}

export default ResourceHeader
