import { useState, useEffect } from 'react'

const Home = () => {
  const [chapterContent, setChapterContent] = useState('Loading')
  useEffect(() => {
    fetch('http://localhost:5000/translator/37740/26129003')
    .then(response => response.json())
    .then(data => setChapterContent(data.data))
    .catch(error => console.log(error));
  }, [])

  return (
    <div>
      {chapterContent}
    </div>
  )
}

export default Home
