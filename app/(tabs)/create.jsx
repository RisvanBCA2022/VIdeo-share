import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { createVideo, createVideoPost } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title:"",
    video:null,
    thumbnail:null,
    prompt:""
  })

  const openPicker=async (selectType)=>{
    const result = await DocumentPicker.getDocumentAsync(
      {
        type:selectType === 'image'
        ? ['image/png','image/jpg','image/jpeg']
        :['video/mp4','video/gif']
      }
    )

    if(!result.canceled){
      if(selectType === 'image'){
        setForm({...form,thumbnail: result.assets[0]})
      }
      if(selectType === "video"){
        setForm({...form,video: result.assets[0]})
      }
    }else{
      setTimeout(() => {
        Alert.alert('Document Picked', JSON.stringify(result,null,2))
      }, 100);
    }
  }

  const submit= async ()=>{

    if(!form.prompt || !form.title || !form.thumbnail || !form.video){
      return Alert.alert('Please fill all the fields')
    
    }

    setUploading(true)
    
    try {
      await createVideoPost({
        ...form,userId:user.$id
      })

      Alert.alert('Success','Post uploaded successfully')
      router.push('/home')
      
    } catch (error) {

      Alert.alert('Error',error.message)
    } finally {
      setForm({
        title:"",
    video:null,
    thumbnail:null,
    prompt:""
      })

      setUploading(false)
    }

  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload video
        </Text>

        <FormField title='Video Title' 
        value={form.title}
        placeholder="Give a catch title for your video"
        handleChangeText={(e)=>setForm({
          ...form,title:e
        })}
        otherStyles="mt-10"
        />

<View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium mt-3">
            Upload Thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode='cover'
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl flex justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-medium">
                    Choose a file
                  </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
        title="Submit && Publish"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create