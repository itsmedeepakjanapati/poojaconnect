import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { auth } from '../firebase';
import { loginUser } from '../../../shared/services/authService';
import { colors } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields.'); return; }
    setLoading(true);
    try { await loginUser(auth, email, password); }
    catch (err) { Alert.alert('Login Failed', err.message.replace('Firebase: ', '')); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../../assets/logo-wordmark.png')}
          style={s.logo}
          resizeMode="contain"
          accessibilityLabel="Samskara — Tradition, made simple"
        />
        <Text style={s.subtitle}>Hindu Religious Services · Serving All of New England</Text>
        <View style={s.card}>
          <Text style={s.heading}>Sign In</Text>
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Text style={s.label}>Password</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <TouchableOpacity style={[s.btn, loading && {opacity:0.5}]} onPress={handleLogin} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{marginTop:16,alignItems:'center'}}>
            <Text style={{fontSize:13,color:colors.light}}>Don't have an account? <Text style={{color:colors.saffron,fontWeight:'700'}}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},scroll:{flexGrow:1,justifyContent:'center',padding:24},
  logo:{width:'80%',height:80,alignSelf:'center',marginBottom:8},
  emoji:{fontSize:48,textAlign:'center',marginBottom:8},title:{fontSize:30,fontWeight:'700',textAlign:'center',color:colors.saffron},
  subtitle:{fontSize:13,textAlign:'center',color:colors.light,marginBottom:28},
  card:{backgroundColor:colors.white,borderRadius:16,padding:24,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:12,elevation:3},
  heading:{fontSize:20,fontWeight:'700',color:colors.dark,marginBottom:18},
  label:{fontSize:13,fontWeight:'600',color:colors.mid,marginBottom:4,marginTop:12},
  input:{borderWidth:1.5,borderColor:colors.border,borderRadius:10,padding:12,fontSize:14},
  btn:{backgroundColor:colors.saffron,borderRadius:10,padding:14,alignItems:'center',marginTop:20},
  btnText:{color:'#fff',fontWeight:'700',fontSize:15},
});
