import { useThemeStore } from './store/useThemeStore.js'
import SettingPage from './pages/SettingPage'


function App() {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <SettingPage />
    </div>
  )
}

export default App
