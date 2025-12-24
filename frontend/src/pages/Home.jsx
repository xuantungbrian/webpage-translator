import { useState, useEffect } from 'react'
import './Home.css'

const Home = () => {
  const [chapterContent, setChapterContent] = useState('Loading')
  const [chapterId, setChapterId] = useState(26129007)

  const handleClick = (chapterId) => {
    setChapterId(chapterId => chapterId + 2)
    setChapterContent('Loading')
  }

  useEffect(() => {
    fetch(`http://localhost:5000/translator/37740/${chapterId}`)
    .then(response => response.json())
    .then(data => setChapterContent(data.data))
    .catch(error => console.log(error));
  }, [chapterId])

  return (
    <div className="chapter-content">
      {chapterContent}
      {chapterContent !== "Loading" && <button onClick={handleClick}>Next chapter</button>}
    </div>
  )
}

export default Home
