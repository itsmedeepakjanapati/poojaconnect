import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { getChatResponse } from '../../../shared/services/chatbotService';
import { PRIESTS_SEED } from '../../../shared/data/seedData';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '0', from: 'bot', text: 'Namaste! 🙏 I\'m your PoojaConnect assistant. Ask me about poojas, homams, priests, vendors, or Hindu rituals.' }
  ]);
  const [input, setInput] = useState('');
  const flatRef = useRef();

  useEffect(() => {
    flatRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const id = Date.now().toString();
    setMessages(m => [...m, { id, from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      const resp = getChatResponse(userMsg, { priestCount: 12, vendorCount: 5, priests: PRIESTS_SEED });
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), from: 'bot', text: resp }]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList ref={flatRef} data={messages} keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item: m }) => (
          <View style={[s.bubble, m.from === 'user' ? s.userBubble : s.botBubble]}>
            <Text style={[s.bubbleText, m.from === 'user' ? s.userText : s.botText]}>{m.text}</Text>
          </View>
        )} />
      <View style={s.inputBar}>
        <TextInput style={s.input} value={input} onChangeText={setInput}
          placeholder="Ask about poojas, priests..." onSubmitEditing={send} returnKeyType="send" />
        <TouchableOpacity style={s.sendBtn} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  bubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.saffron, borderBottomRightRadius: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: colors.saffronLight, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 13, lineHeight: 20 },
  userText: { color: '#fff' },
  botText: { color: colors.dark },
  inputBar: { flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 42, height: 42, borderRadius: 10, backgroundColor: colors.saffron, alignItems: 'center', justifyContent: 'center' },
});
