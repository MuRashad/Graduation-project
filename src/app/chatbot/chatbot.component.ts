import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatResponseService } from '../chat-response.service';

interface ChatMessage {
  message: string;
  response?: string;
  error?: string;
}

interface Chat {
  name: string;
  messages: ChatMessage[];
  editingName?: boolean;
  showMenu?: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  chatHistory: Chat[] = [];
  currentChat: Chat | null = null;

  constructor(private fb: FormBuilder, private chatService: ChatResponseService) {
    this.chatForm = this.fb.group({ message: [''] });
  }

  closeAllMenus(event: Event) {
    // Close all menus when clicking outside the dropdown
    this.chatHistory.forEach(chat => chat.showMenu = false);
    event.stopPropagation(); // Prevent unnecessary propagation
  }

  sendMessage() {
    const userMessage = this.chatForm.get('message')?.value;
    this.chatService.getChatResponse(userMessage).subscribe({
      next: (x) => {
        const newMessage: ChatMessage = { message: userMessage, response: x.response };
        this.messages.push(newMessage);
        if (this.currentChat) {
          this.currentChat.messages.push(newMessage);
        }
        this.chatForm.reset();
      },
      error: (error) => {
        const errorMessage: ChatMessage = { message: userMessage, error: error.message };
        this.messages.push(errorMessage);
        if (this.currentChat) {
          this.currentChat.messages.push(errorMessage);
        }
      }
    });
  }

  startNewChat() {
    const newChat: Chat = { name: `Chat ${this.chatHistory.length + 1}`, messages: [] };
    this.chatHistory.push(newChat);
    this.currentChat = newChat;
    this.messages = [];
  }

  loadChat(chat: Chat) {
    if (this.currentChat !== chat) {
      // Check if currentChat is in chatHistory before pushing
      if (this.currentChat && !this.chatHistory.includes(this.currentChat)) {
        this.chatHistory.push(this.currentChat);
      }
      this.currentChat = chat;
      this.messages = chat.messages;
    }
  }

  renameChat(chat: Chat) {
    chat.editingName = true;
    chat.showMenu = false; // Close the menu after action
  }

  saveRenamedChat(chat: Chat) {
    chat.editingName = false;
    chat.showMenu = false; // Close the menu after action
  }

  toggleMenu(chat: Chat, event: Event) {
    event.stopPropagation(); // Prevents the click from bubbling up and closing the menu
    chat.showMenu = !chat.showMenu;
  }

  deleteChat(chat: Chat) {
    const index = this.chatHistory.indexOf(chat);
    if (index > -1) {
      this.chatHistory.splice(index, 1);
      if (this.currentChat === chat) {
        this.currentChat = null;
        this.messages = [];
      }
    }
  }
}
