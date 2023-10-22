import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  const getBlogs = async() => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  //effect hook to handle initial loading of page
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getBlogs()
    }
  }, [])

  const Timeout = (ms) => {
    setTimeout(() => {
      setNotification(null)
    }, ms)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password, })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        text: `${user.username} logged in`,
        type: 'success'
      })
      Timeout(5000)
    } catch (error) {
      setNotification({
        text: 'Wrong credentials -- try again',
        type: 'error'
      })
      Timeout(5000)
    }
  }

  const addBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs([...blogs, response])
      setNotification({
        text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success'
      })
      Timeout(5000)
    } catch (error) {
      setNotification(`Adding blog unsuccessful ${error.message}`)
      Timeout(5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '': 'none ' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}> log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      setNotification({
        text: 'Logout successful',
        type: 'success'
      })
      Timeout(5000)
    } catch (error) {
      setNotification(`Unsuccessful logout ${error.message}`)
      Timeout(5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  const addLike = async (blog) => {
    blog.likes = blog.likes + 1
    const response = await blogService.update(blog)
    setBlogs(
      blogs.map(i =>
        i.id === response.id ? { ...i, likes: response.likes } : i)
    )
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      try {
        const response = await blogService.deleteBlog(blog)
        setNotification({
          text: `${blog.title} by ${blog.author} removed`,
          type: 'success'
        })
        Timeout(5000)
        getBlogs()
      } catch (error) {
        setNotification(`Not able to delete ${error.message}`)
        Timeout(5000)
      }
    }
  }
  //if no user is logged in, only login screen is shown. logged in user has create option + shows blogs
  return (
    <div>
      <Notification message={notification} />
      {!user ? (
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.username} is logged in <button id="logout-button" onClick={handleLogout}>logout</button> </p>
          {blogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes )
            .map(blog => <Blog
              key={blog.id}
              blog={blog}
              user={user}
              addLike={() => addLike(blog)}
              removeBlog={() => removeBlog(blog)}/>)
          }
        </div>
      )
      }
    </div>

  )
}

export default App