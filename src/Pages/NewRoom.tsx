import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { FormEvent } from 'react'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'

import { Button } from '../Components/Button'
import { useAuth } from '../Hooks/useAuth'
import { useState } from 'react'
import { database } from '../Services/firebase'

export function NewRoom(){
    const {user} = useAuth()
    const [newRoow, setNewRoom] = useState('')
    const history = useHistory()

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault()
        
        if(newRoow.trim() === ''){
            return
        }
        const roomRef = database.ref('rooms')
        const firebaseRoom = await roomRef.push({
            title: newRoow,
            authorId: user?.id,
        })
        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as duvidas de sua audiênica em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logo Let Me Ask" />                    
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                         type="text" 
                         placeholder="Nome da sala"
                         onChange={event=> setNewRoom(event.target.value)}
                         value={newRoow}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Quer clicar em uma sala existente? <Link to="/">Clique Aqui</Link></p>
                </div>
            </main>
        </div>
    )
}