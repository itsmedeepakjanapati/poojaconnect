import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../firebase';
import { registerUser } from '../../../shared/services/authService';
import { colors } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', role:'user' });
  const [loading, setLoading] = useState(false);
  const u = (k,v) => setForm(f => ({...f,[k]:v}));
  const roles = [{value:'user',label:'Devotee'},{value:'priest',label:'Priest'},{value:'vendor',label:'Vendor'}];

  const handleRegister = async () => {
    if (!form.name||!form.email||!form.password||!form.phone) { Alert.alert('Error','Please fill all fields.'); return; }
    setLoading(true);
    try { await registerUser(auth, db, form); }
    catch (err) { Alert.alert('Error', err.message.replace('Firebase: ','')); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{flex:1,backgroundColor:colors.cream}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',padding:24}} keyboardShouldPersistTaps="handled">
        <Text style={{fontSize:40,textAlign:'center',marginBottom:6}}>🙏</Text>
        <Text style={{fontSize:24,fontWeight:'700',textAlign:'center',color:colors.saffron,marginBottom:20}}>Join PoojaConnect</Text>
        <View style={{backgroundColor:colors.white,borderRadius:16,padding:24,elevation:3}}>
          {[['Full Name','name','default'],['Phone','phone','phone-pad'],['Email','email','email-address'],['Password','password','default']].map(([lbl,key,kb])=>(
            <View key={key}>
              <Text style={{fontSize:13,fontWeight:'600',color:colors.mid,marginBottom:4,marginTop:12}}>{lbl}</Text>
              <TextInput style={{borderWidth:1.5,borderColor:colors.border,borderRadius:10,padding:12,fontSize:14}}
                value={form[key]} onChangeText={v=>u(key,v)} keyboardType={kb} secureTextEntry={key==='password'} autoCapitalize={key==='email'?'none':'sentences'} />
            </View>
          ))}
          <Text style={{fontSize:13,fontWeight:'600',color:colors.mid,marginBottom:4,marginTop:12}}>I am a...</Text>
          <View style={{flexDirection:'row',gap:8}}>
            {roles.map(r=>(
              <TouchableOpacity key={r.value} style={{flex:1,padding:10,borderRadius:8,borderWidth:1.5,borderColor:form.role===r.value?colors.saffron:colors.border,backgroundColor:form.role===r.value?colors.saffronLight:'transparent',alignItems:'center'}}
                onPress={()=>u('role',r.value)}>
                <Text style={{fontSize:13,fontWeight:'600',color:form.role===r.value?colors.saffron:colors.light}}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{backgroundColor:colors.saffron,borderRadius:10,padding:14,alignItems:'center',marginTop:20,opacity:loading?0.5:1}} onPress={handleRegister} disabled={loading}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>{loading?'Creating...':'Create Account'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginTop:16,alignItems:'center'}}>
            <Text style={{fontSize:13,color:colors.light}}>Already have an account? <Text style={{color:colors.saffron,fontWeight:'700'}}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
