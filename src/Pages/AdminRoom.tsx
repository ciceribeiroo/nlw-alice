import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import '../styles/room.scss'
import { Button } from '../Components/Button'
import { RoomCode } from '../Components/RoomCode'
import {useParams} from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { useAuth } from '../Hooks/useAuth'
import { database } from '../Services/firebase'
import { Question } from '../Components/Question'
import { useRoom } from '../Hooks/useRoom'
import {useHistory} from 'react-router-dom'

type RoomParms = {
    id: string
}

export function AdminRoom(){
    const history = useHistory();
    const {user} = useAuth();
    const parms = useParams<RoomParms>();
    const [newQuestion, setNewQuestion] = useState('')    
    const roomId = parms.id
    const { title, questions} = useRoom(roomId)

    async function handleCreateSendQuestion(event: FormEvent){
        event.preventDefault()
        if(newQuestion.trim() === ''){
            return
        }

        if(!user){
            throw new Error('You must be logged in')
        }

        const question ={
            content: newQuestion,
            author:{
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('')
    }
    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que deseja excluir essa pergunta?")){
             await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/')
    }
    async function handleCheckQuestionAsAnswered(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })    
    }
    async function handleHighlightQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true
        })    
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <div>
                    <RoomCode code={roomId}></RoomCode>
                    <Button isOutLined onClick={handleEndRoom}>
                        Encerrar sala
                    </Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length>0 && <span>{questions.length} perguntas</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighLighted}
                            >
                                
                                {!question.isAnswered && (
                                    <>
                                        <button
                                        type="button"
                                        onClick={()=> handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={()=> handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque a pergunta" />
                                    </button>
                                </>
                                )}
                                <button
                                    type="button"
                                    onClick={()=> handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                            );
                    })}
                </div>
            </main>
        </div>
        )
}