import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function App() {
  const [locale, setLocale] = useState<"bn" | "en">("bn");
  const [title, setTitle] = useState("শুরু করুন");
  const [body, setBody] = useState("Nexus Workspace-এ স্বাগতম!\n\nআপনার নোট ও পরিকল্পনা এখানে লিখুন।");
  const bn = locale === "bn";
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>◈ {bn ? "নেক্সাস ওয়ার্কস্পেস" : "Nexus Workspace"}</Text>
        <TouchableOpacity onPress={() => setLocale(bn ? "en" : "bn")}><Text style={styles.lang}>{bn ? "EN" : "বাংলা"}</Text></TouchableOpacity>
      </View>
      <View style={styles.nav}>
        <Text style={styles.navText}>{bn ? "হোম     পেজসমূহ     কাজ     ক্যালেন্ডার" : "Home     Pages     Tasks     Calendar"}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.subtitle}>{bn ? "আপনার ভাবনা, গুছানো এক জায়গায়।" : "Your ideas, organized."}</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.title} placeholder={bn ? "শিরোনাম" : "Title"} />
        <TextInput value={body} onChangeText={setBody} multiline textAlignVertical="top" style={styles.body} placeholder={bn ? "এখানে লিখুন…" : "Start writing…"} />
        <Text style={styles.note}>{bn ? "প্রাথমিক মোবাইল UI · ক্লাউড সিঙ্ক পরবর্তী ধাপে যুক্ত হবে" : "Mobile UI starter · Cloud sync will be added in a later phase"}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#fff"}, header:{height:60,paddingHorizontal:18,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderColor:"#eceef1"},
  brand:{fontSize:16,fontWeight:"700",color:"#292d35"},lang:{padding:8,borderWidth:1,borderColor:"#e5e7eb",borderRadius:7,color:"#555"},
  nav:{padding:15,backgroundColor:"#fafafd"},navText:{fontSize:12,color:"#6d7280"},content:{padding:24,paddingTop:48,flex:1},
  icon:{fontSize:38,marginBottom:18},subtitle:{fontSize:13,color:"#969ba4",marginBottom:12},title:{fontSize:30,fontWeight:"700",color:"#252a31",paddingVertical:8},
  body:{fontSize:16,lineHeight:27,color:"#4b5563",marginTop:18,minHeight:230},note:{fontSize:11,color:"#9ca3af",marginTop:20}
});
