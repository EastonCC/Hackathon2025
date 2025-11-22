import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.jsx loaded - React app starting...')
console.log('Protocol:', window.location.protocol)
console.log('Root element:', document.getElementById('root'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('React app rendered')
