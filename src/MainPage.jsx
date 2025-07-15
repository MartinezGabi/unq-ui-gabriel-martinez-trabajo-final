import { useEffect, useState } from 'react'
import { getDifficulties} from './services/api.js'
import './MainPage.css'
import DifficultySelector from './components/DifficultySelector.jsx'
import GameGrid from './components/GameGrid.jsx'

function MainPage() {
  const [session, setSession] = useState(null)
  const [difficulties, setDifficulties] = useState([])

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        const data = await getDifficulties()
        setDifficulties(data)
      } catch (error) {
        console.error('Error fetching difficulties:', error)
      }
    } 
    fetchDifficulties()
  }, [])

  return (
    <div className="page">
      <h1>Welcome to Wordle</h1>
      <DifficultySelector difficulties = {difficulties} setSession = {setSession}/>

      {session && (
        <div>
          <GameGrid session={session} setSession={setSession} />
        </div>
      )}
    </div>
  )
}

export default MainPage
