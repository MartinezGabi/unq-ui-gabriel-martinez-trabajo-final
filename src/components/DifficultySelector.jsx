import { createGameSession } from '../services/api.js'
import Select from 'react-select'

export default function DifficultySelector({difficulties, setSession}) {

    const options = difficulties.map((d) => ({
    value: d.id,
    label: d.name,
  }));

    const handleChange = async (selectedOption) => {
        try {  
            const session = await createGameSession(selectedOption.value)
            setSession(session)
        }
        catch (error) {
            console.error('Error creating game session:', error)
        }
    };

  return (
    <div>
        <label htmlFor="difficulty">
        </label>
        <Select
         options={options}
         onChange={handleChange}
         placeholder="Select a difficulty"
         styles={{
         control: (base) => ({
            ...base,
            backgroundColor: 'white',
            color: 'black',
            borderColor: '#ccc',
            borderRadius: '6px',
            fontSize: '18px',
            boxShadow: 'none','&:hover': {borderColor: '#999',},
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'grey' : 'white' ,color: 'black',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'black',
        }),
        placeholder: (base) => ({
             ...base,
            color: '#666',
        }),
        }} 
        />
    </div>
  )
}
