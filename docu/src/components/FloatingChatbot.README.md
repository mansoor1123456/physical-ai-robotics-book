# Floating RAG Chatbot Component

A minimal floating chatbot component that integrates with the RAG Agent backend and is positioned in the bottom-right corner of the screen.

## Features

- **Floating Design**: Minimal chat interface positioned in the bottom-right corner
- **Toggle Functionality**: Expand/collapse the chat interface with a single button
- **Real-time Messaging**: Send queries to the RAG Agent backend and receive responses
- **Loading States**: Visual indicators during query processing
- **Error Handling**: Displays user-friendly error messages when requests fail
- **Responsive Design**: Works on different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Implementation Details

- Uses the existing `apiService` to communicate with the backend
- Implements the same API endpoint (`/query`) as used by other components
- Follows the same data models and response formatting as the existing system
- Includes proper loading states and error handling
- Positioned using fixed positioning in the bottom-right corner

## Usage

The component is automatically included on the homepage via the `index.tsx` file. Simply import and include the component:

```jsx
import FloatingChatbot from "../components/FloatingChatbot";

// In your component
<FloatingChatbot />
```

## Styling

The chatbot uses inline styles for minimal dependencies and includes:

- Clean, modern UI with rounded corners
- Color-coded messages (blue for user, gray for bot, red for errors)
- Smooth animations and transitions
- Responsive design that works on mobile and desktop
- Customizable colors and dimensions

## API Integration

The component uses the existing `apiService.sendQuery()` method to communicate with the backend, ensuring consistency with the rest of the application. It passes the user's query text to the backend and displays the AI-generated response.

## Dependencies

- React (useState, useRef, useEffect)
- Existing `apiService` from `../services/api`

## Positioning

The chatbot appears as a small circular button in the bottom-right corner of the screen. When clicked, it expands to show the full chat interface. When closed, only the button remains visible.