
import { Component, useEffect, useState } from 'react'
import Table from './components/Table'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)



  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts'
        )

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  }, [])

const filteredPosts = posts.filter((posts) =>{
  const search = searchText.trim().toLowerCase()
  return(
    String(posts.id).includes(search)||
    String(posts.userId).includes(search)||
    String(posts.title).toLowerCase().includes(search) ||
    String(posts.body).toLowerCase().includes(search)

  )
})

    const pageSizeOptions = [10,20,30,50,70,100].filter(size => size <posts.length)
    if(posts.length > 0 && !pageSizeOptions.includes(posts.length)){
      pageSizeOptions.push(posts.length)
    }


    const totalPages = Math.ceil(filteredPosts.length / pageSize)

    const startIndex = (currentPage - 1) * pageSize

    const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + pageSize
  )


  return (
  <div className="container">
    <h1>Posts API Viewer</h1>

    {loading && <p>Loading data...</p>}

    {error && <p>Error: {error}</p>}

    {!loading && !error && (
      <>
        <p>Total records: {posts.length}</p>
        <p>Showing {filteredPosts.length} of {posts.length} records</p>
   
        <label>
          Show{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            >
              {pageSizeOptions.map((size)=>(
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>
          {' '}entries
        </label>
    <input type='text' value={searchText} 
    onChange={(e) =>
    {
      setSearchText(e.target.value)
      setCurrentPage(1)

    }} 
     placeholder='Search ID, UserID, Title or body...' ></input>
        <button onClick={() => setSearchText('')}> Clear</button>
        
        {filteredPosts.length === 0 ?(
          <p>No records found</p>
        ):(
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Title</th>
              <th>Body</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.userId}</td>
                <td>{post.title}</td>
                <td>{post.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}



<div className="pagination">
  

  <button
    onClick={() => setCurrentPage((page) => page + 1)}
    disabled={currentPage >= totalPages}
  >
    Next
  </button>
<p>page = {currentPage}</p>
  <button
    onClick={() => setCurrentPage((page) => page - 1)}
    disabled={currentPage <= 1}
  >
    Previous
  </button>
</div>
<div>
      <h1>Testing API Call</h1>
      {/* Table component ni ekkade render chestunnam */}
      <Table />
    </div>

      </>
    )}
  </div>
  )
}

export default App
