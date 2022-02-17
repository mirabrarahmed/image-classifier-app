import * as mobilenet from '@tensorflow-models/mobilenet'
import { useEffect, useState, useRef } from 'react';


function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [results, setResults] = useState([])

  const imageRef = useRef()
  const inputRef = useRef()

  const loadModel = async () => {
    setIsLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

  }

  const urlChange = (e) => {
    setImageUrl(e.target.value)
    setResults([])
  }

  const uploadImage = (e) => {
    const {files} = e.target
    if(files.length === 0) return setImageUrl(null)
    if(files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageUrl(url)
    }
  }

  const identify = async () => {
    inputRef.current.value = ''
    const results = await model.classify(imageRef.current)
    setResults(results)
  }

  useEffect(() => {
    loadModel()
  }, [])

  
  if(isLoading) return <h1>Model is loading..</h1>

  console.log(results)
  
  return (
    <div className="App">
      <h1>Image Identification</h1>
      <div className="input-holder">
        <input type='file' accept='image/*' capture='camera' className='upload-input' onChange={uploadImage}/>
        <span>OR</span>
        <input type='text' placeholder='Paste Image URL' ref={inputRef} onChange={urlChange} />
        <div className="wrapper">
          <div className="main-content">
            <div className="image">
              {imageUrl && <img style={{height: '300px', width: '300px'}} src={imageUrl} alt='Preview' crossOrigin='anonymous' ref={imageRef} />}
            </div>
            {results.length > 0 && <div className='result'>
                {<>
                  <ul>
                    {results.map((result, index) => {
                      return <li key={result.className}><span>Name: {result.className}</span><span> Confidence Level: {(result.probability * 100).toFixed(2)}%</span>{index === 0 && <span style={{fontWeight:'bold'}}> Best Option</span>}</li> 
                    })
                    }
                  </ul>
                </> 
                }
              </div>}
          </div>
          <button className='button' onClick={identify}>Identify Image</button>
        </div>
      </div>
    </div>
  );
}

export default App;
