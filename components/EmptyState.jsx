import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title,subtitle}) => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w=[270px] h-[215px]" resizeMode='contain'/>
        <Text className="text-xl font-pmedium text-white text-center mt-2">
                  {subtitle}
                </Text>
                <Text className="font-pmedium text-sm text-gray-100">
                  {title}
                </Text>

                <CustomButton
                title="Create video"
                handlePress={()=>router.push('/create')}
                containerStyles="w-full my-5"
                />
    </View>
  )
}

export default EmptyState