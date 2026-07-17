import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { screenTopPadding } from '../theme/layout';
import {
  createPrivateConversationApi,
  getConversationDetailApi,
  getConversationsApi,
  searchChatUsersApi,
  sendMessageApi,
  setTypingIndicatorApi,
} from '../api/chat';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const unwrapList = (payload: any) => {
  const data =
    payload?.data?.data ||
    payload?.data?.conversations ||
    payload?.data?.users ||
    payload?.data ||
    payload;
  return Array.isArray(data) ? data : [];
};

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await getConversationsApi({ page: 1, per_page: 20 });
      setConversations(unwrapList(response));
    } catch (error) {
      showErrorToast('Could not load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const openConversation = async (conversation: any) => {
    setSelectedConversation(conversation);
    try {
      const response = await getConversationDetailApi(conversation.id || conversation.guid);
      setMessages(unwrapList(response?.data?.messages ? response.data.messages : response));
    } catch (error) {
      setMessages(conversation.messages || []);
    }
  };

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }
    try {
      const response = await searchChatUsersApi(value.trim());
      setUsers(unwrapList(response));
    } catch (error) {
      setUsers([]);
    }
  };

  const startConversation = async (user: any) => {
    try {
      const response = await createPrivateConversationApi(user.id || user.guid);
      const conversation = response?.data || response;
      setUsers([]);
      setSearch('');
      await fetchConversations();
      openConversation(conversation);
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not start chat');
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedConversation) return;
    setSending(true);
    try {
      const userId =
        selectedConversation.user_id ||
        selectedConversation.other_user?.id ||
        selectedConversation.user?.id;
      await setTypingIndicatorApi(selectedConversation.id, false);
      await sendMessageApi({
        user_id: userId,
        message: message.trim(),
        type: 'text',
      });
      setMessage('');
      showSuccessToast('Message sent');
      openConversation(selectedConversation);
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      <TextInput
        value={search}
        onChangeText={handleSearch}
        placeholder="Search users"
        placeholderTextColor="#777"
        style={styles.input}
      />
      {!!users.length && (
        <View style={styles.searchBox}>
          {users.slice(0, 5).map(user => (
            <TouchableOpacity
              key={String(user.id || user.guid)}
              onPress={() => startConversation(user)}
              style={styles.userRow}
            >
              <Text style={styles.userText}>{user.name || user.email}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : selectedConversation ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => String(item.id || item.guid || index)}
            ListEmptyComponent={<Text style={styles.emptyText}>No messages yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item.message || item.body}</Text>
              </View>
            )}
            style={{ flex: 1 }}
          />
          <View style={styles.composer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="#777"
              style={[styles.input, styles.messageInput]}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Send size={18} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => String(item.id || item.guid || index)}
          ListEmptyComponent={<Text style={styles.emptyText}>No conversations found.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationRow}
              onPress={() => openConversation(item)}
            >
              <Text style={styles.conversationTitle}>
                {item.other_user?.name || item.user?.name || item.title || 'Conversation'}
              </Text>
              <Text style={styles.conversationMeta} numberOfLines={1}>
                {item.last_message?.message || item.last_message || 'Tap to open'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: screenTopPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#282828',
    color: '#fff',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(9),
    marginBottom: verticalScale(10),
  },
  searchBox: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  userRow: {
    padding: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userText: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(80),
  },
  conversationRow: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
  },
  conversationTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  conversationMeta: {
    color: '#999',
    marginTop: verticalScale(4),
  },
  messageBubble: {
    backgroundColor: '#222',
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: verticalScale(8),
  },
  messageText: {
    color: '#fff',
  },
  composer: {
    flexDirection: 'row',
    gap: scale(8),
    paddingBottom: verticalScale(10),
  },
  messageInput: {
    flex: 1,
    marginBottom: 0,
  },
  sendBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: '#ADE406',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
